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
import type { Incoterm } from '@/types/rfq';

// Incoterm descriptions for user guidance
const INCOTERM_INFO: Record<Incoterm, string> = {
  EXW: 'Ex Works - Cumpărătorul preia marfa din depozitul vânzătorului',
  FCA: 'Free Carrier - Vânzătorul livrează marfa transportatorului desemnat de cumpărător',
  CPT: 'Carriage Paid To - Vânzătorul plătește transportul până la destinație',
  DAP: 'Delivered at Place - Vânzătorul livrează marfa la adresa specificată',
  DDP: 'Delivered Duty Paid - Vânzătorul livrează marfa cu toate taxele plătite',
};

const preferencesSchema = z.object({
  incoterm: z.enum(['EXW', 'FCA', 'CPT', 'DAP', 'DDP']).optional(),
  paymentTermsPreference: z.string().optional(),
  specialRequirements: z.string().max(1000, 'Maxim 1000 caractere').optional(),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

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
            Preferințe & Cerințe Speciale
          </CardTitle>
          <CardDescription>
            Specificați preferințele dumneavoastră pentru livrare și condiții de plată. Aceste
            informații ne vor ajuta să pregătim o ofertă personalizată.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Incoterm Selection */}
          <div className="space-y-2">
            <Label htmlFor="incoterm">Incoterm Preferat (opțional)</Label>
            <Select
              onValueChange={(value) => setValue('incoterm', value as Incoterm)}
              defaultValue={selectedIncoterm}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selectează Incoterm (sau lasă implicit)" />
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
              Incotermul final va fi negociat și specificat în oferta finală. Dacă nu sunteți
              sigur, lăsați acest câmp necompletat.
            </p>
          </div>

          {/* Payment Terms Preferences */}
          <div className="space-y-2">
            <Label htmlFor="paymentTermsPreference">
              Preferințe Condiții de Plată (opțional)
            </Label>
            <Textarea
              id="paymentTermsPreference"
              {...register('paymentTermsPreference')}
              placeholder="De exemplu: 30 zile, plată la livrare, avans 50%, etc."
              rows={3}
              className={errors.paymentTermsPreference ? 'border-destructive' : ''}
            />
            {errors.paymentTermsPreference && (
              <p className="text-sm text-destructive">{errors.paymentTermsPreference.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Specificați condițiile de plată dorite. Condițiile finale vor fi negociate cu echipa
              de vânzări.
            </p>
          </div>

          {/* Special Requirements */}
          <div className="space-y-2">
            <Label htmlFor="specialRequirements">Cerințe Speciale (opțional)</Label>
            <Textarea
              id="specialRequirements"
              {...register('specialRequirements')}
              placeholder="Specificați orice cerințe speciale: pregătire specială a materialelor, ambalare specială, condiții de transport, urgență livrare, etc."
              rows={5}
              className={errors.specialRequirements ? 'border-destructive' : ''}
            />
            {errors.specialRequirements && (
              <p className="text-sm text-destructive">{errors.specialRequirements.message}</p>
            )}
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Descrieți orice cerințe specifice pentru această comandă</span>
              <span>
                {watch('specialRequirements')?.length || 0} / 1000 caractere
              </span>
            </div>
          </div>

          {/* Helpful Tips */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong className="block mb-1">Sugestii pentru cerințe speciale:</strong>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Debitare la dimensiuni specifice</li>
                <li>Certificări sau agremente necesare</li>
                <li>Urgența comenzii</li>
                <li>Condiții speciale de ambalare sau transport</li>
                <li>Documente tehnice sau agremente necesare</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Înapoi
        </Button>
        <Button type="submit">Continuă</Button>
      </div>
    </form>
  );
};

export default PreferencesStep;
