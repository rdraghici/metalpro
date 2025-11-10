/**
 * Google Tag Manager Integration
 *
 * This module provides functions to initialize GTM and track events
 * throughout the MetalPro application.
 */

// GTM Configuration
export const GTM_ID = import.meta.env.VITE_GTM_ID || '';

// DataLayer types
interface DataLayerEvent {
  event: string;
  [key: string]: any;
}

/**
 * Initialize Google Tag Manager
 * Call this once in the app entry point
 */
export function initializeGTM(): void {
  if (!GTM_ID) {
    console.warn('GTM ID not configured. Set VITE_GTM_ID environment variable.');
    return;
  }

  // Create dataLayer if it doesn't exist
  window.dataLayer = window.dataLayer || [];

  // GTM script injection
  const script = document.createElement('script');
  script.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');
  `;
  document.head.appendChild(script);

  // Add noscript iframe
  const noscript = document.createElement('noscript');
  noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
  document.body.insertBefore(noscript, document.body.firstChild);
}

/**
 * Push event to dataLayer
 */
function pushToDataLayer(event: DataLayerEvent): void {
  if (typeof window === 'undefined' || !window.dataLayer) {
    console.warn('DataLayer not initialized');
    return;
  }

  window.dataLayer.push(event);
}

/**
 * Track page view
 */
export function trackPageView(path: string, title: string): void {
  pushToDataLayer({
    event: 'page_view',
    page_path: path,
    page_title: title,
  });
}

/**
 * Track catalog view
 */
export function trackCatalogView(category?: string): void {
  pushToDataLayer({
    event: 'catalog_view',
    category: category || 'all',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track filter application
 */
export function trackFilterApply(filters: {
  family?: string;
  grade?: string[];
  standard?: string[];
  availability?: string;
  priceRange?: { min: number; max: number };
}): void {
  pushToDataLayer({
    event: 'filter_apply',
    filter_family: filters.family || 'none',
    filter_grades: filters.grade?.join(',') || 'none',
    filter_standards: filters.standard?.join(',') || 'none',
    filter_availability: filters.availability || 'all',
    filter_price_min: filters.priceRange?.min || 0,
    filter_price_max: filters.priceRange?.max || 0,
  });
}

/**
 * Track product detail page view
 */
export function trackPDPView(product: {
  id: string;
  sku: string;
  title: string;
  family: string;
  grade?: string;
  basePrice?: number;
}): void {
  pushToDataLayer({
    event: 'pdp_view',
    product_id: product.id,
    product_sku: product.sku,
    product_name: product.title,
    product_family: product.family,
    product_grade: product.grade || 'N/A',
    product_price: product.basePrice || 0,
  });
}

/**
 * Track add to estimate (cart)
 */
export function trackAddToEstimate(product: {
  id: string;
  sku: string;
  title: string;
  quantity: number;
  unit: string;
  totalPrice?: number;
}): void {
  pushToDataLayer({
    event: 'add_to_estimate',
    product_id: product.id,
    product_sku: product.sku,
    product_name: product.title,
    quantity: product.quantity,
    unit: product.unit,
    value: product.totalPrice || 0,
    currency: 'RON',
  });
}

/**
 * Track estimate cart update
 */
export function trackEstimateUpdate(cart: {
  itemCount: number;
  totalWeight: number;
  totalPrice: number;
}): void {
  pushToDataLayer({
    event: 'estimate_update',
    cart_items: cart.itemCount,
    cart_weight_kg: cart.totalWeight,
    cart_value: cart.totalPrice,
    currency: 'RON',
  });
}

/**
 * Track BOM upload
 */
export function trackBOMUpload(bomData: {
  fileName: string;
  rowCount: number;
  matchedCount: number;
  matchRate: number;
}): void {
  pushToDataLayer({
    event: 'bom_upload',
    bom_file_name: bomData.fileName,
    bom_rows: bomData.rowCount,
    bom_matched: bomData.matchedCount,
    bom_match_rate: bomData.matchRate,
  });
}

/**
 * Track RFQ start
 */
export function trackRFQStart(source: 'cart' | 'pdp' | 'bom'): void {
  pushToDataLayer({
    event: 'rfq_start',
    rfq_source: source,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track RFQ form step completion
 */
export function trackRFQStep(step: number, stepName: string): void {
  pushToDataLayer({
    event: 'rfq_step_complete',
    rfq_step: step,
    rfq_step_name: stepName,
  });
}

/**
 * Track RFQ submission
 */
export function trackRFQSubmit(rfq: {
  referenceNumber: string;
  itemCount: number;
  totalValue: number;
  companyName: string;
  hasAttachments: boolean;
}): void {
  pushToDataLayer({
    event: 'rfq_submit',
    rfq_reference: rfq.referenceNumber,
    rfq_items: rfq.itemCount,
    rfq_value: rfq.totalValue,
    rfq_company: rfq.companyName,
    rfq_has_attachments: rfq.hasAttachments,
    currency: 'RON',
  });
}

/**
 * Track RFQ submission success
 */
export function trackRFQSuccess(referenceNumber: string): void {
  pushToDataLayer({
    event: 'rfq_success',
    rfq_reference: referenceNumber,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track contact click
 */
export function trackContactClick(contactType: 'phone' | 'email' | 'form'): void {
  pushToDataLayer({
    event: 'contact_click',
    contact_type: contactType,
  });
}

/**
 * Track search
 */
export function trackSearch(query: string, resultCount: number): void {
  pushToDataLayer({
    event: 'search',
    search_query: query,
    search_results: resultCount,
  });
}

/**
 * Track user signup
 */
export function trackSignup(accountType: 'individual' | 'business'): void {
  pushToDataLayer({
    event: 'signup',
    account_type: accountType,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track user login
 */
export function trackLogin(accountType: 'individual' | 'business'): void {
  pushToDataLayer({
    event: 'login',
    account_type: accountType,
  });
}

/**
 * Track project save (BOM project)
 */
export function trackProjectSave(projectName: string, itemCount: number): void {
  pushToDataLayer({
    event: 'project_save',
    project_name: projectName,
    project_items: itemCount,
  });
}

/**
 * Track error
 */
export function trackError(error: {
  message: string;
  page?: string;
  action?: string;
}): void {
  pushToDataLayer({
    event: 'error',
    error_message: error.message,
    error_page: error.page || window.location.pathname,
    error_action: error.action || 'unknown',
  });
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
  }
}