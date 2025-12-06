import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { authenticate, requireBackoffice } from '../middleware/auth.middleware';
import logger from '../config/logger';
import backofficeProductRoutes from './backoffice-product.routes';

const router = Router();

// All backoffice routes require authentication and backoffice role
router.use(authenticate);
router.use(requireBackoffice);

// =====================================================
// RFQ MANAGEMENT
// =====================================================

/**
 * GET /api/backoffice/rfqs
 * Get paginated list of RFQs with filters
 */
router.get('/rfqs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = '1',
      limit = '20',
      sortBy = 'submittedAt',
      sortOrder = 'desc',
      status,
      assignedToId,
      companyName,
      dateFrom,
      dateTo,
      minValue,
      maxValue,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (assignedToId) {
      where.assignedToId = assignedToId;
    }

    if (companyName) {
      where.companyName = {
        contains: companyName as string,
        mode: 'insensitive',
      };
    }

    if (dateFrom || dateTo) {
      where.submittedAt = {};
      if (dateFrom) {
        where.submittedAt.gte = new Date(dateFrom as string);
      }
      if (dateTo) {
        where.submittedAt.lte = new Date(dateTo as string);
      }
    }

    if (minValue || maxValue) {
      where.estimatedTotal = {};
      if (minValue) {
        where.estimatedTotal.gte = parseFloat(minValue as string);
      }
      if (maxValue) {
        where.estimatedTotal.lte = parseFloat(maxValue as string);
      }
    }

    // Get total count
    const total = await prisma.rFQ.count({ where });

    // Get paginated RFQs
    const rfqs = await prisma.rFQ.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: {
        [sortBy as string]: sortOrder === 'asc' ? 'asc' : 'desc',
      },
      select: {
        id: true,
        referenceNumber: true,
        status: true,
        companyName: true,
        contactPerson: true,
        email: true,
        phone: true,
        estimatedTotal: true,
        finalQuoteAmount: true,
        submittedAt: true,
        quotedAt: true,
        assignedToId: true,
      },
    });

    res.json({
      success: true,
      data: rfqs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    logger.error('Error fetching RFQs', {
      error: error.message,
      stack: error.stack,
    });
    next(error);
  }
});

/**
 * GET /api/backoffice/rfqs/:id
 * Get detailed RFQ by ID
 */
router.get('/rfqs/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const rfq = await prisma.rFQ.findUnique({
      where: { id },
      include: {
        items: true,
        attachments: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            company: true,
          },
        },
      },
    });

    if (!rfq) {
      return res.status(404).json({
        success: false,
        message: 'RFQ not found',
      });
    }

    logger.info('RFQ Detail Response', {
      rfqId: id,
      hasStatus: !!rfq.status,
      status: rfq.status,
      keys: Object.keys(rfq),
    });

    res.json({
      success: true,
      data: rfq,
    });
  } catch (error: any) {
    logger.error('Error fetching RFQ details', {
      error: error.message,
      stack: error.stack,
    });
    next(error);
  }
});

/**
 * PATCH /api/backoffice/rfqs/:id/status
 * Update RFQ status
 */
router.patch('/rfqs/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, internalNotes, customerNotes } = req.body;

    // Get current RFQ to check existing timestamps
    const currentRFQ = await prisma.rFQ.findUnique({ where: { id } });
    if (!currentRFQ) {
      return res.status(404).json({ error: 'RFQ not found' });
    }

    // Build update data with timestamps
    const updateData: any = {
      status,
      internalNotes,
      customerNotes,
    };

    // Set status timestamps when transitioning to each status (only once)
    if (status === 'ACKNOWLEDGED' && !currentRFQ.acknowledgedAt) {
      updateData.acknowledgedAt = new Date();
    }
    if (status === 'IN_PROGRESS' && !currentRFQ.inProgressAt) {
      updateData.inProgressAt = new Date();
    }
    if (status === 'QUOTED' && !currentRFQ.quotedAt) {
      updateData.quotedAt = new Date();
    }
    if (status === 'COMPLETED' && !currentRFQ.completedAt) {
      updateData.completedAt = new Date();
    }
    if (status === 'CANCELLED' && !currentRFQ.cancelledAt) {
      updateData.cancelledAt = new Date();
    }

    const rfq = await prisma.rFQ.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        attachments: true,
      },
    });

    logger.info('RFQ status updated', {
      rfqId: id,
      status,
      updatedBy: (req as any).user.id,
    });

    res.json({
      success: true,
      data: rfq,
    });
  } catch (error: any) {
    logger.error('Error updating RFQ status', {
      error: error.message,
      stack: error.stack,
    });
    next(error);
  }
});

/**
 * PATCH /api/backoffice/rfqs/:id/assign
 * Assign RFQ to operator
 */
router.patch('/rfqs/:id/assign', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { operatorId } = req.body;

    const rfq = await prisma.rFQ.update({
      where: { id },
      data: {
        assignedToId: operatorId,
      },
      include: {
        items: true,
      },
    });

    logger.info('RFQ assigned', {
      rfqId: id,
      operatorId,
      assignedBy: (req as any).user.id,
    });

    res.json({
      success: true,
      data: rfq,
    });
  } catch (error: any) {
    logger.error('Error assigning RFQ', {
      error: error.message,
      stack: error.stack,
    });
    next(error);
  }
});

/**
 * PATCH /api/backoffice/rfqs/:id/pricing
 * Update RFQ pricing
 */
router.patch('/rfqs/:id/pricing', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { items, deliveryCost, processingFee, vatAmount, finalQuoteAmount } = req.body;

    // Update individual line items if provided
    if (items && items.length > 0) {
      await Promise.all(
        items.map((item: any) =>
          prisma.rFQItem.update({
            where: { id: item.id },
            data: {
              finalPrice: item.pricePerUnit,
              grossPrice: item.pricePerUnit,
            },
          })
        )
      );
    }

    // Update RFQ-level pricing
    const rfq = await prisma.rFQ.update({
      where: { id },
      data: {
        deliveryCost,
        processingFee,
        vatAmount,
        finalQuoteAmount,
      },
      include: {
        items: true,
        attachments: true,
      },
    });

    logger.info('RFQ pricing updated', {
      rfqId: id,
      finalQuoteAmount,
      updatedBy: (req as any).user.id,
    });

    res.json({
      success: true,
      data: rfq,
    });
  } catch (error: any) {
    logger.error('Error updating RFQ pricing', {
      error: error.message,
      stack: error.stack,
    });
    next(error);
  }
});

// =====================================================
// PRODUCTS
// =====================================================

// Mount product routes
router.use('/products', backofficeProductRoutes);

// =====================================================
// ANALYTICS
// =====================================================

/**
 * GET /api/backoffice/analytics/kpis
 * Get dashboard KPIs
 */
router.get('/analytics/kpis', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get total RFQs
    const totalRFQs = await prisma.rFQ.count();

    // Get pending RFQs (SUBMITTED status)
    const pendingRFQs = await prisma.rFQ.count({
      where: { status: 'SUBMITTED' },
    });

    // Get quoted RFQs count
    const quotedRFQs = await prisma.rFQ.count({
      where: { status: 'QUOTED' },
    });

    // Get completed RFQs count
    const completedRFQs = await prisma.rFQ.count({
      where: { status: 'COMPLETED' },
    });

    // Get total quoted value (excluding cancelled RFQs)
    const rfqsForValue = await prisma.rFQ.findMany({
      where: {
        status: { not: 'CANCELLED' },
      },
      select: {
        finalQuoteAmount: true,
        estimatedTotal: true,
      },
    });

    const totalQuotedValue = rfqsForValue.reduce((sum, rfq) => {
      const value = rfq.finalQuoteAmount || rfq.estimatedTotal || 0;
      return sum + value;
    }, 0);

    // Calculate average response time (in hours)
    const rfqsWithTimestamps = await prisma.rFQ.findMany({
      where: {
        quotedAt: { not: { equals: null } },
      },
      select: {
        submittedAt: true,
        quotedAt: true,
      },
    });

    let avgResponseTimeHours = 0;
    if (rfqsWithTimestamps.length > 0) {
      const totalHours = rfqsWithTimestamps.reduce((sum, rfq) => {
        const diff = rfq.quotedAt!.getTime() - rfq.submittedAt.getTime();
        return sum + (diff / (1000 * 60 * 60)); // Convert to hours
      }, 0);
      avgResponseTimeHours = Math.round(totalHours / rfqsWithTimestamps.length);
    }

    res.json({
      success: true,
      data: {
        totalRFQs,
        pendingRFQs,
        quotedRFQs,
        completedRFQs,
        totalQuotedValue,
        avgResponseTimeHours,
      },
    });
  } catch (error: any) {
    logger.error('Error fetching KPIs', {
      error: error.message,
      stack: error.stack,
    });
    next(error);
  }
});

/**
 * GET /api/backoffice/analytics/rfq-trend
 * Get monthly RFQ volume trend data for the last 12 months
 */
router.get('/analytics/rfq-trend', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get all RFQs with submission dates
    const rfqs = await prisma.rFQ.findMany({
      select: {
        submittedAt: true,
      },
      orderBy: {
        submittedAt: 'asc',
      },
    });

    // Group RFQs by month
    const monthlyData: Record<string, number> = {};

    rfqs.forEach((rfq) => {
      const date = new Date(rfq.submittedAt);
      // Create key as YYYY-MM (e.g., "2024-01")
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    // Generate last 12 months
    const now = new Date();
    const last12Months: { date: string; rfqs: number }[] = [];

    for (let i = 11; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = targetDate.toLocaleDateString('en-US', { month: 'short' });

      last12Months.push({
        date: monthLabel,
        rfqs: monthlyData[monthKey] || 0,
      });
    }

    res.json({
      success: true,
      data: last12Months,
    });
  } catch (error: any) {
    logger.error('Error fetching RFQ trend', {
      error: error.message,
      stack: error.stack,
    });
    next(error);
  }
});

/**
 * GET /api/backoffice/analytics/revenue-trend
 * Get monthly revenue trend data for the last 12 months
 */
router.get('/analytics/revenue-trend', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get all non-cancelled RFQs with submission dates and revenue
    const rfqs = await prisma.rFQ.findMany({
      where: {
        status: { not: 'CANCELLED' },
      },
      select: {
        submittedAt: true,
        finalQuoteAmount: true,
        estimatedTotal: true,
      },
      orderBy: {
        submittedAt: 'asc',
      },
    });

    // Group revenue by month
    const monthlyData: Record<string, number> = {};

    rfqs.forEach((rfq) => {
      const date = new Date(rfq.submittedAt);
      // Create key as YYYY-MM (e.g., "2024-01")
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      // Use finalQuoteAmount if available, otherwise estimatedTotal
      const revenue = rfq.finalQuoteAmount || rfq.estimatedTotal || 0;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + revenue;
    });

    // Generate last 12 months
    const now = new Date();
    const last12Months: { date: string; revenue: number }[] = [];

    for (let i = 11; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = targetDate.toLocaleDateString('en-US', { month: 'short' });

      last12Months.push({
        date: monthLabel,
        revenue: monthlyData[monthKey] || 0,
      });
    }

    res.json({
      success: true,
      data: last12Months,
    });
  } catch (error: any) {
    logger.error('Error fetching revenue trend', {
      error: error.message,
      stack: error.stack,
    });
    next(error);
  }
});

export default router;
