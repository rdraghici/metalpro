/**
 * Test Setup File
 * Global test configuration for Jest
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error'; // Reduce logging noise in tests
process.env.PORT = '3002'; // Use different port for tests
