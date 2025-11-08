/**
 * ANAF API Client
 * Communicates with backend proxy for CUI validation
 */

export interface ANAFValidationResult {
  valid: boolean;
  cui: string;
  legalName?: string;
  address?: string;
  county?: string;
  vatPayer?: boolean;
  active?: boolean;
  registrationDate?: string;
  message: string;
}

// Backend API URL - configurable via environment variable
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001';

/**
 * Validate CUI with ANAF via backend proxy
 */
export async function validateCUIWithANAF(cui: string): Promise<ANAFValidationResult> {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/anaf/validate-cui`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cui }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: ANAFValidationResult = await response.json();
    return data;
  } catch (error) {
    console.error('[ANAF Client] Error:', error);

    return {
      valid: false,
      cui,
      message:
        error instanceof Error
          ? `Eroare la conectarea cu serviciul de validare: ${error.message}`
          : 'Eroare necunoscută la validarea CUI',
    };
  }
}

/**
 * Check backend health
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_API_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('[ANAF Client] Backend health check failed:', error);
    return false;
  }
}
