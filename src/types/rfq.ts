import type { EstimateCart } from './cart';

// =====================================================
// RFQ (REQUEST FOR QUOTE) TYPES
// =====================================================

export type Incoterm = 'EXW' | 'FCA' | 'CPT' | 'DAP' | 'DDP';
export type RFQStatus = 'draft' | 'submitted' | 'acknowledged' | 'in_progress' | 'quoted' | 'completed' | 'cancelled';

// =====================================================
// ADDRESS & CONTACT
// =====================================================

export interface Address {
  street: string;
  city: string;
  county?: string;
  postalCode?: string;
  country: string;
}

export interface Contact {
  person: string;
  phone: string;
  email: string;
}

// =====================================================
// COMPANY INFORMATION
// =====================================================

export interface CompanyInfo {
  legalName: string;
  cuiVat: string; // CUI/VAT number
  registrationNumber?: string;
  billingAddress: Address;
  contact: Contact;
  isVerifiedBusiness?: boolean;
}

// =====================================================
// RFQ ATTACHMENTS
// =====================================================

export interface RFQAttachment {
  id: string;
  name: string;
  type: 'csv' | 'xlsx' | 'pdf' | 'image' | 'other';
  url?: string; // Will be populated after upload
  file?: File; // Local file before upload
  size?: number; // In bytes
  uploadedAt?: string;
}

// =====================================================
// RFQ FORM DATA
// =====================================================

export interface RFQFormData {
  // Step 1: Company Information
  company: CompanyInfo;

  // Step 2: Delivery Address
  deliveryAddress: Address;
  sameAsBilling: boolean;
  desiredDeliveryDate?: string; // ISO date string

  // Step 3: Preferences
  incoterm?: Incoterm;
  paymentTermsPreference?: string;
  specialRequirements?: string;

  // Step 4: Attachments
  attachments: RFQAttachment[];
  notes?: string;

  // Internal
  cartSnapshot: EstimateCart;
  disclaimerAccepted: boolean;
}

// =====================================================
// RFQ SUBMISSION
// =====================================================

export interface RFQ {
  id: string;
  referenceNumber: string; // e.g., "RFQ-2025-00042"
  status: RFQStatus;

  // Company & Contact Info
  company: CompanyInfo;
  deliveryAddress: Address;

  // Cart & Pricing
  cartSnapshot: EstimateCart;

  // Preferences
  desiredDeliveryDate?: string;
  incoterm?: Incoterm;
  paymentTermsPreference?: string;
  specialRequirements?: string;
  notes?: string;

  // Attachments
  attachments: RFQAttachment[];

  // Metadata
  disclaimerAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;

  // Operator assignment (future)
  assignedToUserId?: string;
  assignedAt?: string;

  // Final quote (populated by back-office)
  finalQuoteAmount?: number;
  finalQuoteNotes?: string;
  finalQuotePdfUrl?: string;
  quotedAt?: string;
}

// =====================================================
// RFQ SUBMISSION RESPONSE
// =====================================================

export interface RFQSubmissionResponse {
  success: boolean;
  rfq?: RFQ;
  referenceNumber?: string;
  message?: string;
  errors?: string[];
}

// =====================================================
// VALIDATION RULES
// =====================================================

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message?: string;
}

export interface CUIVATValidationResult {
  valid: boolean;
  formatted?: string; // Formatted CUI/VAT number
  message?: string;
  details?: {
    legalName?: string;
    status?: string;
    county?: string;
  };
}

// =====================================================
// FORM STEP STATES
// =====================================================

export type RFQFormStep = 1 | 2 | 3 | 4 | 5; // 1=Company, 2=Delivery, 3=Preferences, 4=Attachments, 5=Review

export interface RFQFormState {
  currentStep: RFQFormStep;
  completedSteps: Set<RFQFormStep>;
  formData: Partial<RFQFormData>;
  isSubmitting: boolean;
  errors: Record<string, string>;
}