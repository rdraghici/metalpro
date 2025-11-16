/**
 * Logger Configuration
 * Winston-based structured logging for production and development
 */

import winston from 'winston';
import path from 'path';

// ==============================================
// Logger Configuration
// ==============================================

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Create logs directory path
const logsDir = path.join(process.cwd(), 'logs');

// ==============================================
// Logger Instance
// ==============================================

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'metalpro-backend' },
  transports: [
    // Error logs - separate file for errors only
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
    // Combined logs - all levels
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
  ],
});

// ==============================================
// Console Logging (Development)
// ==============================================

if (!IS_PRODUCTION) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          let metaStr = '';
          if (Object.keys(meta).length > 0 && meta.service !== 'metalpro-backend') {
            metaStr = ' ' + JSON.stringify(meta);
          }
          return `${timestamp} [${level}]: ${message}${metaStr}`;
        })
      ),
    })
  );
}

// ==============================================
// Helper Methods
// ==============================================

/**
 * Log HTTP request
 */
export function logRequest(method: string, path: string, statusCode: number, duration: number) {
  logger.info('HTTP Request', {
    method,
    path,
    statusCode,
    duration: `${duration}ms`,
  });
}

/**
 * Log database query
 */
export function logQuery(query: string, duration: number) {
  logger.debug('Database Query', {
    query,
    duration: `${duration}ms`,
  });
}

/**
 * Log authentication event
 */
export function logAuth(event: string, userId?: string, email?: string) {
  logger.info('Authentication Event', {
    event,
    userId,
    email,
  });
}

/**
 * Log security event
 */
export function logSecurity(event: string, details: any) {
  logger.warn('Security Event', {
    event,
    ...details,
  });
}

// ==============================================
// Export
// ==============================================

export default logger;
