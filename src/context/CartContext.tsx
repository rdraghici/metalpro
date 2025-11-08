import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  EstimateCart,
  CartLine,
  CartTotals,
  AddToCartPayload,
  UpdateCartLinePayload,
} from '@/types/cart';
import type { Product } from '@/types/product';
import { getProductById } from '@/lib/api/products';

// =====================================================
// CART CONTEXT INTERFACE
// =====================================================

interface CartContextType {
  cart: EstimateCart;
  itemCount: number;
  isLoading: boolean;

  // Actions
  addToCart: (payload: AddToCartPayload, product: Product) => Promise<void>;
  updateCartLine: (payload: UpdateCartLinePayload) => void;
  removeCartLine: (lineId: string) => void;
  clearCart: () => void;

  // Disclaimer
  acceptDisclaimer: (accepted: boolean) => void;

  // Open/Close drawer
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// =====================================================
// CART PROVIDER
// =====================================================

const CART_STORAGE_KEY = 'metalpro_estimate_cart';
const VAT_RATE = 0.19; // 19% VAT

const createEmptyCart = (): EstimateCart => ({
  id: `cart_${Date.now()}`,
  lines: [],
  totals: {
    estWeightKg: 0,
    estSubtotal: 0,
    vatIndicative: 0,
    vatRate: VAT_RATE,
    deliveryFeeBand: 'Se calculează la ofertă',
    grandTotal: 0,
  },
  currency: 'RON',
  disclaimerAccepted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const calculateTotals = (lines: CartLine[]): CartTotals => {
  const estSubtotal = lines.reduce((sum, line) => sum + (line.indicativeSubtotal || 0), 0);
  const estWeightKg = lines.reduce((sum, line) => sum + (line.estWeightKg || 0), 0);
  const vatIndicative = estSubtotal * VAT_RATE;
  const grandTotal = estSubtotal + vatIndicative;

  // Determine delivery fee band based on weight
  let deliveryFeeBand = 'Se calculează la ofertă';
  if (estWeightKg > 0 && estWeightKg < 100) {
    deliveryFeeBand = '50-150 RON';
  } else if (estWeightKg >= 100 && estWeightKg < 500) {
    deliveryFeeBand = '150-300 RON';
  } else if (estWeightKg >= 500 && estWeightKg < 1000) {
    deliveryFeeBand = '300-500 RON';
  } else if (estWeightKg >= 1000) {
    deliveryFeeBand = 'Transport special - se confirmă';
  }

  return {
    estWeightKg,
    estSubtotal,
    vatIndicative,
    vatRate: VAT_RATE,
    deliveryFeeBand,
    grandTotal,
  };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<EstimateCart>(createEmptyCart);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as EstimateCart;
          setCart(parsed);
        }
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }, [cart, isLoading]);

  // Add item to cart
  const addToCart = useCallback(async (payload: AddToCartPayload, product: Product) => {
    const lineId = `line_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Calculate weight and price for this line
    let estWeightKg = 0;
    let indicativeUnitPrice = 0;
    let indicativeSubtotal = 0;

    // Get base price
    const basePrice = product.indicativePrice?.min || 0;

    // Calculate based on unit
    if (payload.unit === 'kg') {
      estWeightKg = payload.quantity;
      indicativeUnitPrice = basePrice;
      indicativeSubtotal = payload.quantity * basePrice;
    } else if (payload.unit === 'm' && product.sectionProps?.linearMassKgPerM) {
      const weightPerMeter = product.sectionProps.linearMassKgPerM;
      const length = payload.specs.lengthM || 6; // Default to 6m

      if (payload.specs.cutList && payload.specs.cutList.length > 0) {
        // Calculate total length from cut list
        const totalLength = payload.specs.cutList.reduce(
          (sum, cut) => sum + cut.lengthM * cut.qty,
          0
        );
        estWeightKg = totalLength * weightPerMeter;
        indicativeUnitPrice = basePrice;
        indicativeSubtotal = totalLength * basePrice;
      } else {
        estWeightKg = length * payload.quantity * weightPerMeter;
        indicativeUnitPrice = basePrice;
        indicativeSubtotal = length * payload.quantity * basePrice;
      }
    } else if (payload.unit === 'pcs') {
      estWeightKg = payload.quantity * (product.sectionProps?.weightPerPiece || 0);
      indicativeUnitPrice = basePrice;
      indicativeSubtotal = payload.quantity * basePrice;
    }

    // Apply finish multiplier
    const finishMultipliers: Record<string, number> = {
      'Standard (laminat la cald)': 1.0,
      'Zincat (+15%)': 1.15,
      'Vopsit (+20%)': 1.20,
      'Lustruit (+30%)': 1.30,
    };

    const finishMultiplier = finishMultipliers[payload.specs.finish || 'Standard (laminat la cald)'] || 1.0;
    indicativeUnitPrice *= finishMultiplier;
    indicativeSubtotal *= finishMultiplier;

    const newLine: CartLine = {
      id: lineId,
      productId: payload.productId,
      product,
      specs: payload.specs,
      quantity: payload.quantity,
      unit: payload.unit,
      estWeightKg,
      indicativeUnitPrice,
      indicativeSubtotal,
    };

    setCart((prev) => {
      const updatedLines = [...prev.lines, newLine];
      const updatedTotals = calculateTotals(updatedLines);

      return {
        ...prev,
        lines: updatedLines,
        totals: updatedTotals,
        updatedAt: new Date().toISOString(),
      };
    });

    // Open drawer to show added item
    setIsDrawerOpen(true);
  }, []);

  // Update cart line
  const updateCartLine = useCallback((payload: UpdateCartLinePayload) => {
    setCart((prev) => {
      const updatedLines = prev.lines.map((line) => {
        if (line.id === payload.lineId) {
          const updated = {
            ...line,
            quantity: payload.quantity !== undefined ? payload.quantity : line.quantity,
            unit: payload.unit || line.unit,
            specs: payload.specs ? { ...line.specs, ...payload.specs } : line.specs,
          };

          // Recalculate weight and price
          // (Similar logic to addToCart - simplified for now)
          const basePrice = line.product?.indicativePrice?.min || 0;
          let estWeightKg = 0;
          let indicativeSubtotal = 0;

          if (updated.unit === 'kg') {
            estWeightKg = updated.quantity;
            indicativeSubtotal = updated.quantity * basePrice;
          } else if (updated.unit === 'm' && line.product?.sectionProps?.linearMassKgPerM) {
            const weightPerMeter = line.product.sectionProps.linearMassKgPerM;
            const length = updated.specs.lengthM || 6;
            estWeightKg = length * updated.quantity * weightPerMeter;
            indicativeSubtotal = length * updated.quantity * basePrice;
          }

          updated.estWeightKg = estWeightKg;
          updated.indicativeSubtotal = indicativeSubtotal;

          return updated;
        }
        return line;
      });

      const updatedTotals = calculateTotals(updatedLines);

      return {
        ...prev,
        lines: updatedLines,
        totals: updatedTotals,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  // Remove cart line
  const removeCartLine = useCallback((lineId: string) => {
    setCart((prev) => {
      const updatedLines = prev.lines.filter((line) => line.id !== lineId);
      const updatedTotals = calculateTotals(updatedLines);

      return {
        ...prev,
        lines: updatedLines,
        totals: updatedTotals,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setCart(createEmptyCart());
    setIsDrawerOpen(false);
  }, []);

  // Accept disclaimer
  const acceptDisclaimer = useCallback((accepted: boolean) => {
    setCart((prev) => ({
      ...prev,
      disclaimerAccepted: accepted,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Drawer controls
  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), []);

  const itemCount = cart.lines.length;

  const value: CartContextType = {
    cart,
    itemCount,
    isLoading,
    addToCart,
    updateCartLine,
    removeCartLine,
    clearCart,
    acceptDisclaimer,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// =====================================================
// CUSTOM HOOK
// =====================================================

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
