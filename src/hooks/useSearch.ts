import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "@/lib/api/products";
import type { SearchResults } from "@/types";

export interface UseSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  enabled?: boolean;
}

export const useSearch = (options: UseSearchOptions = {}) => {
  const { debounceMs = 300, minQueryLength = 2, enabled = true } = options;

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Only search if query meets minimum length
  const shouldSearch = enabled && debouncedQuery.length >= minQueryLength;

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchProducts(debouncedQuery),
    enabled: shouldSearch,
    staleTime: 1000 * 60, // 1 minute
  });

  const clearSearch = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
  }, []);

  return {
    query,
    setQuery,
    results: data || { products: [], categories: [], suggestions: [] },
    isLoading: shouldSearch && isLoading,
    error,
    clearSearch,
  };
};
