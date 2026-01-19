import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, CheckCircle2, Loader2, AlertCircle, Info } from 'lucide-react';
import { validateCUI, lookupCUIFromANAF } from '@/lib/validation/cuiValidator';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import type { CompanyInfo } from '@/types/rfq';

// Romanian counties for dropdown
const ROMANIAN_COUNTIES = [
  'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani',
  'Brăila', 'Brașov', 'București', 'Buzău', 'Călărași', 'Caraș-Severin',
  'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu',
  'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș',
  'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Sălaj', 'Satu Mare',
  'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vâlcea', 'Vaslui', 'Vrancea',
];

// Validation schema - will be created inside the component to use translations
const createCompanyInfoSchema = (t: (key: string) => string) => z.object({
  legalName: z.string().min(3, t('rfq.validation.company_name_min')),
  cuiVat: z.string().min(2, t('rfq.validation.cui_required')),
  street: z.string().min(5, t('rfq.validation.address_min')),
  city: z.string().min(2, t('rfq.validation.city_required')),
  county: z.string().min(2, t('rfq.validation.county_required')),
  postalCode: z.string().regex(/^\d{6}$/, t('rfq.validation.postal_code_invalid')).optional().or(z.literal('')),
  country: z.string().default('România'),
  contactPerson: z.string().min(3, t('rfq.validation.contact_person_required')),
  phone: z.string().regex(/^(\+40|0040|0)\d{9}$/, t('rfq.validation.phone_invalid')),
  email: z.string().email(t('rfq.validation.email_invalid')),
});

type CompanyInfoFormData = z.infer<ReturnType<typeof createCompanyInfoSchema>>;

interface CompanyInfoStepProps {
  initialData?: Partial<CompanyInfo>;
  onNext: (data: CompanyInfo) => void;
  onBack?: () => void;
}

const CompanyInfoStep: React.FC<CompanyInfoStepProps> = ({ initialData, onNext, onBack }) => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  // Create schema with translations
  const companyInfoSchema = createCompanyInfoSchema(t);

  const [cuiValidationState, setCuiValidationState] = useState<{
    isValidating: boolean;
    isValid: boolean | null;
    message: string;
    details?: { legalName?: string; status?: string; county?: string };
  }>({
    isValidating: false,
    isValid: null,
    message: '',
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CompanyInfoFormData>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      legalName: initialData?.legalName || '',
      cuiVat: initialData?.cuiVat || '',
      street: initialData?.billingAddress?.street || '',
      city: initialData?.billingAddress?.city || '',
      county: initialData?.billingAddress?.county || '',
      postalCode: initialData?.billingAddress?.postalCode || '',
      country: initialData?.billingAddress?.country || 'România',
      contactPerson: initialData?.contact?.person || '',
      phone: initialData?.contact?.phone || '',
      email: initialData?.contact?.email || '',
    },
  });

  // Auto-fill form with user data if logged in
  useEffect(() => {
    if (isAuthenticated && user && !initialData) {
      setIsAutoFilled(true);

      // Fill company data if business account
      if (user.company) {
        if (user.company.name) setValue('legalName', user.company.name);
        if (user.company.cui) setValue('cuiVat', user.company.cui);
        if (user.company.address) setValue('street', user.company.address);
        if (user.company.city) setValue('city', user.company.city);
        if (user.company.county) setValue('county', user.company.county);
        if (user.company.postalCode) setValue('postalCode', user.company.postalCode);

        // Mark CUI as verified if company is verified
        if (user.company.isVerified) {
          setCuiValidationState({
            isValidating: false,
            isValid: true,
            message: t('rfq.cui_verified_from_account'),
            details: {
              legalName: user.company.name,
              status: t('rfq.status_active'),
              county: user.company.county,
            },
          });
        }
      }

      // Fill contact data
      if (user.name) setValue('contactPerson', user.name);
      if (user.phone) setValue('phone', user.phone);
      if (user.email) setValue('email', user.email);
    }
  }, [isAuthenticated, user, initialData, setValue]);

  const cuiValue = watch('cuiVat');

  const handleValidateCUI = async () => {
    if (!cuiValue) return;

    setCuiValidationState({ isValidating: true, isValid: null, message: '' });

    try {
      // First, basic validation
      const basicValidation = validateCUI(cuiValue);

      if (!basicValidation.valid) {
        setCuiValidationState({
          isValidating: false,
          isValid: false,
          message: basicValidation.message || t('rfq.cui_invalid'),
        });
        return;
      }

      // Then, lookup from ANAF (mock API)
      const anafValidation = await lookupCUIFromANAF(cuiValue);

      if (anafValidation.valid && anafValidation.formatted) {
        // Update the form with formatted CUI
        setValue('cuiVat', anafValidation.formatted);

        // If we got business details, pre-fill legal name and county
        if (anafValidation.details?.legalName) {
          setValue('legalName', anafValidation.details.legalName);
        }
        if (anafValidation.details?.county) {
          setValue('county', anafValidation.details.county);
        }

        setCuiValidationState({
          isValidating: false,
          isValid: true,
          message: anafValidation.message || t('rfq.cui_validated'),
          details: anafValidation.details,
        });
      } else {
        setCuiValidationState({
          isValidating: false,
          isValid: false,
          message: anafValidation.message || t('rfq.cui_validation_failed'),
        });
      }
    } catch (error) {
      setCuiValidationState({
        isValidating: false,
        isValid: false,
        message: t('rfq.cui_validation_error'),
      });
    }
  };

  const onSubmit = (data: CompanyInfoFormData) => {
    const companyInfo: CompanyInfo = {
      legalName: data.legalName,
      cuiVat: data.cuiVat,
      billingAddress: {
        street: data.street,
        city: data.city,
        county: data.county,
        postalCode: data.postalCode || undefined,
        country: data.country,
      },
      contact: {
        person: data.contactPerson,
        phone: data.phone,
        email: data.email,
      },
      isVerifiedBusiness: cuiValidationState.isValid === true,
    };

    onNext(companyInfo);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {t('rfq.company_info_title')}
          </CardTitle>
          <CardDescription>
            {t('rfq.company_info_description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto-fill notification */}
          {isAutoFilled && (
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>{t('rfq.data_prefilled')}</strong> {t('rfq.data_prefilled_from_account')}{' '}
                {user?.company ? t('rfq.can_edit_fields') : t('rfq.complete_remaining')}
              </AlertDescription>
            </Alert>
          )}

          {/* CUI/VAT Number with Validation */}
          <div className="space-y-2">
            <Label htmlFor="cuiVat">
              {t('rfq.cui_vat_label')} <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="cuiVat"
                {...register('cuiVat')}
                placeholder={t('rfq.cui_placeholder')}
                className={errors.cuiVat ? 'border-destructive' : ''}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleValidateCUI}
                disabled={cuiValidationState.isValidating || !cuiValue}
              >
                {cuiValidationState.isValidating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('rfq.validating')}
                  </>
                ) : (
                  t('rfq.validate')
                )}
              </Button>
            </div>
            {errors.cuiVat && (
              <p className="text-sm text-destructive">{errors.cuiVat.message}</p>
            )}
            {cuiValidationState.isValid === true && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>{cuiValidationState.message}</strong>
                  {cuiValidationState.details?.legalName && (
                    <div className="mt-1 text-xs">
                      {cuiValidationState.details.legalName} • {cuiValidationState.details.status}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
            {cuiValidationState.isValid === false && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{cuiValidationState.message}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Legal Name */}
          <div className="space-y-2">
            <Label htmlFor="legalName">
              {t('rfq.company_name_label')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="legalName"
              {...register('legalName')}
              placeholder={t('rfq.company_name_placeholder')}
              className={errors.legalName ? 'border-destructive' : ''}
            />
            {errors.legalName && (
              <p className="text-sm text-destructive">{errors.legalName.message}</p>
            )}
          </div>

          {/* Billing Address */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">{t('rfq.billing_address')}</h3>

            <div className="space-y-2">
              <Label htmlFor="street">
                {t('rfq.street_label')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="street"
                {...register('street')}
                placeholder={t('rfq.street_placeholder')}
                className={errors.street ? 'border-destructive' : ''}
              />
              {errors.street && (
                <p className="text-sm text-destructive">{errors.street.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">
                  {t('rfq.city_label')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="city"
                  {...register('city')}
                  placeholder={t('rfq.city_placeholder')}
                  className={errors.city ? 'border-destructive' : ''}
                />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="county">
                  {t('rfq.county_label')} <span className="text-destructive">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue('county', value)}
                  defaultValue={watch('county')}
                >
                  <SelectTrigger className={errors.county ? 'border-destructive' : ''}>
                    <SelectValue placeholder={t('rfq.county_placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {ROMANIAN_COUNTIES.map((county) => (
                      <SelectItem key={county} value={county}>
                        {county}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.county && (
                  <p className="text-sm text-destructive">{errors.county.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">{t('rfq.postal_code_label')}</Label>
                <Input
                  id="postalCode"
                  {...register('postalCode')}
                  placeholder="123456"
                  maxLength={6}
                  className={errors.postalCode ? 'border-destructive' : ''}
                />
                {errors.postalCode && (
                  <p className="text-sm text-destructive">{errors.postalCode.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">{t('rfq.country_label')}</Label>
                <Input id="country" {...register('country')} disabled />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">{t('rfq.contact_person')}</h3>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">
                {t('rfq.full_name_label')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contactPerson"
                {...register('contactPerson')}
                placeholder={t('rfq.full_name_placeholder')}
                className={errors.contactPerson ? 'border-destructive' : ''}
              />
              {errors.contactPerson && (
                <p className="text-sm text-destructive">{errors.contactPerson.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  {t('rfq.phone_label')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="+40 712 345 678"
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  {t('rfq.email_label')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder={t('rfq.email_placeholder')}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        {onBack ? (
          <Button type="button" variant="outline" onClick={onBack}>
            {t('rfq.back')}
          </Button>
        ) : (
          <div />
        )}
        <Button type="submit">{t('rfq.continue')}</Button>
      </div>
    </form>
  );
};

export default CompanyInfoStep;
