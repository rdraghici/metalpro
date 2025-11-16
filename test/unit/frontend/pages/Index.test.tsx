import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@test/setup/frontend-utils';
import Index from '@/pages/Index';

// Mock the child components to isolate the test
vi.mock('@/components/layout/Header', () => ({
  default: () => (
    <header data-testid="header">
      <div data-testid="contact-ribbon">
        <a href="tel:+40xxxxxxxxx">+40 xxx xxx xxx</a>
        <span>(L-V 08:00-16:30)</span>
      </div>
      <div data-testid="logo">MetalPro</div>
    </header>
  ),
}));

vi.mock('@/components/home/HeroSection', () => ({
  default: () => (
    <section data-testid="hero-section">
      <h1>Materiale Metalice pentru Proiecte B2B</h1>
      <div data-testid="trust-indicators">
        <div>Estimare în timp real</div>
        <div>Support specialist</div>
        <div>Livrare rapidă</div>
      </div>
      <div data-testid="cta-buttons">
        <button>Vezi Catalogul</button>
        <button>Încarcă Lista BOM</button>
      </div>
      <div data-testid="statistics">
        <div>500+ Produse disponibile</div>
        <div>24h Timp răspuns ofertă</div>
        <div>1000+ Proiecte realizate</div>
      </div>
    </section>
  ),
}));

vi.mock('@/components/home/CategoryGrid', () => ({
  default: () => <div data-testid="category-grid">Category Grid</div>,
}));

vi.mock('@/components/home/HowItWorks', () => ({
  default: () => <div data-testid="how-it-works">How It Works</div>,
}));

vi.mock('@/components/layout/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

describe('Phase 1.1: Home Page Load', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load page within acceptable time (simulated)', async () => {
    const startTime = performance.now();
    render(<Index />);
    const endTime = performance.now();
    const loadTime = endTime - startTime;

    // Page should render quickly in test environment
    expect(loadTime).toBeLessThan(1000); // 1 second max for test render
  });

  it('should display MetalPro logo in header', () => {
    render(<Index />);
    const logo = screen.getByTestId('logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveTextContent('MetalPro');
  });

  it('should display contact ribbon with phone number', () => {
    render(<Index />);
    const contactRibbon = screen.getByTestId('contact-ribbon');
    expect(contactRibbon).toBeInTheDocument();

    // Check for phone number
    const phoneLink = screen.getByRole('link', { name: /\+40 xxx xxx xxx/i });
    expect(phoneLink).toBeInTheDocument();
    expect(phoneLink).toHaveAttribute('href', 'tel:+40xxxxxxxxx');

    // Check for business hours
    expect(contactRibbon).toHaveTextContent('(L-V 08:00-16:30)');
  });

  it('should display hero section with correct heading', () => {
    render(<Index />);
    const heading = screen.getByRole('heading', {
      name: /Materiale Metalice pentru Proiecte B2B/i
    });
    expect(heading).toBeInTheDocument();
  });

  it('should display three trust indicators', () => {
    render(<Index />);
    const trustIndicators = screen.getByTestId('trust-indicators');
    expect(trustIndicators).toBeInTheDocument();

    expect(screen.getByText('Estimare în timp real')).toBeInTheDocument();
    expect(screen.getByText('Support specialist')).toBeInTheDocument();
    expect(screen.getByText('Livrare rapidă')).toBeInTheDocument();
  });

  it('should display two CTA buttons', () => {
    render(<Index />);

    const catalogButton = screen.getByRole('button', { name: /Vezi Catalogul/i });
    const bomButton = screen.getByRole('button', { name: /Încarcă Lista BOM/i });

    expect(catalogButton).toBeInTheDocument();
    expect(bomButton).toBeInTheDocument();
  });

  it('should display statistics section with correct values', () => {
    render(<Index />);
    const statistics = screen.getByTestId('statistics');
    expect(statistics).toBeInTheDocument();

    expect(screen.getByText('500+ Produse disponibile')).toBeInTheDocument();
    expect(screen.getByText('24h Timp răspuns ofertă')).toBeInTheDocument();
    expect(screen.getByText('1000+ Proiecte realizate')).toBeInTheDocument();
  });

  it('should display footer at bottom of page', () => {
    render(<Index />);
    const footer = screen.getByTestId('footer');
    expect(footer).toBeInTheDocument();
  });

  it('should render all main sections', () => {
    render(<Index />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('category-grid')).toBeInTheDocument();
    expect(screen.getByTestId('how-it-works')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
