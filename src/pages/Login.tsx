import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, User, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Get redirect path from location state (or default to /account)
  const from = (location.state as any)?.from?.pathname || '/account';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      toast({
        title: 'Autentificare reușită',
        description: 'Bine ai revenit!',
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la autentificare');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-6">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Înapoi la catalog
          </Button>

          {/* Login Card */}
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <LogIn className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Autentificare</CardTitle>
              </div>
              <CardDescription>
                Conectează-te pentru a accesa proiectele salvate și istoricul comenzilor
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
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Parolă</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      Ai uitat parola?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Se autentifică...' : 'Autentifică-te'}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">sau</span>
                </div>
              </div>

              {/* Continue as Guest */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleContinueAsGuest}
              >
                <User className="h-4 w-4 mr-2" />
                Continuă fără cont
              </Button>

              {/* Signup Link */}
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Nu ai cont?{' '}
                <Link to="/signup" className="text-primary hover:underline">
                  Creează cont nou
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Value Proposition */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Beneficiile unui cont MetalPro:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Salvează proiecte BOM pentru reutilizare</li>
                <li>✓ Vezi istoricul comenzilor și statusul lor</li>
                <li>✓ Pre-completare automată cu datele companiei</li>
                <li>✓ Adrese de livrare salvate</li>
                <li>✓ Verificare business pentru procesare mai rapidă</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
