import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireBackoffice } from '../middleware/rbac';
import { backofficeAnalyticsService } from '../services/backoffice-analytics.service';
import { RFQStatus } from '@prisma/client';

const router = Router();

// All back-office analytics routes require authentication and BACKOFFICE or ADMIN role
router.use(authenticate);
router.use(requireBackoffice);

/**
 * GET /api/backoffice/analytics/kpis
 * Get dashboard KPIs
 */
router.get('/kpis', async (req: Request, res: Response) => {
  try {
    const { dateFrom, dateTo } = req.query;

    const filters: any = {};
    if (dateFrom) filters.dateFrom = new Date(dateFrom as string);
    if (dateTo) filters.dateTo = new Date(dateTo as string);

    const kpis = await backofficeAnalyticsService.getKPIs(filters);

    res.json(kpis);
  } catch (error: any) {
    console.error('Error getting KPIs:', error);
    res.status(500).json({ error: 'Failed to fetch KPIs', message: error.message });
  }
});

/**
 * GET /api/backoffice/analytics/rfqs-over-time
 * Get RFQs over time (time series)
 */
router.get('/rfqs-over-time', async (req: Request, res: Response) => {
  try {
    const { dateFrom, dateTo, interval } = req.query;

    const filters: any = {};
    if (dateFrom) filters.dateFrom = new Date(dateFrom as string);
    if (dateTo) filters.dateTo = new Date(dateTo as string);
    if (interval) filters.interval = interval as 'day' | 'week' | 'month';

    const data = await backofficeAnalyticsService.getRFQsOverTime(filters);

    res.json(data);
  } catch (error: any) {
    console.error('Error getting RFQs over time:', error);
    res.status(500).json({ error: 'Failed to fetch time series data', message: error.message });
  }
});

/**
 * GET /api/backoffice/analytics/rfqs-by-status
 * Get RFQs breakdown by status
 */
router.get('/rfqs-by-status', async (req: Request, res: Response) => {
  try {
    const { dateFrom, dateTo } = req.query;

    const filters: any = {};
    if (dateFrom) filters.dateFrom = new Date(dateFrom as string);
    if (dateTo) filters.dateTo = new Date(dateTo as string);

    const data = await backofficeAnalyticsService.getRFQsByStatus(filters);

    res.json(data);
  } catch (error: any) {
    console.error('Error getting RFQs by status:', error);
    res.status(500).json({ error: 'Failed to fetch status breakdown', message: error.message });
  }
});

/**
 * GET /api/backoffice/analytics/top-products
 * Get top products by RFQ count
 */
router.get('/top-products', async (req: Request, res: Response) => {
  try {
    const { dateFrom, dateTo, limit } = req.query;

    const filters: any = {};
    if (dateFrom) filters.dateFrom = new Date(dateFrom as string);
    if (dateTo) filters.dateTo = new Date(dateTo as string);
    if (limit) filters.limit = parseInt(limit as string);

    const data = await backofficeAnalyticsService.getTopProductsByRFQCount(filters);

    res.json(data);
  } catch (error: any) {
    console.error('Error getting top products:', error);
    res.status(500).json({ error: 'Failed to fetch top products', message: error.message });
  }
});

/**
 * GET /api/backoffice/analytics/operator-performance
 * Get operator performance metrics
 */
router.get('/operator-performance', async (req: Request, res: Response) => {
  try {
    const { dateFrom, dateTo } = req.query;

    const filters: any = {};
    if (dateFrom) filters.dateFrom = new Date(dateFrom as string);
    if (dateTo) filters.dateTo = new Date(dateTo as string);

    const data = await backofficeAnalyticsService.getOperatorPerformance(filters);

    res.json(data);
  } catch (error: any) {
    console.error('Error getting operator performance:', error);
    res.status(500).json({
      error: 'Failed to fetch operator performance',
      message: error.message,
    });
  }
});

/**
 * GET /api/backoffice/analytics/avg-rfq-value-trend
 * Get average RFQ value trend over time
 */
router.get('/avg-rfq-value-trend', async (req: Request, res: Response) => {
  try {
    const { dateFrom, dateTo, interval } = req.query;

    const filters: any = {};
    if (dateFrom) filters.dateFrom = new Date(dateFrom as string);
    if (dateTo) filters.dateTo = new Date(dateTo as string);
    if (interval) filters.interval = interval as 'day' | 'week' | 'month';

    const data = await backofficeAnalyticsService.getAvgRFQValueTrend(filters);

    res.json(data);
  } catch (error: any) {
    console.error('Error getting avg RFQ value trend:', error);
    res.status(500).json({ error: 'Failed to fetch value trend', message: error.message });
  }
});

/**
 * GET /api/backoffice/analytics/export/rfq-report
 * Export RFQ report data
 */
router.get('/export/rfq-report', async (req: Request, res: Response) => {
  try {
    const { dateFrom, dateTo, status } = req.query;

    const filters: any = {};
    if (dateFrom) filters.dateFrom = new Date(dateFrom as string);
    if (dateTo) filters.dateTo = new Date(dateTo as string);
    if (status) filters.status = status as RFQStatus;

    const data = await backofficeAnalyticsService.exportRFQReport(filters);

    res.json(data);
  } catch (error: any) {
    console.error('Error exporting RFQ report:', error);
    res.status(500).json({ error: 'Failed to export report', message: error.message });
  }
});

export default router;
