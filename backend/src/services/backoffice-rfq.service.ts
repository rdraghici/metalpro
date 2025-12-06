import { prisma } from '../config/database';
import { RFQStatus } from '@prisma/client';
import { emailService } from './email.service';

// =====================================================
// TYPES
// =====================================================

interface RFQFilters {
  status?: RFQStatus;
  assignedToId?: string;
  companyName?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minValue?: number;
  maxValue?: number;
}

interface RFQListOptions {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'submittedAt' | 'estimatedTotal';
  sortOrder?: 'asc' | 'desc';
}

interface UpdateRFQPricingData {
  items?: Array<{
    id: string;
    finalPrice: number;
  }>;
  deliveryCost?: number;
  processingFee?: number;
  vatAmount?: number;
  finalQuoteAmount?: number;
}

interface UpdateRFQStatusData {
  status: RFQStatus;
  assignedToId?: string;
  internalNotes?: string;
  customerNotes?: string;
}

// =====================================================
// BACK-OFFICE RFQ SERVICE
// =====================================================

export class BackofficeRFQService {
  /**
   * Get RFQs with filters and pagination
   */
  async getRFQs(filters: RFQFilters = {}, options: RFQListOptions = {}) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';

    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.assignedToId) {
      where.assignedToId = filters.assignedToId;
    }

    if (filters.companyName) {
      where.companyName = {
        contains: filters.companyName,
        mode: 'insensitive',
      };
    }

    if (filters.dateFrom || filters.dateTo) {
      where.submittedAt = {};
      if (filters.dateFrom) {
        where.submittedAt.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.submittedAt.lte = filters.dateTo;
      }
    }

    if (filters.minValue || filters.maxValue) {
      where.estimatedTotal = {};
      if (filters.minValue) {
        where.estimatedTotal.gte = filters.minValue;
      }
      if (filters.maxValue) {
        where.estimatedTotal.lte = filters.maxValue;
      }
    }

    const [rfqs, total] = await Promise.all([
      prisma.rFQ.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: true,
          attachments: true,
        },
      }),
      prisma.rFQ.count({ where }),
    ]);

    return {
      rfqs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single RFQ by ID with full details
   */
  async getRFQById(id: string) {
    const rfq = await prisma.rFQ.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            company: true,
          },
        },
        items: true,
        attachments: true,
      },
    });

    if (!rfq) {
      throw new Error('RFQ not found');
    }

    return rfq;
  }

  /**
   * Update RFQ status and assignment
   */
  async updateRFQStatus(id: string, data: UpdateRFQStatusData, operatorId: string) {
    const rfq = await this.getRFQById(id);
    const oldStatus = rfq.status;

    console.log('📝 UpdateRFQStatus Debug:', {
      rfqId: id,
      oldStatus,
      newStatus: data.status,
      newStatusType: typeof data.status,
      rfqTimestamps: {
        acknowledgedAt: rfq.acknowledgedAt,
        inProgressAt: rfq.inProgressAt,
        quotedAt: rfq.quotedAt,
        completedAt: rfq.completedAt,
        cancelledAt: rfq.cancelledAt,
      },
    });

    const updates: any = {
      status: data.status,
      updatedAt: new Date(),
    };

    if (data.assignedToId !== undefined) {
      updates.assignedToId = data.assignedToId;
    }

    if (data.internalNotes !== undefined) {
      updates.internalNotes = data.internalNotes;
    }

    if (data.customerNotes !== undefined) {
      updates.customerNotes = data.customerNotes;
    }

    // Set status timestamps when transitioning to each status (only once)
    if (data.status === RFQStatus.ACKNOWLEDGED && !rfq.acknowledgedAt) {
      console.log('✅ Setting acknowledgedAt');
      updates.acknowledgedAt = new Date();
    }

    if (data.status === RFQStatus.IN_PROGRESS && !rfq.inProgressAt) {
      console.log('✅ Setting inProgressAt');
      updates.inProgressAt = new Date();
    }

    if (data.status === RFQStatus.QUOTED && !rfq.quotedAt) {
      console.log('✅ Setting quotedAt');
      updates.quotedAt = new Date();
    }

    if (data.status === RFQStatus.COMPLETED && !rfq.completedAt) {
      console.log('✅ Setting completedAt');
      updates.completedAt = new Date();
    }

    if (data.status === RFQStatus.CANCELLED && !rfq.cancelledAt) {
      console.log('✅ Setting cancelledAt');
      updates.cancelledAt = new Date();
    }

    console.log('📦 Updates object:', updates);

    const updatedRFQ = await prisma.rFQ.update({
      where: { id },
      data: updates,
      include: {
        items: true,
        attachments: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Send email notifications based on status change
    try {
      // Send acknowledgment email when status changes to ACKNOWLEDGED
      if (data.status === RFQStatus.ACKNOWLEDGED && oldStatus !== RFQStatus.ACKNOWLEDGED) {
        await emailService.sendRFQAcknowledgment({
          id: updatedRFQ.id,
          referenceNumber: updatedRFQ.referenceNumber,
          companyName: updatedRFQ.companyName,
          cui: updatedRFQ.cui || undefined,
          contactPerson: updatedRFQ.contactPerson,
          email: updatedRFQ.email,
          phone: updatedRFQ.phone,
          estimatedTotal: updatedRFQ.estimatedTotal || undefined,
          deliveryDate: updatedRFQ.deliveryDate
            ? updatedRFQ.deliveryDate.toISOString().split('T')[0]
            : undefined,
        });
      }

      // Send quote ready email when status changes to QUOTED and has pricing
      if (
        data.status === RFQStatus.QUOTED &&
        oldStatus !== RFQStatus.QUOTED &&
        updatedRFQ.finalQuoteAmount
      ) {
        await emailService.sendQuoteReady({
          referenceNumber: updatedRFQ.referenceNumber,
          contactPerson: updatedRFQ.contactPerson,
          email: updatedRFQ.email,
          finalQuoteAmount: updatedRFQ.finalQuoteAmount,
          pdfUrl: `${process.env.FRONTEND_URL}/rfq/${updatedRFQ.id}/quote`, // Placeholder URL
        });
      }
    } catch (emailError) {
      // Log email error but don't fail the status update
      console.error('Failed to send status change email:', emailError);
    }

    return updatedRFQ;
  }

  /**
   * Update RFQ item pricing
   */
  async updateRFQPricing(id: string, data: UpdateRFQPricingData) {
    const rfq = await this.getRFQById(id);

    // Update individual line items if provided
    if (data.items && data.items.length > 0) {
      await Promise.all(
        data.items.map((item) =>
          prisma.rFQItem.update({
            where: { id: item.id },
            data: { finalPrice: item.finalPrice },
          })
        )
      );
    }

    // Update RFQ-level pricing
    const updates: any = {
      updatedAt: new Date(),
    };

    if (data.deliveryCost !== undefined) {
      updates.deliveryCost = data.deliveryCost;
    }

    if (data.processingFee !== undefined) {
      updates.processingFee = data.processingFee;
    }

    if (data.vatAmount !== undefined) {
      updates.vatAmount = data.vatAmount;
    }

    if (data.finalQuoteAmount !== undefined) {
      updates.finalQuoteAmount = data.finalQuoteAmount;
    }

    return prisma.rFQ.update({
      where: { id },
      data: updates,
      include: {
        items: true,
      },
    });
  }

  /**
   * Assign RFQ to operator
   */
  async assignRFQ(id: string, operatorId: string) {
    return prisma.rFQ.update({
      where: { id },
      data: {
        assignedToId: operatorId,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Get RFQ statistics for dashboard
   */
  async getStatistics(filters?: { dateFrom?: Date; dateTo?: Date }) {
    const where: any = {};

    if (filters?.dateFrom || filters?.dateTo) {
      where.submittedAt = {};
      if (filters.dateFrom) {
        where.submittedAt.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.submittedAt.lte = filters.dateTo;
      }
    }

    const [
      totalRFQs,
      pendingRFQs,
      quotedRFQs,
      completedRFQs,
      statusBreakdown,
      totalValue,
    ] = await Promise.all([
      prisma.rFQ.count({ where }),
      prisma.rFQ.count({ where: { ...where, status: RFQStatus.SUBMITTED } }),
      prisma.rFQ.count({ where: { ...where, status: RFQStatus.QUOTED } }),
      prisma.rFQ.count({ where: { ...where, status: RFQStatus.COMPLETED } }),
      prisma.rFQ.groupBy({
        by: ['status'],
        where,
        _count: { id: true },
      }),
      prisma.rFQ.aggregate({
        where,
        _sum: { estimatedTotal: true },
      }),
    ]);

    return {
      totalRFQs,
      pendingRFQs,
      quotedRFQs,
      completedRFQs,
      statusBreakdown,
      totalValue: totalValue._sum.estimatedTotal || 0,
      conversionRate: totalRFQs > 0 ? (completedRFQs / totalRFQs) * 100 : 0,
    };
  }

  /**
   * Get operator performance metrics
   */
  async getOperatorPerformance(operatorId?: string, filters?: { dateFrom?: Date; dateTo?: Date }) {
    const where: any = {};

    if (operatorId) {
      where.assignedToId = operatorId;
    }

    if (filters?.dateFrom || filters?.dateTo) {
      where.submittedAt = {};
      if (filters.dateFrom) {
        where.submittedAt.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.submittedAt.lte = filters.dateTo;
      }
    }

    const rfqs = await prisma.rFQ.findMany({
      where,
      select: {
        id: true,
        assignedToId: true,
        status: true,
        submittedAt: true,
        acknowledgedAt: true,
        quotedAt: true,
      },
    });

    const metrics = rfqs.reduce(
      (acc: any, rfq) => {
        acc.total++;

        if (rfq.status === RFQStatus.COMPLETED) {
          acc.completed++;
        }

        if (rfq.acknowledgedAt && rfq.submittedAt) {
          const responseTime =
            rfq.acknowledgedAt.getTime() - rfq.submittedAt.getTime();
          acc.totalResponseTime += responseTime;
          acc.responseCount++;
        }

        return acc;
      },
      { total: 0, completed: 0, totalResponseTime: 0, responseCount: 0 }
    );

    const avgResponseTime =
      metrics.responseCount > 0
        ? metrics.totalResponseTime / metrics.responseCount / (1000 * 60 * 60) // Convert to hours
        : 0;

    return {
      totalProcessed: metrics.total,
      completed: metrics.completed,
      averageResponseTimeHours: avgResponseTime,
      conversionRate: metrics.total > 0 ? (metrics.completed / metrics.total) * 100 : 0,
    };
  }
}

// Export singleton instance
export const backofficeRFQService = new BackofficeRFQService();
