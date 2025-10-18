import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/catalog/ProductGrid";
import FilterPanel from "@/components/catalog/FilterPanel";
import FilterChips from "@/components/catalog/FilterChips";
import Pagination from "@/components/catalog/Pagination";
import Breadcrumbs from "@/components/catalog/Breadcrumbs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getProductsWithFilters, getAvailableGrades, getAvailableStandards } from "@/lib/api/products";
import type { Product, ProductFilters, ProductSort, ProductFamily } from "@/types";
import type { FilterOptions } from "@/components/catalog/FilterPanel";

const familyInfo: Record<ProductFamily, { name: string; description: string }> = {
  profiles: {
    name: "Profile Metalice",
    description: "Profile metalice de înaltă calitate: HEA, UNP, IPE, UPN. Ideale pentru construcții industriale și civile.",
  },
  plates: {
    name: "Table de Oțel",
    description: "Table de oțel în diverse grade: DC01, S235JR, S355JR. Pentru aplicații industriale exigente.",
  },
  pipes: {
    name: "Țevi și Tuburi",
    description: "Țevi și tuburi rectangulare și rotunde. Potrivite pentru construcții și instalații.",
  },
  fasteners: {
    name: "Elemente de Asamblare",
    description: "Șuruburi, piulițe și alte elemente de fixare conform standardelor DIN și ISO.",
  },
  stainless: {
    name: "Oțel Inoxidabil",
    description: "Materiale din oțel inoxidabil 304, 316L, 321. Rezistente la coroziune pentru aplicații speciale.",
  },
  nonferrous: {
    name: "Metale Neferoase",
    description: "Aluminiu, cupru, bronz și alte metale neferoase pentru diverse aplicații industriale.",
  },
};

export default function CategoryPage() {
  const { family } = useParams<{ family: ProductFamily }>();
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

  const categoryInfo = family ? familyInfo[family] : null;

  // Fetch filter options for this category
  useEffect(() => {
    if (!family) return;

    const fetchFilterOptions = async () => {
      try {
        const [grades, standards] = await Promise.all([
          getAvailableGrades(family),
          getAvailableStandards(family),
        ]);

        setFilterOptions({
          families: [family],
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
  }, [family]);

  // Parse filters from URL
  const parseFiltersFromURL = (): ProductFilters => {
    const filters: ProductFilters = {};

    // Always filter by the current family
    if (family) {
      filters.family = [family];
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

  // Parse sort from URL
  const parseSortFromURL = (): ProductSort | undefined => {
    const sort = searchParams.get("sort");
    if (!sort) return undefined;

    const [field, order] = sort.split("-");
    return {
      field: field as ProductSort["field"],
      order: (order as ProductSort["order"]) || "asc",
    };
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
    window.location.search = params.toString();
  };

  // Fetch products
  useEffect(() => {
    if (!family) return;

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const filters = parseFiltersFromURL();
        const sort = parseSortFromURL();
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "12");

        setCurrentPage(page);
        setItemsPerPage(limit);

        const response = await getProductsWithFilters(filters, sort, page, limit);
        setProducts(response.products);
        setTotal(response.total);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [family, searchParams]);

  const totalPages = Math.ceil(total / itemsPerPage);

  if (!family || !categoryInfo) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Categorie invalidă</h1>
            <p className="text-muted-foreground">Categoria selectată nu există.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-hero text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">{categoryInfo.name}</h1>
            <p className="text-lg text-white/90 max-w-2xl">
              {categoryInfo.description}
            </p>
          </div>
        </section>

        {/* Category Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Breadcrumbs */}
            <div className="mb-6">
              <Breadcrumbs family={family} />
            </div>

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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="text-lg">
                    <span className="font-semibold">{total}</span> produse găsite
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
    </div>
  );
}
