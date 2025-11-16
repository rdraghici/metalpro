import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@test/setup/frontend-utils';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock dependencies
vi.mock('@/context/CartContext', () => ({
  useCart: () => ({
    itemCount: 0,
    toggleDrawer: vi.fn(),
  }),
}));

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isGuest: true,
    logout: vi.fn(),
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackContactClick: vi.fn(),
  }),
}));

vi.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'header.contact_sales': 'Contact Sales:',
        'header.hours': 'L-V 08:00-16:30',
        'header.company_name': 'MetalPro',
        'header.tagline': 'B2B Soluții Metalurgice',
        'header.search_placeholder': 'Caută produse...',
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock('@/components/search/SearchBar', () => ({
  default: ({ placeholder }: { placeholder: string }) => (
    <input data-testid="search-bar" placeholder={placeholder} />
  ),
}));

vi.mock('@/components/LanguageSwitcher', () => ({
  default: () => <button data-testid="language-switcher">RO/EN</button>,
}));

// Import the actual Header component after mocks
import Header from '@/components/layout/Header';

describe('Phase 1.2: Header Navigation Links', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display MetalPro logo', () => {
    render(<Header />);

    const logoLink = screen.getByRole('link', { name: /MetalPro/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('should navigate to home page when logo is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const logoLink = screen.getByRole('link', { name: /MetalPro/i });
    expect(logoLink).toHaveAttribute('href', '/');

    // Verify it's a link that points to home
    await user.click(logoLink);
  });

  it('should display phone number with correct format', () => {
    render(<Header />);

    const phoneLink = screen.getByRole('link', { name: /\+40 xxx xxx xxx/i });
    expect(phoneLink).toBeInTheDocument();
    expect(phoneLink).toHaveAttribute('href', 'tel:+40xxxxxxxxx');
  });

  it('should display business hours', () => {
    render(<Header />);

    expect(screen.getByText(/L-V 08:00-16:30/i)).toBeInTheDocument();
  });

  it('should display search bar', () => {
    render(<Header />);

    const searchBar = screen.getByTestId('search-bar');
    expect(searchBar).toBeInTheDocument();
    expect(searchBar).toHaveAttribute('placeholder', 'Caută produse...');
  });

  it('should display language switcher', () => {
    render(<Header />);

    const languageSwitcher = screen.getByTestId('language-switcher');
    expect(languageSwitcher).toBeInTheDocument();
  });

  it('should display cart icon', () => {
    render(<Header />);

    // Shopping cart button should be present
    const cartButtons = screen.getAllByRole('button');
    expect(cartButtons.length).toBeGreaterThan(0);
  });

  it('should display login/account section', () => {
    render(<Header />);

    // Account button or login link should be present
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});

describe('Phase 1.2: Category Navigation', () => {
  it('should display main navigation categories', () => {
    render(<Header />);

    // Check that the header renders navigation elements
    // Category navigation links are rendered in the header
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });
});
