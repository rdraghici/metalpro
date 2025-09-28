import { Search, Settings, Calculator, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: Search,
    title: "1. Explorează & Filtrează",
    description: "Navighează prin categorii sau caută produse specifice folosind filtrele avansate pentru standard, grad, dimensiuni și disponibilitate.",
    color: "text-blue-500"
  },
  {
    icon: Settings,
    title: "2. Configurează Specificațiile",
    description: "Selectează dimensiunile, lungimile, finisajele și cantitățile exacte. Calculatorul nostru îți oferă greutatea și estimarea de preț în timp real.",
    color: "text-orange-500"
  },
  {
    icon: Calculator,
    title: "3. Verifică Estimarea",
    description: "Revizuiește coșul de estimare cu toate specificațiile, prețurile indicative, TVA și costurile de transport estimate.",
    color: "text-green-500"
  },
  {
    icon: FileText,
    title: "4. Trimite Cererea RFQ",
    description: "Completează datele companiei și trimite cererea de ofertă. Echipa noastră te va contacta în 24h cu oferta finală personalizată.",
    color: "text-purple-500"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-headline mb-4">Cum Funcționează</h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Patru pași simpli pentru a obține o ofertă personalizată pentru materialele metalice
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="relative group hover:shadow-medium transition-all duration-300 animate-fade-in border-card-border" style={{ animationDelay: `${index * 150}ms` }}>
              <CardContent className="p-6 text-center">
                {/* Step Number */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>

                {/* Icon */}
                <div className="mb-4 mt-2">
                  <step.icon className={`h-12 w-12 mx-auto ${step.color} group-hover:scale-110 transition-transform`} />
                </div>

                {/* Content */}
                <h3 className="text-title mb-3 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border transform -translate-y-1/2 z-10" />
              )}
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 p-8 gradient-card rounded-2xl border border-card-border shadow-soft">
          <h3 className="text-title mb-2">Gata să începi?</h3>
          <p className="text-muted-foreground mb-4">
            Începe să explorezi catalogul nostru și configurează prima ta cerere de ofertă
          </p>
          <div className="flex items-center justify-center gap-4">
            <button className="bg-primary text-primary-foreground hover:bg-primary-hover px-6 py-3 rounded-lg font-medium shadow-industrial transition-all">
              Explorează Catalogul
            </button>
            <button className="border border-border hover:bg-card-hover px-6 py-3 rounded-lg font-medium transition-all">
              Încarcă Lista BOM
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;