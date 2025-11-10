import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/useAnalytics";

const Footer = () => {
  const analytics = useAnalytics();
  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">MetalPro</h1>
                <p className="text-xs text-muted-foreground">Materiale metalice B2B</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Furnizor de materiale metalice pentru industrie cu peste 15 ani de experiență. 
              Calitate garantată și livrare rapidă în toată țara.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Categorii Principale</h3>
            <div className="space-y-2">
              <Button variant="link" className="p-0 h-auto justify-start text-muted-foreground hover:text-foreground">
                Profile Metalice
              </Button>
              <Button variant="link" className="p-0 h-auto justify-start text-muted-foreground hover:text-foreground">
                Table de Oțel
              </Button>
              <Button variant="link" className="p-0 h-auto justify-start text-muted-foreground hover:text-foreground">
                Țevi și Tuburi
              </Button>
              <Button variant="link" className="p-0 h-auto justify-start text-muted-foreground hover:text-foreground">
                Elemente Asamblare
              </Button>
              <Button variant="link" className="p-0 h-auto justify-start text-muted-foreground hover:text-foreground">
                Oțel Inoxidabil
              </Button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Servicii</h3>
            <div className="space-y-2">
              <Button variant="link" className="p-0 h-auto justify-start text-muted-foreground hover:text-foreground">
                Debitare la dimensiune
              </Button>
              <Button variant="link" className="p-0 h-auto justify-start text-muted-foreground hover:text-foreground">
                Transport specializat
              </Button>
              <Button variant="link" className="p-0 h-auto justify-start text-muted-foreground hover:text-foreground">
                Consultanță tehnică
              </Button>
              <Button variant="link" className="p-0 h-auto justify-start text-muted-foreground hover:text-foreground">
                Certificare materiale
              </Button>
              <Button variant="link" className="p-0 h-auto justify-start text-muted-foreground hover:text-foreground">
                Support proiecte
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <a
                  href="tel:+40xxxxxxxxx"
                  className="hover:text-primary transition-colors"
                  onClick={() => analytics.trackContactClick('phone')}
                >
                  +40 xxx xxx xxx
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <a
                  href="mailto:vanzari@metalpro.ro"
                  className="hover:text-primary transition-colors"
                  onClick={() => analytics.trackContactClick('email')}
                >
                  vanzari@metalpro.ro
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Str. Industrială Nr. 123<br />București, România</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span>L-V: 08:00-16:30<br />S: 08:00-12:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 MetalPro. Toate drepturile rezervate.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                Termeni și condiții
              </Button>
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                Politica de confidențialitate
              </Button>
              <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground">
                GDPR
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;