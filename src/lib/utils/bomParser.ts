/**
 * BOM Parser & Auto-Matching Engine
 *
 * Parses CSV/XLSX files and auto-matches rows to product catalog
 */

import type { BOMRow, BOMUploadResult, BOMParseOptions, BOMMatchConfidence } from '@/types/bom';
import type { Product } from '@/types';

/**
 * Normalize string for matching (remove spaces, convert to uppercase)
 */
function normalizeString(str: string | undefined): string {
  if (!str) return '';
  return str
    .toString()
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_')
    .replace(/[^A-Z0-9_]/g, '');
}

/**
 * Parse CSV content to array of rows
 */
function parseCSV(content: string): string[][] {
  const rows: string[][] = [];
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    if (!line.trim()) continue;

    const cells: string[] = [];
    let currentCell = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          // Escaped quote
          currentCell += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote mode
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        // End of cell
        cells.push(currentCell.trim());
        currentCell = '';
      } else {
        currentCell += char;
      }
    }

    // Add last cell
    cells.push(currentCell.trim());
    rows.push(cells);
  }

  return rows;
}

/**
 * Auto-detect header row and create column mapping
 */
function detectHeaders(rows: string[][]): {
  headerRow: number;
  mapping: Record<string, number>;
} {
  const possibleHeaders = [
    'familie',
    'family',
    'standard',
    'grad',
    'grade',
    'dimensiune',
    'dimension',
    'lungime',
    'length',
    'cantitate',
    'quantity',
    'qty',
    'unitate',
    'unit',
    'finisaj',
    'finish',
    'note',
    'notes',
  ];

  for (let rowIndex = 0; rowIndex < Math.min(3, rows.length); rowIndex++) {
    const row = rows[rowIndex];
    const normalizedRow = row.map((cell) => normalizeString(cell));

    // Check if this row contains header-like values
    const matchedHeaders = normalizedRow.filter((cell) =>
      possibleHeaders.some((header) => normalizeString(header) === cell)
    );

    if (matchedHeaders.length >= 3) {
      // This looks like a header row
      const mapping: Record<string, number> = {};

      normalizedRow.forEach((cell, index) => {
        const normalized = normalizeString(cell);

        // Map Romanian and English headers
        if (normalized.includes('FAMIL')) mapping.family = index;
        if (normalized.includes('STANDARD')) mapping.standard = index;
        if (normalized.includes('GRAD') || normalized.includes('GRADE')) mapping.grade = index;
        if (normalized.includes('DIMENSI') || normalized.includes('DIMENSION'))
          mapping.dimension = index;
        if (normalized.includes('LUNGIME') || normalized.includes('LENGTH')) mapping.length = index;
        if (
          normalized.includes('CANTIT') ||
          normalized.includes('QUANT') ||
          normalized === 'QTY'
        )
          mapping.quantity = index;
        if (normalized.includes('UNITAT') || normalized.includes('UNIT')) mapping.unit = index;
        if (normalized.includes('FINISAJ') || normalized.includes('FINISH'))
          mapping.finish = index;
        if (normalized.includes('NOTE')) mapping.notes = index;
      });

      return { headerRow: rowIndex, mapping };
    }
  }

  // Default mapping (assume order matches template)
  return {
    headerRow: 0,
    mapping: {
      family: 0,
      standard: 1,
      grade: 2,
      dimension: 3,
      length: 4,
      quantity: 5,
      unit: 6,
      finish: 7,
      notes: 8,
    },
  };
}

/**
 * Parse a single row into BOMRow object
 */
function parseRow(
  rowData: string[],
  rowIndex: number,
  mapping: Record<string, number>
): BOMRow | null {
  const getCell = (field: string): string => {
    const index = mapping[field];
    return index !== undefined ? rowData[index]?.trim() || '' : '';
  };

  const quantityStr = getCell('quantity');
  const quantity = parseFloat(quantityStr);

  // Skip rows without quantity
  if (!quantityStr || isNaN(quantity) || quantity <= 0) {
    return null;
  }

  const unitStr = getCell('unit').toLowerCase();
  let unit: 'kg' | 'buc' | 'm' | 'ton' = 'buc';

  if (unitStr.includes('kg')) unit = 'kg';
  else if (unitStr.includes('buc') || unitStr.includes('pc') || unitStr.includes('pcs'))
    unit = 'buc';
  else if (unitStr.includes('m') && !unitStr.includes('kg')) unit = 'm';
  else if (unitStr.includes('ton') || unitStr.includes('tonne')) unit = 'ton';

  const lengthStr = getCell('length');
  const length_m = lengthStr ? parseFloat(lengthStr) : undefined;

  return {
    rowIndex,
    family: getCell('family') || undefined,
    standard: getCell('standard') || undefined,
    grade: getCell('grade') || undefined,
    dimension: getCell('dimension') || undefined,
    length_m: !isNaN(length_m!) ? length_m : undefined,
    qty: quantity,
    unit,
    finish: getCell('finish') || undefined,
    notes: getCell('notes') || undefined,
    matchConfidence: 'none',
    errors: [],
    warnings: [],
  };
}

/**
 * Calculate match confidence between BOM row and product
 */
function calculateMatchConfidence(
  row: BOMRow,
  product: Product
): { confidence: BOMMatchConfidence; score: number; reason: string } {
  let score = 0;
  const reasons: string[] = [];

  // Family matching (highest weight)
  if (row.family && row.parsedFamily) {
    const normalizedRowFamily = normalizeString(row.family);
    const normalizedProductFamily = normalizeString(product.family);

    if (normalizedRowFamily === normalizedProductFamily) {
      score += 40;
      reasons.push('Familie identică');
    } else if (normalizedProductFamily.includes(normalizedRowFamily)) {
      score += 20;
      reasons.push('Familie parțială');
    }
  }

  // Grade matching
  if (row.grade && product.grade) {
    const normalizedRowGrade = normalizeString(row.grade);
    const normalizedProductGrade = normalizeString(product.grade);

    if (normalizedRowGrade === normalizedProductGrade) {
      score += 30;
      reasons.push('Grad identic');
    } else if (normalizedProductGrade.includes(normalizedRowGrade)) {
      score += 15;
      reasons.push('Grad similar');
    }
  }

  // Dimension matching (from title or dimensions)
  if (row.dimension && product.title) {
    const normalizedDimension = normalizeString(row.dimension);
    const normalizedTitle = normalizeString(product.title);

    if (normalizedTitle.includes(normalizedDimension)) {
      score += 25;
      reasons.push('Dimensiune găsită în titlu');
    }
  }

  // Standard matching
  if (row.standard && product.standards) {
    const normalizedStandard = normalizeString(row.standard);
    const hasMatchingStandard = product.standards.some(
      (std) => normalizeString(std) === normalizedStandard
    );

    if (hasMatchingStandard) {
      score += 5;
      reasons.push('Standard compatibil');
    }
  }

  // Determine confidence level
  let confidence: BOMMatchConfidence;
  if (score >= 80) confidence = 'high';
  else if (score >= 50) confidence = 'medium';
  else if (score >= 20) confidence = 'low';
  else confidence = 'none';

  return {
    confidence,
    score,
    reason: reasons.join(', ') || 'Nicio potrivire',
  };
}

/**
 * Auto-match a BOM row to products
 */
export function autoMatchRow(row: BOMRow, products: Product[]): BOMRow {
  let bestMatch: { product: Product; confidence: BOMMatchConfidence; score: number } | null = null;

  for (const product of products) {
    if (!product.isActive) continue;

    const match = calculateMatchConfidence(row, product);

    if (!bestMatch || match.score > bestMatch.score) {
      bestMatch = {
        product,
        confidence: match.confidence,
        score: match.score,
      };
    }
  }

  if (bestMatch && bestMatch.score > 0) {
    return {
      ...row,
      matchedProductId: bestMatch.product.id,
      matchConfidence: bestMatch.confidence,
      matchReason: `Score: ${bestMatch.score}/100 - ${bestMatch.product.title}`,
    };
  }

  return {
    ...row,
    matchConfidence: 'none',
    matchReason: 'Nu s-au găsit produse compatibile',
  };
}

/**
 * Parse BOM file and auto-match to products
 */
export async function parseBOM(
  file: File,
  products: Product[],
  options: BOMParseOptions = {}
): Promise<BOMUploadResult> {
  const {
    autoDetectHeaders = true,
    skipEmptyRows = true,
    trimWhitespace = true,
  } = options;

  try {
    // Read file content
    const content = await file.text();

    // Parse CSV
    const rawRows = parseCSV(content);

    if (rawRows.length === 0) {
      return {
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        totalRows: 0,
        rows: [],
        parseErrors: ['Fișierul este gol'],
      };
    }

    // Detect headers
    const { headerRow, mapping } = autoDetectHeaders
      ? detectHeaders(rawRows)
      : { headerRow: 0, mapping: options.columnMapping || {} };

    // Parse data rows
    const bomRows: BOMRow[] = [];
    const parseErrors: string[] = [];

    for (let i = headerRow + 1; i < rawRows.length; i++) {
      const rawRow = rawRows[i];

      // Skip empty rows if configured
      if (skipEmptyRows && rawRow.every((cell) => !cell.trim())) {
        continue;
      }

      try {
        const parsedRow = parseRow(rawRow, i, mapping);
        if (parsedRow) {
          // Normalize family for better matching
          if (parsedRow.family) {
            parsedRow.parsedFamily = normalizeString(parsedRow.family);
          }

          // Auto-match to products
          const matchedRow = autoMatchRow(parsedRow, products);
          bomRows.push(matchedRow);
        }
      } catch (error) {
        parseErrors.push(
          `Rând ${i + 1}: ${error instanceof Error ? error.message : 'Eroare la parsare'}`
        );
      }
    }

    return {
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      totalRows: bomRows.length,
      rows: bomRows,
      parseErrors: parseErrors.length > 0 ? parseErrors : undefined,
    };
  } catch (error) {
    return {
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      totalRows: 0,
      rows: [],
      parseErrors: [
        `Eroare la citirea fișierului: ${error instanceof Error ? error.message : 'Eroare necunoscută'}`,
      ],
    };
  }
}

/**
 * Get matching statistics from BOM rows
 */
export function getBOMMatchingStats(rows: BOMRow[]) {
  const stats = {
    totalRows: rows.length,
    highConfidence: 0,
    mediumConfidence: 0,
    lowConfidence: 0,
    unmatched: 0,
    matchRate: 0,
  };

  for (const row of rows) {
    switch (row.matchConfidence) {
      case 'high':
        stats.highConfidence++;
        break;
      case 'medium':
        stats.mediumConfidence++;
        break;
      case 'low':
        stats.lowConfidence++;
        break;
      case 'none':
        stats.unmatched++;
        break;
    }
  }

  const matched = stats.highConfidence + stats.mediumConfidence;
  stats.matchRate = stats.totalRows > 0 ? (matched / stats.totalRows) * 100 : 0;

  return stats;
}
