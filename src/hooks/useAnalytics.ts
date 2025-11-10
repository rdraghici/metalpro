/**
 * useAnalytics Hook
 *
 * React hook for tracking analytics events throughout the application.
 * Provides a clean interface to GTM tracking functions.
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import * as gtm from '@/lib/analytics/gtm';

/**
 * Hook for analytics tracking
 */
export function useAnalytics() {
  const location = useLocation();

  // Track page views on route change
  useEffect(() => {
    const title = document.title || 'MetalPro';
    gtm.trackPageView(location.pathname, title);
  }, [location.pathname]);

  // Catalog tracking
  const trackCatalogView = useCallback((category?: string) => {
    gtm.trackCatalogView(category);
  }, []);

  const trackFilterApply = useCallback(
    (filters: Parameters<typeof gtm.trackFilterApply>[0]) => {
      gtm.trackFilterApply(filters);
    },
    []
  );

  // Product tracking
  const trackPDPView = useCallback(
    (product: Parameters<typeof gtm.trackPDPView>[0]) => {
      gtm.trackPDPView(product);
    },
    []
  );

  const trackAddToEstimate = useCallback(
    (product: Parameters<typeof gtm.trackAddToEstimate>[0]) => {
      gtm.trackAddToEstimate(product);
    },
    []
  );

  // Cart tracking
  const trackEstimateUpdate = useCallback(
    (cart: Parameters<typeof gtm.trackEstimateUpdate>[0]) => {
      gtm.trackEstimateUpdate(cart);
    },
    []
  );

  // BOM tracking
  const trackBOMUpload = useCallback(
    (bomData: Parameters<typeof gtm.trackBOMUpload>[0]) => {
      gtm.trackBOMUpload(bomData);
    },
    []
  );

  // RFQ tracking
  const trackRFQStart = useCallback((source: 'cart' | 'pdp' | 'bom') => {
    gtm.trackRFQStart(source);
  }, []);

  const trackRFQStep = useCallback((step: number, stepName: string) => {
    gtm.trackRFQStep(step, stepName);
  }, []);

  const trackRFQSubmit = useCallback(
    (rfq: Parameters<typeof gtm.trackRFQSubmit>[0]) => {
      gtm.trackRFQSubmit(rfq);
    },
    []
  );

  const trackRFQSuccess = useCallback((referenceNumber: string) => {
    gtm.trackRFQSuccess(referenceNumber);
  }, []);

  // Search tracking
  const trackSearch = useCallback((query: string, resultCount: number) => {
    gtm.trackSearch(query, resultCount);
  }, []);

  // Contact tracking
  const trackContactClick = useCallback(
    (contactType: 'phone' | 'email' | 'form') => {
      gtm.trackContactClick(contactType);
    },
    []
  );

  // Auth tracking
  const trackSignup = useCallback((accountType: 'individual' | 'business') => {
    gtm.trackSignup(accountType);
  }, []);

  const trackLogin = useCallback((accountType: 'individual' | 'business') => {
    gtm.trackLogin(accountType);
  }, []);

  // Project tracking
  const trackProjectSave = useCallback((projectName: string, itemCount: number) => {
    gtm.trackProjectSave(projectName, itemCount);
  }, []);

  // Error tracking
  const trackError = useCallback(
    (error: Parameters<typeof gtm.trackError>[0]) => {
      gtm.trackError(error);
    },
    []
  );

  // Memoize the returned object to prevent unnecessary re-renders
  return useMemo(() => ({
    // Catalog
    trackCatalogView,
    trackFilterApply,
    // Product
    trackPDPView,
    trackAddToEstimate,
    // Cart
    trackEstimateUpdate,
    // BOM
    trackBOMUpload,
    // RFQ
    trackRFQStart,
    trackRFQStep,
    trackRFQSubmit,
    trackRFQSuccess,
    // Search
    trackSearch,
    // Contact
    trackContactClick,
    // Auth
    trackSignup,
    trackLogin,
    // Project
    trackProjectSave,
    // Error
    trackError,
  }), [
    trackCatalogView,
    trackFilterApply,
    trackPDPView,
    trackAddToEstimate,
    trackEstimateUpdate,
    trackBOMUpload,
    trackRFQStart,
    trackRFQStep,
    trackRFQSubmit,
    trackRFQSuccess,
    trackSearch,
    trackContactClick,
    trackSignup,
    trackLogin,
    trackProjectSave,
    trackError,
  ]);
}

/**
 * Hook for tracking page views only
 * Useful for pages that don't need other analytics
 */
export function usePageTracking(pageTitle?: string) {
  const location = useLocation();

  useEffect(() => {
    const title = pageTitle || document.title || 'MetalPro';
    gtm.trackPageView(location.pathname, title);
  }, [location.pathname, pageTitle]);
}
