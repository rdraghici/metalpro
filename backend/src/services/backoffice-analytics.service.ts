import { prisma } from '../config/database';
import { RFQStatus } from '@prisma/client';

// =====================================================
// TYPES
// =====================================================

interface DateRange {
  dateFrom?: Date;
  dateTo?: Date;
}

interface TimeSeriesData {
  date: string;
  count: number;
  value?: number;
}

// =====================================================
// BACK-OFFICE ANALYTICS SERVICE
// =====================================================

export class BackofficeAnalyticsService {
  /**
   * Get dashboard KPIs
   */
  async getKPIs(filters?: DateRange) {
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
      totalValue,
      rfqsWithAcknowledgment,
    ] = await Promise.all([
      prisma.rFQ.count({ where }),
      prisma.rFQ.count({ where: { ...where, status: RFQStatus.SUBMITTED } }),
      prisma.rFQ.count({ where: { ...where, status: RFQStatus.QUOTED } }),
      prisma.rFQ.count({ where: { ...where, status: RFQStatus.COMPLETED } }),
      prisma.rFQ.aggregate({
        where,
        _sum: { estimatedTotal: true },
      }),
      prisma.rFQ.findMany({
        where: {
          ...where,
          acknowledgedAt: { not: null },
        },
        select: {
          submittedAt: true,
          acknowledgedAt: true,
        },
      }),
    ]);

    // Calculate average response time in hours
    let avgResponseTime = 0;
    if (rfqsWithAcknowledgment.length > 0) {
      const totalResponseTime = rfqsWithAcknowledgment.reduce((sum, rfq) => {
        if (rfq.acknowledgedAt) {
          const diff = rfq.acknowledgedAt.getTime() - rfq.submittedAt.getTime();
          return sum + diff;
        }
        return sum;
      }, 0);
      avgResponseTime = totalResponseTime / rfqsWithAcknowledgment.length / (1000 * 60 * 60);
    }

    // Calculate conversion rate
    const conversionRate = totalRFQs > 0 ? (completedRFQs / totalRFQs) * 100 : 0;

    return {
      totalRFQs,
      pendingRFQs,
      quotedRFQs,
      completedRFQs,
      totalQuotedValue: totalValue._sum.estimatedTotal || 0,
      avgResponseTimeHours: Math.round(avgResponseTime * 10) / 10,
      conversionRate: Math.round(conversionRate * 10) / 10,
    };
  }

  /**
   * Get RFQs over time (time series data)
   */
  async getRFQsOverTime(filters?: DateRange & { interval?: 'day' | 'week' | 'month' }) {
    const interval = filters?.interval || 'day';
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

    const rfqs = await prisma.rFQ.findMany({
      where,
      select: {
        submittedAt: true,
        estimatedTotal: true,
      },
      orderBy: {
        submittedAt: 'asc',
      },
    });

    // Group by date interval
    const grouped = new Map<string, { count: number; value: number }>();

    rfqs.forEach((rfq) => {
      let dateKey: string;
      const date = new Date(rfq.submittedAt);

      if (interval === 'day') {
        dateKey = date.toISOString().split('T')[0];
      } else if (interval === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        dateKey = weekStart.toISOString().split('T')[0];
      } else {
        dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      const existing = grouped.get(dateKey) || { count: 0, value: 0 };
      grouped.set(dateKey, {
        count: existing.count + 1,
        value: existing.value + (rfq.estimatedTotal || 0),
      });
    });

    return Array.from(grouped.entries())
      .map(([date, data]) => ({
        date,
        count: data.count,
        value: Math.round(data.value * 100) / 100,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Get RFQs by status breakdown
   */
  async getRFQsByStatus(filters?: DateRange) {
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

    const statusBreakdown = await prisma.rFQ.groupBy({
      by: ['status'],
      where,
      _count: { id: true },
    });

    return statusBreakdown.map((item) => ({
      status: item.status,
      count: item._count.id,
    }));
  }

  /**
   * Get top products by RFQ count
   */
  async getTopProductsByRFQCount(filters?: DateRange & { limit?: number }) {
    const limit = filters?.limit || 10;
    const where: any = {};

    if (filters?.dateFrom || filters?.dateTo) {
      where.rfq = {
        submittedAt: {},
      };
      if (filters.dateFrom) {
        where.rfq.submittedAt.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.rfq.submittedAt.lte = filters.dateTo;
      }
    }

    const topProducts = await prisma.rFQItem.groupBy({
      by: ['productSku', 'productName'],
      where,
      _count: { id: true },
      _sum: { quantity: true },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: limit,
    });

    return topProducts.map((item) => ({
      sku: item.productSku,
      name: item.productName,
      rfqCount: item._count.id,
      totalQuantity: item._sum.quantity || 0,
    }));
  }

  /**
   * Get operator performance metrics
   */
  async getOperatorPerformance(filters?: DateRange) {
    const where: any = {
      assignedToId: { not: null },
    };

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
        assignedToId: true,
        status: true,
        submittedAt: true,
        acknowledgedAt: true,
        quotedAt: true,
      },
    });

    // Group by operator
    const operatorMetrics = new Map<
      string,
      {
        total: number;
        completed: number;
        quoted: number;
        totalResponseTime: number;
        responseCount: number;
      }
    >();

    rfqs.forEach((rfq) => {
      if (!rfq.assignedToId) return;

      const existing = operatorMetrics.get(rfq.assignedToId) || {
        total: 0,
        completed: 0,
        quoted: 0,
        totalResponseTime: 0,
        responseCount: 0,
      };

      existing.total++;

      if (rfq.status === RFQStatus.COMPLETED) {
        existing.completed++;
      }

      if (rfq.status === RFQStatus.QUOTED || rfq.status === RFQStatus.COMPLETED) {
        existing.quoted++;
      }

      if (rfq.acknowledgedAt) {
        const responseTime = rfq.acknowledgedAt.getTime() - rfq.submittedAt.getTime();
        existing.totalResponseTime += responseTime;
        existing.responseCount++;
      }

      operatorMetrics.set(rfq.assignedToId, existing);
    });

    // Get operator details
    const operatorIds = Array.from(operatorMetrics.keys());
    const operators = await prisma.user.findMany({
      where: { id: { in: operatorIds } },
      select: { id: true, name: true, email: true },
    });

    return operators.map((operator) => {
      const metrics = operatorMetrics.get(operator.id)!;
      const avgResponseTime =
        metrics.responseCount > 0
          ? metrics.totalResponseTime / metrics.responseCount / (1000 * 60 * 60)
          : 0;

      return {
        operatorId: operator.id,
        operatorName: operator.name,
        operatorEmail: operator.email,
        totalProcessed: metrics.total,
        completed: metrics.completed,
        quoted: metrics.quoted,
        avgResponseTimeHours: Math.round(avgResponseTime * 10) / 10,
        conversionRate:
          metrics.total > 0 ? Math.round((metrics.completed / metrics.total) * 1000) / 10 : 0,
      };
    });
  }

  /**
   * Get average RFQ value trend
   */
  async getAvgRFQValueTrend(filters?: DateRange & { interval?: 'day' | 'week' | 'month' }) {
    const interval = filters?.interval || 'week';
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

    const rfqs = await prisma.rFQ.findMany({
      where,
      select: {
        submittedAt: true,
        estimatedTotal: true,
      },
      orderBy: {
        submittedAt: 'asc',
      },
    });

    // Group by interval and calculate average
    const grouped = new Map<string, { total: number; count: number }>();

    rfqs.forEach((rfq) => {
      let dateKey: string;
      const date = new Date(rfq.submittedAt);

      if (interval === 'day') {
        dateKey = date.toISOString().split('T')[0];
      } else if (interval === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        dateKey = weekStart.toISOString().split('T')[0];
      } else {
        dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      const existing = grouped.get(dateKey) || { total: 0, count: 0 };
      grouped.set(dateKey, {
        total: existing.total + (rfq.estimatedTotal || 0),
        count: existing.count + 1,
      });
    });

    return Array.from(grouped.entries())
      .map(([date, data]) => ({
        date,
        avgValue: Math.round((data.total / data.count) * 100) / 100,
        count: data.count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Export RFQ report data
   */
  async exportRFQReport(filters?: DateRange & { status?: RFQStatus }) {
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

    if (filters?.status) {
      where.status = filters.status;
    }

    const rfqs = await prisma.rFQ.findMany({
      where,
      select: {
        id: true,
        referenceNumber: true,
        companyName: true,
        cui: true,
        contactPerson: true,
        email: true,
        phone: true,
        status: true,
        estimatedTotal: true,
        finalQuoteAmount: true,
        submittedAt: true,
        acknowledgedAt: true,
        quotedAt: true,
        assignedToId: true,
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    return rfqs;
  }
}

// Export singleton instance
export const backofficeAnalyticsService = new BackofficeAnalyticsService();
