import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslation } from '@/hooks/useTranslation';
import type { Incoterm } from '@/types/rfq';

// Incoterm descriptions for user guidance - will be replaced with translations
const getIncotermInfo = (t: (key: string) => string): Record<Incoterm, string> => ({
  EXW: t('rfq.incoterm_exw_desc'),
  FCA: t('rfq.incoterm_fca_desc'),
  CPT: t('rfq.incoterm_cpt_desc'),
  DAP: t('rfq.incoterm_dap_desc'),
  DDP: t('rfq.incoterm_ddp_desc'),
});

const createPreferencesSchema = (t: (key: string) => string) => z.object({
  incoterm: z.enum(['EXW', 'FCA', 'CPT', 'DAP', 'DDP']).optional(),
  paymentTermsPreference: z.string().optional(),
  specialRequirements: z.string().max(1000, t('rfq.max_1000_chars')).optional(),
});

type PreferencesFormData = z.infer<ReturnType<typeof createPreferencesSchema>>;

interface PreferencesStepProps {
  initialData?: {
    incoterm?: Incoterm;
    paymentTermsPreference?: string;
    specialRequirements?: string;
  };
  onNext: (data: {
    incoterm?: Incoterm;
    paymentTermsPreference?: string;
    specialRequirements?: string;
  }) => void;
  onBack: () => void;
}

const PreferencesStep: React.FC<PreferencesStepProps> = ({ initialData, onNext, onBack }) => {
  const { t } = useTranslation();
  const preferencesSchema = createPreferencesSchema(t);
  const INCOTERM_INFO = getIncotermInfo(t);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      incoterm: initialData?.incoterm || undefined,
      paymentTermsPreference: initialData?.paymentTermsPreference || '',
      specialRequirements: initialData?.specialRequirements || '',
    },
  });

  const selectedIncoterm = watch('incoterm');

  const onSubmit = (data: PreferencesFormData) => {
    onNext({
      incoterm: data.incoterm,
      paymentTermsPreference: data.paymentTermsPreference || undefined,
      specialRequirements: data.specialRequirements || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            {t('rfq.preferences_title')}
          </CardTitle>
          <CardDescription>
            {t('rfq.preferences_description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Incoterm Selection */}
          <div className="space-y-2">
            <Label htmlFor="incoterm">{t('rfq.preferred_incoterm')}</Label>
            <Select
              onValueChange={(value) => setValue('incoterm', value as Incoterm)}
              defaultValue={selectedIncoterm}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('rfq.select_incoterm')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXW">EXW - Ex Works</SelectItem>
                <SelectItem value="FCA">FCA - Free Carrier</SelectItem>
                <SelectItem value="CPT">CPT - Carriage Paid To</SelectItem>
                <SelectItem value="DAP">DAP - Delivered at Place</SelectItem>
                <SelectItem value="DDP">DDP - Delivered Duty Paid</SelectItem>
              </SelectContent>
            </Select>
            {selectedIncoterm && (
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm">
                  <strong>{selectedIncoterm}:</strong> {INCOTERM_INFO[selectedIncoterm]}
                </AlertDescription>
              </Alert>
            )}
            <p className="text-xs text-muted-foreground">
              {t('rfq.incoterm_note')}
            </p>
          </div>

          {/* Payment Terms Preferences */}
          <div className="space-y-2">
            <Label htmlFor="paymentTermsPreference">
              {t('rfq.payment_terms_preference')}
            </Label>
            <Textarea
              id="paymentTermsPreference"
              {...register('paymentTermsPreference')}
              placeholder={t('rfq.payment_terms_placeholder')}
              rows={3}
              className={errors.paymentTermsPreference ? 'border-destructive' : ''}
            />
            {errors.paymentTermsPreference && (
              <p className="text-sm text-destructive">{errors.paymentTermsPreference.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {t('rfq.payment_terms_note')}
            </p>
          </div>

          {/* Special Requirements */}
          <div className="space-y-2">
            <Label htmlFor="specialRequirements">{t('rfq.special_requirements')}</Label>
            <Textarea
              id="specialRequirements"
              {...register('specialRequirements')}
              placeholder={t('rfq.special_requirements_placeholder')}
              rows={5}
              className={errors.specialRequirements ? 'border-destructive' : ''}
            />
            {errors.specialRequirements && (
              <p className="text-sm text-destructive">{errors.specialRequirements.message}</p>
            )}
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{t('rfq.special_requirements_hint')}</span>
              <span>
                {watch('specialRequirements')?.length || 0} / 1000 {t('rfq.characters')}
              </span>
            </div>
          </div>

          {/* Helpful Tips */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong className="block mb-1">{t('rfq.suggestions_title')}</strong>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>{t('rfq.suggestion_cutting')}</li>
                <li>{t('rfq.suggestion_certifications')}</li>
                <li>{t('rfq.suggestion_urgency')}</li>
                <li>{t('rfq.suggestion_packaging')}</li>
                <li>{t('rfq.suggestion_documents')}</li>
              </ul>
            </AlertDescription>
          </Alert>
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

export default PreferencesStep;
