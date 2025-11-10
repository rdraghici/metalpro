import i18n from '@/lib/i18n/config';

/**
 * Locale-aware formatting utilities
 * These functions can be used outside of React components
 */

/**
 * Get current locale from i18n
 */
const getLocale = (): string => {
  const language = i18n.language || 'ro';
  return language === 'ro' ? 'ro-RO' : 'en-US';
};

/**
 * Format currency based on current locale
 *
 * @param amount - The amount to format
 * @param currency - Currency code (RON, EUR, USD)
 * @param locale - Optional locale override
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1234.56, 'RON') // "1.234,56 RON" (ro-RO) or "$1,234.56" (en-US)
 */
export function formatCurrency(
  amount: number,
  currency: 'RON' | 'EUR' | 'USD' = 'RON',
  locale?: string
): string {
  const currentLocale = locale || getLocale();

  return new Intl.NumberFormat(currentLocale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format number based on current locale
 *
 * @param value - The number to format
 * @param options - Intl.NumberFormat options
 * @param locale - Optional locale override
 * @returns Formatted number string
 *
 * @example
 * formatNumber(1234.56) // "1.234,56" (ro-RO) or "1,234.56" (en-US)
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
  locale?: string
): string {
  const currentLocale = locale || getLocale();

  return new Intl.NumberFormat(currentLocale, options).format(value);
}

/**
 * Format unit with translation and number formatting
 *
 * @param value - The numeric value
 * @param unit - Unit type
 * @param locale - Optional locale override
 * @returns Formatted value with translated unit
 *
 * @example
 * formatUnit(100.5, 'kg') // "100,5 kg" (ro-RO) or "100.5 kg" (en-US)
 */
export function formatUnit(
  value: number,
  unit: 'pcs' | 'm' | 'kg' | 'mm' | 'cm' | 'ton' | 'tons',
  locale?: string
): string {
  const currentLocale = locale || getLocale();

  const formattedValue = new Intl.NumberFormat(currentLocale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);

  // Get translated unit from i18n
  const translatedUnit = i18n.t(`units.${unit}`) || unit;

  return `${formattedValue} ${translatedUnit}`;
}

/**
 * Format date based on current locale
 *
 * @param date - Date object or ISO string
 * @param options - Intl.DateTimeFormat options
 * @param locale - Optional locale override
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date()) // "10 noiembrie 2024" (ro-RO) or "November 10, 2024" (en-US)
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  locale?: string
): string {
  const currentLocale = locale || getLocale();
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat(currentLocale, options).format(dateObj);
}

/**
 * Format date and time based on current locale
 *
 * @param date - Date object or ISO string
 * @param locale - Optional locale override
 * @returns Formatted date and time string
 *
 * @example
 * formatDateTime(new Date()) // "10 noiembrie 2024, 15:30" (ro-RO)
 */
export function formatDateTime(
  date: Date | string,
  locale?: string
): string {
  const currentLocale = locale || getLocale();
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat(currentLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Format short date (numeric)
 *
 * @param date - Date object or ISO string
 * @param locale - Optional locale override
 * @returns Formatted short date string
 *
 * @example
 * formatShortDate(new Date()) // "10.11.2024" (ro-RO) or "11/10/2024" (en-US)
 */
export function formatShortDate(
  date: Date | string,
  locale?: string
): string {
  const currentLocale = locale || getLocale();
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat(currentLocale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
}

/**
 * Format relative time (e.g., "2 days ago")
 *
 * @param date - Date object or ISO string
 * @returns Relative time string
 *
 * @example
 * formatRelativeTime(yesterday) // "Ieri" (ro-RO) or "Yesterday" (en-US)
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return i18n.t('dates.today');
  } else if (diffInDays === 1) {
    return i18n.t('dates.yesterday');
  } else if (diffInDays < 7) {
    return `${diffInDays} ${i18n.t('dates.days')}`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} ${i18n.t('dates.weeks')}`;
  } else {
    const months = Math.floor(diffInDays / 30);
    return `${months} ${i18n.t('dates.months')}`;
  }
}

/**
 * Format weight with appropriate unit (kg or tons)
 *
 * @param weightInKg - Weight in kilograms
 * @param locale - Optional locale override
 * @returns Formatted weight with unit
 *
 * @example
 * formatWeight(1500) // "1,5 tone" (ro-RO) or "1.5 tons" (en-US)
 * formatWeight(50) // "50 kg"
 */
export function formatWeight(
  weightInKg: number,
  locale?: string
): string {
  if (weightInKg >= 1000) {
    const weightInTons = weightInKg / 1000;
    return formatUnit(weightInTons, weightInTons === 1 ? 'ton' : 'tons', locale);
  }
  return formatUnit(weightInKg, 'kg', locale);
}

/**
 * Format percentage
 *
 * @param value - Percentage value (0-100)
 * @param locale - Optional locale override
 * @returns Formatted percentage string
 *
 * @example
 * formatPercentage(19) // "19%" (both locales)
 */
export function formatPercentage(
  value: number,
  locale?: string
): string {
  const currentLocale = locale || getLocale();

  return new Intl.NumberFormat(currentLocale, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

/**
 * Format compact number (e.g., 1K, 1M)
 *
 * @param value - The number to format
 * @param locale - Optional locale override
 * @returns Compact formatted number
 *
 * @example
 * formatCompactNumber(1500) // "1,5K" (ro-RO) or "1.5K" (en-US)
 */
export function formatCompactNumber(
  value: number,
  locale?: string
): string {
  const currentLocale = locale || getLocale();

  return new Intl.NumberFormat(currentLocale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
}
