import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useTranslation } from "@/hooks/useTranslation";

const Footer = () => {
  const analytics = useAnalytics();
  const { t } = useTranslation();
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
                <h1 className="text-xl font-bold">{t('header.company_name')}</h1>
                <p className="text-xs text-muted-foreground">{t('footer.tagline')}</p>
              </div>
            </div>
            <p className="text-sm text-secondary-foreground/80 leading-relaxed">
              {t('footer.company_info')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.main_categories')}</h3>
            <div className="space-y-2 text-sm text-secondary-foreground/80">
              <Link to="/catalog/profiles" className="block hover:text-primary transition-colors">Profile Metalice</Link>
              <Link to="/catalog/plates" className="block hover:text-primary transition-colors">Table de Oțel</Link>
              <Link to="/catalog/pipes" className="block hover:text-primary transition-colors">Țevi și Tuburi</Link>
              <Link to="/catalog/fasteners" className="block hover:text-primary transition-colors">Elemente de Fixare</Link>
              <Link to="/catalog/stainless" className="block hover:text-primary transition-colors">Inox</Link>
              <Link to="/catalog/nonferrous" className="block hover:text-primary transition-colors">Metale Neferoase</Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.services')}</h3>
            <div className="space-y-2 text-sm text-secondary-foreground/80">
              <p>{t('footer.cutting_service')}</p>
              <p>{t('footer.specialized_transport')}</p>
              <p>{t('footer.technical_consulting')}</p>
              <p>{t('footer.material_certification')}</p>
              <p>{t('footer.project_support')}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.contact')}</h3>
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
                  href="mailto:vanzari@metal-direct.ro"
                  className="hover:text-primary transition-colors"
                  onClick={() => analytics.trackContactClick('email')}
                >
                  sales@metal-direct.ro
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
            <div className="text-sm text-white">
              {t('footer.copyright')}
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Button variant="link" className="p-0 h-auto text-white hover:text-gray-200">
                {t('footer.terms')}
              </Button>
              <Button variant="link" className="p-0 h-auto text-white hover:text-gray-200">
                {t('footer.privacy')}
              </Button>
              <Button variant="link" className="p-0 h-auto text-white hover:text-gray-200">
                {t('footer.gdpr')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;