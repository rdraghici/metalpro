import { prisma } from '../config/database';
import { RFQStatus, Prisma } from '@prisma/client';
import logger from '../config/logger';

export interface CreateRFQItemData {
  productId?: string;
  productSku: string;
  productName: string;
  quantity: number;
  unit: string;
  specs?: any;
  grossPrice: number;
}

export interface CreateRFQData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;

  // Optional fields
  taxId?: string;
  registrationNumber?: string;
  shippingAddress?: string;
  billingAddress?: string;
  incoterm?: string;
  deliveryDate?: string;
  notes?: string;

  // Cart data
  items: CreateRFQItemData[];
  estimatedTotal: number;
}

export class RFQService {
  /**
   * Generate a unique reference number for RFQ
   * Includes collision detection and retry logic
   */
  private async generateReferenceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const maxAttempts = 10;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Generate random 4-digit number (1000-9999)
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const referenceNumber = `RFQ-${year}-${randomNum}`;

      // Check if this reference number already exists
      const existing = await prisma.rFQ.findUnique({
        where: { referenceNumber },
        select: { id: true },
      });

      // If it doesn't exist, we can use it
      if (!existing) {
        return referenceNumber;
      }

      // Log collision for monitoring
      logger.warn('RFQ reference number collision detected', {
        referenceNumber,
        attempt: attempt + 1,
        maxAttempts,
      });
    }

    // If we've exhausted all attempts, throw an error
    throw new Error(
      `Unable to generate unique RFQ reference number after ${maxAttempts} attempts. Please try again.`
    );
  }

  /**
   * Create a new RFQ submission
   */
  async createRFQ(userId: string | null, data: CreateRFQData) {
    // Generate reference number
    const referenceNumber = await this.generateReferenceNumber();

    // Prepare cart snapshot - cast to Prisma.JsonObject for type safety
    const cartSnapshot: Prisma.InputJsonValue = {
      items: data.items.map(item => ({
        productId: item.productId ?? null,
        productSku: item.productSku,
        productName: item.productName,
        quantity: item.quantity,
        unit: item.unit,
        specs: item.specs ?? null,
        grossPrice: item.grossPrice,
      })),
      submittedAt: new Date().toISOString(),
    };

    // For guest users, userId will be null
    // Create RFQ with items
    const rfq = await prisma.rFQ.create({
      data: {
        userId: userId || undefined,
        referenceNumber,
        status: RFQStatus.SUBMITTED,

        // Contact information
        companyName: data.companyName,
        cui: data.taxId || null,
        contactPerson: data.contactPerson,
        email: data.email,
        phone: data.phone,

        // Addresses (JSON fields - cannot be null, must be empty object if not provided)
        deliveryAddress: data.shippingAddress || {},
        billingAddress: data.billingAddress || {},

        // Preferences
        incoterm: data.incoterm || null,
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
        notes: data.notes || null,

        // Pricing
        estimatedTotal: data.estimatedTotal,

        // Cart snapshot
        cartSnapshot,

        // Create items
        items: {
          create: data.items.map((item) => ({
            productId: item.productId || null,
            productSku: item.productSku,
            productName: item.productName,
            quantity: item.quantity,
            unit: item.unit,
            specs: item.specs || null,
            grossPrice: item.grossPrice,
          })),
        },
      },
      include: {
        items: true,
        user: userId
          ? {
              select: {
                id: true,
                email: true,
                name: true,
                company: true,
              },
            }
          : false,
      },
    });

    return rfq;
  }

  /**
   * Get RFQs for a specific user
   */
  async getUserRFQs(userId: string) {
    const rfqs = await prisma.rFQ.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    return rfqs;
  }

  /**
   * Get a single RFQ by ID
   */
  async getRFQById(rfqId: string, userId: string) {
    const rfq = await prisma.rFQ.findFirst({
      where: {
        id: rfqId,
        userId,
      },
      include: {
        items: true,
        attachments: true,
      },
    });

    if (!rfq) {
      throw new Error('RFQ not found');
    }

    return rfq;
  }
}

export const rfqService = new RFQService();
