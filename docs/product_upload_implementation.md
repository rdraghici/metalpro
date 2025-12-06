# Product Upload Implementation Plan

## Overview
This document outlines a clean, simple, and practical approach for implementing comprehensive product management functionality in the MetalPro backoffice system.

## Current State Analysis

### Database Schema (backend/prisma/schema.prisma)

The Product model in PostgreSQL contains the following fields:

| Field | Type | Description | Required | Frontend Field |
|-------|------|-------------|----------|----------------|
| id | String | UUID primary key | Yes | id |
| categoryId | String | Foreign key to Category | Yes | categoryId |
| sku | String | Unique product identifier | Yes | sku |
| title | String | Product display name | Yes | title |
| grade | String | Material grade specification | No | grade |
| standard | String | Industry standard | No | standard |
| dimensions | String | Physical dimensions | No | dimensions |
| availability | String | Stock availability status | Yes (default: "in_stock") | availability |
| baseUnit | String | Unit of measurement (kg, m, pcs) | Yes | baseUnit |
| pricePerUnit | Float | Gross estimate price | Yes | pricePerUnit |
| weight | Float | Weight in kg per unit | No | weight |
| lengthM | Float | Length in meters (for profiles, pipes) | No | lengthM |
| metadata | Json | Flexible field for future specs | No | metadata |
| isActive | Boolean | Product visibility status | Yes (default: true) | isActive |
| createdAt | DateTime | Auto-generated timestamp | Yes | createdAt |
| updatedAt | DateTime | Auto-updated timestamp | Yes | updatedAt |

### Category Schema

The Category model contains:

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| id | String | UUID primary key | Yes |
| slug | String | URL-friendly identifier | Yes (unique) |
| name | String | Display name | Yes |
| nameEn | String | English name | No |
| description | String | Category description | No |
| icon | String | Icon identifier | No |
| sortOrder | Int | Display order | Yes (default: 0) |

### Frontend-Backend Field Correspondence

Current implementation has 100% alignment between backend schema and frontend types:
- TypeScript interface `Product` in `src/types/backoffice.ts` matches database fields
- CreateProductData interface omits auto-generated fields (id, createdAt, updatedAt)
- Category relation is established through categoryId

## Implementation Plan

### Phase 1: Single Product Creation & Bulk Upload/Download

#### 1.0 Single Product Upload via Frontend

**Quick Add Feature on Product List Page:**

The product list page (`/backoffice/products`) should include a streamlined single product creation flow without leaving the page.

**Implementation Options:**

**Option A: Modal Dialog (Recommended)**
- Click "+ Add Product" button in the header
- Opens modal with product form
- Real-time validation
- Save without page refresh
- Automatically adds to list on success

**Option B: Inline Expandable Form**
- Click "+ Add Product" button
- Expands form at top of product list
- Collapsible panel design
- Maintains context of product list

**Frontend Components:**
```tsx
// Quick Add Product Button
<Button onClick={() => setShowAddDialog(true)}>
  <Plus className="mr-2 h-4 w-4" />
  Add Product
</Button>

// Add Product Dialog
<Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Add New Product</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleQuickAdd}>
      {/* Product form fields */}
      <div className="grid grid-cols-2 gap-4">
        <Input label="SKU" required />
        <Input label="Title" required />
        <Select label="Category" required />
        <Select label="Base Unit" required />
        <Input label="Price per Unit" type="number" required />
        {/* Additional fields... */}
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
          Cancel
        </Button>
        <Button type="submit">Add Product</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
```

**Features:**
- Auto-generate SKU suggestion based on category and title
- Category quick-create option if needed category doesn't exist
- Duplicate detection with warning
- Save and continue adding (checkbox option)
- Keyboard shortcuts (Ctrl+Enter to save)

### Phase 1.1: Bulk Upload/Download Feature

#### 1.1.1 CSV/Excel Template Structure

Create a standardized template with the following columns:

```csv
sku,title,category,grade,standard,dimensions,availability,baseUnit,pricePerUnit,weight,lengthM,isActive
"PROF-001","I-beam HEA 100","profiles","S235JR","EN 10025-2","100x96x5x8","in_stock","kg",3.25,16.7,12,true
"PLATE-001","Sheet Metal 3mm","plates","S355J2","EN 10025-2","3x1500x3000","in_stock","kg",2.85,35.3,,true
```

#### 1.1.2 Download Functionality

**Backend endpoint:** `GET /api/backoffice/products/export`

- Query parameters:
  - format: 'csv' | 'xlsx'
  - includeInactive: boolean (default: false)
  - categoryId: string (optional filter)

**Frontend implementation:**
- Add "Export Products" button on product list page
- Download dialog with format selection
- Include option to export filtered results

#### 1.1.3 Upload Functionality

**Backend endpoint:** `POST /api/backoffice/products/import`

- Request: multipart/form-data with file
- Response:
  ```json
  {
    "processed": 100,
    "created": 85,
    "updated": 10,
    "errors": 5,
    "errorDetails": [
      {"row": 23, "sku": "INVALID-SKU", "error": "Category not found"},
      ...
    ]
  }
  ```

**Frontend implementation:**
- Add "Import Products" button on product list page
- Drag-and-drop file upload zone
- Progress indicator during processing
- Results summary with error details
- Option to download error report

### Phase 2: Product Images

#### 2.1 Schema Extension

Update Product model in schema.prisma:
```prisma
model Product {
  // existing fields...
  imageUrl     String?  // Primary product image
  imageUrls    Json?    // Array of additional images
  // ...
}
```

#### 2.2 Image Storage Strategy

**Option 1: AWS S3 (Recommended)**
- Create bucket: `metalpro-product-images`
- Folder structure: `/products/{sku}/{image-name}.{ext}`
- CloudFront CDN for performance

**Option 2: Local Storage (Development)**
- Directory: `backend/uploads/products/`
- Serve via static route

#### 2.3 Image Upload Implementation

**Backend endpoints:**
- `POST /api/backoffice/products/{id}/images` - Upload image
- `DELETE /api/backoffice/products/{id}/images/{imageId}` - Remove image
- `PATCH /api/backoffice/products/{id}/images/{imageId}/primary` - Set primary

**Frontend features:**
- Image upload in product form
- Drag-to-reorder images
- Set primary image
- Image preview gallery

### Phase 3: Enhanced Field Editing

#### 3.1 Inline Editing in Product List

Enable quick edits without opening full form:
- Price adjustment
- Stock status toggle
- Active/inactive toggle

Implementation:
```tsx
// Double-click cell to edit
<td onDoubleClick={() => setEditingCell({id: product.id, field: 'pricePerUnit'})}>
  {editingCell?.id === product.id && editingCell.field === 'pricePerUnit' ? (
    <Input
      value={editValue}
      onBlur={handleSave}
      onKeyPress={(e) => e.key === 'Enter' && handleSave()}
    />
  ) : (
    <span>{product.pricePerUnit} RON</span>
  )}
</td>
```

#### 3.2 Bulk Field Updates

Allow updating multiple products simultaneously:
- Select products with checkboxes
- Choose field to update
- Apply new value to all selected

### Phase 4: Category Management

#### 4.1 Dynamic Category Creation

**Backend endpoints:**
- `GET /api/backoffice/categories` - List all categories
- `POST /api/backoffice/categories` - Create new category
- `PUT /api/backoffice/categories/{id}` - Update category
- `DELETE /api/backoffice/categories/{id}` - Delete category (if no products)

#### 4.2 Category Management UI

Create dedicated category management page:
```
/backoffice/categories
```

Features:
- List view with drag-to-reorder (sortOrder)
- Create new category dialog
- Edit category inline
- Delete with confirmation (only if no products)
- Icon picker for category icons

#### 4.3 Category Migration from Static to Dynamic

Current state: Categories defined in `src/data/products.ts`

Migration steps:
1. Create database seed script to populate Category table
2. Update product form to fetch categories from API
3. Remove static category definitions
4. Update frontend catalog to use API categories

## Technical Implementation Details

### CSV/Excel Processing Libraries

**Backend:**
- CSV: `csv-parser` for reading, `csv-writer` for generating
- Excel: `exceljs` for both reading and writing

**Frontend:**
- `papaparse` for CSV preview/validation
- `xlsx` for Excel file reading

### File Upload Handling

```typescript
// Backend: Using multer for file uploads
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

router.post('/import', upload.single('file'), async (req, res) => {
  // Process file buffer
  const products = await parseFile(req.file.buffer, req.file.mimetype);
  // Validate and import
});
```

### Validation Rules

1. **SKU Validation:**
   - Must be unique
   - Alphanumeric with hyphens only
   - Maximum 50 characters

2. **Category Validation:**
   - Must exist in database
   - Match by slug or ID

3. **Price Validation:**
   - Must be positive number
   - Maximum 2 decimal places

4. **Required Fields:**
   - SKU, title, categoryId, baseUnit, pricePerUnit

### Error Handling Strategy

```typescript
interface ImportError {
  row: number;
  field: string;
  value: any;
  error: string;
  suggestion?: string;
}

// Collect all errors, don't stop on first error
const errors: ImportError[] = [];
const successful: Product[] = [];

for (const [index, row] of rows.entries()) {
  try {
    const product = await validateAndCreateProduct(row);
    successful.push(product);
  } catch (error) {
    errors.push({
      row: index + 2, // +2 for header row and 0-index
      field: error.field,
      value: error.value,
      error: error.message,
      suggestion: getSuggestion(error)
    });
  }
}
```

## UI/UX Improvements

### Product List Page Enhancements

1. **Add action buttons in header:**
   ```
   [+ Add Product] [⬆ Import] [⬇ Export] [🔄 Refresh]
   ```
   - "Add Product" opens modal for single product creation
   - "Import" for bulk CSV/Excel upload
   - "Export" for downloading current products

2. **Bulk actions toolbar (appears when items selected):**
   ```
   [✓ 3 selected] [Activate] [Deactivate] [Delete] [Update Prices]
   ```

3. **Enhanced filtering:**
   - Multi-select category filter
   - Price range slider
   - Availability status checkboxes
   - Search by multiple fields (SKU, title, grade)

### Import/Export Dialog Designs

**Export Dialog:**
```
┌─ Export Products ──────────────────┐
│                                     │
│ Format:                             │
│ ○ CSV (.csv)                        │
│ ● Excel (.xlsx)                     │
│                                     │
│ Include:                            │
│ ☑ Active products                   │
│ ☐ Inactive products                 │
│                                     │
│ Filters:                            │
│ Category: [All Categories     ▼]    │
│                                     │
│ [Cancel]           [Download]       │
└─────────────────────────────────────┘
```

**Import Dialog:**
```
┌─ Import Products ───────────────────┐
│                                     │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │   Drop CSV/Excel file here  │    │
│  │         or click to browse   │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│ Options:                            │
│ ☑ Update existing products (by SKU) │
│ ☑ Skip invalid rows                 │
│ ☐ Test import (no changes)          │
│                                     │
│ [Download Template]                  │
│                                     │
│ [Cancel]              [Import]       │
└─────────────────────────────────────┘
```

## Implementation Timeline

### Week 1: Single Product & Bulk Operations
- Day 1: Single product creation modal on product list page
- Day 2: Backend CSV/Excel export endpoint
- Day 3-4: Backend import endpoint with validation
- Day 5: Frontend export functionality
- Day 6-7: Frontend import with error handling

### Week 2: Product Images
- Day 1-2: Database schema update & migration
- Day 3-4: Image upload endpoints
- Day 5-7: Frontend image management UI

### Week 3: Field Editing & Categories
- Day 1-2: Inline editing implementation
- Day 3-4: Bulk update functionality
- Day 5-7: Dynamic category management

## Security Considerations

1. **File Upload Security:**
   - Validate file size (max 10MB)
   - Check file type by content, not just extension
   - Scan for malicious content
   - Rate limiting on import endpoint

2. **Image Security:**
   - Validate image formats (JPEG, PNG, WebP only)
   - Resize large images server-side
   - Generate unique filenames to prevent overwrites
   - Use signed URLs for S3 uploads

3. **Data Validation:**
   - Sanitize all input fields
   - Validate against SQL injection in bulk operations
   - Check user permissions for bulk operations

## Testing Strategy

1. **Unit Tests:**
   - CSV/Excel parsing functions
   - Validation rules
   - Image processing

2. **Integration Tests:**
   - File upload endpoints
   - Bulk operations
   - Category CRUD operations

3. **E2E Tests:**
   - Complete import flow
   - Export and re-import cycle
   - Image upload and display

## Rollback Plan

1. **Database Backup:**
   - Backup before bulk imports
   - Transaction-based imports (all or nothing)

2. **Feature Flags:**
   - Toggle for new import/export features
   - Gradual rollout to test with subset of users

3. **Audit Log:**
   - Track all bulk operations
   - Store original values for modified products

## Success Metrics

1. **Performance:**
   - Import 1000 products < 30 seconds
   - Export 5000 products < 10 seconds
   - Image upload < 2 seconds

2. **Reliability:**
   - < 1% error rate on valid imports
   - 100% data integrity on export/import cycle

3. **Usability:**
   - 80% of imports succeed without errors
   - Average time to complete import < 2 minutes

## Conclusion

This implementation plan provides a comprehensive, practical approach to enhancing the product management system. The phased approach ensures each feature is properly tested before moving to the next, while maintaining system stability and data integrity throughout the process.