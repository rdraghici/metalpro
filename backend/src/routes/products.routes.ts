import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';

const router = Router();

// =====================================================
// PRODUCTS ROUTES (Public - No Auth Required)
// =====================================================

// GET /api/products - List all products with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform products to match frontend type expectations
    const transformedProducts = products.map(product => {
      const metadata = product.metadata as any;
      return {
        ...product,
        slug: metadata?.slug || product.sku.toLowerCase().replace(/_/g, '-'),
        family: metadata?.family || product.category?.slug || 'profiles',
        standards: metadata?.standards || (product.standard ? [product.standard] : []),
        producer: metadata?.producer || null,
        dimensions: metadata?.dimensions || product.dimensions,
        description: metadata?.description || null,
        deliveryEstimate: metadata?.deliveryEstimate || null,
        indicativePrice: {
          currency: 'RON' as const,
          unit: product.baseUnit,
          min: product.pricePerUnit,
          max: product.pricePerUnit,
        },
        sectionProps: metadata?.sectionProps || {},
      };
    });

    res.json({
      success: true,
      count: transformedProducts.length,
      data: transformedProducts,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
    });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    // Transform product to match frontend type expectations
    const metadata = product.metadata as any;
    const transformedProduct = {
      ...product,
      slug: metadata?.slug || product.sku.toLowerCase().replace(/_/g, '-'),
      family: metadata?.family || product.category?.slug || 'profiles',
      standards: metadata?.standards || (product.standard ? [product.standard] : []),
      producer: metadata?.producer || null,
      dimensions: metadata?.dimensions || product.dimensions,
      description: metadata?.description || null,
      deliveryEstimate: metadata?.deliveryEstimate || null,
      indicativePrice: {
        currency: 'RON' as const,
        unit: product.baseUnit,
        min: product.pricePerUnit,
        max: product.pricePerUnit,
      },
      sectionProps: metadata?.sectionProps || {},
    };

    res.json({
      success: true,
      data: transformedProduct,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
    });
  }
});

export default router;
