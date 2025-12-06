import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { prisma } from './config/database';
import { redisClient } from './config/redis';
import { validateEnv } from './config/env-validator';
import { apiLimiter, authLimiter, uploadLimiter, rfqLimiter } from './middleware/rate-limiter';
import { sanitizeMongoData, sanitizeXSS } from './middleware/sanitize';
import logger from './config/logger';
import { requestLogger } from './middleware/request-logger';

// Load environment variables
dotenv.config();

// Validate environment variables before starting server
validateEnv();

const app: Express = express();
const PORT = Number(process.env.PORT) || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// =====================================================
// MIDDLEWARE
// =====================================================

// Trust proxy (required when behind ALB/load balancer)
app.set('trust proxy', 1);

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security: Rate limiting
app.use(apiLimiter);

// Security: Data sanitization (MongoDB injection protection)
app.use(sanitizeMongoData);

// Security: XSS protection
app.use(sanitizeXSS);

// Request logging middleware (Winston-based)
app.use(requestLogger);

// Serve static files from uploads directory with CORS headers
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', FRONTEND_URL);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use('/uploads', express.static(path.join(process.cwd(), uploadDir)));

// =====================================================
// ROUTES
// =====================================================

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  const health: any = {
    status: 'healthy',
    service: 'MetalPro Backend API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    checks: {
      database: 'unknown',
      redis: 'unknown',
    },
  };

  // Helper function to add timeout to promises
  const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), timeoutMs)
      ),
    ]);
  };

  // Check database connection (3 second timeout)
  try {
    await withTimeout(prisma.$queryRaw`SELECT 1`, 3000);
    health.checks.database = 'connected';
  } catch (error) {
    health.checks.database = 'disconnected';
    health.status = 'degraded';
    logger.error('Health check: Database connection failed', { error });
  }

  // Check Redis connection (3 second timeout)
  try {
    await withTimeout(redisClient.ping(), 3000);
    health.checks.redis = 'connected';
  } catch (error) {
    health.checks.redis = 'disconnected';
    health.status = 'degraded';
    logger.error('Health check: Redis connection failed', { error });
  }

  // Return appropriate status code
  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

// Liveness probe (Kubernetes-style)
app.get('/health/live', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
});

// Readiness probe (Kubernetes-style)
app.get('/health/ready', async (req: Request, res: Response) => {
  try {
    // Check if database is ready
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      error: 'Database not accessible',
      timestamp: new Date().toISOString(),
    });
  }
});

// API info endpoint
app.get('/api', (req: Request, res: Response) => {
  res.json({
    name: 'MetalPro Backend API',
    version: '1.0.0',
    description: 'Production-ready backend for MetalPro B2B platform',
    endpoints: {
      health: 'GET /health',
      auth: 'POST /api/auth/*',
      users: 'GET /api/users/*',
      products: 'GET /api/products',
      cart: 'GET /api/cart',
      rfq: 'POST /api/rfq',
      projects: 'GET /api/projects',
      addresses: 'GET /api/addresses',
      upload: 'POST /api/upload/*',
      emailTest: 'POST /api/email-test/*',
    },
  });
});

// Import route files
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import productsRoutes from './routes/products.routes';
import categoriesRoutes from './routes/categories.routes';
import cartRoutes from './routes/cart.routes';
import rfqRoutes from './routes/rfq.routes';
import projectsRoutes from './routes/projects.routes';
import addressesRoutes from './routes/addresses.routes';
import uploadRoutes from './routes/upload.routes';
import emailTestRoutes from './routes/email-test.routes';
import backofficeRoutes from './routes/backoffice.routes';
import backofficeCategoryRoutes from './routes/backoffice-category.routes';

// Register routes with specific rate limiters
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/rfq', rfqLimiter, rfqRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/addresses', addressesRoutes);
app.use('/api/upload', uploadLimiter, uploadRoutes);
app.use('/api/email-test', emailTestRoutes);
app.use('/api/backoffice', backofficeRoutes);
app.use('/api/backoffice/categories', backofficeCategoryRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Log error details (server-side only)
  logger.error('Unhandled Error', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode: err.statusCode || 500,
  });

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Prepare error response
  const errorResponse: any = {
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  };

  // Only include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.path = req.path;
    errorResponse.method = req.method;
  } else {
    // In production, sanitize error messages
    if (statusCode === 500) {
      errorResponse.message = 'An unexpected error occurred. Please try again later.';
    }
  }

  res.status(statusCode).json(errorResponse);
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, '0.0.0.0', () => {
  const banner = '='.repeat(60);
  console.log(banner);
  console.log('🚀 MetalPro Backend Server Started');
  console.log(banner);
  console.log(`📡 Server running on: http://0.0.0.0:${PORT}`);
  console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
  console.log(`🏭 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: PostgreSQL (metalpro)`);
  console.log(`💾 Cache: Redis`);
  console.log(banner);
  console.log('\n📚 Available endpoints:');
  console.log(`  GET  http://0.0.0.0:${PORT}/health`);
  console.log(`  GET  http://0.0.0.0:${PORT}/api`);
  console.log(banner);
  console.log('\n✅ Ready to accept requests!\n');

  // Log server start to file
  logger.info('Server started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    frontendUrl: FRONTEND_URL,
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  console.log('\n🛑 SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  await redisClient.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  console.log('\n🛑 SIGINT signal received: closing HTTP server');
  await prisma.$disconnect();
  await redisClient.disconnect();
  process.exit(0);
});
