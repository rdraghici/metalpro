import { ArrowRight, Package, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();

  const availabilityConfig = {
    in_stock: {
      label: t('catalog.availability_in_stock'),
      variant: "default" as const,
      color: "bg-green-500/10 text-green-700 border-green-500/20",
    },
    on_order: {
      label: t('catalog.availability_on_order'),
      variant: "secondary" as const,
      color: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    },
    backorder: {
      label: t('catalog.availability_backorder'),
      variant: "outline" as const,
      color: "bg-gray-500/10 text-gray-700 border-gray-500/20",
    },
  };

  const availabilityInfo = availabilityConfig[product.availability];

  const formatPrice = (min?: number, max?: number, currency?: string, unit?: string) => {
    if (min === undefined && max === undefined) {
      return t('product.on_request');
    }

    const curr = currency || "RON";
    if (min !== undefined && max !== undefined) {
      return `${min}-${max} ${curr}/${unit}`;
    }
    if (min !== undefined) {
      return `${t('product.from')} ${min} ${curr}/${unit}`;
    }
    if (max !== undefined) {
      return `${t('product.up_to')} ${max} ${curr}/${unit}`;
    }
    return t('product.on_request');
  };

  const getDimensionSummary = () => {
    const dims = product.dimensions;
    if (!dims) return null;

    if ('height' in dims && 'width' in dims) {
      return `${dims.height}×${dims.width}mm`;
    }
    if ('diameter' in dims) {
      return `Ø${dims.diameter}mm`;
    }
    if ('thickness' in dims) {
      return `${dims.thickness}mm`;
    }
    return null;
  };

  return (
    <Link to={`/product/${product.slug}`} className="block group">
      <Card className="h-full hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border-card-border">
        <CardContent className="p-6">
          {/* Header with badges */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <Badge className={`${availabilityInfo.color} mb-2`}>
                {availabilityInfo.label}
              </Badge>
              {product.family && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {product.family}
                </Badge>
              )}
            </div>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-16 h-16 object-contain"
              />
            ) : (
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-title mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.title}
          </h3>

          {/* SKU */}
          <p className="text-xs text-muted-foreground mb-3">
            SKU: {product.sku}
          </p>

          {/* Specs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.grade && (
              <Badge variant="secondary" className="text-xs font-normal">
                {product.grade}
              </Badge>
            )}
            {getDimensionSummary() && (
              <Badge variant="outline" className="text-xs font-normal">
                {getDimensionSummary()}
              </Badge>
            )}
            {product.standards[0] && (
              <Badge variant="outline" className="text-xs font-normal">
                {product.standards[0]}
              </Badge>
            )}
          </div>

          {/* Price */}
          <div className="mb-4">
            <div className="text-lg font-semibold text-foreground">
              {formatPrice(
                product.indicativePrice.min,
                product.indicativePrice.max,
                product.indicativePrice.currency,
                product.indicativePrice.unit
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {t('product.indicative_price')} / {product.indicativePrice.unit}
            </div>
          </div>

          {/* Delivery estimate */}
          {product.deliveryEstimate?.windowDays && (
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>
                {t('product.delivery_in')} {product.deliveryEstimate.windowDays[0]}-
                {product.deliveryEstimate.windowDays[1]} {t('product.days')}
              </span>
            </div>
          )}

          {/* CTA Button */}
          <Button
            variant="outline"
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
            asChild
          >
            <span>
              {t('product.view_details')}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
