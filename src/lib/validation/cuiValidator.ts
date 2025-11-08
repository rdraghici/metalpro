import type { CUIVATValidationResult } from '@/types/rfq';

/**
 * Romanian CUI/VAT Validation Utility
 *
 * CUI (Cod Unic de Înregistrare) is the Romanian tax identification number.
 * Format: 2-10 digits (with or without "RO" prefix)
 *
 * This is a client-side basic validation. In production, you should verify
 * against the Romanian ANAF (tax authority) API for real business data.
 */

/**
 * Extract numeric part from CUI for validation
 * Removes "RO" prefix and non-digit characters, but doesn't modify the original
 */
function extractNumericCUI(input: string): string {
  let cleaned = input.trim().toUpperCase();

  // Remove RO prefix if present
  if (cleaned.startsWith('RO')) {
    cleaned = cleaned.substring(2);
  }

  // Remove non-digit characters
  cleaned = cleaned.replace(/\D/g, '');

  return cleaned;
}

/**
 * Format CUI - preserves the original format (with or without "RO")
 * Just cleans up whitespace and ensures uppercase
 */
export function formatCUI(input: string): string {
  let formatted = input.trim().toUpperCase();

  // If it has RO prefix, ensure it's uppercase and clean
  if (formatted.startsWith('RO')) {
    const numericPart = formatted.substring(2).replace(/\D/g, '');
    return `RO${numericPart}`;
  }

  // Otherwise, just return the numeric part
  return formatted.replace(/\D/g, '');
}

/**
 * Validate CUI checksum using the official Romanian algorithm
 *
 * Algorithm:
 * 1. Remove "RO" prefix if present
 * 2. Length must be 2-10 digits
 * 3. Control digit = last digit
 * 4. Body = all digits except the last
 * 5. Weights = [7, 5, 3, 2, 1, 7, 5, 3, 2] aligned to the right
 * 6. Sum = body digits × corresponding weights
 * 7. Remainder = sum % 11
 * 8. If remainder == 10, computed control = 0, else computed control = remainder
 * 9. Validate: computed control == actual control digit
 */
function validateChecksum(cui: string): boolean {
  // CUI must be between 2 and 10 digits
  if (cui.length < 2 || cui.length > 10) {
    return false;
  }

  // Control digit is the last digit
  const controlDigit = parseInt(cui[cui.length - 1]);

  // Body is all digits except the last one
  const body = cui.substring(0, cui.length - 1);

  // Weights aligned to the right
  const weights = [7, 5, 3, 2, 1, 7, 5, 3, 2];

  // Align weights to the right with body digits
  // If body has fewer than 9 digits, use the rightmost weights
  const offset = weights.length - body.length;

  // Compute weighted sum
  let sum = 0;
  for (let i = 0; i < body.length; i++) {
    const digit = parseInt(body[i]);
    const weight = weights[offset + i];
    sum += digit * weight;
  }

  // Compute control value
  const remainder = sum % 11;
  const computedControl = remainder === 10 ? 0 : remainder;

  // Compare and return
  return computedControl === controlDigit;
}

/**
 * Validate Romanian CUI/VAT number
 *
 * Basic validation rules:
 * - Must contain only digits (after removing RO prefix)
 * - Must be between 2 and 10 digits
 * - Must pass checksum validation
 * - Preserves original format (with or without "RO" prefix)
 *
 * @param input - CUI/VAT number (with or without RO prefix)
 * @returns Validation result with formatted CUI if valid
 */
export function validateCUI(input: string): CUIVATValidationResult {
  if (!input || input.trim() === '') {
    return {
      valid: false,
      message: 'CUI/VAT este obligatoriu',
    };
  }

  // Extract numeric part for validation
  const numericPart = extractNumericCUI(input);

  // Check if it contains only digits
  if (!/^\d+$/.test(numericPart)) {
    return {
      valid: false,
      message: 'CUI/VAT trebuie să conțină doar cifre (după prefix RO)',
    };
  }

  // Check length
  if (numericPart.length < 2) {
    return {
      valid: false,
      message: 'CUI/VAT este prea scurt (minim 2 cifre)',
    };
  }

  if (numericPart.length > 10) {
    return {
      valid: false,
      message: 'CUI/VAT este prea lung (maxim 10 cifre)',
    };
  }

  // Validate checksum
  if (!validateChecksum(numericPart)) {
    return {
      valid: false,
      message: 'CUI/VAT nu este valid (cifră de control incorectă)',
    };
  }

  // All validations passed - preserve original format
  return {
    valid: true,
    formatted: formatCUI(input),
    message: 'CUI/VAT valid',
  };
}

/**
 * Mock function to simulate ANAF API lookup
 *
 * This is a MOCK implementation for development/testing.
 * In production, this would call the Romanian ANAF API to verify:
 * - Business legal name
 * - Registration status
 * - VAT payer status
 * - Registered address
 *
 * ANAF API: https://webservicesp.anaf.ro/PlatitorTvaRest/api/v8/ws/tva
 */
export async function lookupCUIFromANAF(cui: string): Promise<CUIVATValidationResult> {
  // First, validate checksum locally
  const validation = validateCUI(cui);

  if (!validation.valid) {
    return validation;
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Extract numeric part for lookup (mock database uses numeric keys)
  const numericPart = extractNumericCUI(cui);

  // Mock data - in production, this would come from ANAF API
  // Note: Using test CUIs with valid checksums
  const mockBusinessData = {
    '14399840': {
      legalName: 'S.C. METALPRO INDUSTRIES S.R.L.',
      status: 'ACTIV',
      county: 'CLUJ',
    },
    '18547290': {
      legalName: 'S.C. CONSTRUCT STEEL S.R.L.',
      status: 'ACTIV',
      county: 'BUCUREȘTI',
    },
    '16207404': {
      legalName: 'S.C. INDUSTRIAL SOLUTIONS S.R.L.',
      status: 'ACTIV',
      county: 'TIMIȘ',
    },
  };

  const businessData = mockBusinessData[numericPart as keyof typeof mockBusinessData];

  if (businessData) {
    return {
      valid: true,
      formatted: validation.formatted, // Preserves original format
      message: 'CUI/VAT validat în baza ANAF',
      details: businessData,
    };
  }

  // CUI is structurally valid but not found in mock database
  return {
    valid: true,
    formatted: validation.formatted, // Preserves original format
    message: 'CUI/VAT valid (verificare completă necesită autentificare ANAF)',
  };
}

/**
 * Validate Romanian postal code (Cod poștal)
 * Format: 6 digits (XXXXXX)
 */
export function validatePostalCode(postalCode: string): boolean {
  if (!postalCode) return true; // Optional field

  const cleaned = postalCode.replace(/\s/g, '');
  return /^\d{6}$/.test(cleaned);
}

/**
 * Validate Romanian phone number
 * Accepts formats:
 * - +40 XXX XXX XXX
 * - 0040 XXX XXX XXX
 * - 07XX XXX XXX (mobile)
 * - 02XX XXX XXX (landline)
 */
export function validatePhoneNumber(phone: string): boolean {
  if (!phone) return false;

  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // International format
  if (/^\+40\d{9}$/.test(cleaned)) return true;
  if (/^0040\d{9}$/.test(cleaned)) return true;

  // National format
  if (/^0\d{9}$/.test(cleaned)) return true;

  return false;
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  if (cleaned.startsWith('+40')) {
    const digits = cleaned.substring(3);
    return `+40 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
  }

  if (cleaned.startsWith('0')) {
    return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
  }

  return phone;
}
