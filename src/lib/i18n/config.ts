import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import ro from '@/locales/ro.json';
import en from '@/locales/en.json';

// Supported languages
export const SUPPORTED_LANGUAGES = ['ro', 'en'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Default language
export const DEFAULT_LANGUAGE: SupportedLanguage = 'ro';

// Language configuration
export const LANGUAGE_CONFIG = {
  ro: {
    code: 'ro',
    name: 'Română',
    flag: '🇷🇴',
    locale: 'ro-RO',
  },
  en: {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
    locale: 'en-US',
  },
} as const;

// Initialize i18next only if not already initialized
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector) // Detect user language
    .use(initReactI18next) // Pass i18n instance to react-i18next
    .init({
      resources: {
        ro: { translation: ro },
        en: { translation: en },
      },

      // Default language
      lng: DEFAULT_LANGUAGE,

      // Fallback language
      fallbackLng: DEFAULT_LANGUAGE,

      // Supported languages
      supportedLngs: SUPPORTED_LANGUAGES,

      // Namespace
      ns: ['translation'],
      defaultNS: 'translation',

      // Interpolation options
      interpolation: {
        escapeValue: false, // React already escapes values
      },

      // Language detection options
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: 'metalpro_language',
      },

      // Debug mode (disable in production)
      debug: true, // Enable temporarily to debug translation issues

      // React options - disable suspense to prevent flickering
      react: {
        useSuspense: false,
        bindI18n: 'languageChanged',
        bindI18nStore: false,
        transEmptyNodeValue: '',
        transSupportBasicHtmlNodes: true,
        transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
      },
    });
}

export default i18n;
