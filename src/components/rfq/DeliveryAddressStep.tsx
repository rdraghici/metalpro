import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import type { Address, CompanyInfo } from '@/types/rfq';

// Romanian counties
const ROMANIAN_COUNTIES = [
  'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani',
  'Brăila', 'Brașov', 'București', 'Buzău', 'Călărași', 'Caraș-Severin',
  'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu',
  'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș',
  'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Sălaj', 'Satu Mare',
  'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vâlcea', 'Vaslui', 'Vrancea',
];

const createDeliveryAddressSchema = (t: (key: string) => string) => z.object({
  street: z.string().min(5, t('rfq.validation.address_min')),
  city: z.string().min(2, t('rfq.validation.city_required')),
  county: z.string().min(2, t('rfq.validation.county_required')),
  postalCode: z.string().regex(/^\d{6}$/, t('rfq.validation.postal_code_invalid')).optional().or(z.literal('')),
  country: z.string().default('România'),
});

type DeliveryAddressFormData = z.infer<ReturnType<typeof createDeliveryAddressSchema>>;

interface DeliveryAddressStepProps {
  companyInfo: CompanyInfo;
  initialData?: {
    sameAsBilling: boolean;
    deliveryAddress?: Address;
    desiredDeliveryDate?: string;
  };
  onNext: (data: {
    sameAsBilling: boolean;
    deliveryAddress: Address;
    desiredDeliveryDate?: string;
  }) => void;
  onBack: () => void;
}

const DeliveryAddressStep: React.FC<DeliveryAddressStepProps> = ({
  companyInfo,
  initialData,
  onNext,
  onBack,
}) => {
  const { t, currentLanguage } = useTranslation();
  const deliveryAddressSchema = createDeliveryAddressSchema(t);

  const [sameAsBilling, setSameAsBilling] = useState(initialData?.sameAsBilling ?? true);
  const [desiredDate, setDesiredDate] = useState<Date | undefined>(
    initialData?.desiredDeliveryDate ? new Date(initialData.desiredDeliveryDate) : undefined
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DeliveryAddressFormData>({
    resolver: zodResolver(deliveryAddressSchema),
    defaultValues: sameAsBilling
      ? {
          street: companyInfo.billingAddress.street,
          city: companyInfo.billingAddress.city,
          county: companyInfo.billingAddress.county,
          postalCode: companyInfo.billingAddress.postalCode || '',
          country: companyInfo.billingAddress.country,
        }
      : {
          street: initialData?.deliveryAddress?.street || '',
          city: initialData?.deliveryAddress?.city || '',
          county: initialData?.deliveryAddress?.county || '',
          postalCode: initialData?.deliveryAddress?.postalCode || '',
          country: initialData?.deliveryAddress?.country || 'România',
        },
  });

  const handleSameAsBillingChange = (checked: boolean) => {
    setSameAsBilling(checked);

    if (checked) {
      // Copy billing address to delivery fields
      setValue('street', companyInfo.billingAddress.street);
      setValue('city', companyInfo.billingAddress.city);
      setValue('county', companyInfo.billingAddress.county);
      setValue('postalCode', companyInfo.billingAddress.postalCode || '');
      setValue('country', companyInfo.billingAddress.country);
    } else {
      // Clear fields for manual entry
      setValue('street', initialData?.deliveryAddress?.street || '');
      setValue('city', initialData?.deliveryAddress?.city || '');
      setValue('county', initialData?.deliveryAddress?.county || '');
      setValue('postalCode', initialData?.deliveryAddress?.postalCode || '');
    }
  };

  const onSubmit = (data: DeliveryAddressFormData) => {
    const deliveryAddress: Address = {
      street: data.street,
      city: data.city,
      county: data.county,
      postalCode: data.postalCode || undefined,
      country: data.country,
    };

    onNext({
      sameAsBilling,
      deliveryAddress,
      desiredDeliveryDate: desiredDate ? desiredDate.toISOString() : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t('rfq.delivery_address')}
          </CardTitle>
          <CardDescription>
            {t('rfq.delivery_address_description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Same as Billing Checkbox */}
          <div className="flex items-center space-x-3 bg-muted/50 p-4 rounded-lg">
            <Checkbox
              id="sameAsBilling"
              checked={sameAsBilling}
              onCheckedChange={handleSameAsBillingChange}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="sameAsBilling" className="text-sm font-medium cursor-pointer">
                {t('rfq.same_as_billing')}
              </Label>
              <p className="text-xs text-muted-foreground">
                {companyInfo.billingAddress.street}, {companyInfo.billingAddress.city},{' '}
                {companyInfo.billingAddress.county}
              </p>
            </div>
          </div>

          {/* Delivery Address Fields - Disabled if same as billing */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">
                {t('rfq.street_label')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="street"
                {...register('street')}
                placeholder={t('rfq.delivery_street_placeholder')}
                disabled={sameAsBilling}
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
                  disabled={sameAsBilling}
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
                  disabled={sameAsBilling}
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
                  disabled={sameAsBilling}
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

          {/* Desired Delivery Date */}
          <div className="space-y-2">
            <Label>{t('rfq.desired_delivery_date')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !desiredDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {desiredDate ? (
                    format(desiredDate, 'PPP', { locale: currentLanguage === 'ro' ? ro : undefined })
                  ) : (
                    <span>{t('rfq.select_date')}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={desiredDate}
                  onSelect={setDesiredDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  locale={currentLanguage === 'ro' ? ro : undefined}
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              {t('rfq.delivery_date_note')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          {t('rfq.back')}
        </Button>
        <Button type="submit">{t('rfq.continue')}</Button>
      </div>
    </form>
  );
};

export default DeliveryAddressStep;