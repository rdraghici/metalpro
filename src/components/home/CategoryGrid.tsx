import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";

const CategoryGrid = () => {
  const { t } = useTranslation();

  const categories = [
    {
      id: "profiles",
      titleKey: "home.category_profiles_title",
      subtitleKey: "home.category_profiles_subtitle",
      descriptionKey: "home.category_profiles_description",
      specs: ["S235JR - S355JR", "6m - 12m", "EN 10025"],
      image: "🏗️",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "plates",
      titleKey: "home.category_plates_title",
      subtitleKey: "home.category_plates_subtitle",
      descriptionKey: "home.category_plates_description",
      specs: ["1-100mm", "Standard format", "Cutting available"],
      image: "📐",
      color: "from-gray-500 to-gray-600"
    },
    {
      id: "pipes",
      titleKey: "home.category_pipes_title",
      subtitleKey: "home.category_pipes_subtitle",
      descriptionKey: "home.category_pipes_description",
      specs: ["EN 10219", "20x20 - 400x300", "Cut to size"],
      image: "🔧",
      color: "from-orange-500 to-orange-600"
    },
    {
      id: "fasteners",
      titleKey: "home.category_fasteners_title",
      subtitleKey: "home.category_fasteners_subtitle",
      descriptionKey: "home.category_fasteners_description",
      specs: ["M6 - M48", "Class 8.8 - 12.9", "Zinc plated, stainless"],
      image: "🔩",
      color: "from-green-500 to-green-600"
    },
    {
      id: "stainless",
      titleKey: "home.category_stainless_title",
      subtitleKey: "home.category_stainless_subtitle",
      descriptionKey: "home.category_stainless_description",
      specs: ["AISI 304/316L", "Various finishes", "EN 10204 certified"],
      image: "✨",
      color: "from-purple-500 to-purple-600"
    },
    {
      id: "nonferrous",
      titleKey: "home.category_nonferrous_title",
      subtitleKey: "home.category_nonferrous_subtitle",
      descriptionKey: "home.category_nonferrous_description",
      specs: ["Al 6060, 6082", "Electrolytic copper", "Phosphor bronze"],
      image: "🔸",
      color: "from-yellow-500 to-yellow-600"
    }
  ];

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-headline mb-4">{t('home.categories_title')}</h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            {t('home.categories_subtitle')}
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
                    {t(category.titleKey)}
                  </h3>
                  <p className="text-subtitle text-muted-foreground mb-2">
                    {t(category.subtitleKey)}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {t(category.descriptionKey)}
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
                  {t('home.cta_view_products')}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            {t('home.cta_view_all_categories')}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;