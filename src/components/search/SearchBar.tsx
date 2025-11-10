import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/useSearch";
import { useAnalytics } from "@/hooks/useAnalytics";
import SearchResults from "./SearchResults";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onClose?: () => void;
}

export default function SearchBar({
  placeholder = "Caută produse, grade, standarde...",
  className = "",
  onClose
}: SearchBarProps) {
  const navigate = useNavigate();
  const analytics = useAnalytics();
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { query, setQuery, results, isLoading, clearSearch } = useSearch({
    debounceMs: 300,
    minQueryLength: 2,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
      onClose?.();
    } else if (e.key === "Enter" && query.trim()) {
      // Track search
      const totalResults = results.products.length + results.categories.length;
      analytics.trackSearch(query, totalResults);

      // Navigate to catalog with search query
      navigate(`/catalog?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
      onClose?.();
    }
  };

  const handleClear = () => {
    clearSearch();
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleProductClick = (slug: string) => {
    navigate(`/product/${slug}`);
    setIsOpen(false);
    onClose?.();
  };

  const handleCategoryClick = (slug: string) => {
    navigate(`/catalog/${slug}`);
    setIsOpen(false);
    onClose?.();
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (value.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const showResults = isOpen && query.length >= 2 && (results.products.length > 0 || results.categories.length > 0 || !isLoading);

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        )}
        {!isLoading && query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showResults && (
        <SearchResults
          results={results}
          query={query}
          isLoading={isLoading}
          onProductClick={handleProductClick}
          onCategoryClick={handleCategoryClick}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
