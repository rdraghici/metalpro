import type {
  Product,
  Category,
  ProductFilters,
  ProductSort,
  ProductListResponse,
  SearchResults,
  ProductFamily,
} from '@/types';
import {
  allProducts,
  categories,
  getProductById as getProductByIdFromData,
  getProductBySlug as getProductBySlugFromData,
  getCategoryBySlug as getCategoryBySlugFromData,
} from '@/data/products';

// Simulated API delay for realistic UX
const simulateDelay = (ms: number = 300) =>
  new Promise(resolve => setTimeout(resolve, ms));

// =====================================================
// CATEGORIES API
// =====================================================

export const getAllCategories = async (): Promise<Category[]> => {
  await simulateDelay(200);
  return categories.filter(c => c.isActive);
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  await simulateDelay(150);
  const category = categories.find(c => c.id === id);
  return category || null;
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  await simulateDelay(150);
  const category = getCategoryBySlugFromData(slug);
  return category || null;
};

// =====================================================
// PRODUCTS API
// =====================================================

export const getAllProducts = async (): Promise<Product[]> => {
  await simulateDelay(300);
  return allProducts.filter(p => p.isActive);
};

export const getProductById = async (id: string): Promise<Product | null> => {
  await simulateDelay(150);
  const product = getProductByIdFromData(id);
  return product || null;
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  await simulateDelay(150);
  const product = getProductBySlugFromData(slug);
  return product || null;
};

// =====================================================
// FILTERING & SEARCH
// =====================================================

const matchesFilters = (product: Product, filters: ProductFilters): boolean => {
  // Family filter
  if (filters.family && filters.family.length > 0) {
    if (!filters.family.includes(product.family)) {
      return false;
    }
  }

  // Grade filter
  if (filters.grade && filters.grade.length > 0) {
    if (!filters.grade.includes(product.grade)) {
      return false;
    }
  }

  // Standard filter
  if (filters.standard && filters.standard.length > 0) {
    const hasMatchingStandard = filters.standard.some(std =>
      product.standards.some(pStd => pStd.includes(std))
    );
    if (!hasMatchingStandard) {
      return false;
    }
  }

  // Availability filter
  if (filters.availability && filters.availability.length > 0) {
    if (!filters.availability.includes(product.availability)) {
      return false;
    }
  }

  // Price range filter
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const productMinPrice = product.indicativePrice.min;
    const productMaxPrice = product.indicativePrice.max;

    if (productMinPrice !== undefined && filters.maxPrice !== undefined) {
      if (productMinPrice > filters.maxPrice) {
        return false;
      }
    }

    if (productMaxPrice !== undefined && filters.minPrice !== undefined) {
      if (productMaxPrice < filters.minPrice) {
        return false;
      }
    }
  }

  // Search text filter
  if (filters.search && filters.search.trim() !== '') {
    const searchLower = filters.search.toLowerCase();
    const matchesTitle = product.title.toLowerCase().includes(searchLower);
    const matchesSku = product.sku.toLowerCase().includes(searchLower);
    const matchesGrade = product.grade.toLowerCase().includes(searchLower);
    const matchesStandards = product.standards.some(std =>
      std.toLowerCase().includes(searchLower)
    );

    if (!matchesTitle && !matchesSku && !matchesGrade && !matchesStandards) {
      return false;
    }
  }

  return true;
};

const applySorting = (products: Product[], sort?: ProductSort): Product[] => {
  if (!sort) {
    return products;
  }

  const sorted = [...products];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sort.field) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'price': {
        const aPrice = a.indicativePrice.min || a.indicativePrice.max || 0;
        const bPrice = b.indicativePrice.min || b.indicativePrice.max || 0;
        comparison = aPrice - bPrice;
        break;
      }
      case 'availability': {
        const availabilityOrder = { in_stock: 1, on_order: 2, backorder: 3 };
        comparison = availabilityOrder[a.availability] - availabilityOrder[b.availability];
        break;
      }
      case 'createdAt':
        comparison =
          new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        break;
    }

    return sort.order === 'desc' ? -comparison : comparison;
  });

  return sorted;
};

export const getProductsWithFilters = async (
  filters?: ProductFilters,
  sort?: ProductSort,
  page: number = 1,
  limit: number = 12
): Promise<ProductListResponse> => {
  await simulateDelay(300);

  let filteredProducts = allProducts.filter(p => p.isActive);

  // Apply filters
  if (filters) {
    filteredProducts = filteredProducts.filter(p => matchesFilters(p, filters));
  }

  // Apply sorting
  filteredProducts = applySorting(filteredProducts, sort);

  // Pagination
  const total = filteredProducts.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return {
    products: paginatedProducts,
    total,
    page,
    limit,
    hasMore: endIndex < total,
  };
};

export const getProductsByFamily = async (
  family: ProductFamily,
  filters?: ProductFilters,
  sort?: ProductSort,
  page: number = 1,
  limit: number = 12
): Promise<ProductListResponse> => {
  return getProductsWithFilters(
    {
      ...filters,
      family: [family],
    },
    sort,
    page,
    limit
  );
};

// =====================================================
// SEARCH API
// =====================================================

export const searchProducts = async (query: string): Promise<SearchResults> => {
  await simulateDelay(250);

  const queryLower = query.toLowerCase().trim();

  if (!queryLower) {
    return {
      categories: [],
      products: [],
      suggestions: [],
    };
  }

  // Search categories
  const matchedCategories = categories.filter(
    c =>
      c.isActive &&
      (c.name.toLowerCase().includes(queryLower) ||
        c.slug.toLowerCase().includes(queryLower))
  );

  // Search products
  const matchedProducts = allProducts.filter(
    p =>
      p.isActive &&
      (p.title.toLowerCase().includes(queryLower) ||
        p.sku.toLowerCase().includes(queryLower) ||
        p.grade.toLowerCase().includes(queryLower) ||
        p.standards.some(std => std.toLowerCase().includes(queryLower)))
  );

  // Generate suggestions
  const suggestions = matchedProducts.slice(0, 5).map(p => ({
    type: 'product' as const,
    label: p.title,
    value: p.slug,
    metadata: {
      family: p.family,
      sku: p.sku,
      grade: p.grade,
    },
  }));

  return {
    categories: matchedCategories.slice(0, 3),
    products: matchedProducts.slice(0, 12),
    suggestions,
  };
};

// =====================================================
// FILTER OPTIONS (for dynamic filter UI)
// =====================================================

export const getAvailableGrades = async (family?: ProductFamily): Promise<string[]> => {
  await simulateDelay(100);

  let products = allProducts.filter(p => p.isActive);

  if (family) {
    products = products.filter(p => p.family === family);
  }

  const grades = [...new Set(products.map(p => p.grade))];
  return grades.sort();
};

export const getAvailableStandards = async (family?: ProductFamily): Promise<string[]> => {
  await simulateDelay(100);

  let products = allProducts.filter(p => p.isActive);

  if (family) {
    products = products.filter(p => p.family === family);
  }

  const standards = [...new Set(products.flatMap(p => p.standards))];
  return standards.sort();
};

export const getAvailableProducers = async (family?: ProductFamily): Promise<string[]> => {
  await simulateDelay(100);

  let products = allProducts.filter(p => p.isActive && p.producer);

  if (family) {
    products = products.filter(p => p.family === family);
  }

  const producers = [...new Set(products.map(p => p.producer).filter(Boolean) as string[])];
  return producers.sort();
};

export const getAvailableFamilies = async (): Promise<ProductFamily[]> => {
  await simulateDelay(100);

  const families = [...new Set(allProducts.filter(p => p.isActive).map(p => p.family))];
  return families.sort() as ProductFamily[];
};
