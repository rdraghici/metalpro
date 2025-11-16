import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingBag,
  ArrowLeft,
  FileText,
  ArrowRight,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartLineItem from '@/components/cart/CartLineItem';
import TotalsPanel from '@/components/cart/TotalsPanel';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const EstimateCart = () => {
  const navigate = useNavigate();
  const { cart, itemCount, clearCart, acceptDisclaimer } = useCart();

  const handleContinueShopping = () => {
    navigate('/catalog');
  };

  const handleRequestQuote = () => {
    if (!cart.disclaimerAccepted) {
      alert('Vă rugăm să acceptați că prețurile sunt estimative pentru a continua.');
      return;
    }
    navigate('/rfq');
  };

  const handleClearCart = () => {
    if (confirm('Sigur doriți să goliți coșul? Această acțiune nu poate fi anulată.')) {
      clearCart();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleContinueShopping}
              className="gap-2 -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Înapoi la Catalog
            </Button>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <ShoppingBag className="h-8 w-8 text-primary" />
                  Coș Estimare
                </h1>
                <p className="text-muted-foreground">
                  {itemCount === 0
                    ? 'Coșul tău este gol'
                    : `${itemCount} ${itemCount === 1 ? 'produs' : 'produse'} în coș`}
                </p>
              </div>

              {itemCount > 0 && (
                <Button variant="destructive" onClick={handleClearCart}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Golește Coșul
                </Button>
              )}
            </div>
          </div>

          {/* Empty State */}
          {itemCount === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <ShoppingBag className="h-24 w-24 text-muted-foreground mb-6" />
                <h2 className="text-2xl font-semibold mb-3">Coșul tău este gol</h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                  Adaugă produse din catalog pentru a crea o estimare de preț și a cere o ofertă
                  detaliată de la echipa noastră de vânzări.
                </p>
                <Button size="lg" onClick={handleContinueShopping}>
                  Explorează Catalogul
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items - Left Column (2/3) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Info Alert */}
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Informații importante</AlertTitle>
                  <AlertDescription>
                    Prețurile afișate sunt <strong>strict estimative</strong> și pot varia în
                    funcție de disponibilitatea materialelor și condițiile de livrare. Oferta
                    finală va fi confirmată de echipa noastră de vânzări.
                  </AlertDescription>
                </Alert>

                {/* Cart Items List */}
                <div className="space-y-4">
                  {cart.lines.map((line) => (
                    <CartLineItem key={line.id} line={line} editable={true} />
                  ))}
                </div>

                {/* Continue Shopping Button (Mobile) */}
                <div className="lg:hidden">
                  <Button variant="outline" className="w-full" onClick={handleContinueShopping}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continuă Cumpărăturile
                  </Button>
                </div>
              </div>

              {/* Totals & Actions - Right Column (1/3) */}
              <div className="lg:col-span-1 space-y-6">
                {/* Totals Panel */}
                <TotalsPanel
                  totals={cart.totals}
                  currency={cart.currency}
                  disclaimerAccepted={cart.disclaimerAccepted}
                  onDisclaimerChange={acceptDisclaimer}
                  showDisclaimer={true}
                />

                {/* Action Buttons */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleRequestQuote}
                      disabled={!cart.disclaimerAccepted}
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      Cere Ofertă Finală
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Button>

                    <Separator />

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleContinueShopping}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Continuă Cumpărăturile
                    </Button>

                    {!cart.disclaimerAccepted && (
                      <p className="text-xs text-center text-destructive">
                        Acceptați termenii pentru a continua
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Help Card */}
                <Card className="bg-muted/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2 text-sm">Ai nevoie de ajutor?</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Echipa noastră de vânzări este pregătită să te asiste cu orice întrebări.
                    </p>
                    <div className="space-y-1 text-xs">
                      <p>
                        <strong>Telefon:</strong> +40 xxx xxx xxx
                      </p>
                      <p>
                        <strong>Email:</strong> sales@metal-direct.ro
                      </p>
                      <p>
                        <strong>Program:</strong> L-V, 08:00-16:30
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EstimateCart;
