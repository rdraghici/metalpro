import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Home, Mail, Phone, FileText, Clock } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const RFQConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  const referenceNumber = searchParams.get('ref');

  useEffect(() => {
    // Clear cart after successful RFQ submission
    if (referenceNumber) {
      clearCart();
    }
  }, [referenceNumber, clearCart]);

  // Redirect if no reference number
  if (!referenceNumber) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gradient-to-b from-green-50 to-muted/30">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3">Cererea a fost trimisă cu succes!</h1>
            <p className="text-lg text-muted-foreground">
              Mulțumim pentru cererea dumneavoastră. Echipa noastră va reveni cu o ofertă în cel mai
              scurt timp.
            </p>
          </div>

          {/* Reference Number Card */}
          <Card className="mb-8 border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <FileText className="h-5 w-5" />
                Număr de Referință
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg p-4 text-center border border-green-200">
                <p className="text-sm text-muted-foreground mb-1">Codul cererii dumneavoastră:</p>
                <p className="text-2xl font-bold font-mono text-green-700">{referenceNumber}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Vă rugăm să păstrați acest număr pentru referințe ulterioare
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Ce urmează?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Confirmare Email</h3>
                  <p className="text-sm text-muted-foreground">
                    Veți primi un email de confirmare în câteva minute cu detaliile cererii
                    dumneavoastră.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Procesare Cerere</h3>
                  <p className="text-sm text-muted-foreground">
                    Echipa noastră de vânzări va analiza cererea și va pregăti o ofertă personalizată.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Primire Ofertă</h3>
                  <p className="text-sm text-muted-foreground">
                    Veți primi oferta finală în <strong>maximum 24 ore lucrătoare</strong> prin email
                    sau telefon.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Negociere & Finalizare</h3>
                  <p className="text-sm text-muted-foreground">
                    Un specialist vă va contacta pentru a discuta detaliile și a finaliza comanda.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Aveți întrebări?</CardTitle>
              <CardDescription>
                Echipa noastră este disponibilă pentru a vă ajuta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Telefon</p>
                    <p className="text-sm text-muted-foreground">+40 xxx xxx xxx</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">sales@metalpro.ro</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-center">
                  <strong>Program:</strong> Luni - Vineri, 08:00 - 16:30
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/')} className="gap-2">
              <Home className="h-5 w-5" />
              Înapoi la Pagina Principală
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/catalog')}>
              Explorează Catalogul
            </Button>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Dacă nu primiți emailul de confirmare în 10 minute, vă rugăm să verificați folderul de
              spam sau să ne contactați direct.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RFQConfirmation;
