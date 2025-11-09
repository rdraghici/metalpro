/**
 * User & Authentication Types
 */

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;

  // Company information
  company?: {
    name: string;
    cui: string;
    regCom?: string; // Registrul Comerțului
    address: string;
    city: string;
    county: string;
    postalCode?: string;
    country: string;
    contactPerson?: string;
    isVerified?: boolean;
  };

  // Account metadata
  role: 'business' | 'individual';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'business' | 'individual';

  // Company data (required for business accounts)
  company?: {
    name: string;
    cui: string;
    regCom?: string;
    address: string;
    city: string;
    county: string;
    postalCode?: string;
    country: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// =====================================================
// SAVED ADDRESSES
// =====================================================

export type AddressType = 'billing' | 'delivery';

export interface SavedAddress {
  id: string;
  userId: string;
  type: AddressType;
  isDefault: boolean;
  label: string; // e.g., "Sediu Principal", "Depozit Cluj"

  // Company info (for billing addresses)
  companyName?: string;
  cui?: string;

  // Address details
  contactPerson: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  county: string;
  postalCode?: string;
  country: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// =====================================================
// SAVED BOM PROJECTS
// =====================================================

export interface SavedProject {
  id: string;
  userId: string;
  name: string;
  description?: string;

  // BOM data
  bomData: {
    fileName: string;
    totalRows: number;
    rows: any[]; // BOMRow[] from @/types/bom
  };

  // Metadata
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
}

// =====================================================
// ORDER HISTORY (RFQ HISTORY)
// =====================================================

export type RFQStatus = 'submitted' | 'acknowledged' | 'in_progress' | 'quoted' | 'completed' | 'cancelled';

export interface OrderHistoryItem {
  id: string;
  userId: string;
  status: RFQStatus;

  // RFQ data (snapshot at submission time)
  rfqData: {
    companyInfo: any; // CompanyInfo from RFQ
    deliveryInfo: any; // DeliveryInfo from RFQ
    cartItems: any[]; // CartLine[] snapshot
    specialRequirements?: string;
  };

  // Metadata
  submittedAt: string;
  updatedAt: string;

  // Optional: Quote details (when sales team responds)
  quote?: {
    totalPrice?: number;
    currency?: string;
    validUntil?: string;
    notes?: string;
  };
}
