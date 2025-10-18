import { Package, FolderOpen, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { SearchResults as SearchResultsType } from "@/types";

interface SearchResultsProps {
  results: SearchResultsType;
  query: string;
  isLoading: boolean;
  onProductClick: (slug: string) => void;
  onCategoryClick: (slug: string) => void;
  onClose: () => void;
}

export default function SearchResults({
  results,
  query,
  isLoading,
  onProductClick,
  onCategoryClick,
  onClose,
}: SearchResultsProps) {
  const hasCategories = results.categories.length > 0;
  const hasProducts = results.products.length > 0;
  const hasResults = hasCategories || hasProducts;

  if (isLoading) {
    return (
      <Card className="absolute top-full left-0 right-0 mt-2 p-4 shadow-lg z-50">
        <div className="text-center text-sm text-muted-foreground">
          Se caută...
        </div>
      </Card>
    );
  }

  if (!hasResults) {
    return (
      <Card className="absolute top-full left-0 right-0 mt-2 p-4 shadow-lg z-50">
        <div className="text-center text-sm text-muted-foreground">
          Nu am găsit rezultate pentru &quot;{query}&quot;
        </div>
      </Card>
    );
  }

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 shadow-lg z-50 max-h-[500px] overflow-y-auto">
      {/* Categories Section */}
      {hasCategories && (
        <div className="border-b">
          <div className="px-4 py-2 bg-muted/50">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Categorii
            </h3>
          </div>
          <div className="divide-y">
            {results.categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onCategoryClick(category.slug);
                  onClose();
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-accent transition-colors text-left"
              >
                <FolderOpen className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{category.name}</div>
                  {category.description && (
                    <div className="text-xs text-muted-foreground truncate">
                      {category.description}
                    </div>
                  )}
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Section */}
      {hasProducts && (
        <div>
          <div className="px-4 py-2 bg-muted/50">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Produse ({results.products.length})
            </h3>
          </div>
          <div className="divide-y">
            {results.products.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  onProductClick(product.slug);
                  onClose();
                }}
                className="w-full px-4 py-3 flex items-start gap-3 hover:bg-accent transition-colors text-left"
              >
                <Package className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm mb-1">{product.title}</div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{product.sku}</span>
                    <span>•</span>
                    <span>{product.grade}</span>
                    {product.standards.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{product.standards[0]}</span>
                      </>
                    )}
                  </div>
                  {product.indicativePrice.min && (
                    <div className="text-xs text-primary font-semibold mt-1">
                      de la {product.indicativePrice.min.toFixed(2)} RON/{product.priceUnit}
                    </div>
                  )}
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
