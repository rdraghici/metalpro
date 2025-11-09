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

// Validation schema
const companyInfoSchema = z.object({
  legalName: z.string().min(3, 'Denumirea trebuie să aibă minim 3 caractere'),
  cuiVat: z.string().min(2, 'CUI/VAT este obligatoriu'),
  street: z.string().min(5, 'Adresa trebuie să aibă minim 5 caractere'),
  city: z.string().min(2, 'Orașul este obligatoriu'),
  county: z.string().min(2, 'Județul este obligatoriu'),
  postalCode: z.string().regex(/^\d{6}$/, 'Cod poștal invalid (6 cifre)').optional().or(z.literal('')),
  country: z.string().default('România'),
  contactPerson: z.string().min(3, 'Numele persoanei de contact este obligatoriu'),
  phone: z.string().regex(/^(\+40|0040|0)\d{9}$/, 'Număr de telefon invalid'),
  email: z.string().email('Email invalid'),
});

type CompanyInfoFormData = z.infer<typeof companyInfoSchema>;

interface CompanyInfoStepProps {
  initialData?: Partial<CompanyInfo>;
  onNext: (data: CompanyInfo) => void;
  onBack?: () => void;
}

const CompanyInfoStep: React.FC<CompanyInfoStepProps> = ({ initialData, onNext, onBack }) => {
  const { user, isAuthenticated } = useAuth();
  const [isAutoFilled, setIsAutoFilled] = useState(false);

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
            message: 'CUI verificat din contul tău',
            details: {
              legalName: user.company.name,
              status: 'Activ',
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
          message: basicValidation.message || 'CUI/VAT invalid',
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
          message: anafValidation.message || 'CUI/VAT validat',
          details: anafValidation.details,
        });
      } else {
        setCuiValidationState({
          isValidating: false,
          isValid: false,
          message: anafValidation.message || 'CUI/VAT nu a putut fi validat',
        });
      }
    } catch (error) {
      setCuiValidationState({
        isValidating: false,
        isValid: false,
        message: 'Eroare la validarea CUI/VAT',
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
            Informații Companie
          </CardTitle>
          <CardDescription>
            Vă rugăm să introduceți datele companiei dumneavoastră. Aceste informații vor fi folosite
            pentru generarea ofertei.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto-fill notification */}
          {isAutoFilled && (
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Datele au fost pre-completate</strong> din contul tău.{' '}
                {user?.company ? 'Poți edita orice câmp înainte de a continua.' : 'Completează restul informațiilor.'}
              </AlertDescription>
            </Alert>
          )}

          {/* CUI/VAT Number with Validation */}
          <div className="space-y-2">
            <Label htmlFor="cuiVat">
              CUI / Cod TVA <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="cuiVat"
                {...register('cuiVat')}
                placeholder="RO12345678 sau 12345678"
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
                    Validare...
                  </>
                ) : (
                  'Validează'
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
              Denumire Companie <span className="text-destructive">*</span>
            </Label>
            <Input
              id="legalName"
              {...register('legalName')}
              placeholder="S.C. EXEMPLU S.R.L."
              className={errors.legalName ? 'border-destructive' : ''}
            />
            {errors.legalName && (
              <p className="text-sm text-destructive">{errors.legalName.message}</p>
            )}
          </div>

          {/* Billing Address */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Adresa de Facturare</h3>

            <div className="space-y-2">
              <Label htmlFor="street">
                Stradă, Număr <span className="text-destructive">*</span>
              </Label>
              <Input
                id="street"
                {...register('street')}
                placeholder="Str. Exemplu, nr. 123"
                className={errors.street ? 'border-destructive' : ''}
              />
              {errors.street && (
                <p className="text-sm text-destructive">{errors.street.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">
                  Oraș <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="city"
                  {...register('city')}
                  placeholder="București"
                  className={errors.city ? 'border-destructive' : ''}
                />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="county">
                  Județ <span className="text-destructive">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue('county', value)}
                  defaultValue={watch('county')}
                >
                  <SelectTrigger className={errors.county ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selectează județul" />
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
                <Label htmlFor="postalCode">Cod Poștal</Label>
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
                <Label htmlFor="country">Țară</Label>
                <Input id="country" {...register('country')} disabled />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Persoană de Contact</h3>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">
                Nume Complet <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contactPerson"
                {...register('contactPerson')}
                placeholder="Ion Popescu"
                className={errors.contactPerson ? 'border-destructive' : ''}
              />
              {errors.contactPerson && (
                <p className="text-sm text-destructive">{errors.contactPerson.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Telefon <span className="text-destructive">*</span>
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
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="contact@companie.ro"
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
            Înapoi
          </Button>
        ) : (
          <div />
        )}
        <Button type="submit">Continuă</Button>
      </div>
    </form>
  );
};

export default CompanyInfoStep;
