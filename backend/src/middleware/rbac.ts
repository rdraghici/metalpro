import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';

// Extend Express Request to include user from auth middleware
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

/**
 * Role-Based Access Control Middleware
 * Restricts route access based on user roles
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to access this resource',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `This resource requires one of the following roles: ${allowedRoles.join(', ')}`,
        userRole: req.user.role,
      });
    }

    next();
  };
}

/**
 * Convenience middleware for back-office only access
 */
export const requireBackoffice = requireRole(UserRole.BACKOFFICE, UserRole.ADMIN);

/**
 * Convenience middleware for admin only access
 */
export const requireAdmin = requireRole(UserRole.ADMIN);
