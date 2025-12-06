/**
 * Back-Office Types
 * Types for back-office system, RFQ management, analytics, etc.
 */

import { RFQStatus } from './user';

// =====================================================
// USER ROLES (extends existing user types)
// =====================================================

export type BackofficeRole = 'BACKOFFICE' | 'ADMIN';

export interface BackofficeUser {
  id: string;
  email: string;
  name: string;
  role: BackofficeRole;
  createdAt: string;
  updatedAt: string;
}

// =====================================================
// RFQ MANAGEMENT
// =====================================================

export interface RFQListItem {
  id: string;
  referenceNumber: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: RFQStatus;
  estimatedTotal: number | null;
  finalQuoteAmount: number | null;
  submittedAt: string;
  acknowledgedAt: string | null;
  quotedAt: string | null;
  assignedToId: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface RFQItem {
  id: string;
  productSku: string;
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number | null;
  totalPrice: number | null;
}

interface Address {
  street: string;
  city: string;
  county: string;
  postalCode: string;
  country: string;
}

export interface RFQDetail extends RFQListItem {
  cui: string | null;
  regCom: string | null;
  billingAddress: Address | null;
  deliveryAddress: Address | null;
  specialRequirements: string | null;
  internalNotes: string | null;
  customerNotes: string | null;
  deliveryCost: number | null;
  processingFee: number | null;
  vatAmount: number | null;
  finalQuotePdfUrl: string | null;
  inProgressAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  items: RFQItem[];
  attachments: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
  }>;
}

export interface UpdateRFQStatusData {
  status?: RFQStatus;
  assignedToId?: string;
  internalNotes?: string;
  customerNotes?: string;
}

export interface UpdateRFQPricingData {
  items?: Array<{
    id: string;
    pricePerUnit: number;
  }>;
  deliveryCost?: number;
  processingFee?: number;
  vatAmount?: number;
  finalQuoteAmount?: number;
}

// =====================================================
// PRODUCT MANAGEMENT
// =====================================================

export interface Product {
  id: string;
  categoryId: string;
  sku: string;
  title: string;
  grade: string | null;
  standard: string | null;
  dimensions: string | null;
  availability: string | null;
  baseUnit: string;
  pricePerUnit: number;
  weight: number | null;
  lengthM: number | null;
  metadata: any;
  imageUrl: string | null;
  imageUrls: string[] | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CreateProductData {
  categoryId: string;
  sku: string;
  title: string;
  grade?: string;
  standard?: string;
  dimensions?: string;
  availability?: string;
  baseUnit: string;
  pricePerUnit: number;
  weight?: number;
  lengthM?: number;
  metadata?: any;
  imageUrl?: string;
  imageUrls?: string[];
  isActive?: boolean;
}

export interface ProductFilters {
  categoryId?: string;
  availability?: string;
  isActive?: boolean;
  search?: string;
}

// =====================================================
// ANALYTICS
// =====================================================

export interface DashboardKPIs {
  totalRFQs: number;
  pendingRFQs: number;
  quotedRFQs: number;
  completedRFQs: number;
  totalQuotedValue: number;
  avgResponseTimeHours: number;
  conversionRate: number;
}

export interface TimeSeriesData {
  date: string;
  count: number;
  value?: number;
}

export interface StatusBreakdown {
  status: RFQStatus;
  count: number;
}

export interface TopProduct {
  sku: string;
  name: string;
  rfqCount: number;
  totalQuantity: number;
}

export interface OperatorPerformance {
  operatorId: string;
  operatorName: string;
  operatorEmail: string;
  totalProcessed: number;
  completed: number;
  quoted: number;
  avgResponseTimeHours: number;
  conversionRate: number;
}

// =====================================================
// FILTERS & PAGINATION
// =====================================================

export interface DateRangeFilter {
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
