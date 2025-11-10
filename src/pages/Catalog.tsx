import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/catalog/ProductGrid";
import FacetedFilters from "@/components/catalog/FacetedFilters";
import AdvancedSearchModal from "@/components/search/AdvancedSearchModal";
import FilterChips from "@/components/catalog/FilterChips";
import Pagination from "@/components/catalog/Pagination";
import Breadcrumbs from "@/components/catalog/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getProductsWithFilters, getAvailableFamilies, getAvailableGrades, getAvailableStandards } from "@/lib/api/products";
import {
  applyFilters,
  buildFilterOptionsWithCounts,
  searchParamsToFilters,
  filtersToSearchParams,
  type FilterOptions
} from "@/lib/utils/filterUtils";
import type { Product, ProductFilters, ProductSort } from "@/types";
import { getAllProducts } from "@/lib/api/products";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const analytics = useAnalytics();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [dynamicFilterOptions, setDynamicFilterOptions] = useState<FilterOptions>({
    families: [],
    grades: [],
    standards: [],
    availabilities: [],
    producers: [],
    priceRange: { min: 0, max: 0 },
    dimensionRanges: {},
  });

  // Get current filters from URL
  const currentFilters = searchParamsToFilters(searchParams);

  // Track catalog view on mount
  useEffect(() => {
    analytics.trackCatalogView(currentFilters.family);
  }, []); // Only once on mount

  // Handle filter changes
  const handleFiltersChange = (newFilters: ProductFilters) => {
    const params = filtersToSearchParams(newFilters);
    params.set("page", "1"); // Reset to first page on filter change
    setSearchParams(params);

    // Track filter application
    analytics.trackFilterApply({
      family: newFilters.family,
      grade: newFilters.grade,
      standard: newFilters.standard,
      availability: newFilters.availability,
      priceRange: newFilters.priceRange,
    });
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "default") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  // Fetch ALL products once on mount for filter options
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const products = await getAllProducts();
        setAllProducts(products);
      } catch (error) {
        console.error("Error fetching all products:", error);
      }
    };

    fetchAllProducts();
  }, []);

  // Fetch filtered products and build filter options
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "12");
        const sortParam = searchParams.get("sort");

        let sort: ProductSort | undefined = undefined;
        if (sortParam) {
          const [field, order] = sortParam.split("-");
          sort = {
            field: field as ProductSort["field"],
            order: (order as ProductSort["order"]) || "asc",
          };
        }

        setCurrentPage(page);
        setItemsPerPage(limit);

        const response = await getProductsWithFilters(currentFilters, sort, page, limit);
        setProducts(response.products);
        setTotal(response.total);

        // Build dynamic filter options from ALL products with accurate counts
        if (allProducts.length > 0) {
          const filterOpts = buildFilterOptionsWithCounts(allProducts, currentFilters);
          setDynamicFilterOptions(filterOpts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, allProducts]);

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-hero text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Catalog Produse</h1>
            <p className="text-lg text-white/90 max-w-2xl">
              Explorează gama completă de materiale metalice disponibile.
              Filtrează după categorie, grad, dimensiuni și disponibilitate.
            </p>
          </div>
        </section>

        {/* Catalog Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Breadcrumbs */}
            <div className="mb-6">
              <Breadcrumbs />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar - Filters */}
              <aside className="lg:col-span-1">
                <FacetedFilters
                  filters={currentFilters}
                  filterOptions={dynamicFilterOptions}
                  onFiltersChange={handleFiltersChange}
                  resultCount={total}
                />
              </aside>

              {/* Main Content - Products */}
              <div className="lg:col-span-3">
                {/* Filter Chips */}
                <div className="mb-6">
                  <FilterChips />
                </div>

                {/* Results header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="text-lg">
                      <span className="font-semibold">{total}</span> produse găsite
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAdvancedSearch(true)}
                      className="gap-2"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Căutare Avansată
                    </Button>
                  </div>

                  {/* Sort dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">Sortează după:</span>
                    <Select
                      value={searchParams.get("sort") || "default"}
                      onValueChange={handleSortChange}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Implicit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Implicit</SelectItem>
                        <SelectItem value="title-asc">Nume (A-Z)</SelectItem>
                        <SelectItem value="title-desc">Nume (Z-A)</SelectItem>
                        <SelectItem value="price-asc">Preț (Crescător)</SelectItem>
                        <SelectItem value="price-desc">Preț (Descrescător)</SelectItem>
                        <SelectItem value="availability-asc">Disponibilitate</SelectItem>
                        <SelectItem value="createdAt-desc">Cele mai noi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Product Grid */}
                <ProductGrid products={products} isLoading={isLoading} />

                {/* Pagination */}
                {!isLoading && total > 0 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={total}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Advanced Search Modal */}
      <AdvancedSearchModal
        open={showAdvancedSearch}
        onOpenChange={setShowAdvancedSearch}
        currentFilters={currentFilters}
        onApplyFilters={handleFiltersChange}
        familyOptions={dynamicFilterOptions.families.map(f => f.value)}
        gradeOptions={dynamicFilterOptions.grades.map(g => g.value)}
        standardOptions={dynamicFilterOptions.standards.map(s => s.value)}
      />
    </div>
  );
}
