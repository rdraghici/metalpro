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
import { useAnalytics } from '@/hooks/useAnalytics';
import { useTranslation } from '@/hooks/useTranslation';

// Login page component
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const analytics = useAnalytics();
  const { t } = useTranslation();

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

      // Track successful login
      analytics.trackLogin('business');

      toast({
        title: t('auth.login_success'),
        description: t('auth.welcome_back'),
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.login_error'));
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
            {t('auth.back_to_catalog')}
          </Button>

          {/* Login Card */}
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <LogIn className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">{t('auth.login_title')}</CardTitle>
              </div>
              <CardDescription>
                {t('auth.login_description')}
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
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.email_placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {t('auth.forgot_password')}
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('auth.password_placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t('auth.logging_in') : t('auth.login_button')}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">{t('auth.or')}</span>
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
                {t('auth.guest_continue')}
              </Button>

              {/* Signup Link */}
              <div className="mt-4 text-center text-sm text-muted-foreground">
                {t('auth.no_account')}{' '}
                <Link to="/signup" className="text-primary hover:underline">
                  {t('auth.create_new_account')}
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Value Proposition */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">{t('auth.benefits_title')}</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ {t('auth.benefit_save_bom')}</li>
                <li>✓ {t('auth.benefit_order_history')}</li>
                <li>✓ {t('auth.benefit_autofill')}</li>
                <li>✓ {t('auth.benefit_saved_addresses')}</li>
                <li>✓ {t('auth.benefit_verification')}</li>
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
