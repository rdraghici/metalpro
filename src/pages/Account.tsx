import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Building2, Package, History, MapPin, LogOut } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ProfileTab from '@/components/account/ProfileTab';
import CompanyInfoTab from '@/components/account/CompanyInfoTab';
import AddressesTab from '@/components/account/AddressesTab';
import SavedProjectsTab from '@/components/account/SavedProjectsTab';
import OrderHistoryTab from '@/components/account/OrderHistoryTab';

const Account = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  // Get tab from URL query parameter (e.g., ?tab=projects)
  const activeTab = searchParams.get('tab') || 'profile';

  // Handle tab change
  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Deconectat cu succes',
        description: 'La revedere!',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut efectua deconectarea',
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return null; // ProtectedRoute should handle this
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold">Contul Meu</h1>
                <p className="text-muted-foreground mt-1">
                  Bine ai revenit, {user.name}!
                </p>
              </div>
              <div className="flex items-center gap-3">
                {user.emailVerified ? (
                  <Badge variant="default" className="hidden sm:flex">Email Verificat</Badge>
                ) : (
                  <Badge variant="secondary" className="hidden sm:flex">Email Neverificat</Badge>
                )}
                <Button variant="outline" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Deconectare</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
              <TabsTrigger value="profile" className="gap-2 py-3">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profil</span>
              </TabsTrigger>

              {user.role === 'business' && (
                <TabsTrigger value="company" className="gap-2 py-3">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Companie</span>
                </TabsTrigger>
              )}

              <TabsTrigger value="addresses" className="gap-2 py-3">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Adrese</span>
              </TabsTrigger>

              <TabsTrigger value="projects" className="gap-2 py-3">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Proiecte</span>
              </TabsTrigger>

              <TabsTrigger value="orders" className="gap-2 py-3">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">Comenzi</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <ProfileTab />
            </TabsContent>

            {/* Company Info Tab - Only for business users */}
            {user.role === 'business' && (
              <TabsContent value="company">
                <CompanyInfoTab />
              </TabsContent>
            )}

            {/* Saved Addresses Tab */}
            <TabsContent value="addresses">
              <AddressesTab />
            </TabsContent>

            {/* Saved Projects Tab */}
            <TabsContent value="projects">
              <SavedProjectsTab />
            </TabsContent>

            {/* Order History Tab */}
            <TabsContent value="orders">
              <OrderHistoryTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;
