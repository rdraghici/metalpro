/**
 * SEO Metadata Generation Utilities
 *
 * Functions to generate SEO metadata for products, categories, and pages
 */

import type { Product, Category } from '@/types/product';
import type { MetaTagsProps } from '@/components/seo/MetaTags';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://metal-direct.ro';

/**
 * Generate metadata for product detail pages
 */
export function generateProductMetadata(product: Product): MetaTagsProps {
  const title = `${product.title} - ${product.grade || ''} ${product.standard || ''} | MetalDirect`.trim();

  const description = `${product.title} (SKU: ${product.sku}) - ${product.grade || ''} ${product.standard || ''}.
    ${product.dimensions || ''} ${product.availability === 'in_stock' ? 'În stoc' : 'La comandă'}.
    Estimare online și ofertă rapidă de la MetalDirect.`.replace(/\s+/g, ' ').trim();

  const keywords = [
    product.title,
    product.sku,
    product.grade,
    product.standard,
    product.family,
    'materiale metalice',
    'distribuitor metale',
    'MetalDirect',
  ].filter(Boolean) as string[];

  // Calculate availability status
  let availability: 'in stock' | 'out of stock' | 'preorder' = 'in stock';
  if (product.availability === 'on_order') {
    availability = 'preorder';
  } else if (product.availability === 'backorder') {
    availability = 'out of stock';
  }

  // Format price
  const priceFormatted = product.pricePerUnit
    ? product.pricePerUnit.toFixed(2)
    : undefined;

  return {
    title,
    description,
    keywords,
    canonical: `${SITE_URL}/product/${product.slug}`,
    ogType: 'product',
    ogTitle: title,
    ogDescription: description,
    ogImage: product.imageUrl || `${SITE_URL}/images/og-default-product.jpg`,
    ogUrl: `${SITE_URL}/product/${product.slug}`,
    productPrice: priceFormatted,
    productCurrency: 'RON',
    productAvailability: availability,
    productCondition: 'new',
    productBrand: product.producer || 'MetalDirect',
  };
}

/**
 * Generate metadata for category pages
 */
export function generateCategoryMetadata(category: Category): MetaTagsProps {
  const title = `${category.name} - Catalog Complet | MetalDirect`;

  const description = `Explorează gama completă de ${category.name.toLowerCase()} de la MetalDirect.
    ${category.description || 'Materiale metalice prime pentru industrie cu livrare rapidă și estimări online.'}`.replace(/\s+/g, ' ').trim();

  const keywords = [
    category.name,
    category.slug,
    'materiale metalice',
    'catalog metale',
    'B2B metale',
    'MetalDirect',
  ];

  return {
    title,
    description,
    keywords,
    canonical: `${SITE_URL}/catalog/${category.slug}`,
    ogType: 'website',
    ogTitle: title,
    ogDescription: description,
    ogImage: category.imageUrl || `${SITE_URL}/images/og-default-category.jpg`,
    ogUrl: `${SITE_URL}/catalog/${category.slug}`,
  };
}

/**
 * Generate metadata for catalog page
 */
export function generateCatalogMetadata(filters?: {
  family?: string;
  grade?: string[];
  standard?: string[];
}): MetaTagsProps {
  let title = 'Catalog Materiale Metalice | MetalDirect';
  let description = 'Catalog complet de materiale metalice prime: profile (HEA, IPE, UNP), table de oțel, țevi și tuburi, elemente de asamblare. Estimări online și livrare rapidă.';

  // Customize based on filters
  if (filters?.family) {
    title = `${filters.family} - Catalog | MetalDirect`;
    description = `Explorează gama de ${filters.family.toLowerCase()} disponibilă la MetalDirect. Estimări online, stoc actualizat și livrare rapidă.`;
  }

  if (filters?.grade && filters.grade.length > 0) {
    title = `${filters.grade.join(', ')} - ${title}`;
  }

  const keywords = [
    'catalog metale',
    'materiale metalice',
    'profile metalice',
    'table otel',
    'tevi metalice',
    ...(filters?.grade || []),
    ...(filters?.standard || []),
    'MetalDirect',
  ];

  return {
    title,
    description,
    keywords,
    canonical: `${SITE_URL}/catalog`,
    ogType: 'website',
    ogTitle: title,
    ogDescription: description,
    ogImage: `${SITE_URL}/images/og-catalog.jpg`,
    ogUrl: `${SITE_URL}/catalog`,
  };
}

/**
 * Generate metadata for BOM upload page
 */
export function generateBOMMetadata(): MetaTagsProps {
  return {
    title: 'Încarcă BOM - Lista de Materiale | MetalDirect',
    description: 'Încarcă lista ta de materiale (BOM) în format Excel sau CSV. Sistemul nostru identifică automat produsele și generează estimarea rapidă.',
    keywords: ['BOM upload', 'lista materiale', 'import Excel', 'CSV import', 'estimare automată', 'MetalDirect'],
    canonical: `${SITE_URL}/bom-upload`,
    ogType: 'website',
    ogTitle: 'Încarcă BOM - Lista de Materiale | MetalDirect',
    ogDescription: 'Încarcă lista ta de materiale și primește estimare automată în câteva secunde.',
    ogImage: `${SITE_URL}/images/og-bom.jpg`,
    ogUrl: `${SITE_URL}/bom-upload`,
  };
}

/**
 * Generate metadata for RFQ page
 */
export function generateRFQMetadata(): MetaTagsProps {
  return {
    title: 'Cerere Ofertă (RFQ) - Finalizare Comandă | MetalDirect',
    description: 'Finalizează comanda și primește o ofertă detaliată de la echipa noastră de vânzări. Răspuns în 24 de ore lucrătoare.',
    keywords: ['cerere oferta', 'RFQ', 'request for quote', 'comanda metale', 'oferta metale', 'MetalDirect'],
    canonical: `${SITE_URL}/rfq`,
    ogType: 'website',
    ogTitle: 'Cerere Ofertă (RFQ) | MetalDirect',
    ogDescription: 'Trimite cererea ta de ofertă și primește răspuns în 24h.',
    ogImage: `${SITE_URL}/images/og-rfq.jpg`,
    ogUrl: `${SITE_URL}/rfq`,
  };
}

/**
 * Generate metadata for account pages
 */
export function generateAccountMetadata(): MetaTagsProps {
  return {
    title: 'Contul Meu - Dashboard | MetalDirect',
    description: 'Gestionează contul tău MetalDirect: istoric comenzi, proiecte salvate, adrese de livrare și preferințe.',
    keywords: ['cont client', 'dashboard', 'istoric comenzi', 'proiecte salvate', 'MetalDirect'],
    canonical: `${SITE_URL}/account`,
    robots: 'noindex, nofollow', // Private pages shouldn't be indexed
    ogType: 'website',
    ogTitle: 'Contul Meu | MetalDirect',
    ogDescription: 'Gestionează contul și comenzile tale.',
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(breadcrumbs: { name: string; url: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate product structured data (Schema.org)
 */
export function generateProductSchema(product: Product): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    sku: product.sku,
    description: `${product.title} - ${product.grade || ''} ${product.standard || ''}`,
    brand: {
      '@type': 'Brand',
      name: product.producer || 'MetalDirect',
    },
    offers: {
      '@type': 'Offer',
      price: product.pricePerUnit?.toFixed(2) || '0.00',
      priceCurrency: 'RON',
      availability:
        product.availability === 'in_stock'
          ? 'https://schema.org/InStock'
          : product.availability === 'on_order'
          ? 'https://schema.org/PreOrder'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'MetalDirect',
      },
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
    },
    ...(product.imageUrl && {
      image: product.imageUrl,
    }),
  };
}

/**
 * Generate organization structured data
 */
export function generateOrganizationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MetalDirect',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+40-XXX-XXX-XXX',
      contactType: 'Sales',
      areaServed: 'RO',
      availableLanguage: ['Romanian', 'English'],
    },
    sameAs: [
      // Add social media links here when available
      // 'https://www.facebook.com/metalpro',
      // 'https://www.linkedin.com/company/metalpro',
    ],
  };
}
