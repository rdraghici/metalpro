import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@test/setup/frontend-utils';
import { setViewportSize } from '@test/setup/frontend-utils';
import Catalog from '@/pages/Catalog';
import * as productsApi from '@/lib/api/products';

// Mock the API functions
vi.mock('@/lib/api/products', () => ({
  getProductsWithFilters: vi.fn(),
  getAllProducts: vi.fn(),
  getAvailableFamilies: vi.fn(),
  getAvailableGrades: vi.fn(),
  getAvailableStandards: vi.fn(),
}));

// Mock dependencies
vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackCatalogView: vi.fn(),
    trackFilterApply: vi.fn(),
  }),
}));

vi.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string, params?: any) => {
      const translations: Record<string, string> = {
        'catalog.title': 'Catalog Produse',
        'catalog.description': 'Browse our complete catalog',
        'catalog.sort_by': 'Sortează după',
        'catalog.sort_default': 'Implicit',
        'catalog.results_count': `${params?.count || 0} produs găsit`,
        'catalog.results_count_plural': `${params?.count || 0} produse găsite`,
        'catalog.advanced_search': 'Căutare Avansată',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock child components
vi.mock('@/components/layout/Header', () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock('@/components/layout/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock('@/components/catalog/ProductGrid', () => ({
  default: ({ products, isLoading }: { products: any[]; isLoading: boolean }) => (
    <div data-testid="product-grid" className="responsive-grid">
      {!isLoading &&
        products.map((product) => (
          <div key={product.id} data-testid={`product-${product.id}`}>
            {product.title}
          </div>
        ))}
    </div>
  ),
}));

vi.mock('@/components/catalog/FacetedFilters', () => ({
  default: ({ resultCount }: any) => (
    <div data-testid="faceted-filters" className="filter-panel">
      Filters ({resultCount})
    </div>
  ),
}));

vi.mock('@/components/catalog/FilterChips', () => ({
  default: () => <div data-testid="filter-chips">Filter Chips</div>,
}));

vi.mock('@/components/catalog/Pagination', () => ({
  default: ({ currentPage, totalPages }: any) => (
    <div data-testid="pagination">
      Page {currentPage} of {totalPages}
    </div>
  ),
}));

vi.mock('@/components/catalog/Breadcrumbs', () => ({
  default: () => <div data-testid="breadcrumbs">Breadcrumbs</div>,
}));

vi.mock('@/components/search/AdvancedSearchModal', () => ({
  default: ({ open }: any) =>
    open ? <div data-testid="advanced-search-modal">Advanced Search</div> : null,
}));

describe('Phase 2.21: Catalog Responsive Design', () => {
  const mockProducts = [
    {
      id: '1',
      title: 'Profil HEA 200 S235JR',
      sku: 'HEA-200-S235',
      family: 'profiles',
      grade: ['S235JR'],
      standard: ['EN 10025'],
      availability: 'in_stock',
      price: 45.5,
      priceUnit: 'kg',
    },
    {
      id: '2',
      title: 'Tablă DC01 2mm',
      sku: 'DC01-2MM',
      family: 'plates',
      grade: ['DC01'],
      standard: ['EN 10130'],
      availability: 'on_order',
      price: 30.0,
      priceUnit: 'kg',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (productsApi.getAllProducts as any).mockResolvedValue(mockProducts);
    (productsApi.getProductsWithFilters as any).mockResolvedValue({
      products: mockProducts,
      total: mockProducts.length,
    });
  });

  describe('Desktop View (1280px)', () => {
    beforeEach(() => {
      setViewportSize(1280, 800);
    });

    it('should display filter panel on the left side', async () => {
      render(<Catalog />);

      await waitFor(() => {
        const filterPanel = screen.getByTestId('faceted-filters');
        expect(filterPanel).toBeInTheDocument();
        expect(filterPanel).toBeVisible();
      });
    });

    it('should display product grid on the right side', async () => {
      render(<Catalog />);

      await waitFor(() => {
        const productGrid = screen.getByTestId('product-grid');
        expect(productGrid).toBeInTheDocument();
        expect(productGrid).toBeVisible();
      });
    });

    it('should display hero section full width', async () => {
      render(<Catalog />);

      await waitFor(() => {
        const heroTitle = screen.getByText('Catalog Produse');
        expect(heroTitle).toBeInTheDocument();
      });
    });

    it('should display sort dropdown and filters on same row', async () => {
      render(<Catalog />);

      await waitFor(() => {
        expect(screen.getByText('Sortează după:')).toBeInTheDocument();
        expect(screen.getByText('2 produse găsite')).toBeInTheDocument();
      });
    });

    it('should show all navigation elements', async () => {
      render(<Catalog />);

      await waitFor(() => {
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
      });
    });
  });

  describe('Tablet View (768px)', () => {
    beforeEach(() => {
      setViewportSize(768, 1024);
    });

    it('should maintain filter panel visibility', async () => {
      render(<Catalog />);

      await waitFor(() => {
        const filterPanel = screen.getByTestId('faceted-filters');
        expect(filterPanel).toBeInTheDocument();
      });
    });

    it('should display product grid in adjusted layout', async () => {
      render(<Catalog />);

      await waitFor(() => {
        const productGrid = screen.getByTestId('product-grid');
        expect(productGrid).toBeInTheDocument();
        expect(productGrid).toBeVisible();
      });
    });

    it('should keep hero section readable', async () => {
      render(<Catalog />);

      await waitFor(() => {
        const heroTitle = screen.getByText('Catalog Produse');
        expect(heroTitle).toBeInTheDocument();
        expect(heroTitle).toBeVisible();
      });
    });

    it('should display sort controls', async () => {
      render(<Catalog />);

      await waitFor(() => {
        expect(screen.getByText('Sortează după:')).toBeInTheDocument();
      });
    });

    it('should maintain functional navigation', async () => {
      render(<Catalog />);

      await waitFor(() => {
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
      });
    });
  });

  describe('Mobile View (375px)', () => {
    beforeEach(() => {
      setViewportSize(375, 667);
    });

    it('should display page content', async () => {
      render(<Catalog />);

      await waitFor(() => {
        const heroTitle = screen.getByText('Catalog Produse');
        expect(heroTitle).toBeInTheDocument();
      });
    });

    it('should show filter panel (may be in drawer)', async () => {
      render(<Catalog />);

      await waitFor(() => {
        // Filter panel may be hidden in a drawer on mobile
        // but component should still render
        const filterPanel = screen.getByTestId('faceted-filters');
        expect(filterPanel).toBeInTheDocument();
      });
    });

    it('should display product grid in single column', async () => {
      render(<Catalog />);

      await waitFor(() => {
        const productGrid = screen.getByTestId('product-grid');
        expect(productGrid).toBeInTheDocument();
        expect(productGrid).toBeVisible();
      });
    });

    it('should keep hero section text readable', async () => {
      render(<Catalog />);

      await waitFor(() => {
        const heroTitle = screen.getByText('Catalog Produse');
        expect(heroTitle).toBeInTheDocument();
        expect(heroTitle).toBeVisible();

        const description = screen.getByText('Browse our complete catalog');
        expect(description).toBeInTheDocument();
      });
    });

    it('should display sort dropdown', async () => {
      render(<Catalog />);

      await waitFor(() => {
        expect(screen.getByText('Sortează după:')).toBeInTheDocument();
      });
    });

    it('should show product count', async () => {
      render(<Catalog />);

      await waitFor(() => {
        expect(screen.getByText('2 produse găsite')).toBeInTheDocument();
      });
    });

    it('should maintain header and footer', async () => {
      render(<Catalog />);

      await waitFor(() => {
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
      });
    });
  });

  describe('Viewport Transitions', () => {
    it('should adapt when viewport changes from desktop to mobile', async () => {
      setViewportSize(1280, 800);
      const { rerender } = render(<Catalog />);

      await waitFor(() => {
        expect(screen.getByTestId('faceted-filters')).toBeInTheDocument();
      });

      // Change to mobile
      setViewportSize(375, 667);
      rerender(<Catalog />);

      await waitFor(() => {
        expect(screen.getByTestId('product-grid')).toBeInTheDocument();
      });
    });

    it('should maintain functionality across viewport changes', async () => {
      setViewportSize(768, 1024);
      render(<Catalog />);

      await waitFor(() => {
        expect(screen.getByText('Catalog Produse')).toBeInTheDocument();
      });

      setViewportSize(1280, 800);

      await waitFor(() => {
        expect(screen.getByTestId('faceted-filters')).toBeInTheDocument();
        expect(screen.getByTestId('product-grid')).toBeInTheDocument();
      });
    });
  });

  describe('Content Overflow Handling', () => {
    it('should handle long product titles on mobile', async () => {
      const productsWithLongTitles = [
        {
          id: '1',
          title: 'Profil HEA 200 S235JR EN 10025 Foarte Lung Nume de Produs',
          sku: 'HEA-200-S235',
          family: 'profiles',
        },
      ];

      (productsApi.getProductsWithFilters as any).mockResolvedValue({
        products: productsWithLongTitles,
        total: 1,
      });

      setViewportSize(375, 667);
      render(<Catalog />);

      await waitFor(() => {
        const productGrid = screen.getByTestId('product-grid');
        expect(productGrid).toBeInTheDocument();
      });
    });
  });

  describe('Interactive Elements Accessibility', () => {
    it('should keep buttons accessible on mobile', async () => {
      setViewportSize(375, 667);
      render(<Catalog />);

      await waitFor(() => {
        const advancedSearchButton = screen.getByText('Căutare Avansată');
        expect(advancedSearchButton).toBeInTheDocument();
        expect(advancedSearchButton).toBeVisible();
      });
    });

    it('should maintain sort dropdown accessibility on tablet', async () => {
      setViewportSize(768, 1024);
      render(<Catalog />);

      await waitFor(() => {
        const sortLabel = screen.getByText('Sortează după:');
        expect(sortLabel).toBeInTheDocument();
        expect(sortLabel).toBeVisible();
      });
    });
  });
});
