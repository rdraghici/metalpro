import { ShoppingCart, Phone, User, LogOut, Package, History } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchBar from "@/components/search/SearchBar";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const analytics = useAnalytics();
  const { itemCount, toggleDrawer } = useCart();
  const { user, isGuest, logout } = useAuth();

  const handleRequestQuote = () => {
    if (itemCount === 0) {
      toast({
        title: "Coșul este gol",
        description: "Adaugă produse în coș pentru a cere o ofertă.",
        variant: "destructive",
      });
      return;
    }
    navigate('/rfq');
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Deconectat cu succes",
        description: "La revedere!",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut efectua deconectarea",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      {/* Contact Ribbon */}
      <div className="gradient-hero text-white py-2">
        <div className="container mx-auto px-4 flex items-center justify-center gap-4 text-sm">
          <Phone className="h-4 w-4" />
          <span>Contactează echipa de vânzări:{" "}
            <a
              href="tel:+40xxxxxxxxx"
              className="hover:underline font-medium"
              onClick={() => analytics.trackContactClick('phone')}
            >
              +40 xxx xxx xxx
            </a>
            {" "}(L-V 08:00-16:30)
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MetalPro</h1>
              <p className="text-xs text-muted-foreground">Materiale metalice B2B</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <SearchBar placeholder="Caută profile, table, țevi... (ex: HEA 200, S235JR)" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Shopping Cart */}
            <Button
              variant="outline"
              size="lg"
              className="relative"
              onClick={toggleDrawer}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline ml-2">Estimare</span>
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground min-w-[20px] h-5 flex items-center justify-center p-0 text-xs">
                  {itemCount}
                </Badge>
              )}
            </Button>

            {/* Auth UI - Dynamic based on guest/logged-in state */}
            {isGuest ? (
              // Guest User - Show "Cont" button
              <Button variant="outline" size="lg" asChild>
                <Link to="/login">
                  <User className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Cont</span>
                </Link>
              </Button>
            ) : (
              // Logged-in User - Show dropdown menu
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="lg" className="gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {user?.company?.name?.charAt(0) || user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden sm:inline">{user?.name?.split(' ')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user?.name}</span>
                      <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Contul Meu
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account?tab=projects" className="cursor-pointer">
                      <Package className="h-4 w-4 mr-2" />
                      Proiecte Salvate
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account?tab=orders" className="cursor-pointer">
                      <History className="h-4 w-4 mr-2" />
                      Istoric Comenzi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Deconectare
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Request Quote Button */}
            <Button variant="hero" size="lg" onClick={handleRequestQuote}>
              Cere Ofertă
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-8">
            <Button variant="ghost" className="text-base font-medium" asChild>
              <Link to="/catalog/profiles">Profile Metalice</Link>
            </Button>
            <Button variant="ghost" className="text-base font-medium" asChild>
              <Link to="/catalog/plates">Table de Oțel</Link>
            </Button>
            <Button variant="ghost" className="text-base font-medium" asChild>
              <Link to="/catalog/pipes">Țevi și Tuburi</Link>
            </Button>
            <Button variant="ghost" className="text-base font-medium" asChild>
              <Link to="/catalog/fasteners">Elemente de Asamblare</Link>
            </Button>
            <Button variant="ghost" className="text-base font-medium" asChild>
              <Link to="/catalog/stainless">Oțel Inoxidabil</Link>
            </Button>
            <Button variant="ghost" className="text-base font-medium" asChild>
              <Link to="/catalog/nonferrous">Metale Neferoase</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;