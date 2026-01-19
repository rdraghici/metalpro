import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, FileText, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useTranslation } from '@/hooks/useTranslation';
import CartLineItem from './CartLineItem';
import TotalsPanel from './TotalsPanel';

const EstimateCartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cart, itemCount, isDrawerOpen, closeDrawer, acceptDisclaimer } = useCart();

  const handleViewFullCart = () => {
    closeDrawer();
    navigate('/cart');
  };

  const handleRequestQuote = () => {
    closeDrawer();
    navigate('/rfq');
  };

  return (
    <Sheet open={isDrawerOpen} onOpenChange={closeDrawer}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full p-0">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="h-5 w-5" />
            {t('cart.drawer_title')}
          </SheetTitle>
          <SheetDescription>
            {itemCount === 0
              ? t('cart.empty')
              : `${itemCount} ${itemCount === 1 ? t('cart.products_in_cart') : t('cart.products_in_cart_plural')}`}
          </SheetDescription>
        </SheetHeader>

        {/* Cart Items */}
        {itemCount === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">{t('cart.empty')}</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t('cart.empty_action')}
            </p>
            <Button onClick={closeDrawer}>{t('cart.explore_catalog')}</Button>
          </div>
        ) : (
          <>
            {/* Scrollable Items List */}
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-4">
                {cart.lines.map((line) => (
                  <CartLineItem key={line.id} line={line} editable={true} />
                ))}
              </div>
            </ScrollArea>

            {/* Footer with Totals & Actions */}
            <div className="border-t px-6 py-4 space-y-4">
              <TotalsPanel
                totals={cart.totals}
                currency={cart.currency}
                disclaimerAccepted={cart.disclaimerAccepted}
                onDisclaimerChange={acceptDisclaimer}
                showDisclaimer={true}
              />

              <Separator />

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleRequestQuote}
                  disabled={!cart.disclaimerAccepted}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  {t('cart.request_final_quote')}
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>

                <Button variant="outline" className="w-full" onClick={handleViewFullCart}>
                  {t('cart.view_full_cart')}
                </Button>

                {!cart.disclaimerAccepted && (
                  <p className="text-xs text-center text-destructive">
                    {t('cart.accept_terms_to_request')}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default EstimateCartDrawer;
