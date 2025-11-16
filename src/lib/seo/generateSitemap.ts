/**
 * Sitemap Generation Utility
 *
 * Generates XML sitemap for SEO purposes
 * Run this script to generate sitemap.xml in the public folder
 */

import type { Product, Category } from '@/types/product';

const SITE_URL = 'https://metal-direct.ro';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Generate sitemap URL entry
 */
function generateUrlEntry(url: SitemapUrl): string {
  const { loc, lastmod, changefreq, priority } = url;

  let entry = '  <url>\n';
  entry += `    <loc>${loc}</loc>\n`;

  if (lastmod) {
    entry += `    <lastmod>${lastmod}</lastmod>\n`;
  }

  if (changefreq) {
    entry += `    <changefreq>${changefreq}</changefreq>\n`;
  }

  if (priority !== undefined) {
    entry += `    <priority>${priority.toFixed(1)}</priority>\n`;
  }

  entry += '  </url>\n';

  return entry;
}

/**
 * Generate complete sitemap XML
 */
export function generateSitemap(products: Product[], categories: Category[]): string {
  const urls: SitemapUrl[] = [];

  // Static pages
  urls.push({
    loc: SITE_URL,
    changefreq: 'daily',
    priority: 1.0,
    lastmod: new Date().toISOString().split('T')[0],
  });

  urls.push({
    loc: `${SITE_URL}/catalog`,
    changefreq: 'daily',
    priority: 0.9,
    lastmod: new Date().toISOString().split('T')[0],
  });

  urls.push({
    loc: `${SITE_URL}/bom-upload`,
    changefreq: 'weekly',
    priority: 0.8,
  });

  urls.push({
    loc: `${SITE_URL}/rfq`,
    changefreq: 'weekly',
    priority: 0.8,
  });

  urls.push({
    loc: `${SITE_URL}/login`,
    changefreq: 'monthly',
    priority: 0.5,
  });

  urls.push({
    loc: `${SITE_URL}/signup`,
    changefreq: 'monthly',
    priority: 0.5,
  });

  // Category pages
  categories.forEach((category) => {
    urls.push({
      loc: `${SITE_URL}/catalog/${category.slug}`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date().toISOString().split('T')[0],
    });
  });

  // Product pages
  products.forEach((product) => {
    urls.push({
      loc: `${SITE_URL}/product/${product.slug}`,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString().split('T')[0],
    });
  });

  // Build XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  urls.forEach((url) => {
    xml += generateUrlEntry(url);
  });

  xml += '</urlset>';

  return xml;
}

/**
 * Generate sitemap index (if you have multiple sitemaps)
 */
export function generateSitemapIndex(sitemaps: string[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  sitemaps.forEach((sitemap) => {
    xml += '  <sitemap>\n';
    xml += `    <loc>${SITE_URL}/${sitemap}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    xml += '  </sitemap>\n';
  });

  xml += '</sitemapindex>';

  return xml;
}

/**
 * Save sitemap to file (Node.js environment only)
 * Use this in a build script or backend
 */
export async function saveSitemap(xml: string, filename = 'sitemap.xml'): Promise<void> {
  // This would be used in a Node.js build script
  // In browser context, this function won't work
  if (typeof window === 'undefined') {
    const fs = await import('fs/promises');
    const path = await import('path');

    const publicDir = path.join(process.cwd(), 'public');
    const filePath = path.join(publicDir, filename);

    await fs.writeFile(filePath, xml, 'utf-8');
    console.log(`✅ Sitemap generated: ${filePath}`);
  } else {
    console.warn('saveSitemap can only be called in Node.js environment');
  }
}

/**
 * Example usage in a build script:
 *
 * ```typescript
 * import { products } from '@/data/products';
 * import { categories } from '@/data/categories';
 * import { generateSitemap, saveSitemap } from '@/lib/seo/generateSitemap';
 *
 * const xml = generateSitemap(products, categories);
 * await saveSitemap(xml);
 * ```
 */
