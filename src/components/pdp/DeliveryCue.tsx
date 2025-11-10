import { Truck, Calendar, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

interface DeliveryCueProps {
  product: Product;
  totalWeight: number;
}

export default function DeliveryCue({ product, totalWeight }: DeliveryCueProps) {
  const { t, currentLanguage } = useTranslation();

  // Calculate delivery window based on availability
  const getDeliveryWindow = () => {
    if (product.availability === "in_stock") {
      return t('product.delivery_3_5_days');
    } else if (product.availability === "on_order") {
      return t('product.delivery_7_14_days');
    } else {
      return t('product.delivery_confirm');
    }
  };

  // Calculate estimated delivery date
  const getEstimatedDeliveryDate = () => {
    if (product.availability === "backorder") {
      return t('product.delivery_to_be_confirmed');
    }

    const today = new Date();
    const daysToAdd = product.availability === "in_stock" ? 5 : 14;
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + daysToAdd);

    const locale = currentLanguage === 'ro' ? 'ro-RO' : 'en-US';
    return deliveryDate.toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Check if special transport is needed
  const needsSpecialTransport = totalWeight > 1000;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Truck className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-sm mb-1">{t('product.delivery_time')}</div>
              <div className="text-sm text-muted-foreground">{getDeliveryWindow()}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-sm mb-1">{t('product.delivery_estimate')}</div>
              <div className="text-sm text-muted-foreground">
                {t('product.until')} {getEstimatedDeliveryDate()}
              </div>
            </div>
          </div>

          {needsSpecialTransport && (
            <div className="flex items-start gap-3 pt-3 border-t">
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-sm mb-1 text-orange-700">
                  {t('product.special_transport_needed')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('product.special_transport_description', { weight: totalWeight.toFixed(0) })}
                </div>
              </div>
            </div>
          )}

          <div className="pt-3 border-t">
            <div className="text-xs text-muted-foreground">
              {t('product.shipping_fee')}: {t('product.shipping_calculated')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
