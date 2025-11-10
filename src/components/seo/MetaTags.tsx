/**
 * MetaTags Component
 *
 * Dynamic SEO meta tags component using React Helmet or direct DOM manipulation
 * Supports Open Graph, Twitter Cards, and standard SEO meta tags
 */

import { useEffect } from 'react';

export interface MetaTagsProps {
  // Basic SEO
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  robots?: string;

  // Open Graph
  ogType?: 'website' | 'article' | 'product';
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogSiteName?: string;

  // Twitter Card
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;

  // Product specific (for e-commerce)
  productPrice?: string;
  productCurrency?: string;
  productAvailability?: 'in stock' | 'out of stock' | 'preorder';
  productCondition?: 'new' | 'used' | 'refurbished';
  productBrand?: string;
}

export function MetaTags({
  title,
  description,
  keywords,
  canonical,
  robots = 'index, follow',
  ogType = 'website',
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  ogSiteName = 'MetalPro',
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterSite = '@metalpro',
  twitterCreator,
  productPrice,
  productCurrency = 'RON',
  productAvailability,
  productCondition = 'new',
  productBrand = 'MetalPro',
}: MetaTagsProps) {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Helper function to set meta tag
    const setMetaTag = (name: string, content: string, useProperty = false) => {
      const attribute = useProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    // Helper function to set link tag
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);

      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }

      element.setAttribute('href', href);
    };

    // Basic meta tags
    setMetaTag('description', description);
    setMetaTag('robots', robots);

    if (keywords && keywords.length > 0) {
      setMetaTag('keywords', keywords.join(', '));
    }

    // Canonical URL
    if (canonical) {
      setLinkTag('canonical', canonical);
    }

    // Open Graph meta tags
    setMetaTag('og:type', ogType, true);
    setMetaTag('og:title', ogTitle || title, true);
    setMetaTag('og:description', ogDescription || description, true);
    setMetaTag('og:site_name', ogSiteName, true);

    if (ogImage) {
      setMetaTag('og:image', ogImage, true);
      setMetaTag('og:image:alt', ogTitle || title, true);
    }

    if (ogUrl) {
      setMetaTag('og:url', ogUrl, true);
    }

    // Twitter Card meta tags
    setMetaTag('twitter:card', twitterCard);
    setMetaTag('twitter:title', twitterTitle || ogTitle || title);
    setMetaTag('twitter:description', twitterDescription || ogDescription || description);

    if (twitterImage || ogImage) {
      setMetaTag('twitter:image', twitterImage || ogImage || '');
    }

    if (twitterSite) {
      setMetaTag('twitter:site', twitterSite);
    }

    if (twitterCreator) {
      setMetaTag('twitter:creator', twitterCreator);
    }

    // Product-specific meta tags (e-commerce)
    if (ogType === 'product') {
      if (productPrice) {
        setMetaTag('product:price:amount', productPrice, true);
        setMetaTag('product:price:currency', productCurrency, true);
      }

      if (productAvailability) {
        setMetaTag('product:availability', productAvailability, true);
      }

      setMetaTag('product:condition', productCondition, true);
      setMetaTag('product:brand', productBrand, true);
    }
  }, [
    title,
    description,
    keywords,
    canonical,
    robots,
    ogType,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    ogSiteName,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    twitterSite,
    twitterCreator,
    productPrice,
    productCurrency,
    productAvailability,
    productCondition,
    productBrand,
  ]);

  // This component doesn't render anything visible
  return null;
}

/**
 * Default meta tags for the application
 */
export const DEFAULT_META = {
  title: 'MetalPro - Materiale Metalice Prime B2B | Profile, Table, Țevi',
  description:
    'MetalPro oferă materiale metalice prime pentru industrie: profile metalice (HEA, IPE, UNP), table de oțel, țevi și tuburi, elemente de asamblare, oțel inoxidabil și metale neferoase. Estimări online și oferte rapide.',
  keywords: [
    'materiale metalice',
    'profile metalice',
    'table otel',
    'tevi metalice',
    'otel inoxidabil',
    'metale neferoase',
    'HEA',
    'IPE',
    'UNP',
    'S235JR',
    'S355JR',
    'comercializare metale',
    'distribuitie metale',
    'B2B metale',
  ],
  ogSiteName: 'MetalPro',
  ogType: 'website' as const,
  twitterCard: 'summary_large_image' as const,
  twitterSite: '@metalpro',
};
