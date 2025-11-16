/**
 * Request Logging Middleware
 * Logs all HTTP requests with duration tracking
 */

import { Request, Response, NextFunction } from 'express';
import logger, { logRequest } from '../config/logger';

/**
 * Request logging middleware
 * Logs method, path, status code, and response time
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();

  // Log request start (only in development)
  if (process.env.NODE_ENV !== 'production') {
    logger.debug(`→ ${req.method} ${req.path}`);
  }

  // Capture response finish event
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { method, path } = req;
    const { statusCode } = res;

    // Log completed request
    logRequest(method, path, statusCode, duration);

    // Log slow requests as warnings (> 1 second)
    if (duration > 1000) {
      logger.warn('Slow Request', {
        method,
        path,
        statusCode,
        duration: `${duration}ms`,
      });
    }
  });

  next();
}
