import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@test/setup/frontend-utils';
import userEvent from '@testing-library/user-event';
import RFQForm from '@/pages/RFQForm';
import type { EstimateCart } from '@/types/cart';

// Create stable mock objects and functions using vi.hoisted()
const {
  mockNavigate,
  mockToast,
  mockTrackRFQStart,
  mockTrackRFQStep,
  mockTrackRFQSubmit,
  mockSubmitRFQ,
} = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockToast: vi.fn(),
  mockTrackRFQStart: vi.fn(),
  mockTrackRFQStep: vi.fn(),
  mockTrackRFQSubmit: vi.fn(),
  mockSubmitRFQ: vi.fn(),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock analytics
const mockAnalytics = {
  trackRFQStart: mockTrackRFQStart,
  trackRFQStep: mockTrackRFQStep,
  trackRFQSubmit: mockTrackRFQSubmit,
};

vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => mockAnalytics,
}));

// Mock RFQ API
vi.mock('@/lib/api/rfq', () => ({
  submitRFQ: mockSubmitRFQ,
}));

// Mock AuthContext
const mockAuthContext = {
  user: null,
  isGuest: true,
  login: vi.fn(),
  logout: vi.fn(),
  isLoading: false,
};

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => mockAuthContext,
}));

// Sample carts for testing
const emptyCart: EstimateCart = {
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

const cartWithItems: EstimateCart = {
  id: 'cart-1',
  lines: [
    {
      id: 'line-1',
      productId: 'prod-1',
      product: {
        id: 'prod-1',
        slug: 'profil-hea-200',
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
      },
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
    },
  ],
  totals: {
    estWeightKg: 253.8,
    estSubtotal: 1139.1,
    vatIndicative: 216.43,
    vatRate: 0.19,
    deliveryFeeBand: '150-300 RON',
    grandTotal: 1355.53,
  },
  currency: 'RON',
  disclaimerAccepted: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Create stable mock cart context
let mockCartContext = {
  cart: emptyCart,
  itemCount: 0,
  isLoading: false,
  addToCart: vi.fn(),
  updateCartLine: vi.fn(),
  removeCartLine: vi.fn(),
  clearCart: vi.fn(),
  acceptDisclaimer: vi.fn(),
  isDrawerOpen: false,
  openDrawer: vi.fn(),
  closeDrawer: vi.fn(),
  toggleDrawer: vi.fn(),
};

vi.mock('@/context/CartContext', () => ({
  useCart: () => mockCartContext,
}));

// Mock child components
vi.mock('@/components/layout/Header', () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock('@/components/layout/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock('@/components/rfq/FormStepIndicator', () => ({
  default: ({ currentStep, completedSteps, steps }: any) => (
    <div data-testid="step-indicator">
      <div data-testid="current-step">{currentStep}</div>
      <div data-testid="completed-steps">{Array.from(completedSteps).join(',')}</div>
      <div data-testid="total-steps">{steps.length}</div>
    </div>
  ),
}));

vi.mock('@/components/rfq/CompanyInfoStep', () => ({
  default: ({ initialData, onNext }: any) => (
    <div data-testid="company-info-step">
      <button
        data-testid="company-next-btn"
        onClick={() =>
          onNext({
            legalName: 'Test Company SRL',
            cuiVat: '14399840',
            billingAddress: {
              street: 'Str. Test 123',
              city: 'București',
              county: 'București',
              postalCode: '123456',
              country: 'România',
            },
            contact: {
              person: 'John Doe',
              phone: '+40712345678',
              email: 'john@test.com',
            },
            isVerifiedBusiness: true,
          })
        }
      >
        Next - Company Info
      </button>
    </div>
  ),
}));

vi.mock('@/components/rfq/DeliveryAddressStep', () => ({
  default: ({ initialData, onNext, onBack }: any) => (
    <div data-testid="delivery-address-step">
      <button data-testid="delivery-back-btn" onClick={onBack}>
        Back
      </button>
      <button
        data-testid="delivery-next-btn"
        onClick={() =>
          onNext({
            sameAsBilling: true,
            deliveryAddress: {
              street: 'Str. Test 123',
              city: 'București',
              county: 'București',
              postalCode: '123456',
              country: 'România',
            },
            desiredDeliveryDate: '2025-02-15',
          })
        }
      >
        Next - Delivery
      </button>
    </div>
  ),
}));

vi.mock('@/components/rfq/PreferencesStep', () => ({
  default: ({ initialData, onNext, onBack }: any) => (
    <div data-testid="preferences-step">
      <button data-testid="preferences-back-btn" onClick={onBack}>
        Back
      </button>
      <button
        data-testid="preferences-next-btn"
        onClick={() =>
          onNext({
            incoterm: 'DDP',
            paymentTermsPreference: 'Net 30',
            specialRequirements: 'Test requirements',
          })
        }
      >
        Next - Preferences
      </button>
    </div>
  ),
}));

vi.mock('@/components/rfq/AttachmentsStep', () => ({
  default: ({ initialData, onNext, onBack }: any) => (
    <div data-testid="attachments-step">
      <button data-testid="attachments-back-btn" onClick={onBack}>
        Back
      </button>
      <button
        data-testid="attachments-next-btn"
        onClick={() =>
          onNext({
            attachments: [],
            notes: 'Test notes',
          })
        }
      >
        Next - Attachments
      </button>
    </div>
  ),
}));

vi.mock('@/components/rfq/ReviewStep', () => ({
  default: ({ formData, cart, onEdit, onSubmit, onBack, isSubmitting }: any) => (
    <div data-testid="review-step">
      <div data-testid="review-company">{formData.company?.legalName}</div>
      <div data-testid="review-items">{cart.lines.length}</div>
      <button data-testid="review-back-btn" onClick={onBack}>
        Back
      </button>
      <button data-testid="review-submit-btn" onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit RFQ'}
      </button>
    </div>
  ),
}));

describe('Phase 4: RFQ Form Tests', () => {
  const setMockCart = (cart: EstimateCart) => {
    mockCartContext.cart = cart;
    mockCartContext.itemCount = cart.lines.length;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setMockCart(cartWithItems);
    // Clear sessionStorage
    sessionStorage.clear();
  });

  describe('4.11: RFQ Form - Empty Cart Protection', () => {
    it('should display error when cart is empty', () => {
      setMockCart(emptyCart);
      render(<RFQForm />);

      expect(screen.getByText('Coșul este gol')).toBeInTheDocument();
      expect(screen.getByText(/Pentru a putea cere o ofertă/i)).toBeInTheDocument();
    });

    it('should show "Înapoi la Catalog" button when cart is empty', () => {
      setMockCart(emptyCart);
      render(<RFQForm />);

      expect(screen.getByText('Înapoi la Catalog')).toBeInTheDocument();
    });

    it('should navigate to /catalog when button clicked on empty cart', async () => {
      const user = userEvent.setup();
      setMockCart(emptyCart);
      render(<RFQForm />);

      const backButton = screen.getByText('Înapoi la Catalog');
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/catalog');
    });
  });

  describe('4.5-4.9: RFQ Form - Multi-Step Flow', () => {
    it('should display RFQ form page with header and footer', () => {
      render(<RFQForm />);

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should display page title "Cerere de Ofertă (RFQ)"', () => {
      render(<RFQForm />);

      expect(screen.getByText('Cerere de Ofertă (RFQ)')).toBeInTheDocument();
    });

    it('should display step indicator', () => {
      render(<RFQForm />);

      expect(screen.getByTestId('step-indicator')).toBeInTheDocument();
      expect(screen.getByTestId('total-steps')).toHaveTextContent('5');
    });

    it('should start on step 1 (Company Info)', () => {
      render(<RFQForm />);

      expect(screen.getByTestId('current-step')).toHaveTextContent('1');
      expect(screen.getByTestId('company-info-step')).toBeInTheDocument();
    });

    it('should track RFQ start on mount', () => {
      render(<RFQForm />);

      expect(mockTrackRFQStart).toHaveBeenCalledWith('rfq_form');
    });

    it('should navigate from step 1 to step 2', async () => {
      const user = userEvent.setup();
      render(<RFQForm />);

      expect(screen.getByTestId('company-info-step')).toBeInTheDocument();

      const nextButton = screen.getByTestId('company-next-btn');
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByTestId('delivery-address-step')).toBeInTheDocument();
        expect(screen.getByTestId('current-step')).toHaveTextContent('2');
      });
    });

    it('should navigate back from step 2 to step 1', async () => {
      const user = userEvent.setup();
      render(<RFQForm />);

      // Go to step 2
      const companyNextBtn = screen.getByTestId('company-next-btn');
      await user.click(companyNextBtn);

      await waitFor(() => {
        expect(screen.getByTestId('delivery-address-step')).toBeInTheDocument();
      });

      // Go back to step 1
      const backButton = screen.getByTestId('delivery-back-btn');
      await user.click(backButton);

      await waitFor(() => {
        expect(screen.getByTestId('company-info-step')).toBeInTheDocument();
        expect(screen.getByTestId('current-step')).toHaveTextContent('1');
      });
    });

    it('should complete all 5 steps and reach review', async () => {
      const user = userEvent.setup();
      render(<RFQForm />);

      // Step 1: Company Info
      await user.click(screen.getByTestId('company-next-btn'));

      // Step 2: Delivery Address
      await waitFor(() => expect(screen.getByTestId('delivery-address-step')).toBeInTheDocument());
      await user.click(screen.getByTestId('delivery-next-btn'));

      // Step 3: Preferences
      await waitFor(() => expect(screen.getByTestId('preferences-step')).toBeInTheDocument());
      await user.click(screen.getByTestId('preferences-next-btn'));

      // Step 4: Attachments
      await waitFor(() => expect(screen.getByTestId('attachments-step')).toBeInTheDocument());
      await user.click(screen.getByTestId('attachments-next-btn'));

      // Step 5: Review
      await waitFor(() => {
        expect(screen.getByTestId('review-step')).toBeInTheDocument();
        expect(screen.getByTestId('current-step')).toHaveTextContent('5');
      });
    });

    it('should track step completion for each step', async () => {
      const user = userEvent.setup();
      render(<RFQForm />);

      await user.click(screen.getByTestId('company-next-btn'));
      expect(mockTrackRFQStep).toHaveBeenCalledWith(1, 'company_info');

      await waitFor(() => expect(screen.getByTestId('delivery-next-btn')).toBeInTheDocument());
      await user.click(screen.getByTestId('delivery-next-btn'));
      expect(mockTrackRFQStep).toHaveBeenCalledWith(2, 'delivery_address');
    });

    it('should show "Înapoi la Coș" button', () => {
      render(<RFQForm />);

      expect(screen.getByText('Înapoi la Coș')).toBeInTheDocument();
    });

    it('should navigate to /cart when "Înapoi la Coș" clicked', async () => {
      const user = userEvent.setup();
      render(<RFQForm />);

      const backToCartButton = screen.getByText('Înapoi la Coș');
      await user.click(backToCartButton);

      expect(mockNavigate).toHaveBeenCalledWith('/cart');
    });
  });

  describe('4.12: RFQ Form - Submission', () => {
    it('should display review step with form data', async () => {
      const user = userEvent.setup();
      render(<RFQForm />);

      // Complete all steps
      await user.click(screen.getByTestId('company-next-btn'));
      await waitFor(() => screen.getByTestId('delivery-next-btn'));
      await user.click(screen.getByTestId('delivery-next-btn'));
      await waitFor(() => screen.getByTestId('preferences-next-btn'));
      await user.click(screen.getByTestId('preferences-next-btn'));
      await waitFor(() => screen.getByTestId('attachments-next-btn'));
      await user.click(screen.getByTestId('attachments-next-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('review-step')).toBeInTheDocument();
        expect(screen.getByTestId('review-company')).toHaveTextContent('Test Company SRL');
        expect(screen.getByTestId('review-items')).toHaveTextContent('1');
      });
    });

    it('should submit RFQ successfully and navigate to confirmation', async () => {
      const user = userEvent.setup();
      mockSubmitRFQ.mockResolvedValue({
        success: true,
        referenceNumber: 'RFQ-2025-00042',
      });

      render(<RFQForm />);

      // Complete all steps
      await user.click(screen.getByTestId('company-next-btn'));
      await waitFor(() => screen.getByTestId('delivery-next-btn'));
      await user.click(screen.getByTestId('delivery-next-btn'));
      await waitFor(() => screen.getByTestId('preferences-next-btn'));
      await user.click(screen.getByTestId('preferences-next-btn'));
      await waitFor(() => screen.getByTestId('attachments-next-btn'));
      await user.click(screen.getByTestId('attachments-next-btn'));

      await waitFor(() => screen.getByTestId('review-submit-btn'));
      await user.click(screen.getByTestId('review-submit-btn'));

      await waitFor(() => {
        expect(mockSubmitRFQ).toHaveBeenCalled();
        expect(mockTrackRFQSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            referenceNumber: 'RFQ-2025-00042',
          })
        );
        expect(mockNavigate).toHaveBeenCalledWith('/rfq/confirmation?ref=RFQ-2025-00042');
      });
    });

    it('should show error toast when submission fails', async () => {
      const user = userEvent.setup();
      mockSubmitRFQ.mockRejectedValue(new Error('Server error'));

      render(<RFQForm />);

      // Complete all steps
      await user.click(screen.getByTestId('company-next-btn'));
      await waitFor(() => screen.getByTestId('delivery-next-btn'));
      await user.click(screen.getByTestId('delivery-next-btn'));
      await waitFor(() => screen.getByTestId('preferences-next-btn'));
      await user.click(screen.getByTestId('preferences-next-btn'));
      await waitFor(() => screen.getByTestId('attachments-next-btn'));
      await user.click(screen.getByTestId('attachments-next-btn'));

      await waitFor(() => screen.getByTestId('review-submit-btn'));
      await user.click(screen.getByTestId('review-submit-btn'));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Eroare',
            variant: 'destructive',
          })
        );
      });
    });

    it('should disable submit button while submitting', async () => {
      const user = userEvent.setup();
      mockSubmitRFQ.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true, referenceNumber: 'RFQ-123' }), 100))
      );

      render(<RFQForm />);

      // Complete all steps
      await user.click(screen.getByTestId('company-next-btn'));
      await waitFor(() => screen.getByTestId('delivery-next-btn'));
      await user.click(screen.getByTestId('delivery-next-btn'));
      await waitFor(() => screen.getByTestId('preferences-next-btn'));
      await user.click(screen.getByTestId('preferences-next-btn'));
      await waitFor(() => screen.getByTestId('attachments-next-btn'));
      await user.click(screen.getByTestId('attachments-next-btn'));

      await waitFor(() => screen.getByTestId('review-submit-btn'));
      const submitButton = screen.getByTestId('review-submit-btn');

      await user.click(submitButton);

      // Button should be disabled while submitting
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Submitting...');
    });
  });

  describe('4.17: Browser Navigation - Form State Persistence', () => {
    it('should persist step progress in sessionStorage', async () => {
      const user = userEvent.setup();
      render(<RFQForm />);

      await user.click(screen.getByTestId('company-next-btn'));

      await waitFor(() => {
        const storedStep = sessionStorage.getItem('metalpro-rfq-current-step');
        expect(storedStep).toBe('2');
      });
    });

    it('should persist completed steps in sessionStorage', async () => {
      const user = userEvent.setup();
      render(<RFQForm />);

      await user.click(screen.getByTestId('company-next-btn'));

      await waitFor(() => {
        const storedCompleted = sessionStorage.getItem('metalpro-rfq-completed-steps');
        expect(storedCompleted).toBeTruthy();
        const completed = JSON.parse(storedCompleted!);
        expect(completed).toContain(1);
      });
    });

    it('should persist form data in sessionStorage', async () => {
      const user = userEvent.setup();
      render(<RFQForm />);

      await user.click(screen.getByTestId('company-next-btn'));

      await waitFor(() => {
        const storedData = sessionStorage.getItem('metalpro-rfq-form-data');
        expect(storedData).toBeTruthy();
        const data = JSON.parse(storedData!);
        expect(data.company).toBeDefined();
        expect(data.company.legalName).toBe('Test Company SRL');
      });
    });
  });
});
