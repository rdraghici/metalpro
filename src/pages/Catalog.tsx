import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/catalog/ProductGrid";
import FilterPanel from "@/components/catalog/FilterPanel";
import FilterChips from "@/components/catalog/FilterChips";
import Pagination from "@/components/catalog/Pagination";
import { getProductsWithFilters, getAvailableFamilies, getAvailableGrades, getAvailableStandards } from "@/lib/api/products";
import type { Product, ProductFilters, ProductSort } from "@/types";
import type { FilterOptions } from "@/components/catalog/FilterPanel";

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    families: [],
    grades: [],
    standards: [],
    availabilities: [
      { value: "in_stock", label: "În Stoc" },
      { value: "on_order", label: "La Comandă" },
      { value: "backorder", label: "Indisponibil" },
    ],
  });

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [families, grades, standards] = await Promise.all([
          getAvailableFamilies(),
          getAvailableGrades(),
          getAvailableStandards(),
        ]);

        setFilterOptions({
          families,
          grades,
          standards,
          availabilities: [
            { value: "in_stock", label: "În Stoc" },
            { value: "on_order", label: "La Comandă" },
            { value: "backorder", label: "Indisponibil" },
          ],
        });
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  // Parse filters from URL
  const parseFiltersFromURL = (): ProductFilters => {
    const filters: ProductFilters = {};

    const family = searchParams.get("family");
    if (family) {
      filters.family = family.split(",") as any[];
    }

    const grade = searchParams.get("grade");
    if (grade) {
      filters.grade = grade.split(",");
    }

    const standard = searchParams.get("standard");
    if (standard) {
      filters.standard = standard.split(",");
    }

    const availability = searchParams.get("availability");
    if (availability) {
      filters.availability = availability.split(",") as any[];
    }

    const search = searchParams.get("search");
    if (search) {
      filters.search = search;
    }

    return filters;
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const filters = parseFiltersFromURL();
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "12");

        setCurrentPage(page);
        setItemsPerPage(limit);

        const response = await getProductsWithFilters(filters, undefined, page, limit);
        setProducts(response.products);
        setTotal(response.total);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar - Filters */}
              <aside className="lg:col-span-1">
                <FilterPanel options={filterOptions} />
              </aside>

              {/* Main Content - Products */}
              <div className="lg:col-span-3">
                {/* Filter Chips */}
                <div className="mb-6">
                  <FilterChips />
                </div>

                {/* Results header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-lg">
                    <span className="font-semibold">{total}</span> produse găsite
                  </div>
                  {/* Sort controls will go here in future */}
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
    </div>
  );
}
