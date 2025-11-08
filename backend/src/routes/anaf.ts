import express, { Request, Response } from 'express';
import { validateCUIWithANAF, getCacheStats, clearCache } from '../services/anafService';
import type { ValidationRequest } from '../types/anaf';

const router = express.Router();

/**
 * POST /api/anaf/validate-cui
 * Validate Romanian CUI/VAT number with ANAF
 */
router.post('/validate-cui', async (req: Request, res: Response) => {
  try {
    const { cui } = req.body as ValidationRequest;

    // Validate request
    if (!cui || typeof cui !== 'string') {
      return res.status(400).json({
        error: 'CUI is required and must be a string',
      });
    }

    // Validate CUI format (basic check)
    const normalizedCUI = cui.replace(/\D/g, '');
    if (normalizedCUI.length < 2 || normalizedCUI.length > 10) {
      return res.status(400).json({
        error: 'CUI must be between 2 and 10 digits',
      });
    }

    // Call ANAF service
    const result = await validateCUIWithANAF(cui);

    // Return result
    return res.status(200).json(result);
  } catch (error) {
    console.error('[ANAF Route] Error validating CUI:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/anaf/cache-stats
 * Get cache statistics (useful for monitoring)
 */
router.get('/cache-stats', (req: Request, res: Response) => {
  try {
    const stats = getCacheStats();
    return res.status(200).json(stats);
  } catch (error) {
    console.error('[ANAF Route] Error getting cache stats:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
});

/**
 * POST /api/anaf/clear-cache
 * Clear the CUI validation cache
 * (Should be protected with authentication in production)
 */
router.post('/clear-cache', (req: Request, res: Response) => {
  try {
    clearCache();
    return res.status(200).json({
      message: 'Cache cleared successfully',
    });
  } catch (error) {
    console.error('[ANAF Route] Error clearing cache:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
});

/**
 * GET /api/anaf/health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  return res.status(200).json({
    status: 'healthy',
    service: 'ANAF Validation API',
    timestamp: new Date().toISOString(),
  });
});

export default router;
