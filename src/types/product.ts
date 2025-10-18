// Core enums and types for the MetalPro application

// =====================================================
// ENUMS
// =====================================================

export type Unit = 'm' | 'kg' | 'pcs' | 'bundle';
export type Availability = 'in_stock' | 'on_order' | 'backorder';
export type ProductFamily = 'profiles' | 'plates' | 'pipes' | 'fasteners' | 'stainless' | 'nonferrous';

// =====================================================
// CATEGORY
// =====================================================

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  parentId?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

// =====================================================
// PRODUCT
// =====================================================

export interface IndicativePrice {
  currency: 'RON' | 'EUR';
  unit: Unit;
  min?: number;
  max?: number;
}

export interface DeliveryEstimate {
  windowDays?: [number, number]; // e.g., [3, 5] means 3-5 days
  date?: string; // ISO date string
  feeBand?: string; // e.g., "50-100 RON" or "Calculated at quote"
}

export interface ProductDocument {
  label: string;
  url: string;
  type?: 'pdf' | 'image' | 'certificate';
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  family: ProductFamily;
  categoryId?: string;
  title: string;
  description?: string;

  // Specifications
  standards: string[]; // e.g., ["EN 10025", "EN 10219"]
  grade: string; // e.g., "S235JR", "S355JR", "304"
  dimensions: Record<string, string | number>; // Flexible: { height: 200, width: 190, thickness: 8 }
  lengthOptionsM?: number[]; // e.g., [6, 12]

  // Pricing & Units
  baseUnit: Unit;
  indicativePrice: IndicativePrice;

  // Physical properties
  densityKgPerM3?: number;
  sectionProps?: Record<string, number>; // For weight calculations

  // Availability
  availability: Availability;
  deliveryEstimate?: DeliveryEstimate;

  // Additional info
  producer?: string;
  imageUrl?: string;
  docs?: ProductDocument[];

  // Metadata
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// =====================================================
// FILTERS
// =====================================================

export interface ProductFilters {
  family?: ProductFamily[];
  grade?: string[];
  standard?: string[];
  availability?: Availability[];
  minPrice?: number;
  maxPrice?: number;
  minDimension?: Record<string, number>; // e.g., { height: 100 }
  maxDimension?: Record<string, number>; // e.g., { height: 300 }
  finish?: string[];
  producer?: string[];
  search?: string;
}

export interface ProductSort {
  field: 'title' | 'price' | 'availability' | 'createdAt';
  order: 'asc' | 'desc';
}

export interface ProductQueryParams {
  filters?: ProductFilters;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// =====================================================
// SEARCH
// =====================================================

export interface SearchSuggestion {
  type: 'category' | 'product' | 'keyword';
  label: string;
  value: string;
  metadata?: {
    family?: ProductFamily;
    sku?: string;
    grade?: string;
  };
}

export interface SearchResults {
  categories: Category[];
  products: Product[];
  suggestions: SearchSuggestion[];
}
