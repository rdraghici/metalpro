import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FormStepIndicator from '@/components/rfq/FormStepIndicator';
import CompanyInfoStep from '@/components/rfq/CompanyInfoStep';
import DeliveryAddressStep from '@/components/rfq/DeliveryAddressStep';
import PreferencesStep from '@/components/rfq/PreferencesStep';
import AttachmentsStep from '@/components/rfq/AttachmentsStep';
import ReviewStep from '@/components/rfq/ReviewStep';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, FileText } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { submitRFQ } from '@/lib/api/rfq';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useTranslation } from '@/hooks/useTranslation';
import type { RFQFormData, RFQFormStep, FormStep } from '@/types/rfq';

const RFQ_FORM_STORAGE_KEY = 'metalpro-rfq-form-data';
const RFQ_STEP_STORAGE_KEY = 'metalpro-rfq-current-step';
const RFQ_COMPLETED_STEPS_KEY = 'metalpro-rfq-completed-steps';

const RFQForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cart, itemCount } = useCart();
  const { user } = useAuth();
  const analytics = useAnalytics();
  const { t, currentLanguage } = useTranslation();

  // Translated steps array
  const STEPS: FormStep[] = useMemo(() => [
    { number: 1, title: t('rfq.step_company'), description: t('rfq.step_company_desc') },
    { number: 2, title: t('rfq.step_delivery'), description: t('rfq.step_delivery_desc') },
    { number: 3, title: t('rfq.step_preferences'), description: t('rfq.step_preferences_desc') },
    { number: 4, title: t('rfq.step_attachments'), description: t('rfq.step_attachments_desc') },
    { number: 5, title: t('rfq.step_review'), description: t('rfq.step_review_desc') },
  ], [t]);

  // Load initial state from sessionStorage
  const loadStoredStep = (): RFQFormStep => {
    try {
      const stored = sessionStorage.getItem(RFQ_STEP_STORAGE_KEY);
      if (stored) {
        const step = parseInt(stored, 10);
        if (step >= 1 && step <= 5) {
          return step as RFQFormStep;
        }
      }
    } catch (error) {
      console.error('Error loading stored step:', error);
    }
    return 1;
  };

  const loadStoredCompletedSteps = (): Set<RFQFormStep> => {
    try {
      const stored = sessionStorage.getItem(RFQ_COMPLETED_STEPS_KEY);
      if (stored) {
        const steps = JSON.parse(stored) as number[];
        return new Set(steps as RFQFormStep[]);
      }
    } catch (error) {
      console.error('Error loading completed steps:', error);
    }
    return new Set();
  };

  const loadStoredFormData = (): Partial<RFQFormData> => {
    try {
      const stored = sessionStorage.getItem(RFQ_FORM_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading form data:', error);
    }
    return {};
  };

  const [currentStep, setCurrentStep] = useState<RFQFormStep>(loadStoredStep);
  const [completedSteps, setCompletedSteps] = useState<Set<RFQFormStep>>(loadStoredCompletedSteps);
  const [formData, setFormData] = useState<Partial<RFQFormData>>(loadStoredFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Persist state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem(RFQ_STEP_STORAGE_KEY, currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    sessionStorage.setItem(RFQ_COMPLETED_STEPS_KEY, JSON.stringify(Array.from(completedSteps)));
  }, [completedSteps]);

  useEffect(() => {
    sessionStorage.setItem(RFQ_FORM_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Clear sessionStorage on successful submission
  const clearFormStorage = () => {
    sessionStorage.removeItem(RFQ_FORM_STORAGE_KEY);
    sessionStorage.removeItem(RFQ_STEP_STORAGE_KEY);
    sessionStorage.removeItem(RFQ_COMPLETED_STEPS_KEY);
  };

  // Validate if user can access a specific step
  const canAccessStep = (step: RFQFormStep): boolean => {
    // Step 1 is always accessible
    if (step === 1) return true;

    // Step 2 requires Step 1 to be completed (company info)
    if (step === 2) return !!formData.company;

    // Step 3 requires Steps 1 and 2 to be completed
    if (step === 3) return !!formData.company && !!formData.deliveryAddress;

    // Step 4 requires Steps 1 and 2 to be completed (attachments are optional)
    if (step === 4) return !!formData.company && !!formData.deliveryAddress;

    // Step 5 (Review) requires at minimum Steps 1 and 2 to be completed
    if (step === 5) return !!formData.company && !!formData.deliveryAddress;

    return false;
  };

  // Validate current step on mount and redirect if necessary
  useEffect(() => {
    if (!canAccessStep(currentStep)) {
      // Find the highest accessible step
      for (let step = 5; step >= 1; step--) {
        if (canAccessStep(step as RFQFormStep)) {
          setCurrentStep(step as RFQFormStep);
          break;
        }
      }
    }
  }, []);

  // Track RFQ start on mount
  useEffect(() => {
    analytics.trackRFQStart('rfq_form');
  }, []);

  // Redirect if cart is empty
  if (itemCount === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-muted/30">
          <div className="container mx-auto px-4 py-16 max-w-2xl">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('rfq.cart_empty')}</AlertTitle>
              <AlertDescription>
                {t('rfq.cart_empty_message')}
              </AlertDescription>
            </Alert>
            <div className="mt-6 flex justify-center">
              <Button onClick={() => navigate('/catalog')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('rfq.back_to_catalog')}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleStepComplete = (step: RFQFormStep, data: Partial<RFQFormData>) => {
    // Update form data
    setFormData((prev) => ({ ...prev, ...data }));

    // Mark step as completed
    setCompletedSteps((prev) => new Set(prev).add(step));

    // Track step completion
    const stepNames: Record<RFQFormStep, string> = {
      1: 'company_info',
      2: 'delivery_address',
      3: 'preferences',
      4: 'attachments',
      5: 'review',
    };
    analytics.trackRFQStep(step, stepNames[step]);

    // Move to next step
    if (step < 5) {
      setCurrentStep((step + 1) as RFQFormStep);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as RFQFormStep);
    }
  };

  const handleEditStep = (step: number) => {
    const targetStep = step as RFQFormStep;
    if (canAccessStep(targetStep)) {
      setCurrentStep(targetStep);
    } else {
      toast({
        title: t('rfq.step_not_accessible'),
        description: t('rfq.complete_previous_steps'),
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Ensure we have all required data
      if (!formData.company || !formData.deliveryAddress) {
        throw new Error(t('rfq.incomplete_data'));
      }

      // Build complete RFQ data
      const rfqData: RFQFormData = {
        company: formData.company,
        deliveryAddress: formData.deliveryAddress,
        sameAsBilling: formData.sameAsBilling ?? false,
        desiredDeliveryDate: formData.desiredDeliveryDate,
        incoterm: formData.incoterm,
        paymentTermsPreference: formData.paymentTermsPreference,
        specialRequirements: formData.specialRequirements,
        attachments: formData.attachments || [],
        notes: formData.notes,
        cartSnapshot: cart,
        disclaimerAccepted: true,
      };

      // Submit RFQ (pass userId and current language)
      console.log('🌍 RFQForm currentLanguage:', currentLanguage);
      const response = await submitRFQ(rfqData, user?.id, currentLanguage as 'ro' | 'en');

      if (response.success && response.referenceNumber) {
        // Track RFQ submission
        analytics.trackRFQSubmit({
          referenceNumber: response.referenceNumber,
          itemCount: cart.lines.length,
          totalValue: cart.totals.grandTotal,
          company: rfqData.company.companyName,
          incoterm: rfqData.incoterm,
        });

        // Clear form storage on successful submission
        clearFormStorage();

        // Navigate to confirmation page
        navigate(`/rfq/confirmation?ref=${response.referenceNumber}`);
      } else {
        throw new Error(response.message || t('rfq.submit_error'));
      }
    } catch (error) {
      console.error('Error submitting RFQ:', error);
      toast({
        title: t('rfq.error'),
        description:
          error instanceof Error
            ? error.message
            : t('rfq.submit_error_retry'),
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Page Header */}
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate('/cart')} className="gap-2 -ml-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              {t('rfq.back_to_cart')}
            </Button>

            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">{t('rfq.title')}</h1>
            </div>
            <p className="text-muted-foreground">
              {t('rfq.description')}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="mb-8">
            <FormStepIndicator
              currentStep={currentStep}
              completedSteps={completedSteps}
              steps={STEPS}
            />
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {currentStep === 1 && (
              <CompanyInfoStep
                initialData={formData.company}
                onNext={(data) => handleStepComplete(1, { company: data })}
              />
            )}

            {currentStep === 2 && formData.company && (
              <DeliveryAddressStep
                companyInfo={formData.company}
                initialData={{
                  sameAsBilling: formData.sameAsBilling ?? true,
                  deliveryAddress: formData.deliveryAddress,
                  desiredDeliveryDate: formData.desiredDeliveryDate,
                }}
                onNext={(data) => handleStepComplete(2, data)}
                onBack={handleBackStep}
              />
            )}

            {currentStep === 3 && (
              <PreferencesStep
                initialData={{
                  incoterm: formData.incoterm,
                  paymentTermsPreference: formData.paymentTermsPreference,
                  specialRequirements: formData.specialRequirements,
                }}
                onNext={(data) => handleStepComplete(3, data)}
                onBack={handleBackStep}
              />
            )}

            {currentStep === 4 && (
              <AttachmentsStep
                initialData={{
                  attachments: formData.attachments || [],
                  notes: formData.notes,
                }}
                onNext={(data) => handleStepComplete(4, data)}
                onBack={handleBackStep}
              />
            )}

            {currentStep === 5 && (
              <ReviewStep
                formData={formData}
                cart={cart}
                onEdit={handleEditStep}
                onSubmit={handleSubmit}
                onBack={handleBackStep}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RFQForm;
