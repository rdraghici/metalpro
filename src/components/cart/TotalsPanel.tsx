import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertCircle, Package } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import type { CartTotals } from '@/types/cart';

interface TotalsPanelProps {
  totals: CartTotals;
  currency: 'RON' | 'EUR';
  disclaimerAccepted: boolean;
  onDisclaimerChange?: (accepted: boolean) => void;
  showDisclaimer?: boolean;
}

const TotalsPanel: React.FC<TotalsPanelProps> = ({
  totals,
  currency,
  disclaimerAccepted,
  onDisclaimerChange,
  showDisclaimer = true,
}) => {
  const { t } = useTranslation();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Package className="h-5 w-5" />
          {t('cart.totals_title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weight */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('cart.total_estimated_weight')}</span>
          <span className="font-medium">{formatCurrency(totals.estWeightKg)} kg</span>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('cart.subtotal_products')}</span>
            <span className="font-medium">
              {formatCurrency(totals.estSubtotal)} {currency}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {t('cart.vat_percent').replace('{{percent}}', ((totals.vatRate || 0.19) * 100).toFixed(0))}
            </span>
            <span className="font-medium">
              {formatCurrency(totals.vatIndicative || 0)} {currency}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('cart.estimated_delivery')}</span>
            <span className="font-medium text-xs">{totals.deliveryFeeBand}</span>
          </div>
        </div>

        <Separator />

        {/* Grand Total */}
        <div className="flex justify-between text-lg font-bold">
          <span>{t('cart.estimated_total_label')}</span>
          <span className="text-primary">
            {formatCurrency(totals.grandTotal || 0)} {currency}
          </span>
        </div>

        {/* Disclaimer */}
        {showDisclaimer && (
          <>
            <Separator />
            <Alert variant="default" className="bg-orange-50 border-orange-200">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-sm text-orange-800">
                <strong>{t('cart.important_note')}</strong> {t('cart.prices_estimated')}{' '}
                <strong>{t('cart.strictly_estimated')}</strong>{t('cart.final_quote_notice')}
              </AlertDescription>
            </Alert>

            {onDisclaimerChange && (
              <div className="flex items-start space-x-3 pt-2">
                <Checkbox
                  id="disclaimer"
                  checked={disclaimerAccepted}
                  onCheckedChange={(checked) => onDisclaimerChange(checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="disclaimer"
                    className="text-sm font-medium leading-snug cursor-pointer"
                  >
                    {t('cart.understand_estimates')}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t('cart.final_prices_notice')}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TotalsPanel;
