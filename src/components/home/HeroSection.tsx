import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

const HeroSection = () => {
  const { t } = useTranslation();

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
            {t('home.hero_title')}
            <br />
            <span className="gradient-accent bg-clip-text text-transparent">{t('home.hero_title_highlight')}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-body-large mb-8 text-white/90 max-w-2xl mx-auto animate-fade-in">
            {t('home.hero_subtitle')}
          </p>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 mb-8 text-sm animate-slide-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              <span>{t('home.trust_realtime_estimate')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              <span>{t('home.trust_specialist_support')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              <span>{t('home.trust_fast_delivery')}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 animate-scale-in">
            <Button variant="accent" size="xl" className="group" asChild>
              <Link to="/catalog">
                {t('home.cta_view_catalog')}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
              <Link to="/bom-upload">
                {t('home.cta_upload_bom')}
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">500+</div>
              <div className="text-white/80">{t('home.stat_products')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">24h</div>
              <div className="text-white/80">{t('home.stat_response_time')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">1000+</div>
              <div className="text-white/80">{t('home.stat_projects')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;