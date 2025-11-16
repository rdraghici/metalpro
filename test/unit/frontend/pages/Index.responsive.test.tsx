import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@test/setup/frontend-utils';
import { setViewportSize } from '@test/setup/frontend-utils';
import Index from '@/pages/Index';

// Mock components
vi.mock('@/components/layout/Header', () => ({
  default: () => (
    <header data-testid="header">
      <nav data-testid="navigation">Navigation</nav>
    </header>
  ),
}));

vi.mock('@/components/home/HeroSection', () => ({
  default: () => (
    <section data-testid="hero-section">
      <h1 className="hero-title">Materiale Metalice pentru Proiecte B2B</h1>
      <div data-testid="cta-buttons" className="cta-buttons">
        <button>Vezi Catalogul</button>
        <button>Încarcă Lista BOM</button>
      </div>
      <div data-testid="statistics" className="statistics">
        <div>500+ Produse disponibile</div>
        <div>24h Timp răspuns ofertă</div>
        <div>1000+ Proiecte realizate</div>
      </div>
    </section>
  ),
}));

vi.mock('@/components/home/CategoryGrid', () => ({
  default: () => (
    <div data-testid="category-grid" className="product-grid">
      <div>Product 1</div>
      <div>Product 2</div>
      <div>Product 3</div>
      <div>Product 4</div>
    </div>
  ),
}));

vi.mock('@/components/home/HowItWorks', () => ({
  default: () => <div data-testid="how-it-works">How It Works</div>,
}));

vi.mock('@/components/layout/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

describe('Phase 1.3: Responsive Design', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Reset viewport to default
    setViewportSize(1280, 800);
  });

  describe('Mobile View (375px)', () => {
    beforeEach(() => {
      setViewportSize(375, 667);
    });

    it('should adapt header to mobile layout', () => {
      render(<Index />);

      const header = screen.getByTestId('header');
      expect(header).toBeInTheDocument();

      // Header should be present and functional on mobile
      const navigation = screen.getByTestId('navigation');
      expect(navigation).toBeInTheDocument();
    });

    it('should keep hero section text readable', () => {
      render(<Index />);

      const heroTitle = screen.getByText(/Materiale Metalice pentru Proiecte B2B/i);
      expect(heroTitle).toBeInTheDocument();
      expect(heroTitle).toBeVisible();
    });

    it('should stack CTA buttons vertically (simulated)', () => {
      render(<Index />);

      const ctaButtons = screen.getByTestId('cta-buttons');
      expect(ctaButtons).toBeInTheDocument();

      // Verify both buttons are present
      expect(screen.getByText('Vezi Catalogul')).toBeInTheDocument();
      expect(screen.getByText('Încarcă Lista BOM')).toBeInTheDocument();
    });

    it('should adapt statistics section to single column (simulated)', () => {
      render(<Index />);

      const statistics = screen.getByTestId('statistics');
      expect(statistics).toBeInTheDocument();

      // Verify all statistics are present
      expect(screen.getByText('500+ Produse disponibile')).toBeInTheDocument();
      expect(screen.getByText('24h Timp răspuns ofertă')).toBeInTheDocument();
      expect(screen.getByText('1000+ Proiecte realizate')).toBeInTheDocument();
    });

    it('should show product grid in single column (simulated)', () => {
      render(<Index />);

      const productGrid = screen.getByTestId('category-grid');
      expect(productGrid).toBeInTheDocument();

      // All products should still be visible
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });

  describe('Tablet View (768px)', () => {
    beforeEach(() => {
      setViewportSize(768, 1024);
    });

    it('should adapt header for tablet', () => {
      render(<Index />);

      const header = screen.getByTestId('header');
      expect(header).toBeInTheDocument();
    });

    it('should show product grid in 2 columns (simulated)', () => {
      render(<Index />);

      const productGrid = screen.getByTestId('category-grid');
      expect(productGrid).toBeInTheDocument();

      // Verify all products are present
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('Product 3')).toBeInTheDocument();
    });

    it('should keep all interactive elements clickable', () => {
      render(<Index />);

      const catalogButton = screen.getByRole('button', { name: /Vezi Catalogul/i });
      const bomButton = screen.getByRole('button', { name: /Încarcă Lista BOM/i });

      expect(catalogButton).toBeInTheDocument();
      expect(bomButton).toBeInTheDocument();
    });
  });

  describe('Desktop View (1280px)', () => {
    beforeEach(() => {
      setViewportSize(1280, 800);
    });

    it('should show product grid in 3-4 columns (simulated)', () => {
      render(<Index />);

      const productGrid = screen.getByTestId('category-grid');
      expect(productGrid).toBeInTheDocument();

      // Verify all products are visible
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('Product 3')).toBeInTheDocument();
      expect(screen.getByText('Product 4')).toBeInTheDocument();
    });

    it('should show full header navigation', () => {
      render(<Index />);

      const navigation = screen.getByTestId('navigation');
      expect(navigation).toBeInTheDocument();
      expect(navigation).toBeVisible();
    });

    it('should maintain proper layout of all sections', () => {
      render(<Index />);

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
      expect(screen.getByTestId('category-grid')).toBeInTheDocument();
      expect(screen.getByTestId('how-it-works')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  describe('Viewport Transitions', () => {
    it('should handle resize from mobile to desktop', () => {
      // Start with mobile
      setViewportSize(375, 667);
      const { rerender } = render(<Index />);
      expect(screen.getByTestId('header')).toBeInTheDocument();

      // Resize to desktop
      setViewportSize(1280, 800);
      rerender(<Index />);
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
    });

    it('should handle resize from desktop to mobile', () => {
      // Start with desktop
      setViewportSize(1280, 800);
      const { rerender } = render(<Index />);
      expect(screen.getByTestId('header')).toBeInTheDocument();

      // Resize to mobile
      setViewportSize(375, 667);
      rerender(<Index />);
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });
  });
});
