import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { PriceEstimate } from "@/hooks/useProductConfig";
import { useTranslation } from "@/hooks/useTranslation";

interface PriceEstimatorProps {
  priceEstimate: PriceEstimate;
  priceUnit: string;
}

export default function PriceEstimator({ priceEstimate, priceUnit }: PriceEstimatorProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <span className="text-sm text-muted-foreground">{t('product.estimated_unit_price')}</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold">
                  {priceEstimate.unitPrice.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">RON/{priceUnit}</span>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('product.subtotal')}</span>
                <span className="font-medium">{priceEstimate.subtotal.toFixed(2)} RON</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('product.vat_19')}</span>
                <span className="font-medium">{priceEstimate.vat.toFixed(2)} RON</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('product.estimated_shipping')}</span>
                <span className="font-medium">{priceEstimate.deliveryFeeBand}</span>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <span className="font-semibold">{t('product.estimated_total')}</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {priceEstimate.total.toFixed(2)} RON
                </div>
                <span className="text-xs text-muted-foreground">{t('product.excluding_shipping')}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>{t('product.important_note')}</strong> {t('product.price_disclaimer')}
        </AlertDescription>
      </Alert>
    </div>
  );
}
