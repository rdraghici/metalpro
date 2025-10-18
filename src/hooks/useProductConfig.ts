import { useState, useEffect, useMemo } from "react";
import type { Product } from "@/types";

export type SellingUnit = "m" | "kg" | "pcs" | "bundle";
export type LengthOption = "6m" | "12m" | "custom";
export type FinishOption = "standard" | "galvanized" | "painted" | "polished";

export interface CutListItem {
  id: string;
  length: number; // in meters
  quantity: number; // pieces
}

export interface ProductConfiguration {
  sellingUnit: SellingUnit;
  lengthOption: LengthOption;
  customLength?: number; // in meters
  quantity: number;
  finish: FinishOption;
  cutToLength: boolean;
  cutList: CutListItem[];
}

export interface WeightEstimate {
  totalWeight: number; // kg
  unitWeight: number; // kg per unit
  formula: string;
}

export interface PriceEstimate {
  unitPrice: number; // RON per unit
  subtotal: number; // RON
  vat: number; // RON (indicative)
  deliveryFeeBand: string;
  total: number; // RON
}

const DEFAULT_CONFIG: ProductConfiguration = {
  sellingUnit: "m",
  lengthOption: "6m",
  quantity: 1,
  finish: "standard",
  cutToLength: false,
  cutList: [],
};

export const useProductConfig = (product: Product | null) => {
  const [config, setConfig] = useState<ProductConfiguration>(DEFAULT_CONFIG);

  // Reset config when product changes
  useEffect(() => {
    if (product) {
      setConfig({
        ...DEFAULT_CONFIG,
        sellingUnit: product.priceUnit as SellingUnit || "m",
      });
    }
  }, [product?.id]);

  // Calculate weight based on configuration
  const weightEstimate = useMemo((): WeightEstimate => {
    if (!product) {
      return { totalWeight: 0, unitWeight: 0, formula: "" };
    }

    // Base weight calculation (simplified - would be more complex in production)
    // This is a placeholder formula - real formulas would be product-specific
    let unitWeight = 0;
    let formula = "";

    // Example formula for profiles (would come from product data)
    if (product.family === "profiles") {
      // Simplified: weight per meter for profiles
      unitWeight = 10.5; // kg/m (placeholder)
      formula = "Greutate = Lungime × Greutate specifică (10.5 kg/m)";
    } else if (product.family === "plates") {
      // Simplified: weight based on area and thickness
      unitWeight = 7.85; // kg/m² × thickness (placeholder)
      formula = "Greutate = Suprafață × Grosime × Densitate (7.85 kg/dm³)";
    } else {
      unitWeight = 5.0; // Default placeholder
      formula = "Greutate = Volum × Densitate";
    }

    let totalWeight = 0;

    if (config.cutToLength && config.cutList.length > 0) {
      // Calculate total weight from cut list
      totalWeight = config.cutList.reduce((sum, item) => {
        return sum + (item.length * item.quantity * unitWeight);
      }, 0);
    } else {
      // Calculate based on selected length and quantity
      const length = config.lengthOption === "custom"
        ? (config.customLength || 6)
        : parseFloat(config.lengthOption);

      if (config.sellingUnit === "m") {
        totalWeight = length * config.quantity * unitWeight;
      } else if (config.sellingUnit === "kg") {
        totalWeight = config.quantity;
      } else if (config.sellingUnit === "pcs") {
        totalWeight = config.quantity * length * unitWeight;
      }
    }

    return {
      totalWeight: Math.round(totalWeight * 100) / 100,
      unitWeight,
      formula,
    };
  }, [product, config]);

  // Calculate price estimate
  const priceEstimate = useMemo((): PriceEstimate => {
    if (!product) {
      return {
        unitPrice: 0,
        subtotal: 0,
        vat: 0,
        deliveryFeeBand: "Se calculează la ofertă",
        total: 0,
      };
    }

    const basePrice = product.indicativePrice.min || 0;
    let unitPrice = basePrice;

    // Adjust price based on finish
    if (config.finish === "galvanized") {
      unitPrice *= 1.15; // 15% premium
    } else if (config.finish === "painted") {
      unitPrice *= 1.20; // 20% premium
    } else if (config.finish === "polished") {
      unitPrice *= 1.30; // 30% premium
    }

    let subtotal = 0;

    if (config.cutToLength && config.cutList.length > 0) {
      // Calculate price from cut list
      const totalLength = config.cutList.reduce((sum, item) => {
        return sum + (item.length * item.quantity);
      }, 0);
      subtotal = totalLength * unitPrice;
    } else {
      // Calculate based on quantity and unit
      if (config.sellingUnit === "m") {
        const length = config.lengthOption === "custom"
          ? (config.customLength || 6)
          : parseFloat(config.lengthOption);
        subtotal = length * config.quantity * unitPrice;
      } else if (config.sellingUnit === "kg") {
        subtotal = config.quantity * unitPrice;
      } else if (config.sellingUnit === "pcs") {
        subtotal = config.quantity * unitPrice;
      }
    }

    const vat = subtotal * 0.19; // 19% VAT
    const total = subtotal + vat;

    // Determine delivery fee band based on weight
    let deliveryFeeBand = "Se calculează la ofertă";
    if (weightEstimate.totalWeight < 100) {
      deliveryFeeBand = "50-100 RON";
    } else if (weightEstimate.totalWeight < 500) {
      deliveryFeeBand = "100-200 RON";
    } else if (weightEstimate.totalWeight < 1000) {
      deliveryFeeBand = "200-400 RON";
    } else {
      deliveryFeeBand = "Transport special - se calculează";
    }

    return {
      unitPrice: Math.round(unitPrice * 100) / 100,
      subtotal: Math.round(subtotal * 100) / 100,
      vat: Math.round(vat * 100) / 100,
      deliveryFeeBand,
      total: Math.round(total * 100) / 100,
    };
  }, [product, config, weightEstimate]);

  // Calculate waste percentage for cut list
  const wastePercentage = useMemo((): number => {
    if (!config.cutToLength || config.cutList.length === 0) {
      return 0;
    }

    const stockLength = config.lengthOption === "custom"
      ? (config.customLength || 6)
      : parseFloat(config.lengthOption);

    const totalCutLength = config.cutList.reduce((sum, item) => {
      return sum + (item.length * item.quantity);
    }, 0);

    // Simple waste calculation (would be optimized in production)
    const totalStockNeeded = Math.ceil(totalCutLength / stockLength) * stockLength;
    const waste = totalStockNeeded - totalCutLength;
    const wastePercent = (waste / totalStockNeeded) * 100;

    return Math.round(wastePercent * 100) / 100;
  }, [config]);

  // Update configuration helpers
  const updateConfig = (updates: Partial<ProductConfiguration>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const setSellingUnit = (unit: SellingUnit) => {
    updateConfig({ sellingUnit: unit });
  };

  const setLengthOption = (option: LengthOption) => {
    updateConfig({ lengthOption: option });
  };

  const setCustomLength = (length: number) => {
    updateConfig({ customLength: length, lengthOption: "custom" });
  };

  const setQuantity = (quantity: number) => {
    updateConfig({ quantity: Math.max(1, quantity) });
  };

  const setFinish = (finish: FinishOption) => {
    updateConfig({ finish });
  };

  const toggleCutToLength = () => {
    updateConfig({ cutToLength: !config.cutToLength });
  };

  const addCutListItem = (item: Omit<CutListItem, "id">) => {
    const newItem: CutListItem = {
      ...item,
      id: `cut-${Date.now()}-${Math.random()}`,
    };
    updateConfig({ cutList: [...config.cutList, newItem] });
  };

  const updateCutListItem = (id: string, updates: Partial<CutListItem>) => {
    const updatedList = config.cutList.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    updateConfig({ cutList: updatedList });
  };

  const removeCutListItem = (id: string) => {
    updateConfig({ cutList: config.cutList.filter(item => item.id !== id) });
  };

  const clearCutList = () => {
    updateConfig({ cutList: [] });
  };

  // Validation
  const isValid = useMemo(() => {
    if (config.quantity < 1) return false;
    if (config.lengthOption === "custom" && (!config.customLength || config.customLength <= 0)) {
      return false;
    }
    if (config.cutToLength && config.cutList.length === 0) return false;
    return true;
  }, [config]);

  return {
    config,
    weightEstimate,
    priceEstimate,
    wastePercentage,
    isValid,
    setSellingUnit,
    setLengthOption,
    setCustomLength,
    setQuantity,
    setFinish,
    toggleCutToLength,
    addCutListItem,
    updateCutListItem,
    removeCutListItem,
    clearCutList,
    updateConfig,
  };
};
