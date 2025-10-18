import type { Product, Unit } from './product';

// =====================================================
// CART LINE ITEM
// =====================================================

export interface CartLineSpecs {
  grade?: string;
  standard?: string;
  dimensionSummary?: string; // e.g., "HEA 200"
  lengthM?: number;
  finish?: string;
  cutList?: Array<{
    lengthM: number;
    qty: number;
  }>;
}

export interface CartLine {
  id: string;
  productId: string;
  product?: Product; // Populated for display
  specs: CartLineSpecs;
  quantity: number;
  unit: Unit;
  estWeightKg?: number;
  indicativeUnitPrice?: number;
  indicativeSubtotal?: number;
}

// =====================================================
// ESTIMATE CART
// =====================================================

export interface CartTotals {
  estWeightKg: number;
  estSubtotal: number;
  vatIndicative?: number;
  vatRate?: number; // e.g., 0.19 for 19%
  deliveryFeeBand?: string;
  grandTotal?: number;
}

export interface EstimateCart {
  id: string;
  lines: CartLine[];
  totals: CartTotals;
  currency: 'RON' | 'EUR';
  disclaimerAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

// =====================================================
// CART ACTIONS
// =====================================================

export interface AddToCartPayload {
  productId: string;
  specs: CartLineSpecs;
  quantity: number;
  unit: Unit;
}

export interface UpdateCartLinePayload {
  lineId: string;
  quantity?: number;
  unit?: Unit;
  specs?: Partial<CartLineSpecs>;
}
