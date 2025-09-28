import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative py-20 gradient-hero text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-display mb-6 animate-fade-in">
            Materiale Metalice pentru
            <br />
            <span className="gradient-accent bg-clip-text text-transparent">Proiecte B2B</span>
          </h1>

          {/* Subtitle */}
          <p className="text-body-large mb-8 text-white/90 max-w-2xl mx-auto animate-fade-in">
            Obține estimări rapide pentru profile, table, țevi și elemente de asamblare. 
            Configurează specificațiile și primește o ofertă personalizată de la echipa noastră de specialiști.
          </p>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 mb-8 text-sm animate-slide-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              <span>Estimare în timp real</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              <span>Support specialist</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              <span>Livrare rapidă</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 animate-scale-in">
            <Button variant="accent" size="xl" className="group">
              Vezi Catalogul
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="xl" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Încarcă Lista BOM
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">500+</div>
              <div className="text-white/80">Produse disponibile</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">24h</div>
              <div className="text-white/80">Timp răspuns ofertă</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">1000+</div>
              <div className="text-white/80">Proiecte realizate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;