import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    id: "profiles",
    title: "Profile Metalice",
    subtitle: "UNP, HEA, IPE, UPN",
    description: "Profile laminat la cald pentru structuri",
    specs: ["S235JR - S355JR", "6m - 12m lungime", "EN 10025"],
    image: "🏗️",
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "plates",
    title: "Table de Oțel",
    subtitle: "DC01, S235JR, S355JR",
    description: "Table pentru construcții și industrie",
    specs: ["1-100mm grosime", "Format standard", "Debitare disponibilă"],
    image: "📐",
    color: "from-gray-500 to-gray-600"
  },
  {
    id: "pipes",
    title: "Țevi și Tuburi",
    subtitle: "Rectangulare, rotunde",
    description: "Țevi sudate și fără sudură",
    specs: ["EN 10219", "20x20 - 400x300", "Debitare la dimensiune"],
    image: "🔧",
    color: "from-orange-500 to-orange-600"
  },
  {
    id: "fasteners",
    title: "Elemente Asamblare",
    subtitle: "Șuruburi, piulițe, rondele",
    description: "DIN, ISO, organe de asamblare",
    specs: ["M6 - M48", "Clasa 8.8 - 12.9", "Zincate, inox"],
    image: "🔩",
    color: "from-green-500 to-green-600"
  },
  {
    id: "stainless",
    title: "Oțel Inoxidabil",
    subtitle: "304, 316L, 321",
    description: "Table, profile, țevi inox",
    specs: ["AISI 304/316L", "Finisaje diverse", "Certificare EN 10204"],
    image: "✨",
    color: "from-purple-500 to-purple-600"
  },
  {
    id: "nonferrous",
    title: "Metale Neferoase",
    subtitle: "Aluminiu, cupru, bronz",
    description: "Aliaje neferoase pentru aplicații speciale",
    specs: ["Al 6060, 6082", "Cupru electrolitic", "Bronz fosforoasă"],
    image: "🔸",
    color: "from-yellow-500 to-yellow-600"
  }
];

const CategoryGrid = () => {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-headline mb-4">Explorează Categoriile</h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Găsește rapid materialele de care ai nevoie prin categoriile noastre organizate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card key={category.id} className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-fade-in border-card-border" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-6">
                {/* Category Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl mb-2">{category.image}</div>
                  <div className={`w-12 h-1 rounded-full bg-gradient-to-r ${category.color}`} />
                </div>

                {/* Category Info */}
                <div className="mb-4">
                  <h3 className="text-title mb-1 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-subtitle text-muted-foreground mb-2">
                    {category.subtitle}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {category.description}
                  </p>
                </div>

                {/* Specs */}
                <div className="space-y-1 mb-4">
                  {category.specs.map((spec, specIndex) => (
                    <div key={specIndex} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  Vezi Produsele
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Vezi Toate Categoriile
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;