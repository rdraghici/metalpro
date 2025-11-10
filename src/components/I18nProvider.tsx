import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n/config';

interface I18nProviderProps {
  children: React.ReactNode;
}

/**
 * I18n Provider Wrapper
 * Ensures i18n is fully initialized before rendering children
 * Prevents flickering during language initialization and switching
 */
export default function I18nProvider({ children }: I18nProviderProps) {
  const [isReady, setIsReady] = useState(i18n.isInitialized);

  useEffect(() => {
    // If already initialized, set ready immediately
    if (i18n.isInitialized) {
      setIsReady(true);
      return;
    }

    // Wait for i18n to be ready
    const handleReady = () => {
      setIsReady(true);
    };

    i18n.on('initialized', handleReady);

    // Cleanup
    return () => {
      i18n.off('initialized', handleReady);
    };
  }, []);

  // Don't render children until i18n is ready
  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
