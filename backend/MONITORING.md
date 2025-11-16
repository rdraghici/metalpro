# Monitoring & Logging Guide

## Overview

The MetalPro Backend uses **Winston** for structured logging and provides comprehensive health check endpoints for monitoring application health and performance.

---

## Logging System

### Log Levels

The application uses standard Winston log levels:

| Level | Priority | Usage |
|-------|----------|-------|
| `error` | 0 | Error events that might cause the application to fail |
| `warn` | 1 | Warning events (slow requests, deprecated features) |
| `info` | 2 | Informational messages (server start, shutdowns) |
| `debug` | 3 | Detailed debugging information (queries, requests) |

**Configuration**: Set `LOG_LEVEL` in `.env` file (default: `info`)

```bash
# Development - verbose logging
LOG_LEVEL=debug

# Production - essential logs only
LOG_LEVEL=info
```

---

### Log Files

**Location**: `backend/logs/`

| File | Content | Rotation |
|------|---------|----------|
| `error.log` | Error-level logs only | 10 MB per file, keep 5 files |
| `combined.log` | All log levels | 10 MB per file, keep 5 files |

**Log Format** (JSON):
```json
{
  "level": "info",
  "message": "HTTP Request",
  "timestamp": "2025-11-15 10:30:45",
  "service": "metalpro-backend",
  "method": "GET",
  "path": "/api/products",
  "statusCode": 200,
  "duration": "45ms"
}
```

---

### Development vs Production

**Development Mode**:
- Logs to **console** (colorized, human-readable)
- Logs to **files** (JSON format)
- Debug-level logs enabled

**Production Mode**:
- Logs to **files only** (JSON format)
- Info-level logs (no debug)
- Structured for log aggregation (CloudWatch, ELK Stack)

---

## Health Check Endpoints

### 1. Main Health Check

**Endpoint**: `GET /health`

**Purpose**: Comprehensive health status including database and Redis connectivity

**Response (Healthy)**:
```json
{
  "status": "healthy",
  "service": "MetalPro Backend API",
  "environment": "production",
  "timestamp": "2025-11-15T10:30:45.123Z",
  "uptime": 3600,
  "checks": {
    "database": "connected",
    "redis": "connected"
  }
}
```

**Response (Degraded)**:
```json
{
  "status": "degraded",
  "service": "MetalPro Backend API",
  "environment": "production",
  "timestamp": "2025-11-15T10:30:45.123Z",
  "uptime": 3600,
  "checks": {
    "database": "disconnected",
    "redis": "connected"
  }
}
```

**Status Codes**:
- `200 OK` - Service is healthy
- `503 Service Unavailable` - Service is degraded (database or Redis down)

**Use Cases**:
- Load balancer health checks
- Monitoring dashboards
- Uptime monitoring services

---

### 2. Liveness Probe

**Endpoint**: `GET /health/live`

**Purpose**: Checks if the application process is running (Kubernetes-style)

**Response**:
```json
{
  "status": "alive",
  "timestamp": "2025-11-15T10:30:45.123Z"
}
```

**Status Code**: Always `200 OK` (if server is running)

**Use Cases**:
- Kubernetes liveness probe
- Container orchestration health checks
- Detecting hung processes

---

### 3. Readiness Probe

**Endpoint**: `GET /health/ready`

**Purpose**: Checks if the application is ready to accept traffic

**Response (Ready)**:
```json
{
  "status": "ready",
  "timestamp": "2025-11-15T10:30:45.123Z"
}
```

**Response (Not Ready)**:
```json
{
  "status": "not ready",
  "error": "Database not accessible",
  "timestamp": "2025-11-15T10:30:45.123Z"
}
```

**Status Codes**:
- `200 OK` - Service is ready to accept traffic
- `503 Service Unavailable` - Service is not ready (database down)

**Use Cases**:
- Kubernetes readiness probe
- Load balancer target registration
- Rolling deployment health checks

---

## Request Logging

### Automatic Request Tracking

All HTTP requests are automatically logged with:
- **Method**: GET, POST, PUT, DELETE, etc.
- **Path**: Request URL path
- **Status Code**: HTTP response code
- **Duration**: Request processing time

**Example Log**:
```json
{
  "level": "info",
  "message": "HTTP Request",
  "timestamp": "2025-11-15 10:30:45",
  "service": "metalpro-backend",
  "method": "POST",
  "path": "/api/auth/login",
  "statusCode": 200,
  "duration": "125ms"
}
```

### Slow Request Detection

Requests taking > 1 second are automatically flagged:

```json
{
  "level": "warn",
  "message": "Slow Request",
  "timestamp": "2025-11-15 10:30:45",
  "service": "metalpro-backend",
  "method": "GET",
  "path": "/api/products",
  "statusCode": 200,
  "duration": "1250ms"
}
```

---

## Using the Logger in Code

### Import Logger

```typescript
import logger from './config/logger';
```

### Basic Logging

```typescript
// Info level
logger.info('User logged in', { userId: '123', email: 'user@example.com' });

// Warning level
logger.warn('API rate limit approaching', { ip: '1.2.3.4', usage: '95%' });

// Error level
logger.error('Payment processing failed', {
  error: error.message,
  orderId: '456',
  amount: 100.50
});

// Debug level (development only)
logger.debug('Database query executed', {
  query: 'SELECT * FROM users',
  duration: '25ms'
});
```

### Helper Functions

```typescript
import { logRequest, logAuth, logSecurity } from './config/logger';

// Log HTTP request (done automatically by middleware)
logRequest('GET', '/api/products', 200, 45);

// Log authentication event
logAuth('LOGIN_SUCCESS', 'user123', 'user@example.com');

// Log security event
logSecurity('RATE_LIMIT_EXCEEDED', {
  ip: '1.2.3.4',
  endpoint: '/api/auth/login',
  attempts: 6
});
```

---

## Monitoring in Production

### AWS CloudWatch Integration

When deployed to AWS, logs are automatically sent to CloudWatch Logs.

**Log Group**: `/ecs/metalpro-backend`

**Viewing Logs**:
```bash
# Tail logs in real-time
aws logs tail /ecs/metalpro-backend --follow

# Filter by error level
aws logs tail /ecs/metalpro-backend --follow --filter-pattern '"level":"error"'

# Search for specific user
aws logs tail /ecs/metalpro-backend --follow --filter-pattern '"userId":"123"'
```

---

### Metrics to Monitor

#### Application Metrics

| Metric | Threshold | Action |
|--------|-----------|--------|
| **Error Rate** | > 1% | Investigate errors in `error.log` |
| **Slow Requests** | > 5% | Optimize database queries |
| **Response Time (P95)** | > 500ms | Enable caching, optimize code |
| **Health Check Failures** | Any | Check database/Redis connectivity |

#### Infrastructure Metrics

| Metric | Threshold | Action |
|--------|-----------|--------|
| **CPU Usage** | > 80% | Scale up ECS tasks |
| **Memory Usage** | > 85% | Increase task memory or fix memory leaks |
| **Database Connections** | > 80% of max | Optimize connection pooling |
| **Disk Space (logs)** | > 80% | Review log rotation settings |

---

### Setting Up CloudWatch Alarms

```bash
# Alarm for high error rate
aws cloudwatch put-metric-alarm \
  --alarm-name metalpro-backend-high-error-rate \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --metric-name Errors \
  --namespace AWS/ECS \
  --period 300 \
  --statistic Sum \
  --threshold 10 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:metalpro-alerts

# Alarm for unhealthy targets (load balancer)
aws cloudwatch put-metric-alarm \
  --alarm-name metalpro-backend-unhealthy-targets \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --metric-name UnHealthyHostCount \
  --namespace AWS/ApplicationELB \
  --period 60 \
  --statistic Average \
  --threshold 0 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:metalpro-alerts
```

---

## Log Analysis Examples

### Find All Errors

```bash
# View last 100 error logs
tail -n 100 logs/error.log | jq .

# Search for specific error
grep "Database connection failed" logs/error.log | jq .
```

### Track Slow Requests

```bash
# Find requests slower than 1 second
grep "Slow Request" logs/combined.log | jq .

# Group slow requests by endpoint
grep "Slow Request" logs/combined.log | jq -r .path | sort | uniq -c | sort -rn
```

### Monitor Authentication

```bash
# Find failed login attempts
grep "LOGIN_FAILED" logs/combined.log | jq .

# Count login attempts by IP
grep "LOGIN_" logs/combined.log | jq -r .ip | sort | uniq -c | sort -rn
```

---

## Troubleshooting

### Logs Not Appearing

**Problem**: No logs in files

**Solutions**:
1. Check `logs/` directory exists
2. Verify file permissions (writable)
3. Check `LOG_LEVEL` environment variable
4. Restart server to reload logger configuration

### Disk Space Full

**Problem**: Log files consuming too much space

**Solutions**:
1. Check log rotation settings (10 MB per file, 5 files)
2. Manually clear old logs: `rm logs/*.log.1 logs/*.log.2`
3. Enable log shipping to CloudWatch (production)
4. Lower log level to `warn` or `error` only

### Health Check Failing

**Problem**: `/health` returns 503

**Solutions**:
1. Check database connectivity: `psql $DATABASE_URL`
2. Check Redis connectivity: `redis-cli -u $REDIS_URL ping`
3. Review `error.log` for connection errors
4. Verify security groups allow database/Redis access

---

## Best Practices

### 1. **Use Structured Logging**

✅ **Good**:
```typescript
logger.info('Order created', {
  orderId: order.id,
  userId: user.id,
  total: order.total
});
```

❌ **Bad**:
```typescript
console.log(`Order ${order.id} created for user ${user.id}`);
```

### 2. **Log Sensitive Data Carefully**

❌ **Never Log**:
- Passwords
- JWT tokens
- Credit card numbers
- Full user objects (may contain sensitive data)

✅ **Safe to Log**:
- User IDs
- Order IDs
- Timestamps
- Error messages (without sensitive data)

### 3. **Use Appropriate Log Levels**

- **Error**: Something failed (user sees an error)
- **Warn**: Something might fail soon (slow request, deprecated feature)
- **Info**: Important events (user logged in, order placed)
- **Debug**: Detailed troubleshooting (database queries, cache hits)

### 4. **Include Context**

Always include relevant IDs for traceability:

```typescript
logger.error('Payment failed', {
  error: error.message,
  orderId: order.id,
  userId: user.id,
  paymentMethod: 'stripe',
  amount: 100.50
});
```

---

## Future Enhancements (Optional)

### Error Tracking (Sentry)

For advanced error tracking with stack traces and user context:

```bash
npm install @sentry/node @sentry/profiling-node
```

See [Sentry documentation](https://docs.sentry.io/platforms/node/) for setup.

### Application Performance Monitoring (APM)

Consider tools like:
- **AWS X-Ray** - Distributed tracing
- **DataDog APM** - Full-stack monitoring
- **New Relic** - Application performance insights

---

**Last Updated**: November 15, 2025
**Version**: 1.0.0
