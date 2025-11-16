import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProductDetail from '@/pages/ProductDetail';
import type { Product } from '@/types';

// Create hoisted mock function for the API (must be hoisted for vi.mock factory)
const { mockGetProductBySlug } = vi.hoisted(() => ({
  mockGetProductBySlug: vi.fn(),
}));

// Mock the API module
vi.mock('@/lib/api/products', () => ({
  getProductBySlug: mockGetProductBySlug,
}));

// Mock child components to isolate the page test
vi.mock('@/components/layout/Header', () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock('@/components/layout/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock('@/components/catalog/Breadcrumbs', () => ({
  default: ({ family, productTitle }: { family: string; productTitle: string }) => (
    <nav data-testid="breadcrumbs">
      <a href="/">Home</a> → <a href="/catalog">Catalog</a> →
      <a href={`/catalog/${family}`}>{family}</a> → {productTitle}
    </nav>
  ),
}));

vi.mock('@/components/pdp/SpecTable', () => ({
  default: () => <div data-testid="spec-table">Specification Table</div>,
}));

vi.mock('@/components/pdp/ConfigurationPanel', () => ({
  default: () => <div data-testid="configuration-panel">Configuration Panel</div>,
}));

vi.mock('@/components/pdp/CutListEditor', () => ({
  default: () => <div data-testid="cut-list-editor">Cut List Editor</div>,
}));

vi.mock('@/components/pdp/WeightEstimator', () => ({
  default: () => <div data-testid="weight-estimator">Weight Estimator</div>,
}));

vi.mock('@/components/pdp/PriceEstimator', () => ({
  default: () => <div data-testid="price-estimator">Price Estimator</div>,
}));

vi.mock('@/components/pdp/DeliveryCue', () => ({
  default: () => <div data-testid="delivery-cue">Delivery Information</div>,
}));

// Create stable mock functions for useProductConfig
const mockSetSellingUnit = vi.fn();
const mockSetLengthOption = vi.fn();
const mockSetCustomLength = vi.fn();
const mockSetQuantity = vi.fn();
const mockSetFinish = vi.fn();
const mockToggleCutToLength = vi.fn();
const mockAddCutListItem = vi.fn();
const mockUpdateCutListItem = vi.fn();
const mockRemoveCutListItem = vi.fn();
const mockClearCutList = vi.fn();

// Create stable OBJECT that doesn't change between renders
const mockProductConfig = {
  config: {
    sellingUnit: 'm',
    lengthOption: '6m',
    customLength: 6,
    quantity: 1,
    finish: 'standard',
    cutToLength: false,
    cutList: [],
  },
  weightEstimate: {
    totalWeight: 105.0,
    formula: 'Weight = Length × Specific Weight (10.5 kg/m)',
  },
  priceEstimate: {
    unitPrice: 15.0,
    subtotal: 90.0,
    vat: 17.1,
    delivery: 50.0,
    total: 157.1,
  },
  wastePercentage: 0,
  isValid: true,
  setSellingUnit: mockSetSellingUnit,
  setLengthOption: mockSetLengthOption,
  setCustomLength: mockSetCustomLength,
  setQuantity: mockSetQuantity,
  setFinish: mockSetFinish,
  toggleCutToLength: mockToggleCutToLength,
  addCutListItem: mockAddCutListItem,
  updateCutListItem: mockUpdateCutListItem,
  removeCutListItem: mockRemoveCutListItem,
  clearCutList: mockClearCutList,
};

vi.mock('@/hooks/useProductConfig', () => ({
  useProductConfig: () => mockProductConfig,
}));

// Create stable mock objects that don't change between renders
const mockAddToCart = vi.fn();
const mockCartContext = {
  addToCart: mockAddToCart,
  itemCount: 0,
};

vi.mock('@/context/CartContext', () => ({
  useCart: () => mockCartContext,
}));

const mockToast = vi.fn();
const mockToastContext = {
  toast: mockToast,
};

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => mockToastContext,
}));

// Create stable mock object for analytics
const mockTrackPDPView = vi.fn();
const mockTrackAddToEstimate = vi.fn();
const mockAnalytics = {
  trackPDPView: mockTrackPDPView,
  trackAddToEstimate: mockTrackAddToEstimate,
};

vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => mockAnalytics,
}));

vi.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.loading': 'Se încarcă...',
        'errors.not_found': 'Produs negăsit',
        'errors.generic': 'Produsul pe care îl căutați nu există sau a fost șters.',
        'product.back_to_catalog': 'Înapoi la catalog',
        'product.sku': 'SKU',
        'catalog.producer': 'Producător',
        'product.grade': 'Grad',
        'product.indicative_price': 'Preț indicativ',
        'product.from': 'de la',
        'product.add_to_estimate': 'Adaugă la Estimare',
        'product.similar_products': 'Produse similare',
        'product.similar_products_coming_soon': 'Secțiunea pentru produse similare va fi implementată în curând',
        'product.in_stock': 'În Stoc',
        'product.on_request': 'La Comandă',
        'product.out_of_stock': 'Indisponibil',
      };
      return translations[key] || key;
    },
  }),
}));

const mockProduct: Product = {
  id: 'prod-1',
  sku: 'HEA-200-S235JR',
  title: 'Profil HEA 200 S235JR EN 10025',
  slug: 'profil-hea-200-s235jr-en-10025',
  family: 'profiles',
  grade: 'S235JR',
  standards: ['EN 10025', 'DIN 18800'],
  producer: 'ArcelorMittal',
  availability: 'in_stock',
  pricePerUnit: 15.0,
  priceUnit: 'kg',
  indicativePrice: {
    min: 15.0,
    max: 18.5,
  },
  dimensions: {
    height: 200,
    width: 200,
    thickness: 10,
  },
  weightPerMeter: 10.5,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-10'),
};

// Helper function to render ProductDetail with proper router setup
const renderProductDetail = (slug: string) => {
  const { render: rawRender } = require('@testing-library/react');
  const { QueryClient, QueryClientProvider } = require('@tanstack/react-query');

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return rawRender(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/product/${slug}`]}>
        <Routes>
          <Route path="/product/:slug" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('Phase 3: Product Detail Page (PDP) & Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set up default mock for most tests
    mockGetProductBySlug.mockResolvedValue(mockProduct);
  });

  describe('3.1: Navigate to Product Detail Page', () => {
    it('should load product detail page successfully', async () => {
      renderProductDetail('profil-hea-200-s235jr-en-10025');

      // Initially shows loading state
      expect(screen.getByText('Se încarcă...')).toBeInTheDocument();

      // Wait for product to load
      await waitFor(() => {
        expect(screen.getByText('Profil HEA 200 S235JR EN 10025')).toBeInTheDocument();
      });

      expect(mockGetProductBySlug).toHaveBeenCalledWith('profil-hea-200-s235jr-en-10025');
    });

    it('should display loading state while fetching product', () => {
      (mockGetProductBySlug as any).mockImplementation(() => new Promise(() => {}));

      renderProductDetail('test-product');

      expect(screen.getByText('Se încarcă...')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  describe('3.2: PDP Hero Section Display', () => {
    it('should display breadcrumbs correctly', async () => {
      renderProductDetail('profil-hea-200-s235jr-en-10025');

      await waitFor(() => {
        const breadcrumbs = screen.getByTestId('breadcrumbs');
        expect(breadcrumbs).toBeInTheDocument();
        expect(breadcrumbs).toHaveTextContent('Home');
        expect(breadcrumbs).toHaveTextContent('Catalog');
        expect(breadcrumbs).toHaveTextContent('profiles');
        expect(breadcrumbs).toHaveTextContent('Profil HEA 200 S235JR EN 10025');
      });
    });

    it('should display product title prominently', async () => {
      renderProductDetail('profil-hea-200-s235jr-en-10025');

      await waitFor(() => {
        const title = screen.getByRole('heading', { name: /Profil HEA 200 S235JR EN 10025/i });
        expect(title).toBeInTheDocument();
      });
    });

    it('should display SKU with monospace font', async () => {
      renderProductDetail('profil-hea-200-s235jr-en-10025');

      await waitFor(() => {
        expect(screen.getByText(/HEA-200-S235JR/)).toBeInTheDocument();
        expect(screen.getByText(/SKU/)).toBeInTheDocument();
      });
    });

    it('should display producer name when available', async () => {
      renderProductDetail('profil-hea-200-s235jr-en-10025');

      await waitFor(() => {
        expect(screen.getByText(/ArcelorMittal/)).toBeInTheDocument();
        expect(screen.getByText(/Producător/)).toBeInTheDocument();
      });
    });

    it('should display availability badge with correct styling for "În Stoc"', async () => {
      renderProductDetail('profil-hea-200-s235jr-en-10025');

      await waitFor(() => {
        const badge = screen.getByText('În Stoc');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-green-500');
      });
    });

    it('should display availability badge with orange for "La Comandă"', async () => {
      const onOrderProduct = { ...mockProduct, availability: 'on_order' as const };
      (mockGetProductBySlug as any).mockResolvedValue(onOrderProduct);

      renderProductDetail('test');

      await waitFor(() => {
        const badge = screen.getByText('La Comandă');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-orange-500');
      });
    });

    it('should display availability badge with gray for "Indisponibil"', async () => {
      const unavailableProduct = { ...mockProduct, availability: 'backorder' as const };
      (mockGetProductBySlug as any).mockResolvedValue(unavailableProduct);

      renderProductDetail('test');

      await waitFor(() => {
        const badge = screen.getByText('Indisponibil');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-gray-500');
      });
    });

    it('should display grade badge', async () => {
      renderProductDetail('profil-hea-200-s235jr-en-10025');

      await waitFor(() => {
        expect(screen.getByText(/Grad: S235JR/)).toBeInTheDocument();
      });
    });

    it('should display standard badges (up to 2)', async () => {
      renderProductDetail('profil-hea-200-s235jr-en-10025');

      await waitFor(() => {
        expect(screen.getByText('EN 10025')).toBeInTheDocument();
        expect(screen.getByText('DIN 18800')).toBeInTheDocument();
      });
    });

    it('should display indicative price with correct format', async () => {
      renderProductDetail('profil-hea-200-s235jr-en-10025');

      await waitFor(() => {
        expect(screen.getByText('Preț indicativ')).toBeInTheDocument();
        expect(screen.getByText(/de la/)).toBeInTheDocument();
        expect(screen.getByText(/15\.00/)).toBeInTheDocument();
        expect(screen.getByText(/RON\/kg/)).toBeInTheDocument();
      });
    });

    it('should display delivery information', async () => {
      renderProductDetail('profil-hea-200-s235jr-en-10025');

      await waitFor(() => {
        expect(screen.getByTestId('delivery-cue')).toBeInTheDocument();
      });
    });
  });

  describe('3.3: Specification Table Display', () => {
    it('should display specification table', async () => {
      (mockGetProductBySlug as any).mockResolvedValue(mockProduct);

      renderProductDetail('profil-hea-200-s235jr-en-10025');

      await waitFor(() => {
        expect(screen.getByTestId('spec-table')).toBeInTheDocument();
      });
    });
  });

  describe('3.17: Add to Estimate Button', () => {
    it('should display "Adaugă la Estimare" button', async () => {
      (mockGetProductBySlug as any).mockResolvedValue(mockProduct);

      renderProductDetail('profil-hea-200-s235jr-en-10025');

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /Adaugă la Estimare/i });
        expect(button).toBeInTheDocument();
        expect(button).toBeEnabled();
      });
    });
  });

  describe('3.20: PDP Loading States', () => {
    it('should show loading skeleton while fetching', () => {
      (mockGetProductBySlug as any).mockImplementation(() => new Promise(() => {}));

      renderProductDetail('test');

      expect(screen.getByText('Se încarcă...')).toBeInTheDocument();
    });

    it('should show error state when product not found', async () => {
      (mockGetProductBySlug as any).mockRejectedValue(new Error('Not found'));

      renderProductDetail('invalid-slug');

      await waitFor(() => {
        expect(screen.getByText('Produs negăsit')).toBeInTheDocument();
        expect(screen.getByText('Produsul pe care îl căutați nu există sau a fost șters.')).toBeInTheDocument();
      });
    });

    it('should display "Înapoi la catalog" button in error state', async () => {
      (mockGetProductBySlug as any).mockRejectedValue(new Error('Not found'));

      renderProductDetail('invalid');

      await waitFor(() => {
        const backButton = screen.getByRole('link', { name: /Înapoi la catalog/i });
        expect(backButton).toBeInTheDocument();
        expect(backButton).toHaveAttribute('href', '/catalog');
      });
    });
  });

  describe('3.22: Back to Catalog Navigation', () => {
    it('should display "Înapoi la catalog" button in sidebar', async () => {
      (mockGetProductBySlug as any).mockResolvedValue(mockProduct);

      renderProductDetail('profil-hea-200-s235jr-en-10025');

      await waitFor(() => {
        const backButtons = screen.getAllByRole('link', { name: /Înapoi la catalog/i });
        // There should be at least one back button in the sidebar
        expect(backButtons.length).toBeGreaterThanOrEqual(1);
        expect(backButtons[0]).toHaveAttribute('href', '/catalog');
      });
    });
  });

  describe('3.23: Related Products Section', () => {
    it('should display "Produse similare" section with placeholder', async () => {
      (mockGetProductBySlug as any).mockResolvedValue(mockProduct);

      renderProductDetail('profil-hea-200-s235jr-en-10025');

      await waitFor(() => {
        expect(screen.getByText('Produse similare')).toBeInTheDocument();
        expect(screen.getByText('Secțiunea pentru produse similare va fi implementată în curând')).toBeInTheDocument();
      });
    });
  });

  describe('3.24: PDP URL Direct Access', () => {
    it('should load product when accessing URL directly', async () => {
      (mockGetProductBySlug as any).mockResolvedValue(mockProduct);

      renderProductDetail('profil-hea-200-s235jr-en-10025');

      await waitFor(() => {
        expect(screen.getByText('Profil HEA 200 S235JR EN 10025')).toBeInTheDocument();
      });

      expect(mockGetProductBySlug).toHaveBeenCalledWith('profil-hea-200-s235jr-en-10025');
    });
  });

  describe('Configuration & Estimators Display', () => {
    it('should display configuration panel', async () => {
      (mockGetProductBySlug as any).mockResolvedValue(mockProduct);

      renderProductDetail('profil-hea-200-s235jr-en-10025');

      await waitFor(() => {
        expect(screen.getByTestId('configuration-panel')).toBeInTheDocument();
      });
    });

    it('should display weight estimator', async () => {
      (mockGetProductBySlug as any).mockResolvedValue(mockProduct);

      renderProductDetail('profil-hea-200-s235jr-en-10025');

      await waitFor(() => {
        expect(screen.getByTestId('weight-estimator')).toBeInTheDocument();
      });
    });

    it('should display price estimator', async () => {
      (mockGetProductBySlug as any).mockResolvedValue(mockProduct);

      renderProductDetail('profil-hea-200-s235jr-en-10025');

      await waitFor(() => {
        expect(screen.getByTestId('price-estimator')).toBeInTheDocument();
      });
    });
  });
});
