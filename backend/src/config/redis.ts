import { createClient } from 'redis';

// =====================================================
// Redis Client Instance
// =====================================================

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
})();

// Graceful shutdown
process.on('beforeExit', async () => {
  await redisClient.disconnect();
});

export { redisClient };
