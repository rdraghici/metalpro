import axios from 'axios';
import type { ANAFRequest, ANAFResponse, ValidationResponse } from '../types/anaf';

/**
 * ANAF Service
 * Handles communication with the Romanian Tax Authority (ANAF) API
 */

// In-memory cache for CUI validations
interface CacheEntry {
  data: ValidationResponse;
  timestamp: number;
}

const cuiCache = new Map<string, CacheEntry>();

// Cache TTL from environment or default to 24 hours
const CACHE_TTL = parseInt(process.env.CACHE_TTL || '86400000', 10);

// ANAF API URL
const ANAF_API_URL = process.env.ANAF_API_URL || 'https://webservicesp.anaf.ro/PlatitorTvaRest/api/v8/ws/tva';

/**
 * Extract county from Romanian address string
 * Example: "STR. EXAMPLE NR. 10, CLUJ-NAPOCA, JUD. CLUJ" -> "CLUJ"
 */
function extractCounty(address: string): string {
  const countyMatch = address.match(/JUD\.\s*([A-ZĂÂÎȘȚ\-]+)/i);
  if (countyMatch) {
    return countyMatch[1].trim();
  }

  // Fallback: try to extract city/county from comma-separated parts
  const parts = address.split(',').map(p => p.trim());
  if (parts.length >= 2) {
    // Last part might be the county
    const lastPart = parts[parts.length - 1];
    if (lastPart.length > 2 && lastPart.length < 30) {
      return lastPart.toUpperCase();
    }
  }

  return '';
}

/**
 * Get cached validation result
 */
function getCachedValidation(cui: string): ValidationResponse | null {
  const cached = cuiCache.get(cui);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[ANAF Cache] Hit for CUI: ${cui}`);
    return cached.data;
  }

  if (cached) {
    // Remove expired entry
    cuiCache.delete(cui);
  }

  return null;
}

/**
 * Cache validation result
 */
function cacheValidation(cui: string, data: ValidationResponse): void {
  cuiCache.set(cui, {
    data,
    timestamp: Date.now(),
  });
  console.log(`[ANAF Cache] Stored for CUI: ${cui}`);
}

/**
 * Validate CUI with ANAF API
 */
export async function validateCUIWithANAF(cui: string): Promise<ValidationResponse> {
  // Normalize CUI (remove non-digits)
  const normalizedCUI = cui.replace(/\D/g, '');

  // Check cache first
  const cached = getCachedValidation(normalizedCUI);
  if (cached) {
    return cached;
  }

  try {
    // Convert to integer
    const cuiInt = parseInt(normalizedCUI, 10);

    if (isNaN(cuiInt)) {
      return {
        valid: false,
        cui: normalizedCUI,
        message: 'CUI invalid - nu este un număr valid',
      };
    }

    // Current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split('T')[0];

    // Prepare ANAF API request
    const requestData: ANAFRequest[] = [
      {
        cui: cuiInt,
        data: currentDate,
      },
    ];

    console.log(`[ANAF API] Calling for CUI: ${cuiInt} on date: ${currentDate}`);

    // Call ANAF API
    const response = await axios.post<ANAFResponse>(
      ANAF_API_URL,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    console.log(`[ANAF API] Response code: ${response.data.cod}, message: ${response.data.message}`);

    // Check if CUI was found
    if (response.data.found && response.data.found.length > 0) {
      const company = response.data.found[0];

      const result: ValidationResponse = {
        valid: true,
        cui: normalizedCUI,
        legalName: company.nume,
        address: company.adresa,
        county: extractCounty(company.adresa),
        vatPayer: company.scpTVA,
        active: !company.statusInactivi,
        registrationDate: company.data_inregistrare,
        message: 'CUI/VAT validat în baza ANAF',
      };

      // Cache the successful result
      cacheValidation(normalizedCUI, result);

      return result;
    }

    // CUI not found in ANAF database
    const notFoundResult: ValidationResponse = {
      valid: false,
      cui: normalizedCUI,
      message: 'CUI/VAT nu este înregistrat în baza ANAF',
    };

    // Cache the not-found result (shorter TTL could be used here)
    cacheValidation(normalizedCUI, notFoundResult);

    return notFoundResult;
  } catch (error) {
    console.error('[ANAF API] Error:', error);

    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return {
          valid: false,
          cui: normalizedCUI,
          message: 'Timeout la conectarea cu serviciul ANAF. Vă rugăm să încercați din nou.',
        };
      }

      if (error.response) {
        return {
          valid: false,
          cui: normalizedCUI,
          message: `Eroare ANAF: ${error.response.status} - ${error.response.statusText}`,
        };
      }
    }

    return {
      valid: false,
      cui: normalizedCUI,
      message: 'Eroare la conectarea cu serviciul ANAF. Vă rugăm să verificați manual.',
    };
  }
}

/**
 * Clear cache (useful for testing or scheduled cleanup)
 */
export function clearCache(): void {
  const size = cuiCache.size;
  cuiCache.clear();
  console.log(`[ANAF Cache] Cleared ${size} entries`);
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    size: cuiCache.size,
    entries: Array.from(cuiCache.entries()).map(([cui, entry]) => ({
      cui,
      age: Date.now() - entry.timestamp,
      valid: entry.data.valid,
    })),
  };
}
