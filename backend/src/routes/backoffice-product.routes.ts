import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireBackoffice } from '../middleware/rbac';
import { backofficeProductService } from '../services/backoffice-product.service';
import { imageStorageService } from '../services/image-storage.service';
import multer from 'multer';
import ExcelJS from 'exceljs';
import { prisma } from '../config/database';

const router = Router();

// Configure multer for CSV/Excel file uploads (bulk operations)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV and Excel files are allowed.'));
    }
  },
});

// Configure multer for image uploads
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max for images
  },
  fileFilter: (req, file, cb) => {
    const allowedImageMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];
    if (allowedImageMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
    }
  },
});

// All back-office product routes require authentication and BACKOFFICE or ADMIN role
router.use(authenticate);
router.use(requireBackoffice);

/**
 * GET /api/backoffice/products
 * Get all products with filters and pagination
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      categoryId,
      availability,
      isActive,
      search,
      page,
      limit,
      sortBy,
      sortOrder,
    } = req.query;

    const filters: any = {};
    if (categoryId) filters.categoryId = categoryId as string;
    if (availability) filters.availability = availability as string;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (search) filters.search = search as string;

    const options: any = {};
    if (page) options.page = parseInt(page as string);
    if (limit) options.limit = parseInt(limit as string);
    if (sortBy) options.sortBy = sortBy as any;
    if (sortOrder) options.sortOrder = sortOrder as 'asc' | 'desc';

    const result = await backofficeProductService.getProducts(filters, options);

    res.json(result);
  } catch (error: any) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Failed to fetch products', message: error.message });
  }
});

/**
 * GET /api/backoffice/products/statistics
 * Get product statistics
 */
router.get('/statistics', async (req: Request, res: Response) => {
  try {
    const statistics = await backofficeProductService.getStatistics();
    res.json(statistics);
  } catch (error: any) {
    console.error('Error getting product statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics', message: error.message });
  }
});

/**
 * GET /api/backoffice/products/export
 * Export products to CSV or Excel
 */
router.get('/export', async (req: Request, res: Response) => {
  try {
    const { format = 'csv', includeInactive = 'false', categoryId } = req.query;

    // Build filters
    const where: any = {};
    if (includeInactive !== 'true') {
      where.isActive = true;
    }
    if (categoryId) {
      where.categoryId = categoryId as string;
    }

    // Fetch products
    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: { slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (format === 'xlsx') {
      // Create Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Products');

      // Define columns
      worksheet.columns = [
        { header: 'SKU', key: 'sku', width: 20 },
        { header: 'Title', key: 'title', width: 30 },
        { header: 'Category', key: 'category', width: 15 },
        { header: 'Grade', key: 'grade', width: 15 },
        { header: 'Standard', key: 'standard', width: 20 },
        { header: 'Dimensions', key: 'dimensions', width: 20 },
        { header: 'Availability', key: 'availability', width: 15 },
        { header: 'Base Unit', key: 'baseUnit', width: 10 },
        { header: 'Price Per Unit', key: 'pricePerUnit', width: 15 },
        { header: 'Weight', key: 'weight', width: 10 },
        { header: 'Length (m)', key: 'lengthM', width: 10 },
        { header: 'Active', key: 'isActive', width: 10 },
      ];

      // Add rows
      products.forEach((p) => {
        worksheet.addRow({
          sku: p.sku,
          title: p.title,
          category: p.category.slug,
          grade: p.grade || '',
          standard: p.standard || '',
          dimensions: p.dimensions || '',
          availability: p.availability,
          baseUnit: p.baseUnit,
          pricePerUnit: p.pricePerUnit,
          weight: p.weight || '',
          lengthM: p.lengthM || '',
          isActive: p.isActive ? 'true' : 'false',
        });
      });

      // Set response headers
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', 'attachment; filename=products.xlsx');

      // Write to response
      await workbook.xlsx.write(res);
      res.end();
    } else {
      // Generate CSV
      const csvLines = [
        'sku,title,category,grade,standard,dimensions,availability,baseUnit,pricePerUnit,weight,lengthM,isActive',
      ];

      products.forEach((p) => {
        const row = [
          p.sku,
          p.title,
          p.category.slug,
          p.grade || '',
          p.standard || '',
          p.dimensions || '',
          p.availability,
          p.baseUnit,
          p.pricePerUnit.toString(),
          p.weight?.toString() || '',
          p.lengthM?.toString() || '',
          p.isActive ? 'true' : 'false',
        ];
        // Wrap fields in quotes and escape existing quotes
        const escapedRow = row.map((field) => `"${field.replace(/"/g, '""')}"`);
        csvLines.push(escapedRow.join(','));
      });

      const csv = csvLines.join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
      res.send(csv);
    }
  } catch (error: any) {
    console.error('Error exporting products:', error);
    res.status(500).json({ error: 'Failed to export products', message: error.message });
  }
});

/**
 * POST /api/backoffice/products/import
 * Import products from CSV or Excel
 */
router.post('/import', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Note: Using 'any' type assertion due to Node.js 20+ Buffer type incompatibility with ExcelJS
    const fileBuffer: any = req.file.buffer;
    const isExcel = req.file.mimetype.includes('spreadsheet') || req.file.mimetype.includes('excel');

    let rows: any[] = [];

    if (isExcel) {
      // Parse Excel
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(fileBuffer);
      const worksheet = workbook.worksheets[0];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header
        const values = row.values as any[];
        rows.push({
          sku: values[1],
          title: values[2],
          category: values[3],
          grade: values[4] || null,
          standard: values[5] || null,
          dimensions: values[6] || null,
          availability: values[7] || 'in_stock',
          baseUnit: values[8],
          pricePerUnit: parseFloat(values[9]) || 0,
          weight: values[10] ? parseFloat(values[10]) : null,
          lengthM: values[11] ? parseFloat(values[11]) : null,
          isActive: values[12] === 'true' || values[12] === true,
        });
      });
    } else {
      // Parse CSV
      const csvText = fileBuffer.toString('utf-8');
      const lines = csvText.split('\n');

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Simple CSV parsing (handles quoted fields)
        const values: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim());

        rows.push({
          sku: values[0]?.replace(/^"|"$/g, ''),
          title: values[1]?.replace(/^"|"$/g, ''),
          category: values[2]?.replace(/^"|"$/g, ''),
          grade: values[3]?.replace(/^"|"$/g, '') || null,
          standard: values[4]?.replace(/^"|"$/g, '') || null,
          dimensions: values[5]?.replace(/^"|"$/g, '') || null,
          availability: values[6]?.replace(/^"|"$/g, '') || 'in_stock',
          baseUnit: values[7]?.replace(/^"|"$/g, ''),
          pricePerUnit: parseFloat(values[8]?.replace(/^"|"$/g, '')) || 0,
          weight: values[9] ? parseFloat(values[9]?.replace(/^"|"$/g, '')) : null,
          lengthM: values[10] ? parseFloat(values[10]?.replace(/^"|"$/g, '')) : null,
          isActive: values[11]?.replace(/^"|"$/g, '') === 'true',
        });
      }
    }

    // Process rows
    const results = {
      processed: rows.length,
      created: 0,
      updated: 0,
      errors: 0,
      errorDetails: [] as any[],
    };

    // Get all categories for lookup
    const categories = await prisma.category.findMany({
      select: { id: true, slug: true },
    });
    const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // +2 for header and 0-index

      try {
        // Validate required fields
        if (!row.sku || !row.title || !row.baseUnit || !row.pricePerUnit) {
          throw new Error('Missing required fields (sku, title, baseUnit, pricePerUnit)');
        }

        // Find category
        const categoryId = categoryMap.get(row.category);
        if (!categoryId) {
          throw new Error(`Category '${row.category}' not found`);
        }

        // Check if product exists
        const existing = await prisma.product.findUnique({ where: { sku: row.sku } });

        const productData = {
          categoryId,
          title: row.title,
          grade: row.grade,
          standard: row.standard,
          dimensions: row.dimensions,
          availability: row.availability,
          baseUnit: row.baseUnit,
          pricePerUnit: row.pricePerUnit,
          weight: row.weight,
          lengthM: row.lengthM,
          isActive: row.isActive,
        };

        if (existing) {
          // Update existing product
          await prisma.product.update({
            where: { sku: row.sku },
            data: productData,
          });
          results.updated++;
        } else {
          // Create new product
          await prisma.product.create({
            data: {
              sku: row.sku,
              ...productData,
            },
          });
          results.created++;
        }
      } catch (error: any) {
        results.errors++;
        results.errorDetails.push({
          row: rowNum,
          sku: row.sku,
          error: error.message,
        });
      }
    }

    res.json(results);
  } catch (error: any) {
    console.error('Error importing products:', error);
    res.status(500).json({ error: 'Failed to import products', message: error.message });
  }
});

/**
 * GET /api/backoffice/products/:id
 * Get single product by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await backofficeProductService.getProductById(req.params.id);
    res.json(product);
  } catch (error: any) {
    console.error('Error getting product:', error);
    res.status(404).json({ error: 'Product not found', message: error.message });
  }
});

/**
 * POST /api/backoffice/products
 * Create new product
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const product = await backofficeProductService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    console.error('Error creating product:', error);
    const statusCode = error.message.includes('already exists') ? 409 : 400;
    res.status(statusCode).json({ error: 'Failed to create product', message: error.message });
  }
});

/**
 * PUT /api/backoffice/products/:id
 * Update existing product
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const product = await backofficeProductService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error: any) {
    console.error('Error updating product:', error);
    const statusCode = error.message.includes('already exists') ? 409 : 400;
    res.status(statusCode).json({ error: 'Failed to update product', message: error.message });
  }
});

/**
 * DELETE /api/backoffice/products/:id
 * Delete product
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await backofficeProductService.deleteProduct(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    res.status(404).json({ error: 'Failed to delete product', message: error.message });
  }
});

/**
 * PATCH /api/backoffice/products/bulk/status
 * Bulk activate/deactivate products
 */
router.patch('/bulk/status', async (req: Request, res: Response) => {
  try {
    const { productIds, isActive } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: 'productIds array is required' });
    }

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive boolean is required' });
    }

    const result = await backofficeProductService.bulkUpdateStatus(productIds, isActive);

    res.json({
      success: true,
      message: `${result.count} products updated`,
      count: result.count,
    });
  } catch (error: any) {
    console.error('Error bulk updating products:', error);
    res.status(500).json({ error: 'Failed to update products', message: error.message });
  }
});

/**
 * DELETE /api/backoffice/products/bulk
 * Bulk delete products
 */
router.delete('/bulk', async (req: Request, res: Response) => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: 'productIds array is required' });
    }

    const result = await backofficeProductService.bulkDelete(productIds);

    res.json({
      success: true,
      message: `${result.count} products deleted`,
      count: result.count,
    });
  } catch (error: any) {
    console.error('Error bulk deleting products:', error);
    res.status(500).json({ error: 'Failed to delete products', message: error.message });
  }
});

/**
 * POST /api/backoffice/products/:id/images
 * Upload a product image
 */
router.post('/:id/images', imageUpload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    // Get product to verify it exists and get SKU
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Upload image
    const result = await imageStorageService.uploadImage({
      productSku: product.sku,
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
      originalName: req.file.originalname,
    });

    // Update product with new image
    const currentImages = (product.imageUrls as string[]) || [];
    const updatedImages = [...currentImages, result.url];

    await prisma.product.update({
      where: { id: req.params.id },
      data: {
        imageUrl: product.imageUrl || result.url, // Set as primary if no primary image
        imageUrls: updatedImages,
      },
    });

    res.json({
      success: true,
      image: result,
    });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image', message: error.message });
  }
});

/**
 * DELETE /api/backoffice/products/:id/images/:filename
 * Delete a product image
 */
router.delete('/:id/images/:filename', async (req: Request, res: Response) => {
  try {
    const { id, filename } = req.params;

    // Get product
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete from storage
    await imageStorageService.deleteImage(product.sku, filename);

    // Update product record
    const currentImages = (product.imageUrls as string[]) || [];
    const imageToDelete = currentImages.find((url) => url.includes(filename));
    const updatedImages = currentImages.filter((url) => !url.includes(filename));

    // If deleted image was primary, set new primary
    const newPrimaryUrl =
      product.imageUrl === imageToDelete ? (updatedImages[0] || null) : product.imageUrl;

    await prisma.product.update({
      where: { id },
      data: {
        imageUrl: newPrimaryUrl,
        imageUrls: updatedImages,
      },
    });

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image', message: error.message });
  }
});

/**
 * PATCH /api/backoffice/products/:id/images/primary
 * Set primary product image
 */
router.patch('/:id/images/primary', async (req: Request, res: Response) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl is required' });
    }

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Verify image exists in product's images
    const currentImages = (product.imageUrls as string[]) || [];
    if (!currentImages.includes(imageUrl)) {
      return res.status(400).json({ error: 'Image not found in product images' });
    }

    // Update primary image
    await prisma.product.update({
      where: { id: req.params.id },
      data: {
        imageUrl,
      },
    });

    res.json({
      success: true,
      message: 'Primary image updated successfully',
    });
  } catch (error: any) {
    console.error('Error setting primary image:', error);
    res.status(500).json({ error: 'Failed to set primary image', message: error.message });
  }
});

export default router;
