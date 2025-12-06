import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.middleware';
import { requireBackoffice } from '../middleware/rbac';

const router = express.Router();
const prisma = new PrismaClient();

// =====================================================
// BACKOFFICE CATEGORY ROUTES - CRUD API
// =====================================================

/**
 * GET /api/backoffice/categories
 * List all categories with product counts
 */
router.get('/', authenticate, requireBackoffice, async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/backoffice/categories/:id
 * Get single category by ID
 */
router.get('/:id', authenticate, requireBackoffice, async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/backoffice/categories
 * Create new category
 */
router.post('/', authenticate, requireBackoffice, async (req, res) => {
  try {
    const { slug, name, nameEn, description, icon, sortOrder } = req.body;

    // Validate required fields
    if (!slug || !name) {
      return res.status(400).json({
        success: false,
        message: 'Slug and name are required',
      });
    }

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this slug already exists',
      });
    }

    // If sortOrder not provided, set it to max + 1
    let finalSortOrder = sortOrder;
    if (finalSortOrder === undefined || finalSortOrder === null) {
      const maxCategory = await prisma.category.findFirst({
        orderBy: { sortOrder: 'desc' },
      });
      finalSortOrder = (maxCategory?.sortOrder ?? 0) + 1;
    }

    const category = await prisma.category.create({
      data: {
        slug,
        name,
        nameEn: nameEn || name,
        description,
        icon,
        sortOrder: finalSortOrder,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully',
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * PUT /api/backoffice/categories/:id
 * Update category
 */
router.put('/:id', authenticate, requireBackoffice, async (req, res) => {
  try {
    const { id } = req.params;
    const { slug, name, nameEn, description, icon, sortOrder } = req.body;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // If slug is being changed, check for conflicts
    if (slug && slug !== existingCategory.slug) {
      const slugConflict = await prisma.category.findUnique({
        where: { slug },
      });

      if (slugConflict) {
        return res.status(400).json({
          success: false,
          message: 'Category with this slug already exists',
        });
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(slug && { slug }),
        ...(name && { name }),
        ...(nameEn !== undefined && { nameEn }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    res.json({
      success: true,
      data: category,
      message: 'Category updated successfully',
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * DELETE /api/backoffice/categories/:id
 * Delete category (only if no products are using it)
 */
router.delete('/:id', authenticate, requireBackoffice, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check if category has products
    if (category._count.products > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${category._count.products} product(s) assigned to it.`,
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * PATCH /api/backoffice/categories/reorder
 * Update sort order for multiple categories
 */
router.patch('/reorder', authenticate, requireBackoffice, async (req, res) => {
  try {
    const { categories } = req.body;

    if (!Array.isArray(categories)) {
      return res.status(400).json({
        success: false,
        message: 'Categories must be an array',
      });
    }

    // Update sort order for each category in a transaction
    await prisma.$transaction(
      categories.map((cat: { id: string; sortOrder: number }) =>
        prisma.category.update({
          where: { id: cat.id },
          data: { sortOrder: cat.sortOrder },
        })
      )
    );

    const updatedCategories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    res.json({
      success: true,
      data: updatedCategories,
      message: 'Categories reordered successfully',
    });
  } catch (error) {
    console.error('Error reordering categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder categories',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
