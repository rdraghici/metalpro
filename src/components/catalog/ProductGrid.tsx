import { Skeleton } from "@/components/ui/card";
import ProductCard from "./ProductCard";
import type { Product } from "@/types";
import { Package } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
}

function ProductSkeleton() {
  return (
    <div className="border border-card-border rounded-lg p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-16 w-16 rounded-lg" />
      </div>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export default function ProductGrid({
  products,
  isLoading = false,
  emptyMessage = "Nu s-au găsit produse care să corespundă criteriilor tale.",
}: ProductGridProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
          <Package className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Niciun produs găsit</h3>
        <p className="text-muted-foreground max-w-md">{emptyMessage}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Încearcă să ajustezi filtrele sau să cauți alte cuvinte cheie.
        </p>
      </div>
    );
  }

  // Product grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
      {products.map((product, index) => (
        <div
          key={product.id}
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
