/**
 * BOM (Bill of Materials) Types
 *
 * Defines types for BOM upload, parsing, and auto-mapping functionality
 */

export type BOMMatchConfidence = 'high' | 'medium' | 'low' | 'none';

export interface BOMRow {
  // Original row data from uploaded file
  rowIndex: number;
  family?: string;
  standard?: string;
  grade?: string;
  dimension?: string;
  length_m?: number;
  qty: number;
  unit?: 'kg' | 'buc' | 'm' | 'ton';
  finish?: string;
  notes?: string;

  // Parsed/normalized data
  parsedFamily?: string;
  parsedStandard?: string;
  parsedGrade?: string;
  parsedDimension?: string;

  // Matching results
  matchedProductId?: string;
  matchConfidence: BOMMatchConfidence;
  matchReason?: string;

  // Validation
  errors?: string[];
  warnings?: string[];

  // UI state
  isSelected?: boolean;
  isManuallyMapped?: boolean;
}

export interface BOMUploadResult {
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  totalRows: number;
  rows: BOMRow[];
  parseErrors?: string[];
}

export interface BOMParseOptions {
  // Column mapping (if user provides custom headers)
  columnMapping?: {
    family?: string;
    standard?: string;
    grade?: string;
    dimension?: string;
    length?: string;
    quantity?: string;
    unit?: string;
    finish?: string;
    notes?: string;
  };

  // Auto-detection settings
  autoDetectHeaders?: boolean;
  skipEmptyRows?: boolean;
  trimWhitespace?: boolean;
}

export interface BOMMatchingStats {
  totalRows: number;
  highConfidence: number;
  mediumConfidence: number;
  lowConfidence: number;
  unmatched: number;
  matchRate: number; // percentage
}

export interface BOMColumnMapping {
  sourceColumn: string;
  targetField: keyof BOMRow;
  isMapped: boolean;
  confidence?: number;
}

export interface BOMTemplate {
  headers: string[];
  sampleRows: string[][];
  instructions: string;
}

export interface BulkAddToCartPayload {
  rows: BOMRow[];
  replaceExisting?: boolean;
}
