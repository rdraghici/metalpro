import { prisma } from '../config/database';

// =====================================================
// TYPES
// =====================================================

interface ProductFilters {
  categoryId?: string;
  availability?: string;
  isActive?: boolean;
  search?: string;
}

interface ProductListOptions {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'title' | 'pricePerUnit';
  sortOrder?: 'asc' | 'desc';
}

interface CreateProductData {
  categoryId: string;
  sku: string;
  title: string;
  grade?: string;
  standard?: string;
  dimensions?: string;
  availability?: string;
  baseUnit: string;
  pricePerUnit: number;
  weight?: number;
  lengthM?: number;
  metadata?: any;
  isActive?: boolean;
}

interface UpdateProductData {
  categoryId?: string;
  sku?: string;
  title?: string;
  grade?: string;
  standard?: string;
  dimensions?: string;
  availability?: string;
  baseUnit?: string;
  pricePerUnit?: number;
  weight?: number;
  lengthM?: number;
  metadata?: any;
  isActive?: boolean;
}

// =====================================================
// BACK-OFFICE PRODUCT SERVICE
// =====================================================

export class BackofficeProductService {
  /**
   * Get all products with filters and pagination (including inactive)
   */
  async getProducts(filters: ProductFilters = {}, options: ProductListOptions = {}) {
    const page = options.page || 1;
    const limit = options.limit || 50;
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';

    const where: any = {};

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.availability) {
      where.availability = filters.availability;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
        { grade: { contains: filters.search, mode: 'insensitive' } },
        { standard: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single product by ID
   */
  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  /**
   * Create new product
   */
  async createProduct(data: CreateProductData) {
    // Check if SKU already exists
    const existing = await prisma.product.findUnique({
      where: { sku: data.sku },
    });

    if (existing) {
      throw new Error(`Product with SKU '${data.sku}' already exists`);
    }

    return prisma.product.create({
      data: {
        categoryId: data.categoryId,
        sku: data.sku,
        title: data.title,
        grade: data.grade,
        standard: data.standard,
        dimensions: data.dimensions,
        availability: data.availability || 'in_stock',
        baseUnit: data.baseUnit,
        pricePerUnit: data.pricePerUnit,
        weight: data.weight,
        lengthM: data.lengthM,
        metadata: data.metadata,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
      include: {
        category: true,
      },
    });
  }

  /**
   * Update existing product
   */
  async updateProduct(id: string, data: UpdateProductData) {
    // Check if product exists
    await this.getProductById(id);

    // If updating SKU, check it's not taken by another product
    if (data.sku) {
      const existing = await prisma.product.findUnique({
        where: { sku: data.sku },
      });

      if (existing && existing.id !== id) {
        throw new Error(`Product with SKU '${data.sku}' already exists`);
      }
    }

    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  /**
   * Delete product
   */
  async deleteProduct(id: string) {
    // Check if product exists
    await this.getProductById(id);

    return prisma.product.delete({
      where: { id },
    });
  }

  /**
   * Bulk activate/deactivate products
   */
  async bulkUpdateStatus(productIds: string[], isActive: boolean) {
    return prisma.product.updateMany({
      where: {
        id: { in: productIds },
      },
      data: {
        isActive,
      },
    });
  }

  /**
   * Bulk delete products
   */
  async bulkDelete(productIds: string[]) {
    return prisma.product.deleteMany({
      where: {
        id: { in: productIds },
      },
    });
  }

  /**
   * Get product statistics
   */
  async getStatistics() {
    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      byCategory,
      byAvailability,
      avgPrice,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: false } }),
      prisma.product.groupBy({
        by: ['categoryId'],
        _count: { id: true },
      }),
      prisma.product.groupBy({
        by: ['availability'],
        _count: { id: true },
      }),
      prisma.product.aggregate({
        _avg: { pricePerUnit: true },
      }),
    ]);

    return {
      totalProducts,
      activeProducts,
      inactiveProducts,
      byCategory,
      byAvailability,
      averagePrice: avgPrice._avg.pricePerUnit || 0,
    };
  }
}

// Export singleton instance
export const backofficeProductService = new BackofficeProductService();
