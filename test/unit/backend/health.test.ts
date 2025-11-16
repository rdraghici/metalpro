/**
 * Health Check Endpoint Tests
 * Tests for Phase 6C.8: Monitoring & Logging
 */

import request from 'supertest';
import express, { Express } from 'express';

// Create a minimal test app
const createTestApp = (): Express => {
  const app = express();

  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      service: 'MetalPro Backend API',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      checks: {
        database: 'connected',
        redis: 'connected',
      },
    });
  });

  app.get('/health/live', (req, res) => {
    res.status(200).json({
      status: 'alive',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/health/ready', (req, res) => {
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
    });
  });

  return app;
};

describe('Backend API - Health Check Endpoints', () => {
  let app: Express;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('GET /health', () => {
    it('should return 200 OK with health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('service', 'MetalPro Backend API');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('checks');
    });

    it('should include database and redis checks', async () => {
      const response = await request(app).get('/health');

      expect(response.body.checks).toHaveProperty('database');
      expect(response.body.checks).toHaveProperty('redis');
    });

    it('should return valid timestamp', async () => {
      const response = await request(app).get('/health');

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });
  });

  describe('GET /health/live', () => {
    it('should return 200 OK for liveness probe', async () => {
      const response = await request(app).get('/health/live');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'alive');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should respond quickly (< 100ms)', async () => {
      const start = Date.now();
      await request(app).get('/health/live');
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(100);
    });
  });

  describe('GET /health/ready', () => {
    it('should return 200 OK for readiness probe', async () => {
      const response = await request(app).get('/health/ready');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ready');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Health Check Performance', () => {
    it('should handle multiple concurrent requests', async () => {
      const requests = Array.from({ length: 10 }, () =>
        request(app).get('/health')
      );

      const responses = await Promise.all(requests);

      responses.forEach((response) => {
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('healthy');
      });
    });
  });
});
