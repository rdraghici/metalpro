/**
 * Back-Office API Client
 * Connects to the backend API for back-office operations
 */

import type {
  BackofficeUser,
  RFQListItem,
  RFQDetail,
  UpdateRFQStatusData,
  UpdateRFQPricingData,
  Product,
  CreateProductData,
  ProductFilters,
  DashboardKPIs,
  TimeSeriesData,
  StatusBreakdown,
  TopProduct,
  OperatorPerformance,
  DateRangeFilter,
  PaginationParams,
  PaginatedResponse,
} from '@/types/backoffice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('backoffice_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

interface BackendResponse<T> {
  success: boolean;
  data: T;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  const result = await response.json();

  // Backend wraps all responses in { success: true, data: {...}, ... }
  // For paginated responses, preserve both data and pagination
  if (result && typeof result === 'object' && 'data' in result) {
    if ('pagination' in result) {
      // Paginated response: return { data, pagination }
      return { data: result.data, pagination: result.pagination } as T;
    }
    // Non-paginated response: extract just the data
    return result.data as T;
  }

  return result;
}

function buildQueryString(params: Record<string, any>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });
  return query.toString();
}

// =====================================================
// AUTHENTICATION
// =====================================================

export interface BackofficeLoginData {
  email: string;
  password: string;
}

export interface BackofficeAuthResponse {
  user: BackofficeUser;
  token: string;
}

interface BackendAuthData {
  user: BackofficeUser;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export async function backofficeLogin(data: BackofficeLoginData): Promise<BackofficeAuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  // handleResponse now automatically extracts the 'data' field
  const backendResult = await handleResponse<BackendAuthData>(response);

  // Extract token from the response
  const token = backendResult.tokens.accessToken;
  const user = backendResult.user;

  // Store token in localStorage
  localStorage.setItem('backoffice_token', token);
  localStorage.setItem('backoffice_user', JSON.stringify(user));

  return { user, token };
}

export async function backofficeLogout(): Promise<void> {
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
  } finally {
    localStorage.removeItem('backoffice_token');
    localStorage.removeItem('backoffice_user');
  }
}

export function getBackofficeUser(): BackofficeUser | null {
  try {
    const stored = localStorage.getItem('backoffice_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// =====================================================
// RFQ MANAGEMENT
// =====================================================

export interface GetRFQsParams extends PaginationParams {
  status?: string;
  assignedToId?: string;
  companyName?: string;
  dateFrom?: string;
  dateTo?: string;
  minValue?: number;
  maxValue?: number;
}

export async function getRFQs(params?: GetRFQsParams): Promise<PaginatedResponse<RFQListItem>> {
  const queryString = params ? buildQueryString(params) : '';
  const response = await fetch(`${API_URL}/api/backoffice/rfqs?${queryString}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleResponse(response);
}

export async function getRFQById(id: string): Promise<RFQDetail> {
  const response = await fetch(`${API_URL}/api/backoffice/rfqs/${id}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleResponse(response);
}

export async function updateRFQStatus(id: string, data: UpdateRFQStatusData): Promise<RFQDetail> {
  const response = await fetch(`${API_URL}/api/backoffice/rfqs/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return handleResponse(response);
}

export async function updateRFQPricing(id: string, data: UpdateRFQPricingData): Promise<RFQDetail> {
  const response = await fetch(`${API_URL}/api/backoffice/rfqs/${id}/pricing`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return handleResponse(response);
}

export async function assignRFQ(id: string, operatorId: string): Promise<RFQDetail> {
  const response = await fetch(`${API_URL}/api/backoffice/rfqs/${id}/assign`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ operatorId }),
    credentials: 'include',
  });
  return handleResponse(response);
}

export async function getRFQStatistics(filters?: DateRangeFilter) {
  const queryString = filters ? buildQueryString(filters) : '';
  const response = await fetch(`${API_URL}/api/backoffice/rfqs/statistics?${queryString}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleResponse(response);
}

// =====================================================
// PRODUCT MANAGEMENT
// =====================================================

export interface GetProductsParams extends PaginationParams, ProductFilters {}

export async function getProducts(params?: GetProductsParams): Promise<PaginatedResponse<Product>> {
  const queryString = params ? buildQueryString(params) : '';
  const response = await fetch(`${API_URL}/api/backoffice/products?${queryString}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleResponse(response);
}

export async function getProductById(id: string): Promise<Product> {
  const response = await fetch(`${API_URL}/api/backoffice/products/${id}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleResponse(response);
}

export async function createProduct(data: CreateProductData): Promise<Product> {
  const response = await fetch(`${API_URL}/api/backoffice/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return handleResponse(response);
}

export async function updateProduct(id: string, data: Partial<CreateProductData>): Promise<Product> {
  const response = await fetch(`${API_URL}/api/backoffice/products/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return handleResponse(response);
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/backoffice/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  await handleResponse(response);
}

export async function bulkUpdateProductStatus(productIds: string[], isActive: boolean) {
  const response = await fetch(`${API_URL}/api/backoffice/products/bulk/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ productIds, isActive }),
    credentials: 'include',
  });
  return handleResponse(response);
}

export async function bulkDeleteProducts(productIds: string[]) {
  const response = await fetch(`${API_URL}/api/backoffice/products/bulk`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    body: JSON.stringify({ productIds }),
    credentials: 'include',
  });
  return handleResponse(response);
}

export async function getProductStatistics() {
  const response = await fetch(`${API_URL}/api/backoffice/products/statistics`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleResponse(response);
}

// =====================================================
// ANALYTICS
// =====================================================

export async function getKPIs(filters?: DateRangeFilter): Promise<DashboardKPIs> {
  const queryString = filters ? buildQueryString(filters) : '';
  const response = await fetch(`${API_URL}/api/backoffice/analytics/kpis?${queryString}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleResponse(response);
}

export interface RFQTrendData {
  date: string;
  rfqs: number;
}

export async function getRFQTrend(): Promise<RFQTrendData[]> {
  const response = await fetch(`${API_URL}/api/backoffice/analytics/rfq-trend`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleResponse(response);
}

export interface RevenueTrendData {
  date: string;
  revenue: number;
}

export async function getRevenueTrend(): Promise<RevenueTrendData[]> {
  const response = await fetch(`${API_URL}/api/backoffice/analytics/revenue-trend`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleResponse(response);
}

export async function getRFQsOverTime(
  filters?: DateRangeFilter & { interval?: 'day' | 'week' | 'month' }
): Promise<TimeSeriesData[]> {
  const queryString = filters ? buildQueryString(filters) : '';
  const response = await fetch(`${API_URL}/api/backoffice/analytics/rfqs-over-time?${queryString}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleResponse(response);
}

export async function getRFQsByStatus(filters?: DateRangeFilter): Promise<StatusBreakdown[]> {
  const queryString = filters ? buildQueryString(filters) : '';
  const response = await fetch(`${API_URL}/api/backoffice/analytics/rfqs-by-status?${queryString}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleResponse(response);
}

export async function getTopProducts(
  filters?: DateRangeFilter & { limit?: number }
): Promise<TopProduct[]> {
  const queryString = filters ? buildQueryString(filters) : '';
  const response = await fetch(`${API_URL}/api/backoffice/analytics/top-products?${queryString}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleResponse(response);
}

export async function getOperatorPerformance(
  filters?: DateRangeFilter
): Promise<OperatorPerformance[]> {
  const queryString = filters ? buildQueryString(filters) : '';
  const response = await fetch(`${API_URL}/api/backoffice/analytics/operator-performance?${queryString}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleResponse(response);
}

export async function getAvgRFQValueTrend(
  filters?: DateRangeFilter & { interval?: 'day' | 'week' | 'month' }
): Promise<TimeSeriesData[]> {
  const queryString = filters ? buildQueryString(filters) : '';
  const response = await fetch(`${API_URL}/api/backoffice/analytics/avg-rfq-value-trend?${queryString}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleResponse(response);
}

export async function exportRFQReport(filters?: DateRangeFilter & { status?: string }) {
  const queryString = filters ? buildQueryString(filters) : '';
  const response = await fetch(`${API_URL}/api/backoffice/analytics/export/rfq-report?${queryString}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return handleResponse(response);
}
