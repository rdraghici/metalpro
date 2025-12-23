# ==============================================
# MetalPro Backend - Production Dockerfile
# ==============================================
# Multi-stage build for optimized production image

# ==============================================
# Stage 1: Builder
# ==============================================
FROM node:20-alpine AS builder

# Install OpenSSL for Prisma and curl for health checks
RUN apk add --no-cache openssl curl

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript to JavaScript (skip tests in Docker build)
RUN npm run build:skip-tests

# ==============================================
# Stage 2: Production
# ==============================================
FROM node:20-alpine

# Install OpenSSL for Prisma and curl for health checks
RUN apk add --no-cache openssl curl

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy templates (PDF templates for quote generation)
COPY --from=builder /app/dist/templates ./dist/templates

# Create uploads directory
RUN mkdir -p uploads

# Set environment to production
ENV NODE_ENV=production

# Expose port
EXPOSE 3001

# Run database migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
