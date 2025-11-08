/**
 * ANAF API Request/Response Types
 */

export interface ANAFRequest {
  cui: number;
  data: string; // Format: YYYY-MM-DD
}

export interface ANAFCompanyData {
  cui: number;
  data: string;
  nume: string; // Legal name
  adresa: string; // Full address
  scpTVA: boolean; // VAT payer status
  data_inregistrare: string; // Registration date
  statusInactivi: boolean; // Inactive status
  dataInactivare: string | null;
  dataReactivare: string | null;
}

export interface ANAFResponse {
  cod: number; // HTTP status code
  message: string; // Status message
  found: ANAFCompanyData[];
  notfound: Array<{ cui: number; data: string }>;
}

export interface ValidationRequest {
  cui: string;
}

export interface ValidationResponse {
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
