import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { ProductFilters } from '@/types/product';

/**
 * Saved Search Interface
 */
export interface SavedSearch {
  id: string;
  name: string;
  filters: ProductFilters;
  createdAt: string;
  lastUsedAt?: string;
}

/**
 * Get Romanian label for dimension filter (without units)
 */
function getDimensionName(dimension: string): string {
  const labels: Record<string, string> = {
    height: 'Înălțime',
    width: 'Lățime',
    webThickness: 'Grosime inimă',
    flangeThickness: 'Grosime talpă',
    weightPerM: 'Greutate pe metru',
    thickness: 'Grosime',
    widthMm: 'Lățime',
    lengthMm: 'Lungime',
    weightPerM2: 'Greutate pe metru pătrat',
  };

  const key = dimension.toLowerCase();
  const camelKey = dimension.charAt(0).toLowerCase() + dimension.slice(1);

  return labels[camelKey] || labels[key] || dimension;
}

/**
 * Get the unit for dimension filter
 */
function getDimensionUnit(dimension: string): string {
  const key = dimension.toLowerCase();
  const camelKey = dimension.charAt(0).toLowerCase() + dimension.slice(1);

  if (camelKey === 'weightPerM') return 'kg/m';
  if (camelKey === 'weightPerM2') return 'kg/m²';
  return 'mm';
}

/**
 * Advanced Search Hook
 *
 * Manages advanced search state, saved searches, and search history.
 * Uses localStorage for persistence (mock implementation).
 */
export function useAdvancedSearch() {
  const { user } = useAuth();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [recentSearches, setRecentSearches] = useState<ProductFilters[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const STORAGE_KEY_SAVED = `metalpro_saved_searches_${user?.id || 'guest'}`;
  const STORAGE_KEY_RECENT = `metalpro_recent_searches_${user?.id || 'guest'}`;
  const MAX_RECENT_SEARCHES = 10;

  // Load saved searches and recent searches from localStorage
  useEffect(() => {
    loadSavedSearches();
    loadRecentSearches();
    setIsLoading(false);
  }, [user?.id]);

  const loadSavedSearches = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SAVED);
      if (stored) {
        const searches = JSON.parse(stored) as SavedSearch[];
        setSavedSearches(searches);
      }
    } catch (error) {
      console.error('Error loading saved searches:', error);
    }
  }, [STORAGE_KEY_SAVED]);

  const loadRecentSearches = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_RECENT);
      if (stored) {
        const searches = JSON.parse(stored) as ProductFilters[];
        setRecentSearches(searches);
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  }, [STORAGE_KEY_RECENT]);

  /**
   * Save a new search
   */
  const saveSearch = useCallback((name: string, filters: ProductFilters): SavedSearch => {
    const newSearch: SavedSearch = {
      id: `search_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name,
      filters,
      createdAt: new Date().toISOString(),
    };

    const updated = [...savedSearches, newSearch];
    setSavedSearches(updated);
    localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated));

    return newSearch;
  }, [savedSearches, STORAGE_KEY_SAVED]);

  /**
   * Delete a saved search
   */
  const deleteSavedSearch = useCallback((searchId: string) => {
    const updated = savedSearches.filter(s => s.id !== searchId);
    setSavedSearches(updated);
    localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated));
  }, [savedSearches, STORAGE_KEY_SAVED]);

  /**
   * Update a saved search (rename or update filters)
   */
  const updateSavedSearch = useCallback((searchId: string, updates: Partial<SavedSearch>) => {
    const updated = savedSearches.map(s =>
      s.id === searchId
        ? { ...s, ...updates }
        : s
    );
    setSavedSearches(updated);
    localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated));
  }, [savedSearches, STORAGE_KEY_SAVED]);

  /**
   * Mark a saved search as used (update lastUsedAt)
   */
  const markSearchAsUsed = useCallback((searchId: string) => {
    const updated = savedSearches.map(s =>
      s.id === searchId
        ? { ...s, lastUsedAt: new Date().toISOString() }
        : s
    );
    setSavedSearches(updated);
    localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated));
  }, [savedSearches, STORAGE_KEY_SAVED]);

  /**
   * Add filters to recent searches history
   */
  const addToRecentSearches = useCallback((filters: ProductFilters) => {
    // Don't add empty searches
    if (Object.keys(filters).length === 0) return;

    // Check if this exact search already exists in recent
    const exists = recentSearches.some(
      rs => JSON.stringify(rs) === JSON.stringify(filters)
    );

    if (exists) return;

    // Add to beginning and limit to MAX_RECENT_SEARCHES
    const updated = [filters, ...recentSearches].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updated);
    localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(updated));
  }, [recentSearches, STORAGE_KEY_RECENT]);

  /**
   * Clear recent searches
   */
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEY_RECENT);
  }, [STORAGE_KEY_RECENT]);

  /**
   * Build a human-readable description of filters
   */
  const getFilterDescription = useCallback((filters: ProductFilters): string => {
    const parts: string[] = [];

    if (filters.family && filters.family.length > 0) {
      parts.push(`Categorie: ${filters.family.join(', ')}`);
    }

    if (filters.grade && filters.grade.length > 0) {
      parts.push(`Grad: ${filters.grade.join(', ')}`);
    }

    if (filters.standard && filters.standard.length > 0) {
      parts.push(`Standard: ${filters.standard.join(', ')}`);
    }

    if (filters.availability && filters.availability.length > 0) {
      parts.push(`Disponibilitate: ${filters.availability.join(', ')}`);
    }

    if (filters.producer && filters.producer.length > 0) {
      parts.push(`Producător: ${filters.producer.join(', ')}`);
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const priceRange = [];
      if (filters.minPrice !== undefined) priceRange.push(`min ${filters.minPrice} RON`);
      if (filters.maxPrice !== undefined) priceRange.push(`max ${filters.maxPrice} RON`);
      parts.push(`Preț: ${priceRange.join(' - ')}`);
    }

    if (filters.minDimension || filters.maxDimension) {
      const dimensions: string[] = [];
      const allDimensions = new Set([
        ...Object.keys(filters.minDimension || {}),
        ...Object.keys(filters.maxDimension || {})
      ]);

      allDimensions.forEach(dim => {
        const min = filters.minDimension?.[dim];
        const max = filters.maxDimension?.[dim];
        if (min !== undefined || max !== undefined) {
          const dimName = getDimensionName(dim);
          const unit = getDimensionUnit(dim);
          const range = [];
          if (min !== undefined) range.push(`min ${min}${unit}`);
          if (max !== undefined) range.push(`max ${max}${unit}`);
          dimensions.push(`${dimName}: ${range.join(' - ')}`);
        }
      });

      if (dimensions.length > 0) {
        parts.push(dimensions.join(', '));
      }
    }

    if (filters.search) {
      parts.push(`Căutare: "${filters.search}"`);
    }

    return parts.length > 0 ? parts.join(' | ') : 'Fără filtre';
  }, []);

  /**
   * Check if a search with the same filters already exists
   */
  const findSimilarSavedSearch = useCallback((filters: ProductFilters): SavedSearch | null => {
    return savedSearches.find(
      s => JSON.stringify(s.filters) === JSON.stringify(filters)
    ) || null;
  }, [savedSearches]);

  return {
    // State
    savedSearches,
    recentSearches,
    isLoading,

    // Saved search operations
    saveSearch,
    deleteSavedSearch,
    updateSavedSearch,
    markSearchAsUsed,
    findSimilarSavedSearch,

    // Recent searches operations
    addToRecentSearches,
    clearRecentSearches,

    // Utilities
    getFilterDescription,
  };
}
