import { useTranslation as useI18nextTranslation } from 'react-i18next';
import { startTransition } from 'react';
import type { SupportedLanguage } from '@/lib/i18n/config';

/**
 * Custom hook for translations with additional utilities
 * Wraps react-i18next's useTranslation hook
 */
export function useTranslation() {
  const { t, i18n } = useI18nextTranslation();

  /**
   * Get current language
   */
  const currentLanguage = i18n.language as SupportedLanguage;

  /**
   * Change language with React transition to prevent flickering
   */
  const changeLanguage = (lng: SupportedLanguage) => {
    startTransition(() => {
      i18n.changeLanguage(lng);
    });
  };

  /**
   * Toggle between Romanian and English
   */
  const toggleLanguage = () => {
    const newLang = currentLanguage === 'ro' ? 'en' : 'ro';
    changeLanguage(newLang);
  };

  /**
   * Format currency based on locale
   */
  const formatCurrency = (
    amount: number,
    currency: 'RON' | 'EUR' | 'USD' = 'RON'
  ): string => {
    const locale = currentLanguage === 'ro' ? 'ro-RO' : 'en-US';

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  /**
   * Format number based on locale
   */
  const formatNumber = (
    value: number,
    options?: Intl.NumberFormatOptions
  ): string => {
    const locale = currentLanguage === 'ro' ? 'ro-RO' : 'en-US';

    return new Intl.NumberFormat(locale, options).format(value);
  };

  /**
   * Format unit with translation
   */
  const formatUnit = (value: number, unit: 'pcs' | 'm' | 'kg' | 'mm' | 'cm' | 'ton' | 'tons'): string => {
    const formattedValue = formatNumber(value, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    const translatedUnit = t(`units.${unit}`);

    return `${formattedValue} ${translatedUnit}`;
  };

  /**
   * Format date based on locale
   */
  const formatDate = (
    date: Date | string,
    options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  ): string => {
    const locale = currentLanguage === 'ro' ? 'ro-RO' : 'en-US';
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  };

  /**
   * Format date and time based on locale
   */
  const formatDateTime = (date: Date | string): string => {
    const locale = currentLanguage === 'ro' ? 'ro-RO' : 'en-US';
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  };

  /**
   * Format relative time (e.g., "2 days ago")
   */
  const formatRelativeTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return t('dates.today');
    } else if (diffInDays === 1) {
      return t('dates.yesterday');
    } else if (diffInDays < 7) {
      return `${diffInDays} ${t('dates.days')}`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} ${t('dates.weeks')}`;
    } else {
      const months = Math.floor(diffInDays / 30);
      return `${months} ${t('dates.months')}`;
    }
  };

  return {
    t,
    i18n,
    currentLanguage,
    changeLanguage,
    toggleLanguage,
    formatCurrency,
    formatNumber,
    formatUnit,
    formatDate,
    formatDateTime,
    formatRelativeTime,
  };
}
