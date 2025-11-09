import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Building2, User, ArrowLeft, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { SignupData } from '@/types/user';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { toast } = useToast();

  const [accountType, setAccountType] = useState<'business' | 'individual'>('business');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Company fields
  const [companyName, setCompanyName] = useState('');
  const [cui, setCui] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Parolele nu coincid');
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Parola trebuie să aibă minim 8 caractere');
      return;
    }

    setIsLoading(true);

    try {
      const signupData: SignupData = {
        email,
        password,
        name,
        phone: phone || undefined,
        role: accountType,
      };

      // Add company data if business account
      if (accountType === 'business' && companyName && address && city && county) {
        signupData.company = {
          name: companyName,
          cui: cui || '',
          address,
          city,
          county,
          postalCode: postalCode || undefined,
          country: 'România',
        };
      }

      await signup(signupData);

      toast({
        title: 'Cont creat cu succes!',
        description: 'Bine ai venit la MetalPro.',
      });

      navigate('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la crearea contului');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30 py-12 px-4">
        <div className="container mx-auto max-w-2xl space-y-6">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Înapoi la catalog
          </Button>

          {/* Signup Card */}
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <UserPlus className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Creare Cont</CardTitle>
              </div>
              <CardDescription>
                Creează un cont pentru a salva proiecte și a urmări comenzile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Account Type */}
                <div className="space-y-3">
                  <Label>Tip Cont</Label>
                  <RadioGroup value={accountType} onValueChange={(v) => setAccountType(v as any)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="business" id="business" />
                      <Label htmlFor="business" className="font-normal cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Cont Business (recomandat pentru firme)
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual" className="font-normal cursor-pointer">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Cont Individual
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Date Personale</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Nume Complet <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="Ion Popescu"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+40 123 456 789"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-destructive">*</span>
                    </Label>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">
                        Parolă <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Minim 8 caractere"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirmă Parola <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Repetă parola"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                </div>

                {/* Company Info (only for business accounts) */}
                {accountType === 'business' && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold">Date Companie (Opțional)</h3>
                    <p className="text-sm text-muted-foreground">
                      Completează aceste date pentru pre-completare automată în formularele de
                      ofertă
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Nume Companie</Label>
                        <Input
                          id="companyName"
                          placeholder="SC Exemplu SRL"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cui">CUI</Label>
                        <Input
                          id="cui"
                          placeholder="RO12345678"
                          value={cui}
                          onChange={(e) => setCui(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Adresă</Label>
                      <Input
                        id="address"
                        placeholder="Strada Exemplu nr. 123"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Oraș</Label>
                        <Input
                          id="city"
                          placeholder="București"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="county">Județ</Label>
                        <Input
                          id="county"
                          placeholder="București"
                          value={county}
                          onChange={(e) => setCounty(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Cod Poștal</Label>
                        <Input
                          id="postalCode"
                          placeholder="012345"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isLoading ? 'Se creează contul...' : 'Creează Cont'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleSkip}
                    disabled={isLoading}
                  >
                    Sari peste (continuă fără cont)
                  </Button>
                </div>

                {/* Login Link */}
                <div className="text-center text-sm text-muted-foreground">
                  Ai deja cont?{' '}
                  <Link to="/login" className="text-primary hover:underline">
                    Autentifică-te
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Signup;
