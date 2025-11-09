import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { requestPasswordReset } from '@/lib/api/auth';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await requestPasswordReset(email);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la trimiterea email-ului');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-muted/30 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <CardTitle className="text-2xl">Email Trimis!</CardTitle>
                </div>
                <CardDescription>
                  Dacă există un cont cu adresa {email}, vei primi un email cu instrucțiuni pentru
                  resetarea parolei.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Verifică inbox-ul (și folderul spam) pentru email-ul de resetare. Link-ul este
                    valabil 24 de ore.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Button onClick={() => navigate('/login')} className="w-full">
                    Înapoi la Autentificare
                  </Button>

                  <Button variant="outline" onClick={() => setIsSuccess(false)} className="w-full">
                    Retrimite Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-6">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => navigate('/login')} className="gap-2 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Înapoi la autentificare
          </Button>

          {/* Forgot Password Card */}
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <KeyRound className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Resetare Parolă</CardTitle>
              </div>
              <CardDescription>
                Introdu adresa de email asociată contului tău și îți vom trimite instrucțiuni
                pentru resetarea parolei.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemplu@companie.ro"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    autoFocus
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Se trimite...' : 'Trimite Email de Resetare'}
                </Button>
              </form>

              {/* Login Link */}
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Ți-ai amintit parola?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Autentifică-te
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
