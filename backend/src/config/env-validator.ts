/**
 * Environment Variable Validation
 * Ensures all required environment variables are set before starting the server
 */

interface EnvConfig {
  // Node Environment
  NODE_ENV: string;
  PORT: string;

  // Database
  DATABASE_URL: string;

  // Redis
  REDIS_URL: string;

  // JWT Authentication
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  REFRESH_TOKEN_EXPIRES_IN: string;

  // Frontend URL (CORS)
  FRONTEND_URL: string;

  // Backend URL
  BACKEND_URL: string;

  // File Upload
  UPLOAD_DIR: string;

  // ANAF API
  ANAF_API_URL: string;

  // Email Service (optional in development)
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  FROM_EMAIL?: string;
  OPERATOR_EMAIL?: string;

  // Logging
  LOG_LEVEL: string;
}

/**
 * Required environment variables
 * These MUST be set for the application to run
 */
const REQUIRED_ENV_VARS = [
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
  'REDIS_URL',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'REFRESH_TOKEN_EXPIRES_IN',
  'FRONTEND_URL',
  'BACKEND_URL',
  'UPLOAD_DIR',
  'ANAF_API_URL',
  'LOG_LEVEL',
];

/**
 * Optional environment variables (with warnings)
 * These are optional but recommended for production
 */
const OPTIONAL_ENV_VARS = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'FROM_EMAIL',
  'OPERATOR_EMAIL',
];

/**
 * Validate environment variables
 * Throws error if required variables are missing
 * Warns if optional variables are missing in production
 */
export function validateEnv(): EnvConfig {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required environment variables
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      errors.push(`Missing required environment variable: ${envVar}`);
    }
  }

  // Check optional environment variables (warn in production)
  if (process.env.NODE_ENV === 'production') {
    for (const envVar of OPTIONAL_ENV_VARS) {
      if (!process.env[envVar]) {
        warnings.push(`Missing recommended environment variable: ${envVar}`);
      }
    }
  }

  // Security checks
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters long for security');
  }

  if (process.env.NODE_ENV === 'production') {
    // Production-specific validations
    if (process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-this-in-production-minimum-32-characters') {
      errors.push('JWT_SECRET is using default value! Change it in production!');
    }

    if (process.env.DATABASE_URL?.includes('metalpro_dev_password')) {
      warnings.push('DATABASE_URL appears to use development password in production');
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      warnings.push('Email service not configured - emails will not be sent');
    }
  }

  // Display errors
  if (errors.length > 0) {
    console.error('\n❌ Environment Validation Failed:\n');
    errors.forEach((error) => console.error(`  - ${error}`));
    console.error('\nPlease check your .env file and ensure all required variables are set.\n');
    throw new Error('Environment validation failed');
  }

  // Display warnings
  if (warnings.length > 0) {
    console.warn('\n⚠️  Environment Validation Warnings:\n');
    warnings.forEach((warning) => console.warn(`  - ${warning}`));
    console.warn('');
  }

  // Success message
  console.log('✅ Environment validation passed');
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET?.substring(0, 10)}... (${process.env.JWT_SECRET?.length} characters)`);
  console.log(`📧 Email Service: ${process.env.SMTP_USER ? 'Configured' : 'Not configured (development mode)'}`);
  console.log('');

  return process.env as EnvConfig;
}
