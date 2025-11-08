# MetalPro Backend API

Backend proxy server for MetalPro Steel Craft Flow application. Provides integration with the Romanian ANAF (Tax Authority) API for CUI/VAT validation.

## Features

- ✅ CUI/VAT validation with ANAF API
- ✅ In-memory caching (24-hour TTL)
- ✅ CORS support for frontend
- ✅ Security headers (Helmet)
- ✅ Error handling and logging
- ✅ Health check endpoints
- ✅ TypeScript support

## Prerequisites

- Node.js 18+ or 20+
- npm or yarn

## Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

## Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` to configure:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:8080

# ANAF API Configuration
ANAF_API_URL=https://webservicesp.anaf.ro/PlatitorTvaRest/api/v8/ws/tva

# Cache Configuration (in milliseconds)
CACHE_TTL=86400000  # 24 hours

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
```

## Development

Start the development server with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Production

Build and run in production mode:

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## API Endpoints

### Health Check

```http
GET /health
```

Response:
```json
{
  "status": "healthy",
  "service": "MetalPro Backend API",
  "environment": "development",
  "timestamp": "2025-01-08T10:00:00.000Z"
}
```

### Validate CUI

```http
POST /api/anaf/validate-cui
Content-Type: application/json

{
  "cui": "14399840"
}
```

Response (success):
```json
{
  "valid": true,
  "cui": "14399840",
  "legalName": "S.C. METALPRO INDUSTRIES S.R.L.",
  "address": "STR. EXAMPLE NR. 10, CLUJ-NAPOCA, JUD. CLUJ",
  "county": "CLUJ",
  "vatPayer": true,
  "active": true,
  "registrationDate": "2001-12-15",
  "message": "CUI/VAT validat în baza ANAF"
}
```

Response (not found):
```json
{
  "valid": false,
  "cui": "12345678",
  "message": "CUI/VAT nu este înregistrat în baza ANAF"
}
```

### Cache Statistics

```http
GET /api/anaf/cache-stats
```

Response:
```json
{
  "size": 5,
  "entries": [
    {
      "cui": "14399840",
      "age": 3600000,
      "valid": true
    }
  ]
}
```

### Clear Cache

```http
POST /api/anaf/clear-cache
```

Response:
```json
{
  "message": "Cache cleared successfully"
}
```

## Testing with cURL

### Test validation with valid CUI:

```bash
curl -X POST http://localhost:3001/api/anaf/validate-cui \
  -H "Content-Type: application/json" \
  -d '{"cui": "14399840"}'
```

### Test validation with RO prefix:

```bash
curl -X POST http://localhost:3001/api/anaf/validate-cui \
  -H "Content-Type: application/json" \
  -d '{"cui": "RO14399840"}'
```

### Check health:

```bash
curl http://localhost:3001/health
```

### Check cache stats:

```bash
curl http://localhost:3001/api/anaf/cache-stats
```

## Architecture

```
backend/
├── src/
│   ├── routes/
│   │   └── anaf.ts          # ANAF API routes
│   ├── services/
│   │   └── anafService.ts   # ANAF API integration & caching
│   ├── types/
│   │   └── anaf.ts          # TypeScript type definitions
│   └── server.ts            # Express server setup
├── .env                     # Environment variables (not in git)
├── .env.example             # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## Caching Strategy

- **In-memory cache** using JavaScript Map
- **TTL**: 24 hours (configurable via `CACHE_TTL`)
- **Cache key**: Normalized CUI (digits only)
- **Cache invalidation**: Automatic on expiry or manual via API

## Error Handling

The API gracefully handles:
- Invalid CUI format
- ANAF API timeouts (10 second timeout)
- Network errors
- Rate limiting
- CORS errors

## Security

- **Helmet**: Security headers
- **CORS**: Restricted to configured frontend URL
- **Input validation**: CUI format validation before API calls
- **Error messages**: No sensitive information leaked in production

## Performance

- **Caching**: Reduces ANAF API calls
- **Timeout**: 10 second maximum per request
- **Async**: Non-blocking operations
- **Rate limiting**: Prevents abuse (configurable)

## Troubleshooting

### Backend won't start

Check if port 3001 is already in use:
```bash
lsof -i :3001
```

Change port in `.env` if needed.

### CORS errors

Ensure `FRONTEND_URL` in `.env` matches your frontend URL exactly.

### ANAF API timeouts

The ANAF API can be slow. Current timeout is 10 seconds. Increase if needed in `anafService.ts`:

```typescript
timeout: 15000, // 15 seconds
```

### Cache not working

Check cache statistics:
```bash
curl http://localhost:3001/api/anaf/cache-stats
```

Clear cache if needed:
```bash
curl -X POST http://localhost:3001/api/anaf/clear-cache
```

## Deployment

### Docker (recommended for production)

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t metalpro-backend .
docker run -p 3001:3001 --env-file .env metalpro-backend
```

### PM2 (Node.js process manager)

```bash
npm install -g pm2
pm2 start dist/server.js --name metalpro-backend
pm2 save
pm2 startup
```

## License

MIT
