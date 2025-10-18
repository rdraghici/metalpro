import { ShoppingCart, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/search/SearchBar";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      {/* Contact Ribbon */}
      <div className="gradient-hero text-white py-2">
        <div className="container mx-auto px-4 flex items-center justify-center gap-4 text-sm">
          <Phone className="h-4 w-4" />
          <span>Contactează echipa de vânzări: +40 xxx xxx xxx (L-V 08:00-16:30)</span>
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
            <Button variant="outline" size="lg" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline ml-2">Estimare</span>
              <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground min-w-[20px] h-5 flex items-center justify-center p-0 text-xs">
                0
              </Badge>
            </Button>
            <Button variant="hero" size="lg">
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