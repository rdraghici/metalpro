import type { Product, ProductFilters, ProductFamily, Availability } from '@/types/product';

/**
 * Filter Utilities
 *
 * Provides functions for filtering products, building filter options,
 * and syncing filters with URL query parameters.
 */

// =====================================================
// FILTER APPLICATION
// =====================================================

/**
 * Apply filters to a list of products
 */
export function applyFilters(products: Product[], filters: ProductFilters): Product[] {
  let filtered = [...products];

  // Family filter
  if (filters.family && filters.family.length > 0) {
    filtered = filtered.filter(p => filters.family!.includes(p.family));
  }

  // Grade filter
  if (filters.grade && filters.grade.length > 0) {
    filtered = filtered.filter(p => filters.grade!.includes(p.grade));
  }

  // Standard filter
  if (filters.standard && filters.standard.length > 0) {
    filtered = filtered.filter(p =>
      p.standards.some(s => filters.standard!.includes(s))
    );
  }

  // Availability filter
  if (filters.availability && filters.availability.length > 0) {
    filtered = filtered.filter(p => filters.availability!.includes(p.availability));
  }

  // Producer filter
  if (filters.producer && filters.producer.length > 0) {
    filtered = filtered.filter(p =>
      p.producer && filters.producer!.includes(p.producer)
    );
  }

  // Price range filter
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    filtered = filtered.filter(p => {
      const price = p.indicativePrice.min || p.indicativePrice.max || 0;
      if (filters.minPrice !== undefined && price < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;
      return true;
    });
  }

  // Dimension range filters
  if (filters.minDimension || filters.maxDimension) {
    filtered = filtered.filter(p => {
      // Check each dimension constraint
      if (filters.minDimension) {
        for (const [key, minValue] of Object.entries(filters.minDimension)) {
          const productValue = p.dimensions[key];
          if (typeof productValue === 'number' && productValue < minValue) {
            return false;
          }
        }
      }

      if (filters.maxDimension) {
        for (const [key, maxValue] of Object.entries(filters.maxDimension)) {
          const productValue = p.dimensions[key];
          if (typeof productValue === 'number' && productValue > maxValue) {
            return false;
          }
        }
      }

      return true;
    });
  }

  // Search filter (text search across multiple fields)
  if (filters.search && filters.search.trim()) {
    const searchLower = filters.search.toLowerCase().trim();
    filtered = filtered.filter(p => {
      return (
        p.title.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower) ||
        p.grade.toLowerCase().includes(searchLower) ||
        p.family.toLowerCase().includes(searchLower) ||
        (p.description && p.description.toLowerCase().includes(searchLower)) ||
        p.standards.some(s => s.toLowerCase().includes(searchLower))
      );
    });
  }

  return filtered;
}

// =====================================================
// FILTER OPTIONS BUILDER
// =====================================================

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export interface FilterOptions {
  families: FilterOption[];
  grades: FilterOption[];
  standards: FilterOption[];
  availabilities: FilterOption[];
  producers: FilterOption[];
  priceRange: {
    min: number;
    max: number;
  };
  dimensionRanges: Record<string, {
    min: number;
    max: number;
  }>;
}

/**
 * Build filter options from ALL products with accurate counts based on current filters
 * This ensures filter options don't disappear and counts are accurate
 */
export function buildFilterOptionsWithCounts(
  allProducts: Product[],
  currentFilters: ProductFilters,
  t: (key: string) => string
): FilterOptions {
  // Helper function to count products for a specific filter option
  const countWithFilter = (filterKey: keyof ProductFilters, filterValue: string): number => {
    // Create a temporary filter with the option being counted
    const tempFilters: ProductFilters = { ...currentFilters };

    // Toggle or add this specific filter value
    if (Array.isArray(tempFilters[filterKey])) {
      const currentArray = tempFilters[filterKey] as string[];
      if (!currentArray.includes(filterValue)) {
        tempFilters[filterKey] = [...currentArray, filterValue] as any;
      }
    } else {
      tempFilters[filterKey] = [filterValue] as any;
    }

    // Apply filters and count
    return applyFilters(allProducts, tempFilters).length;
  };

  // Helper function to count products if a specific filter were removed
  const countWithoutFilter = (filterKey: keyof ProductFilters, filterValue: string): number => {
    // Create a temporary filter without this specific value
    const tempFilters: ProductFilters = { ...currentFilters };

    if (Array.isArray(tempFilters[filterKey])) {
      const currentArray = tempFilters[filterKey] as string[];
      tempFilters[filterKey] = currentArray.filter(v => v !== filterValue) as any;
      if ((tempFilters[filterKey] as string[]).length === 0) {
        delete tempFilters[filterKey];
      }
    }

    return applyFilters(allProducts, tempFilters).length;
  };

  // Collect all unique values from ALL products
  const familySet = new Set<ProductFamily>();
  const gradeSet = new Set<string>();
  const standardSet = new Set<string>();
  const availabilitySet = new Set<Availability>();
  const producerSet = new Set<string>();

  let minPrice = Infinity;
  let maxPrice = -Infinity;
  const dimensionMaps = new Map<string, { min: number; max: number }>();

  // Collect all unique values
  allProducts.forEach(product => {
    if (product.family) familySet.add(product.family);
    if (product.grade) gradeSet.add(product.grade);
    if (product.standards && Array.isArray(product.standards)) {
      product.standards.forEach(standard => standardSet.add(standard));
    }
    if (product.availability) availabilitySet.add(product.availability);
    if (product.producer) producerSet.add(product.producer);

    // Price range
    if (product.indicativePrice) {
      const price = product.indicativePrice.min || product.indicativePrice.max || 0;
      if (price > 0) {
        minPrice = Math.min(minPrice, price);
        maxPrice = Math.max(maxPrice, price);
      }
    }

    // Dimension ranges
    if (product.dimensions && typeof product.dimensions === 'object') {
      Object.entries(product.dimensions).forEach(([key, value]) => {
        if (typeof value === 'number') {
          const existing = dimensionMaps.get(key);
          if (!existing) {
            dimensionMaps.set(key, { min: value, max: value });
          } else {
            existing.min = Math.min(existing.min, value);
            existing.max = Math.max(existing.max, value);
          }
        }
      });
    }
  });

  // Build filter options with accurate counts
  // For each option, show how many products have that specific attribute value
  // considering OTHER active filters (but not THIS filter type)
  const countForOption = (filterKey: keyof ProductFilters, filterValue: string): number => {
    // Create filters without the current filter type
    const tempFilters: ProductFilters = { ...currentFilters };
    delete tempFilters[filterKey];

    // Add only this specific value
    tempFilters[filterKey] = [filterValue] as any;

    return applyFilters(allProducts, tempFilters).length;
  };

  const families: FilterOption[] = Array.from(familySet)
    .map(value => ({
      value,
      label: getFamilyLabel(value, t),
      count: countForOption('family', value)
    }))
    .filter(option => option.count > 0) // Hide options with no products
    .sort((a, b) => String(a.label || '').localeCompare(String(b.label || '')));

  const grades: FilterOption[] = Array.from(gradeSet)
    .map(value => ({
      value,
      label: String(value || ''),
      count: countForOption('grade', value)
    }))
    .filter(option => option.count > 0 && option.label) // Hide options with no products or empty labels
    .sort((a, b) => String(a.label).localeCompare(String(b.label)));

  const standards: FilterOption[] = Array.from(standardSet)
    .map(value => ({
      value,
      label: String(value || ''),
      count: countForOption('standard', value)
    }))
    .filter(option => option.count > 0 && option.label) // Hide options with no products or empty labels
    .sort((a, b) => String(a.label).localeCompare(String(b.label)));

  const availabilities: FilterOption[] = Array.from(availabilitySet)
    .map(value => ({
      value,
      label: getAvailabilityLabel(value, t),
      count: countForOption('availability', value)
    }))
    .filter(option => option.count > 0) // Hide options with no products
    .sort((a, b) => String(a.label || '').localeCompare(String(b.label || '')));

  const producers: FilterOption[] = Array.from(producerSet)
    .map(value => ({
      value,
      label: String(value || ''),
      count: countForOption('producer', value)
    }))
    .filter(option => option.count > 0 && option.label) // Hide options with no products or empty labels
    .sort((a, b) => String(a.label).localeCompare(String(b.label)));

  // Convert dimension maps to object
  const dimensionRanges: Record<string, { min: number; max: number }> = {};
  dimensionMaps.forEach((range, key) => {
    dimensionRanges[key] = range;
  });

  return {
    families,
    grades,
    standards,
    availabilities,
    producers,
    priceRange: {
      min: minPrice === Infinity ? 0 : minPrice,
      max: maxPrice === -Infinity ? 0 : maxPrice
    },
    dimensionRanges
  };
}

/**
 * Get human-readable label for product family
 */
function getFamilyLabel(family: ProductFamily, t: (key: string) => string): string {
  const labelKeys: Record<ProductFamily, string> = {
    profiles: 'catalog.family_profiles',
    plates: 'catalog.family_plates',
    pipes: 'catalog.family_pipes',
    fasteners: 'catalog.family_fasteners',
    stainless: 'catalog.family_stainless',
    nonferrous: 'catalog.family_nonferrous'
  };
  return t(labelKeys[family]) || family;
}

/**
 * Get human-readable label for availability
 */
function getAvailabilityLabel(availability: Availability, t: (key: string) => string): string {
  const labelKeys: Record<Availability, string> = {
    in_stock: 'catalog.availability_in_stock',
    on_order: 'catalog.availability_on_order',
    backorder: 'catalog.availability_backorder'
  };
  return t(labelKeys[availability]) || availability;
}

// =====================================================
// URL SYNC
// =====================================================

/**
 * Convert filters to URL search params
 */
export function filtersToSearchParams(filters: ProductFilters): URLSearchParams {
  const params = new URLSearchParams();

  // Family
  if (filters.family && filters.family.length > 0) {
    filters.family.forEach(f => params.append('family', f));
  }

  // Grade
  if (filters.grade && filters.grade.length > 0) {
    filters.grade.forEach(g => params.append('grade', g));
  }

  // Standard
  if (filters.standard && filters.standard.length > 0) {
    filters.standard.forEach(s => params.append('standard', s));
  }

  // Availability
  if (filters.availability && filters.availability.length > 0) {
    filters.availability.forEach(a => params.append('availability', a));
  }

  // Producer
  if (filters.producer && filters.producer.length > 0) {
    filters.producer.forEach(p => params.append('producer', p));
  }

  // Price range
  if (filters.minPrice !== undefined) {
    params.set('minPrice', filters.minPrice.toString());
  }
  if (filters.maxPrice !== undefined) {
    params.set('maxPrice', filters.maxPrice.toString());
  }

  // Dimension ranges
  if (filters.minDimension) {
    Object.entries(filters.minDimension).forEach(([key, value]) => {
      params.set(`minDim_${key}`, value.toString());
    });
  }
  if (filters.maxDimension) {
    Object.entries(filters.maxDimension).forEach(([key, value]) => {
      params.set(`maxDim_${key}`, value.toString());
    });
  }

  // Search
  if (filters.search) {
    params.set('search', filters.search);
  }

  return params;
}

/**
 * Convert URL search params to filters
 */
export function searchParamsToFilters(params: URLSearchParams): ProductFilters {
  const filters: ProductFilters = {};

  // Family
  const families = params.getAll('family') as ProductFamily[];
  if (families.length > 0) {
    filters.family = families;
  }

  // Grade
  const grades = params.getAll('grade');
  if (grades.length > 0) {
    filters.grade = grades;
  }

  // Standard
  const standards = params.getAll('standard');
  if (standards.length > 0) {
    filters.standard = standards;
  }

  // Availability
  const availabilities = params.getAll('availability') as Availability[];
  if (availabilities.length > 0) {
    filters.availability = availabilities;
  }

  // Producer
  const producers = params.getAll('producer');
  if (producers.length > 0) {
    filters.producer = producers;
  }

  // Price range
  const minPrice = params.get('minPrice');
  if (minPrice) {
    filters.minPrice = parseFloat(minPrice);
  }
  const maxPrice = params.get('maxPrice');
  if (maxPrice) {
    filters.maxPrice = parseFloat(maxPrice);
  }

  // Dimension ranges
  const minDimension: Record<string, number> = {};
  const maxDimension: Record<string, number> = {};

  params.forEach((value, key) => {
    if (key.startsWith('minDim_')) {
      const dimKey = key.replace('minDim_', '');
      minDimension[dimKey] = parseFloat(value);
    } else if (key.startsWith('maxDim_')) {
      const dimKey = key.replace('maxDim_', '');
      maxDimension[dimKey] = parseFloat(value);
    }
  });

  if (Object.keys(minDimension).length > 0) {
    filters.minDimension = minDimension;
  }
  if (Object.keys(maxDimension).length > 0) {
    filters.maxDimension = maxDimension;
  }

  // Search
  const search = params.get('search');
  if (search) {
    filters.search = search;
  }

  return filters;
}

/**
 * Sync filters with URL (for use in components)
 */
export function syncFiltersWithURL(
  filters: ProductFilters,
  updateURL: (params: URLSearchParams) => void
): void {
  const params = filtersToSearchParams(filters);
  updateURL(params);
}

// =====================================================
// FILTER HELPERS
// =====================================================

/**
 * Check if any filters are active
 */
export function hasActiveFilters(filters: ProductFilters): boolean {
  return (
    (filters.family && filters.family.length > 0) ||
    (filters.grade && filters.grade.length > 0) ||
    (filters.standard && filters.standard.length > 0) ||
    (filters.availability && filters.availability.length > 0) ||
    (filters.producer && filters.producer.length > 0) ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    (filters.minDimension && Object.keys(filters.minDimension).length > 0) ||
    (filters.maxDimension && Object.keys(filters.maxDimension).length > 0) ||
    (filters.search && filters.search.trim().length > 0)
  );
}

/**
 * Clear all filters
 */
export function clearFilters(): ProductFilters {
  return {};
}

/**
 * Get count of active filters
 */
export function getActiveFilterCount(filters: ProductFilters): number {
  let count = 0;

  if (filters.family && filters.family.length > 0) count += filters.family.length;
  if (filters.grade && filters.grade.length > 0) count += filters.grade.length;
  if (filters.standard && filters.standard.length > 0) count += filters.standard.length;
  if (filters.availability && filters.availability.length > 0) count += filters.availability.length;
  if (filters.producer && filters.producer.length > 0) count += filters.producer.length;
  if (filters.minPrice !== undefined) count++;
  if (filters.maxPrice !== undefined) count++;
  if (filters.minDimension && Object.keys(filters.minDimension).length > 0) {
    count += Object.keys(filters.minDimension).length;
  }
  if (filters.maxDimension && Object.keys(filters.maxDimension).length > 0) {
    count += Object.keys(filters.maxDimension).length;
  }
  if (filters.search && filters.search.trim().length > 0) count++;

  return count;
}
