# Security Documentation

## Overview

This document outlines all security measures implemented in the MetalPro Backend API to ensure production-ready security standards.

---

## Security Enhancements

### 1. Rate Limiting

Rate limiting protects the API from abuse, brute-force attacks, and DDoS attempts.

#### General API Rate Limiting
- **Location**: `src/middleware/rate-limiter.ts`
- **Limit**: 100 requests per 15 minutes per IP address
- **Applies to**: All API endpoints (except /health)
- **Response**: HTTP 429 when limit exceeded
- **Headers**:
  - `RateLimit-Policy`: Limit policy
  - `RateLimit-Limit`: Maximum requests allowed
  - `RateLimit-Remaining`: Requests remaining
  - `RateLimit-Reset`: Time until reset (seconds)

#### Authentication Rate Limiting (Strict)
- **Limit**: 5 requests per 15 minutes per IP address
- **Applies to**: `/api/auth/*` endpoints (login, signup, password reset)
- **Purpose**: Prevent brute-force attacks on authentication
- **Feature**: Skip successful requests (only failed attempts count)

#### File Upload Rate Limiting
- **Limit**: 20 uploads per hour per IP address
- **Applies to**: `/api/upload/*` endpoints
- **Purpose**: Prevent upload abuse and storage exhaustion

#### RFQ Submission Rate Limiting
- **Limit**: 10 submissions per hour per IP address
- **Applies to**: `/api/rfq/*` endpoints
- **Purpose**: Prevent spam RFQ submissions

### 2. Input Sanitization

#### XSS Protection
- **Location**: `src/middleware/sanitize.ts`
- **Method**: `sanitizeXSS`
- **Sanitizes**: Request body, query parameters, URL parameters
- **Implementation**: Escapes HTML special characters
  - `&` → `&amp;`
  - `<` → `&lt;`
  - `>` → `&gt;`
  - `"` → `&quot;`
  - `'` → `&#x27;`
  - `/` → `&#x2F;`

#### MongoDB Injection Protection
- **Location**: `src/middleware/sanitize.ts`
- **Method**: `sanitizeMongoData`
- **Package**: `express-mongo-sanitize`
- **Protection**: Removes MongoDB operators from user input
  - Removes keys starting with `$` (e.g., `$ne`, `$gt`)
  - Removes keys containing `.` (e.g., nested object injection)
- **Replacement**: Replaces with `_` character
- **Logging**: Warns when sanitization occurs

### 3. Environment Variable Validation

#### Startup Validation
- **Location**: `src/config/env-validator.ts`
- **When**: Runs before server starts
- **Purpose**: Ensures all required environment variables are set

#### Required Variables
- `NODE_ENV` - Node environment
- `PORT` - Server port
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret (minimum 32 characters)
- `JWT_EXPIRES_IN` - JWT expiration time
- `REFRESH_TOKEN_EXPIRES_IN` - Refresh token expiration
- `FRONTEND_URL` - CORS origin URL
- `BACKEND_URL` - Backend URL for file links
- `UPLOAD_DIR` - File upload directory
- `ANAF_API_URL` - ANAF API endpoint
- `LOG_LEVEL` - Logging level

#### Optional Variables (with warnings in production)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - Email service
- `FROM_EMAIL`, `OPERATOR_EMAIL` - Email addresses

#### Security Checks
- JWT_SECRET must be at least 32 characters
- Warns if using default JWT_SECRET in production
- Warns if using development database password in production
- Warns if email service not configured in production

### 4. Secure Error Handling

#### Production Mode
- **Location**: `src/index.ts` (global error handler)
- **Behavior**:
  - Hides internal error details from clients
  - Returns generic "An unexpected error occurred" message for 500 errors
  - Logs full error details server-side only
- **Logged Information**:
  - Error message
  - Stack trace
  - Request path
  - HTTP method
  - Timestamp

#### Development Mode
- **Behavior**:
  - Returns detailed error information (message, stack trace, path, method)
  - Helps with debugging during development
- **Warning**: Never use development mode in production!

### 5. Security Headers

#### Helmet.js
- **Location**: `src/index.ts`
- **Package**: `helmet`
- **Protection**:
  - `X-DNS-Prefetch-Control` - Controls DNS prefetching
  - `X-Frame-Options` - Prevents clickjacking (DENY)
  - `X-Content-Type-Options` - Prevents MIME sniffing (nosniff)
  - `X-Download-Options` - Prevents downloads from opening automatically
  - `X-XSS-Protection` - Enables XSS filter
  - `Strict-Transport-Security` - Enforces HTTPS
  - `Content-Security-Policy` - Controls resource loading

### 6. CORS Configuration

#### Settings
- **Location**: `src/index.ts`
- **Origin**: `FRONTEND_URL` environment variable
- **Credentials**: Enabled (allows cookies/auth headers)
- **Methods**: GET, POST, PUT, PATCH, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization
- **Purpose**: Prevents unauthorized cross-origin requests

---

## Testing

### Manual Testing

Run the security test suite:

```bash
chmod +x test-security.sh
./test-security.sh
```

### Test Coverage

The test suite verifies:
1. ✅ Environment validation on startup
2. ✅ API rate limiting (100 req/15min)
3. ✅ Auth rate limiting (5 req/15min)
4. ✅ XSS protection (script tag sanitization)
5. ✅ MongoDB injection protection (operator removal)
6. ✅ Secure error handling (no sensitive data leakage)
7. ✅ Health check bypass (always accessible)
8. ✅ Rate limit headers (proper HTTP headers)

### Expected Results

- **Rate Limiting**: 6th auth attempt returns HTTP 429
- **XSS Protection**: Script tags are escaped in inputs
- **MongoDB Injection**: `$ne`, `$gt` operators are removed
- **Error Handling**: Clean error messages without stack traces (production)
- **Health Check**: Always returns HTTP 200 regardless of rate limits
- **Headers**: RateLimit-* headers present in responses

---

## Production Deployment Checklist

Before deploying to production, ensure:

- [ ] `NODE_ENV=production` is set
- [ ] `JWT_SECRET` is changed from default value (minimum 32 characters)
- [ ] Database password is changed from development password
- [ ] Email service is configured (SMTP credentials set)
- [ ] `FRONTEND_URL` is set to production frontend URL
- [ ] `BACKEND_URL` is set to production backend URL
- [ ] All required environment variables are set
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced (use reverse proxy like Nginx)
- [ ] Database connections use SSL
- [ ] Redis connections use password authentication

---

## Security Best Practices

### For Developers

1. **Never commit `.env` files** - Always use `.env.example` as template
2. **Use environment variables** - Never hardcode secrets
3. **Validate user input** - Always validate and sanitize
4. **Use parameterized queries** - Prisma provides this by default
5. **Keep dependencies updated** - Run `npm audit` regularly
6. **Follow principle of least privilege** - Minimal database permissions
7. **Log security events** - Track failed auth attempts, rate limit hits
8. **Test in production mode** - Before deploying

### For Operations

1. **Enable HTTPS** - Use Let's Encrypt or similar
2. **Use strong passwords** - Minimum 16 characters for database, Redis
3. **Restrict database access** - Only from application server
4. **Enable firewall rules** - Restrict ports 3001, 5432, 6379
5. **Regular backups** - Database and file uploads
6. **Monitor logs** - Set up alerting for suspicious activity
7. **Update SSL certificates** - Before expiration
8. **Review security logs** - Weekly or daily in production

---

## Incident Response

### If Rate Limit Abuse is Detected

1. Check logs for offending IP addresses
2. Consider adding IP to blocklist (firewall level)
3. Review and adjust rate limits if needed
4. Contact hosting provider if DDoS attack

### If SQL/NoSQL Injection Attempt is Detected

1. Logs will show sanitization warnings
2. Review the affected endpoint
3. Add additional validation if needed
4. Consider blocking the IP address
5. Check database for any suspicious data

### If XSS Attempt is Detected

1. Logs will show escaped script tags
2. Verify sanitization is working
3. Check all user-generated content displays
4. Review and enhance Content-Security-Policy headers

### If Authentication Breach is Suspected

1. Force password reset for affected users
2. Invalidate all active sessions
3. Review authentication logs
4. Increase rate limiting temporarily
5. Enable 2FA if not already enabled

---

## Dependencies

### Security-Related Packages

- `helmet` (^8.0.0) - Security headers
- `express-rate-limit` (^7.4.1) - Rate limiting
- `express-mongo-sanitize` (^2.2.0) - MongoDB injection protection
- `bcryptjs` (^2.4.3) - Password hashing
- `jsonwebtoken` (^9.0.2) - JWT authentication

### Regular Updates

Run these commands monthly:

```bash
npm audit                    # Check for vulnerabilities
npm audit fix               # Fix vulnerabilities
npm outdated                # Check for outdated packages
npm update                  # Update to latest compatible versions
```

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Top security risks
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Security Checklist](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)
- [Helmet.js Documentation](https://helmetjs.github.io/)

---

## Changelog

### 2025-11-15 - Initial Security Implementation

- ✅ Added rate limiting (general, auth, upload, RFQ)
- ✅ Added XSS protection middleware
- ✅ Added MongoDB injection protection
- ✅ Added environment variable validation
- ✅ Enhanced error handling for production
- ✅ Created security test suite
- ✅ Documented all security measures
