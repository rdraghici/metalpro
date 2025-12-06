import type {
  Product,
  Category,
  ProductFilters,
  ProductSort,
  ProductListResponse,
  SearchResults,
  ProductFamily,
} from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// =====================================================
// PRODUCTS API - Backend Integration
// =====================================================

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/api/products`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return result.data.filter((p: Product) => p.isActive);
    }

    return [];
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await fetch(`${API_URL}/api/products/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    return null;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    // Fetch all products and find by slug
    const products = await getAllProducts();
    const product = products.find(p => p.slug === slug);
    return product || null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
};

// =====================================================
// FILTERING & SEARCH - Client-side filtering
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
  try {
    // Fetch all products from backend
    let filteredProducts = await getAllProducts();

    // Apply filters client-side
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
  } catch (error) {
    console.error('Error fetching products with filters:', error);
    return {
      products: [],
      total: 0,
      page,
      limit,
      hasMore: false,
    };
  }
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
  try {
    const queryLower = query.toLowerCase().trim();

    if (!queryLower) {
      return {
        categories: [],
        products: [],
        suggestions: [],
      };
    }

    // Fetch all products
    const allProducts = await getAllProducts();

    // Search products
    const matchedProducts = allProducts.filter(
      p =>
        p.title.toLowerCase().includes(queryLower) ||
        p.sku.toLowerCase().includes(queryLower) ||
        p.grade.toLowerCase().includes(queryLower) ||
        p.standards.some(std => std.toLowerCase().includes(queryLower))
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
      categories: [], // Categories not implemented yet
      products: matchedProducts.slice(0, 12),
      suggestions,
    };
  } catch (error) {
    console.error('Error searching products:', error);
    return {
      categories: [],
      products: [],
      suggestions: [],
    };
  }
};

// =====================================================
// FILTER OPTIONS (for dynamic filter UI)
// =====================================================

export const getAvailableGrades = async (family?: ProductFamily): Promise<string[]> => {
  try {
    let products = await getAllProducts();

    if (family) {
      products = products.filter(p => p.family === family);
    }

    const grades = [...new Set(products.map(p => p.grade))];
    return grades.sort();
  } catch (error) {
    console.error('Error fetching available grades:', error);
    return [];
  }
};

export const getAvailableStandards = async (family?: ProductFamily): Promise<string[]> => {
  try {
    let products = await getAllProducts();

    if (family) {
      products = products.filter(p => p.family === family);
    }

    const standards = [...new Set(products.flatMap(p => p.standards))];
    return standards.sort();
  } catch (error) {
    console.error('Error fetching available standards:', error);
    return [];
  }
};

export const getAvailableProducers = async (family?: ProductFamily): Promise<string[]> => {
  try {
    let products = await getAllProducts();

    if (family) {
      products = products.filter(p => p.family === family);
    }

    const producers = [...new Set(products.map(p => p.producer).filter(Boolean) as string[])];
    return producers.sort();
  } catch (error) {
    console.error('Error fetching available producers:', error);
    return [];
  }
};

export const getAvailableFamilies = async (): Promise<ProductFamily[]> => {
  try {
    const products = await getAllProducts();
    const families = [...new Set(products.map(p => p.family))];
    return families.sort() as ProductFamily[];
  } catch (error) {
    console.error('Error fetching available families:', error);
    return [];
  }
};

// =====================================================
// CATEGORIES API - Mock data (keeping for backwards compatibility)
// =====================================================

import {
  categories,
  getCategoryBySlug as getCategoryBySlugFromData,
} from '@/data/products';

export const getAllCategories = async (): Promise<Category[]> => {
  return categories.filter(c => c.isActive);
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  const category = categories.find(c => c.id === id);
  return category || null;
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const category = getCategoryBySlugFromData(slug);
  return category || null;
};

// =====================================================
// SIMILAR PRODUCTS API
// =====================================================

export const getSimilarProducts = async (
  product: Product,
  limit: number = 4
): Promise<Product[]> => {
  try {
    const allProducts = await getAllProducts();

    // Filter out current product and get similar ones
    const similarProducts = allProducts
      .filter(p => p.id !== product.id)
      .map(p => {
        let score = 0;

        // Same family (highest priority)
        if (p.family === product.family) score += 100;

        // Same grade
        if (p.grade === product.grade) score += 50;

        // Matching standards
        const commonStandards = p.standards.filter(std =>
          product.standards.includes(std)
        );
        score += commonStandards.length * 20;

        // Same availability
        if (p.availability === product.availability) score += 10;

        return { product: p, score };
      })
      .filter(({ score }) => score > 0) // Only include products with some similarity
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, limit)
      .map(({ product }) => product);

    return similarProducts;
  } catch (error) {
    console.error('Error fetching similar products:', error);
    return [];
  }
};
