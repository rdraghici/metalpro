# Smart Catalog Import Engine

## Executive Summary

This document outlines a solution for intelligently importing vendor product catalogs into MetalPro. The system will handle diverse catalog formats, automatically detect and map fields, and suggest schema extensions when new data patterns emerge.

---

## 1. Catalog Analysis: Welding Materials Sample

### 1.1 Observed Field Patterns

From the "Preturi materiale sudura.xlsx" catalog, we identified the following field categories:

#### Product Identification
| Field | Examples | Mapping |
|-------|----------|---------|
| Product Code/SKU | `M15 3000`, `GEKA ELIT`, `VARIN 1805 LCD` | `sku` |
| Product Name | `Selectarc 20/10BC`, `CORODUR K 350-G` | `title` |
| Model Name | `MX220 C Pulse` | `title` (variant) |
| Equivalent Products | `VAUTID 100`, `ROBOTIC 352` | `metadata.equivalents` |

#### Technical Specifications
| Field | Examples | Mapping |
|-------|----------|---------|
| Diameter | `1.2mm`, `2.5*350mm`, `3.2*350mm` | `dimensions` or `metadata.diameter` |
| Standard | `E6013`, `E7018 H4`, `E308L-16` | `standard` |
| Grade | `S235JR`, `E71-GS` | `grade` |
| Power Rating | `180A`, `200A`, `500A` | `metadata.powerRating` |
| Cooling Type | `aer`, `apa` | `metadata.coolingType` |
| Pressure Specs | `P1: 315 bar`, `P2: 0-30 l/min` | `metadata.pressure` |
| Cable Length | `3m`, `4m`, `5m` | `metadata.cableLength` |

#### Packaging & Units
| Field | Examples | Mapping |
|-------|----------|---------|
| Packaging | `5kg/pac`, `6kg/pac`, `role 15kg` | `metadata.packaging` |
| Base Unit | `kg`, `buc`, `ml` | `baseUnit` |
| Minimum Order | `10 kg`, `5 kg` | `metadata.minOrderQty` |

#### Pricing
| Field | Examples | Mapping |
|-------|----------|---------|
| Price per Unit | `15.89 lei/kg`, `206.95 lei/buc` | `pricePerUnit` |
| Volume Pricing | `>1000kg: X`, `>500kg: Y`, `<500kg: Z` | `metadata.volumePricing` |
| Currency | `RON`, `EUR`, `USD` | `metadata.currency` |
| Discount Tiers | `-50%`, `-50%-20%` | `metadata.discountTiers` |

#### Availability & Stock
| Field | Examples | Mapping |
|-------|----------|---------|
| Stock Status | `in stoc`, `solicita stoc` | `availability` |
| Quantity Available | `10 buc`, `500kg` | `metadata.stockQty` |

#### Vendor/Producer
| Field | Examples | Mapping |
|-------|----------|---------|
| Producer/Brand | `GEKA TURCIA`, `EDR SPAIN`, `SELECTARC FRANTA` | `metadata.producer` |
| Vendor Code | `ZO3430`, `251201` | `metadata.vendorCode` |

#### Certifications
| Field | Examples | Mapping |
|-------|----------|---------|
| Certifications | `TUV`, `ABS`, `BV`, `DNV`, `CE` | `metadata.certifications` |

---

## 2. Proposed Schema Extension

### 2.1 Current Product Model Limitations

The current schema has:
- `grade`, `standard`, `dimensions` as simple strings
- `metadata` as unstructured JSON
- No vendor/supplier tracking
- No volume pricing support
- No certification tracking

### 2.2 Recommended Schema Changes

```prisma
model Product {
  id           String   @id @default(uuid())
  categoryId   String
  category     Category @relation(fields: [categoryId], references: [id])
  vendorId     String?  // NEW: Link to vendor/supplier
  vendor       Vendor?  @relation(fields: [vendorId], references: [id])

  sku          String   @unique
  vendorSku    String?  // NEW: Original vendor SKU
  title        String
  titleEn      String?  // NEW: English title for multi-language
  description  String?
  descriptionEn String? // NEW: English description

  grade        String?
  standard     String?
  dimensions   String?

  // Physical specs - keep existing
  baseUnit     String
  pricePerUnit Float
  weight       Float?
  lengthM      Float?

  // NEW: Volume pricing tiers
  volumePricing Json?   // [{minQty: 500, maxQty: 1000, price: 12.50}, ...]

  availability String   @default("in_stock")

  // NEW: Structured metadata with known fields
  technicalSpecs Json?  // Diameter, power, pressure, etc.
  packaging      Json?  // {unit: "pac", quantity: 5, weight: "kg"}
  certifications String[] @default([])
  equivalents    String[] @default([])

  metadata Json?        // Keep for truly flexible/unknown fields

  imageUrl  String?
  imageUrls Json?

  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([categoryId])
  @@index([vendorId])
  @@index([sku])
  @@index([vendorSku])
  @@map("products")
}

// NEW: Vendor/Supplier tracking
model Vendor {
  id          String   @id @default(uuid())
  name        String
  code        String   @unique  // Short code like "GEKA", "EDR"
  country     String?
  website     String?
  contactEmail String?
  notes       String?

  products    Product[]
  catalogs    CatalogImport[]

  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("vendors")
}

// NEW: Track catalog imports for audit
model CatalogImport {
  id            String   @id @default(uuid())
  vendorId      String?
  vendor        Vendor?  @relation(fields: [vendorId], references: [id])

  fileName      String
  fileSize      Int
  fileType      String   // xlsx, csv

  mappingConfig Json     // Field mapping used

  totalRows     Int
  importedCount Int
  updatedCount  Int
  errorCount    Int
  errors        Json?    // [{row: 5, error: "..."}]

  importedBy    String   // User ID
  importedAt    DateTime @default(now())

  @@index([vendorId])
  @@map("catalog_imports")
}
```

---

## 3. Smart Import Engine Architecture

### 3.1 Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Catalog Import Flow                          │
└─────────────────────────────────────────────────────────────────────┘

  Upload File          Analyze Structure       Map Fields           Import
┌──────────┐         ┌──────────────────┐   ┌────────────────┐   ┌─────────┐
│  Excel/  │────────▶│ Sheet Detection  │──▶│ Auto-Mapping   │──▶│ Validate│
│   CSV    │         │ Header Analysis  │   │ User Review    │   │ Transform│
└──────────┘         │ Data Sampling    │   │ Save Template  │   │ Upsert  │
                     └──────────────────┘   └────────────────┘   └─────────┘
                              │                     │                  │
                              ▼                     ▼                  ▼
                     ┌──────────────────┐   ┌────────────────┐   ┌─────────┐
                     │ Field Patterns:  │   │ Mapping Rules: │   │ Results:│
                     │ - Headers        │   │ - Field → DB   │   │ - Count │
                     │ - Data types     │   │ - Transforms   │   │ - Errors│
                     │ - Sample values  │   │ - Defaults     │   │ - Report│
                     └──────────────────┘   └────────────────┘   └─────────┘
```

### 3.2 Core Components

#### 3.2.1 File Parser

```typescript
// backend/src/services/catalog-import/file-parser.ts

interface ParsedSheet {
  name: string;
  headers: string[];
  sampleRows: any[][];  // First 10 rows
  totalRows: number;
  dataTypes: Record<string, 'string' | 'number' | 'date' | 'boolean' | 'mixed'>;
}

interface ParsedCatalog {
  fileName: string;
  fileType: 'xlsx' | 'csv';
  sheets: ParsedSheet[];
  detectedPatterns: DetectedPattern[];
}

class CatalogFileParser {
  async parse(buffer: Buffer, fileName: string): Promise<ParsedCatalog> {
    const fileType = this.detectFileType(fileName);

    if (fileType === 'xlsx') {
      return this.parseExcel(buffer);
    } else {
      return this.parseCSV(buffer);
    }
  }

  private analyzeHeaders(headers: string[]): DetectedPattern[] {
    // Pattern matching for common header names
    const patterns: DetectedPattern[] = [];

    for (const header of headers) {
      const normalized = this.normalizeHeader(header);
      const match = this.matchHeaderPattern(normalized);
      if (match) {
        patterns.push(match);
      }
    }

    return patterns;
  }
}
```

#### 3.2.2 Field Pattern Detector

```typescript
// backend/src/services/catalog-import/field-detector.ts

interface FieldPattern {
  sourceHeader: string;
  suggestedField: string;
  confidence: number;  // 0-1
  transform?: string;  // Optional transform function name
  sampleValues: any[];
}

// Known header patterns (multi-language)
const HEADER_PATTERNS: Record<string, string[]> = {
  'sku': ['cod', 'code', 'sku', 'cod produs', 'product code', 'codice', 'articol'],
  'title': ['denumire', 'name', 'produs', 'product', 'descrizione', 'denumire produs'],
  'price': ['pret', 'price', 'prezzo', 'pret lei', 'pret eur', 'price eur', 'pret vanzare'],
  'standard': ['standard', 'norma', 'specificatie'],
  'diameter': ['diametru', 'diameter', 'ø', 'dia'],
  'grade': ['calitate', 'grade', 'tip material', 'aliaj'],
  'unit': ['um', 'unit', 'unitate', 'base unit'],
  'availability': ['stoc', 'stock', 'disponibilitate', 'availability'],
  'packaging': ['ambalare', 'packaging', 'conf', 'ambalaj'],
  'producer': ['producator', 'producer', 'brand', 'marca', 'furnizor'],
  'weight': ['greutate', 'weight', 'kg', 'masa'],
  'certifications': ['certificari', 'certifications', 'aprobari'],
  'minOrder': ['cantitate minima', 'min order', 'moq', 'minimum'],
};

class FieldPatternDetector {
  detect(sheet: ParsedSheet): FieldPattern[] {
    const patterns: FieldPattern[] = [];

    for (let i = 0; i < sheet.headers.length; i++) {
      const header = sheet.headers[i];
      const columnData = sheet.sampleRows.map(row => row[i]);

      const pattern = this.analyzeColumn(header, columnData);
      if (pattern) {
        patterns.push(pattern);
      }
    }

    return patterns;
  }

  private analyzeColumn(header: string, values: any[]): FieldPattern | null {
    const normalized = this.normalize(header);

    // Try header pattern matching first
    for (const [field, patterns] of Object.entries(HEADER_PATTERNS)) {
      if (patterns.some(p => normalized.includes(p))) {
        return {
          sourceHeader: header,
          suggestedField: field,
          confidence: 0.9,
          sampleValues: values.slice(0, 5)
        };
      }
    }

    // Fall back to data type analysis
    const dataType = this.inferDataType(values);
    const inferredField = this.inferFieldFromData(values, dataType);

    if (inferredField) {
      return {
        sourceHeader: header,
        suggestedField: inferredField,
        confidence: 0.6,
        sampleValues: values.slice(0, 5)
      };
    }

    return null;
  }

  private normalize(header: string): string {
    return header
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')  // Remove diacritics
      .replace(/[^a-z0-9\s]/g, ' ')
      .trim();
  }
}
```

#### 3.2.3 Mapping Configuration

```typescript
// backend/src/services/catalog-import/mapping-config.ts

interface FieldMapping {
  sourceColumn: string | number;  // Header name or column index
  targetField: string;            // Database field
  transform?: TransformType;
  defaultValue?: any;
  required?: boolean;
}

type TransformType =
  | 'trim'
  | 'uppercase'
  | 'lowercase'
  | 'parseNumber'
  | 'parsePrice'
  | 'parseDimensions'
  | 'parseAvailability'
  | 'splitArray'
  | 'extractUnit'
  | 'custom';

interface MappingConfig {
  id?: string;
  name: string;
  vendorId?: string;
  sheetSelector?: string | number;  // Sheet name or index
  headerRow?: number;               // Row containing headers (0-indexed)
  dataStartRow?: number;            // First data row (0-indexed)

  fieldMappings: FieldMapping[];

  // Category assignment rules
  categoryRules?: CategoryRule[];

  // Skip rules
  skipRules?: SkipRule[];

  createdAt?: Date;
  updatedAt?: Date;
}

interface CategoryRule {
  condition: {
    field: string;
    operator: 'contains' | 'equals' | 'startsWith' | 'regex';
    value: string;
  };
  categorySlug: string;
}

interface SkipRule {
  field: string;
  condition: 'empty' | 'contains' | 'equals';
  value?: string;
}
```

#### 3.2.4 Transform Functions

```typescript
// backend/src/services/catalog-import/transforms.ts

const transforms: Record<TransformType, (value: any, options?: any) => any> = {
  trim: (v) => String(v).trim(),

  uppercase: (v) => String(v).toUpperCase(),

  lowercase: (v) => String(v).toLowerCase(),

  parseNumber: (v) => {
    if (typeof v === 'number') return v;
    const cleaned = String(v).replace(/[^\d.,\-]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  },

  parsePrice: (v, options) => {
    // Handle formats: "15.89 lei/kg", "€52.80", "3,25 EUR"
    const value = transforms.parseNumber(v);
    // Could also extract currency if needed
    return value;
  },

  parseDimensions: (v) => {
    // Handle formats: "2.5*350mm", "100x96x5x8", "3x1500x3000"
    const str = String(v);
    const match = str.match(/[\d.]+/g);
    if (!match) return str;

    if (match.length === 1) {
      return { diameter: parseFloat(match[0]) };
    } else if (match.length === 2) {
      return { diameter: parseFloat(match[0]), length: parseFloat(match[1]) };
    } else if (match.length >= 3) {
      return {
        thickness: parseFloat(match[0]),
        width: parseFloat(match[1]),
        length: parseFloat(match[2])
      };
    }
    return str;
  },

  parseAvailability: (v) => {
    const normalized = String(v).toLowerCase();
    if (normalized.includes('stoc') || normalized.includes('stock')) {
      return 'in_stock';
    }
    if (normalized.includes('comanda') || normalized.includes('order')) {
      return 'on_order';
    }
    if (normalized.includes('solicita') || normalized.includes('request')) {
      return 'on_order';
    }
    return 'in_stock';
  },

  splitArray: (v, options) => {
    const separator = options?.separator || /[,;]/;
    return String(v).split(separator).map(s => s.trim()).filter(Boolean);
  },

  extractUnit: (v) => {
    const str = String(v).toLowerCase();
    if (str.includes('kg')) return 'kg';
    if (str.includes('buc') || str.includes('pcs')) return 'pcs';
    if (str.includes('m') && !str.includes('mm')) return 'm';
    return 'pcs';
  },

  custom: (v, options) => {
    // Allow custom transform functions
    if (options?.fn && typeof options.fn === 'function') {
      return options.fn(v);
    }
    return v;
  }
};
```

#### 3.2.5 Import Service

```typescript
// backend/src/services/catalog-import/import.service.ts

interface ImportResult {
  success: boolean;
  totalRows: number;
  imported: number;
  updated: number;
  skipped: number;
  errors: ImportError[];
  warnings: ImportWarning[];
  importId: string;
}

interface ImportError {
  row: number;
  column?: string;
  value?: any;
  error: string;
}

interface ImportWarning {
  row: number;
  message: string;
}

class CatalogImportService {
  async import(
    file: Buffer,
    fileName: string,
    config: MappingConfig,
    userId: string
  ): Promise<ImportResult> {
    // 1. Parse file
    const parsed = await this.parser.parse(file, fileName);

    // 2. Select sheet
    const sheet = this.selectSheet(parsed, config);

    // 3. Process rows
    const results: ImportResult = {
      success: true,
      totalRows: sheet.totalRows,
      imported: 0,
      updated: 0,
      skipped: 0,
      errors: [],
      warnings: [],
      importId: uuid()
    };

    const rows = await this.getDataRows(sheet, config);

    for (let i = 0; i < rows.length; i++) {
      const rowNum = (config.dataStartRow || 1) + i;
      const row = rows[i];

      try {
        // Check skip rules
        if (this.shouldSkip(row, config)) {
          results.skipped++;
          continue;
        }

        // Transform row to product data
        const productData = this.transformRow(row, config);

        // Validate
        const validation = this.validate(productData);
        if (!validation.valid) {
          results.errors.push({
            row: rowNum,
            error: validation.errors.join(', ')
          });
          continue;
        }

        // Determine category
        const categoryId = await this.resolveCategory(productData, config);
        productData.categoryId = categoryId;

        // Upsert product
        const existing = await prisma.product.findUnique({
          where: { sku: productData.sku }
        });

        if (existing) {
          await prisma.product.update({
            where: { id: existing.id },
            data: productData
          });
          results.updated++;
        } else {
          await prisma.product.create({ data: productData });
          results.imported++;
        }

      } catch (error) {
        results.errors.push({
          row: rowNum,
          error: error.message
        });
      }
    }

    // 4. Save import record
    await this.saveImportRecord(results, config, userId);

    results.success = results.errors.length === 0;
    return results;
  }

  private transformRow(row: any[], config: MappingConfig): CreateProductData {
    const data: any = {};

    for (const mapping of config.fieldMappings) {
      const sourceValue = this.getSourceValue(row, mapping.sourceColumn);

      if (sourceValue === undefined || sourceValue === null || sourceValue === '') {
        if (mapping.defaultValue !== undefined) {
          data[mapping.targetField] = mapping.defaultValue;
        }
        continue;
      }

      // Apply transform
      const transform = mapping.transform ? transforms[mapping.transform] : null;
      const transformedValue = transform ? transform(sourceValue) : sourceValue;

      // Handle nested fields (e.g., "technicalSpecs.diameter")
      this.setNestedValue(data, mapping.targetField, transformedValue);
    }

    return data;
  }
}
```

---

## 4. Backoffice UI Design

### 4.1 Import Wizard Flow

```
Step 1: Upload        Step 2: Configure       Step 3: Map Fields      Step 4: Review
┌───────────────┐    ┌─────────────────┐    ┌──────────────────┐    ┌──────────────┐
│               │    │                 │    │                  │    │              │
│  Drop file    │───▶│ Select sheet    │───▶│ Review mappings  │───▶│ Preview data │
│  here         │    │ Set header row  │    │ Adjust if needed │    │ Confirm      │
│               │    │ Choose vendor   │    │ Save template    │    │ Import       │
└───────────────┘    └─────────────────┘    └──────────────────┘    └──────────────┘
```

### 4.2 Field Mapping Interface

```
┌─ Field Mapping ──────────────────────────────────────────────────────────────┐
│                                                                              │
│  Source Column          →    Target Field         Transform    Sample        │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ☑ "Cod produs"         →    [sku            ▼]   [None    ▼]   ABC-123     │
│  ☑ "Denumire"           →    [title          ▼]   [Trim    ▼]   Electrod... │
│  ☑ "Diametru"           →    [dimensions     ▼]   [ParseDim▼]   2.5*350mm   │
│  ☑ "Pret lei/kg"        →    [pricePerUnit   ▼]   [ParseNum▼]   15.89       │
│  ☑ "Standard"           →    [standard       ▼]   [None    ▼]   E6013       │
│  ☑ "Stoc"               →    [availability   ▼]   [ParseAvl▼]   in stoc     │
│  ☐ "Note interne"       →    [-- Skip --    ▼]   [--      ▼]   ...         │
│                                                                              │
│  [+ Add Custom Mapping]                                                      │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Category Assignment:                                                        │
│  ○ Single category: [Materiale de sudura              ▼]                    │
│  ● Rule-based:                                                              │
│    IF "Denumire" contains "electrozi"  → [electrozi-sudura        ▼]        │
│    IF "Denumire" contains "sarma"      → [sarma-sudura            ▼]        │
│    IF "Denumire" contains "pistol"     → [pistoleti-sudura        ▼]        │
│    ELSE                                → [materiale-sudura        ▼]        │
│                                                                              │
│  [+ Add Rule]                                                               │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│  ☑ Save as template: [Alloy Distribution - Sudura       ]                   │
│                                                                              │
│  [← Back]                                      [Preview Import →]            │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Import Preview

```
┌─ Import Preview ─────────────────────────────────────────────────────────────┐
│                                                                              │
│  File: Preturi materiale sudura.xlsx                                         │
│  Sheet: 1.1 - ALIAJE OTEL                                                   │
│  Total rows: 234 | Will import: 228 | Will skip: 6                          │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ SKU          Title                  Category     Price    Status       │ │
│  │ ────────────────────────────────────────────────────────────────────── │ │
│  │ GEKA-ELI-25  GEKA ELIT 2.5*350mm   electrozi    12.17    ⬆ New        │ │
│  │ GEKA-ELI-32  GEKA ELIT 3.2*350mm   electrozi    11.00    ⬆ New        │ │
│  │ GEKA-B47-25  GEKA LASER B47 2.5    electrozi    11.63    ↔ Update     │ │
│  │ ...                                                                    │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ⚠ Warnings (2):                                                            │
│    Row 45: Missing SKU, will auto-generate                                   │
│    Row 89: Price seems unusually high (5000 RON/kg)                         │
│                                                                              │
│  ❌ Errors (6 rows will be skipped):                                        │
│    Row 12: Empty product name                                                │
│    Row 56: Invalid price format                                              │
│    ...                                                                       │
│                                                                              │
│  [← Back to Mapping]              [Download Error Report]  [Start Import]   │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. API Endpoints

### 5.1 Catalog Analysis

```typescript
// POST /api/backoffice/catalog/analyze
// Upload file and get structure analysis
Request: FormData { file: File }
Response: {
  success: true,
  data: {
    fileName: string,
    fileType: string,
    sheets: [{
      name: string,
      headers: string[],
      sampleRows: any[][],
      totalRows: number,
      suggestedMappings: FieldPattern[]
    }]
  }
}
```

### 5.2 Get Mapping Templates

```typescript
// GET /api/backoffice/catalog/templates
// Get saved mapping templates
Response: {
  success: true,
  data: MappingConfig[]
}

// GET /api/backoffice/catalog/templates/:vendorId
// Get templates for specific vendor
```

### 5.3 Save Mapping Template

```typescript
// POST /api/backoffice/catalog/templates
Request: MappingConfig
Response: {
  success: true,
  data: { id: string }
}
```

### 5.4 Preview Import

```typescript
// POST /api/backoffice/catalog/preview
Request: FormData {
  file: File,
  config: MappingConfig (JSON string)
}
Response: {
  success: true,
  data: {
    totalRows: number,
    previewRows: ProductPreview[],
    newCount: number,
    updateCount: number,
    skipCount: number,
    warnings: ImportWarning[],
    errors: ImportError[]
  }
}
```

### 5.5 Execute Import

```typescript
// POST /api/backoffice/catalog/import
Request: FormData {
  file: File,
  config: MappingConfig (JSON string)
}
Response: {
  success: true,
  data: ImportResult
}
```

### 5.6 Get Import History

```typescript
// GET /api/backoffice/catalog/imports
Response: {
  success: true,
  data: CatalogImport[]
}

// GET /api/backoffice/catalog/imports/:id
// Get details of specific import
```

---

## 6. New Categories for Welding Materials

Based on the catalog analysis, create these categories:

```typescript
const weldingCategories = [
  { slug: 'materiale-sudura', name: 'Materiale de sudura', nameEn: 'Welding Materials' },
  { slug: 'electrozi-sudura', name: 'Electrozi sudura', nameEn: 'Welding Electrodes', parentSlug: 'materiale-sudura' },
  { slug: 'sarma-sudura', name: 'Sarma sudura', nameEn: 'Welding Wire', parentSlug: 'materiale-sudura' },
  { slug: 'sarma-tubulara', name: 'Sarma tubulara', nameEn: 'Flux-cored Wire', parentSlug: 'sarma-sudura' },
  { slug: 'echipamente-sudura', name: 'Echipamente sudura', nameEn: 'Welding Equipment', parentSlug: 'materiale-sudura' },
  { slug: 'pistoleti-sudura', name: 'Pistoleti sudura', nameEn: 'Welding Torches', parentSlug: 'materiale-sudura' },
  { slug: 'consumabile-sudura', name: 'Consumabile sudura', nameEn: 'Welding Consumables', parentSlug: 'materiale-sudura' },
  { slug: 'reductoare-gaze', name: 'Reductoare gaze', nameEn: 'Gas Regulators', parentSlug: 'materiale-sudura' },
  { slug: 'aliaje-brazare', name: 'Aliaje brazare', nameEn: 'Brazing Alloys', parentSlug: 'materiale-sudura' },
  { slug: 'protectie-sudura', name: 'Echipamente protectie', nameEn: 'Protection Equipment', parentSlug: 'materiale-sudura' },
];
```

---

## 7. Implementation Phases

### Phase 1: Core Infrastructure (Week 1-2)
1. Database schema migration (Vendor, CatalogImport models)
2. File parser service (Excel/CSV)
3. Field pattern detection
4. Basic transform functions

### Phase 2: Mapping System (Week 2-3)
1. Mapping configuration storage
2. Template save/load functionality
3. Category rule engine
4. Import preview API

### Phase 3: Backoffice UI (Week 3-4)
1. Import wizard component
2. Field mapping interface
3. Preview/confirmation screens
4. Import history view

### Phase 4: Intelligence Layer (Week 4-5)
1. Auto-detection improvements
2. Machine learning for header matching (optional)
3. Duplicate detection
4. Price anomaly warnings

---

## 8. Key Benefits

1. **Time Savings**: Import hundreds of products in minutes instead of manual entry
2. **Accuracy**: Consistent transforms reduce human error
3. **Flexibility**: Handles diverse vendor formats without code changes
4. **Traceability**: Full audit trail of imports
5. **Reusability**: Save templates for recurring vendor catalogs
6. **Scalability**: Designed to handle any product category, not just welding

---

## 9. Security Considerations

1. **File Validation**: Check file type by content, not just extension
2. **Size Limits**: Max 50MB per file
3. **Rate Limiting**: Max 10 imports per hour per user
4. **Sanitization**: All imported data is sanitized before storage
5. **Permissions**: Only BACKOFFICE and ADMIN roles can import
6. **Audit Trail**: All imports logged with user ID and timestamp

---

## 10. Future Enhancements

1. **AI-Powered Mapping**: Use ML to suggest field mappings based on historical imports
2. **OCR for PDFs**: Extract product data from PDF catalogs
3. **Real-time Price Updates**: Scheduled re-imports for price updates
4. **Multi-language Support**: Auto-detect and translate product names
5. **Vendor Portal**: Let vendors upload catalogs directly
6. **Approval Workflow**: Require manager approval for large imports
