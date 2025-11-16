import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

// =====================================================
// TYPES
// =====================================================

export interface AuthRequest extends Request {
  user?: any;
  session?: any;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

/**
 * Authenticate request (required)
 * Throws 401 if no valid token
 */
export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - No token provided',
      });
    }

    const token = authHeader.substring(7);

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // Verify session exists and is not expired
    const sessionData = await authService.verifySession(token);

    if (!sessionData) {
      return res.status(401).json({
        success: false,
        error: 'Session expired or invalid',
      });
    }

    // Attach user and session to request
    req.user = sessionData.user;
    req.session = sessionData.session;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
    });
  }
}

/**
 * Optional authentication
 * Doesn't fail if no token, but attaches user if valid token present
 */
export async function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      // Verify JWT
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

      // Verify session
      const sessionData = await authService.verifySession(token);

      if (sessionData) {
        req.user = sessionData.user;
        req.session = sessionData.session;
      }
    }
  } catch (error) {
    // Ignore auth errors for optional auth
  }

  next();
}
