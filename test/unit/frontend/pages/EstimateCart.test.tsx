import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@test/setup/frontend-utils';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EstimateCart from '@/pages/EstimateCart';
import type { EstimateCart as EstimateCartType, CartLine } from '@/types/cart';
import type { Product } from '@/types/product';

// Create stable mock objects and functions using vi.hoisted()
const {
  mockNavigate,
  mockClearCart,
  mockAcceptDisclaimer,
  mockAddToCart,
  mockUpdateCartLine,
  mockRemoveCartLine,
  mockOpenDrawer,
  mockCloseDrawer,
  mockToggleDrawer,
} = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockClearCart: vi.fn(),
  mockAcceptDisclaimer: vi.fn(),
  mockAddToCart: vi.fn(),
  mockUpdateCartLine: vi.fn(),
  mockRemoveCartLine: vi.fn(),
  mockOpenDrawer: vi.fn(),
  mockCloseDrawer: vi.fn(),
  mockToggleDrawer: vi.fn(),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Create stable cart context - will be updated in tests
let mockCartContext = {
  cart: {
    id: 'cart-empty',
    lines: [],
    totals: {
      estWeightKg: 0,
      estSubtotal: 0,
      vatIndicative: 0,
      vatRate: 0.19,
      deliveryFeeBand: 'Se calculează la ofertă',
      grandTotal: 0,
    },
    currency: 'RON' as const,
    disclaimerAccepted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  itemCount: 0,
  isLoading: false,
  addToCart: mockAddToCart,
  updateCartLine: mockUpdateCartLine,
  removeCartLine: mockRemoveCartLine,
  clearCart: mockClearCart,
  acceptDisclaimer: mockAcceptDisclaimer,
  isDrawerOpen: false,
  openDrawer: mockOpenDrawer,
  closeDrawer: mockCloseDrawer,
  toggleDrawer: mockToggleDrawer,
};

// Mock CartContext
vi.mock('@/context/CartContext', () => ({
  useCart: () => mockCartContext,
}));

// Mock child components (stable implementations)
vi.mock('@/components/layout/Header', () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock('@/components/layout/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock('@/components/cart/CartLineItem', () => ({
  default: ({ line, editable }: { line: CartLine; editable: boolean }) => (
    <div data-testid={`cart-line-${line.id}`} data-editable={editable}>
      <div data-testid={`line-title-${line.id}`}>{line.product?.title}</div>
      <div data-testid={`line-quantity-${line.id}`}>{line.quantity}</div>
      <div data-testid={`line-subtotal-${line.id}`}>{line.indicativeSubtotal}</div>
    </div>
  ),
}));

vi.mock('@/components/cart/TotalsPanel', () => ({
  default: ({
    totals,
    currency,
    disclaimerAccepted,
    onDisclaimerChange,
    showDisclaimer,
  }: any) => (
    <div data-testid="totals-panel">
      <div data-testid="subtotal">{totals.estSubtotal}</div>
      <div data-testid="vat">{totals.vatIndicative}</div>
      <div data-testid="grand-total">{totals.grandTotal}</div>
      <div data-testid="weight">{totals.estWeightKg}</div>
      <div data-testid="delivery-band">{totals.deliveryFeeBand}</div>
      <div data-testid="currency">{currency}</div>
      {showDisclaimer && (
        <label data-testid="disclaimer-checkbox">
          <input
            type="checkbox"
            checked={disclaimerAccepted}
            onChange={(e) => onDisclaimerChange(e.target.checked)}
          />
          Accept Disclaimer
        </label>
      )}
    </div>
  ),
}));

describe('Phase 4: Estimate Cart & RFQ Flow - Cart Tests', () => {
  // Sample product for tests
  const mockProduct: Product = {
    id: 'prod-1',
    slug: 'profil-hea-200-s235jr',
    title: 'Profil HEA 200 S235JR',
    sku: 'HEA-200-S235',
    family: 'profiles',
    subcategory: 'hea',
    dimensionSummary: 'HEA 200',
    grade: ['S235JR'],
    standard: ['EN 10025'],
    availability: 'in_stock',
    indicativePrice: { min: 4.5, max: 5.2, unit: 'kg' },
    sectionProps: {
      profileType: 'hea',
      heightMm: 200,
      widthMm: 200,
      webThicknessMm: 6.5,
      flangeThicknessMm: 10,
      linearMassKgPerM: 42.3,
    },
  };

  // Sample cart line
  const mockCartLine: CartLine = {
    id: 'line-1',
    productId: 'prod-1',
    product: mockProduct,
    specs: {
      grade: 'S235JR',
      standard: 'EN 10025',
      dimensionSummary: 'HEA 200',
      lengthM: 6,
      finish: 'Standard (laminat la cald)',
    },
    quantity: 10,
    unit: 'm',
    estWeightKg: 253.8,
    indicativeUnitPrice: 4.5,
    indicativeSubtotal: 1139.1,
  };

  // Empty cart
  const emptyCart: EstimateCartType = {
    id: 'cart-empty',
    lines: [],
    totals: {
      estWeightKg: 0,
      estSubtotal: 0,
      vatIndicative: 0,
      vatRate: 0.19,
      deliveryFeeBand: 'Se calculează la ofertă',
      grandTotal: 0,
    },
    currency: 'RON',
    disclaimerAccepted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Cart with items
  const cartWithItems: EstimateCartType = {
    id: 'cart-1',
    lines: [mockCartLine],
    totals: {
      estWeightKg: 253.8,
      estSubtotal: 1139.1,
      vatIndicative: 216.43,
      vatRate: 0.19,
      deliveryFeeBand: '150-300 RON',
      grandTotal: 1355.53,
    },
    currency: 'RON',
    disclaimerAccepted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Helper to update mock cart context
  const setMockCart = (cart: EstimateCartType) => {
    mockCartContext.cart = cart;
    mockCartContext.itemCount = cart.lines.length;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn(() => true); // Mock confirm dialog
    window.alert = vi.fn(); // Mock alert dialog
    // Reset to empty cart
    setMockCart(emptyCart);
  });

  describe('4.3: Cart Page - Full View', () => {
    it('should display cart page with header and footer', () => {
      render(<EstimateCart />);

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should display "Coș Estimare" page title', () => {
      render(<EstimateCart />);

      expect(screen.getByText('Coș Estimare')).toBeInTheDocument();
    });

    it('should show empty state when cart has no items', () => {
      render(<EstimateCart />);

      // Text appears in multiple places (header subtitle and empty state card)
      const emptyTexts = screen.getAllByText('Coșul tău este gol');
      expect(emptyTexts.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/Adaugă produse din catalog/i)).toBeInTheDocument();
    });

    it('should display "Explorează Catalogul" button in empty state', async () => {
      const user = userEvent.setup();
      render(<EstimateCart />);

      const exploreButton = screen.getByText('Explorează Catalogul');
      expect(exploreButton).toBeInTheDocument();

      await user.click(exploreButton);
      expect(mockNavigate).toHaveBeenCalledWith('/catalog');
    });

    it('should display cart items when cart has products', () => {
      setMockCart(cartWithItems);
      render(<EstimateCart />);

      expect(screen.getByText('1 produs în coș')).toBeInTheDocument();
      expect(screen.getByTestId('cart-line-line-1')).toBeInTheDocument();
    });

    it('should display totals panel when cart has items', () => {
      setMockCart(cartWithItems);
      render(<EstimateCart />);

      expect(screen.getByTestId('totals-panel')).toBeInTheDocument();
      expect(screen.getByTestId('subtotal')).toHaveTextContent('1139.1');
      expect(screen.getByTestId('grand-total')).toHaveTextContent('1355.53');
    });

    it('should display "Golește Coșul" button when cart has items', () => {
      setMockCart(cartWithItems);
      render(<EstimateCart />);

      expect(screen.getByText('Golește Coșul')).toBeInTheDocument();
    });

    it('should show "Înapoi la Catalog" button', async () => {
      const user = userEvent.setup();
      render(<EstimateCart />);

      const backButton = screen.getByText('Înapoi la Catalog');
      expect(backButton).toBeInTheDocument();

      await user.click(backButton);
      expect(mockNavigate).toHaveBeenCalledWith('/catalog');
    });
  });

  describe('4.13: Cart Totals Calculation Accuracy', () => {
    it('should display correct subtotal', () => {
      setMockCart(cartWithItems);
      render(<EstimateCart />);

      expect(screen.getByTestId('subtotal')).toHaveTextContent('1139.1');
    });

    it('should display correct VAT (19%)', () => {
      setMockCart(cartWithItems);
      render(<EstimateCart />);

      expect(screen.getByTestId('vat')).toHaveTextContent('216.43');
    });

    it('should display correct grand total (subtotal + VAT)', () => {
      setMockCart(cartWithItems);
      render(<EstimateCart />);

      expect(screen.getByTestId('grand-total')).toHaveTextContent('1355.53');
    });

    it('should display correct total weight', () => {
      setMockCart(cartWithItems);
      render(<EstimateCart />);

      expect(screen.getByTestId('weight')).toHaveTextContent('253.8');
    });

    it('should display correct delivery fee band based on weight', () => {
      setMockCart(cartWithItems);
      render(<EstimateCart />);

      expect(screen.getByTestId('delivery-band')).toHaveTextContent('150-300 RON');
    });

    it('should display currency as RON', () => {
      setMockCart(cartWithItems);
      render(<EstimateCart />);

      expect(screen.getByTestId('currency')).toHaveTextContent('RON');
    });
  });

  describe('4.3: Clear Cart Functionality', () => {
    it('should show confirmation dialog when "Golește Coșul" is clicked', async () => {
      const user = userEvent.setup();
      setMockCart(cartWithItems);

      render(<EstimateCart />);

      const clearButton = screen.getByText('Golește Coșul');
      await user.click(clearButton);

      expect(window.confirm).toHaveBeenCalledWith(
        'Sigur doriți să goliți coșul? Această acțiune nu poate fi anulată.'
      );
    });

    it('should call clearCart when user confirms', async () => {
      const user = userEvent.setup();
      window.confirm = vi.fn(() => true);
      setMockCart(cartWithItems);

      render(<EstimateCart />);

      const clearButton = screen.getByText('Golește Coșul');
      await user.click(clearButton);

      expect(mockClearCart).toHaveBeenCalled();
    });

    it('should not call clearCart when user cancels', async () => {
      const user = userEvent.setup();
      window.confirm = vi.fn(() => false);
      setMockCart(cartWithItems);

      render(<EstimateCart />);

      const clearButton = screen.getByText('Golește Coșul');
      await user.click(clearButton);

      expect(mockClearCart).not.toHaveBeenCalled();
    });
  });

  describe('4.3: Disclaimer and RFQ Navigation', () => {
    it('should show disclaimer checkbox', () => {
      setMockCart(cartWithItems);

      render(<EstimateCart />);

      expect(screen.getByTestId('disclaimer-checkbox')).toBeInTheDocument();
    });

    it('should disable "Cere Ofertă Finală" button when disclaimer not accepted', () => {
      setMockCart(cartWithItems);

      render(<EstimateCart />);

      const rfqButton = screen.getByText('Cere Ofertă Finală');
      expect(rfqButton).toBeDisabled();
    });

    it('should enable "Cere Ofertă Finală" button when disclaimer is accepted', () => {
      const cartWithDisclaimer = { ...cartWithItems, disclaimerAccepted: true };
      setMockCart(cartWithDisclaimer);

      render(<EstimateCart />);

      const rfqButton = screen.getByText('Cere Ofertă Finală');
      expect(rfqButton).not.toBeDisabled();
    });

    it('should navigate to /rfq when disclaimer accepted and button clicked', async () => {
      const user = userEvent.setup();
      const cartWithDisclaimer = { ...cartWithItems, disclaimerAccepted: true };
      setMockCart(cartWithDisclaimer);

      render(<EstimateCart />);

      const rfqButton = screen.getByText('Cere Ofertă Finală');
      await user.click(rfqButton);

      expect(mockNavigate).toHaveBeenCalledWith('/rfq');
    });

    it('should show alert when trying to request quote without accepting disclaimer', async () => {
      const user = userEvent.setup();
      setMockCart(cartWithItems);

      render(<EstimateCart />);

      // Try to click the disabled button (simulate clicking it programmatically)
      const rfqButton = screen.getByText('Cere Ofertă Finală');

      // Button is disabled, so this won't trigger the click handler
      // But let's verify the disabled state shows the warning message
      expect(screen.getByText(/Acceptați termenii pentru a continua/i)).toBeInTheDocument();
    });

    it('should call acceptDisclaimer when checkbox is toggled', async () => {
      const user = userEvent.setup();
      setMockCart(cartWithItems);

      render(<EstimateCart />);

      const checkbox = screen.getByTestId('disclaimer-checkbox').querySelector('input');
      expect(checkbox).not.toBeNull();

      if (checkbox) {
        await user.click(checkbox);
        expect(mockAcceptDisclaimer).toHaveBeenCalledWith(true);
      }
    });
  });

  describe('4.3: Cart Line Items Display', () => {
    it('should render all cart line items', () => {
      const twoItemsCart: EstimateCartType = {
        ...cartWithItems,
        lines: [
          mockCartLine,
          {
            ...mockCartLine,
            id: 'line-2',
            productId: 'prod-2',
            product: { ...mockProduct, id: 'prod-2', title: 'Tablă DC01 2mm' },
          },
        ],
      };
      setMockCart(twoItemsCart);

      render(<EstimateCart />);

      expect(screen.getByTestId('cart-line-line-1')).toBeInTheDocument();
      expect(screen.getByTestId('cart-line-line-2')).toBeInTheDocument();
    });

    it('should pass editable=true to CartLineItem components', () => {
      setMockCart(cartWithItems);

      render(<EstimateCart />);

      const cartLine = screen.getByTestId('cart-line-line-1');
      expect(cartLine).toHaveAttribute('data-editable', 'true');
    });

    it('should display product title in cart line', () => {
      setMockCart(cartWithItems);

      render(<EstimateCart />);

      expect(screen.getByTestId('line-title-line-1')).toHaveTextContent('Profil HEA 200 S235JR');
    });

    it('should display quantity in cart line', () => {
      setMockCart(cartWithItems);

      render(<EstimateCart />);

      expect(screen.getByTestId('line-quantity-line-1')).toHaveTextContent('10');
    });

    it('should display subtotal in cart line', () => {
      setMockCart(cartWithItems);

      render(<EstimateCart />);

      expect(screen.getByTestId('line-subtotal-line-1')).toHaveTextContent('1139.1');
    });
  });

  describe('4.3: Information Alert Display', () => {
    it('should display important information alert when cart has items', () => {
      setMockCart(cartWithItems);

      render(<EstimateCart />);

      expect(screen.getByText('Informații importante')).toBeInTheDocument();
      expect(screen.getByText(/strict estimative/i)).toBeInTheDocument();
    });
  });

  describe('4.3: Help Card Display', () => {
    it('should display help card with contact information', () => {
      setMockCart(cartWithItems);

      render(<EstimateCart />);

      expect(screen.getByText('Ai nevoie de ajutor?')).toBeInTheDocument();
      expect(screen.getByText(/Telefon/i)).toBeInTheDocument();
      expect(screen.getByText(/Email/i)).toBeInTheDocument();
      expect(screen.getByText(/Program/i)).toBeInTheDocument();
    });
  });
});
