import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/hooks/useTranslation';
import { LANGUAGE_CONFIG, type SupportedLanguage } from '@/lib/i18n/config';

interface LanguageSwitcherProps {
  variant?: 'button' | 'icon';
  size?: 'sm' | 'default' | 'lg';
}

/**
 * Language switcher component
 * Allows users to switch between Romanian and English
 */
export default function LanguageSwitcher({
  variant = 'button',
  size = 'default',
}: LanguageSwitcherProps) {
  const { currentLanguage, changeLanguage } = useTranslation();

  const handleLanguageChange = (language: SupportedLanguage) => {
    changeLanguage(language);
  };

  const currentLangConfig = LANGUAGE_CONFIG[currentLanguage];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === 'icon' ? (
          <Button variant="ghost" size={size === 'sm' ? 'sm' : 'default'} className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">{currentLangConfig.code.toUpperCase()}</span>
          </Button>
        ) : (
          <Button variant="outline" size={size} className="gap-2">
            <span className="text-lg">{currentLangConfig.flag}</span>
            <span className="hidden sm:inline">{currentLangConfig.name}</span>
            <span className="sm:hidden">{currentLangConfig.code.toUpperCase()}</span>
          </Button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {Object.values(LANGUAGE_CONFIG).map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code as SupportedLanguage)}
            className={`cursor-pointer gap-2 ${
              currentLanguage === lang.code ? 'bg-accent' : ''
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="flex-1">{lang.name}</span>
            {currentLanguage === lang.code && (
              <span className="text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
