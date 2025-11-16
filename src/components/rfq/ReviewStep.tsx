import { useState } from 'react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  CheckCircle2,
  Building2,
  MapPin,
  Settings2,
  Paperclip,
  ShoppingCart,
  Edit2,
  AlertCircle,
  FileText,
  File,
  Image,
} from 'lucide-react';
import type { RFQFormData } from '@/types/rfq';
import type { EstimateCart } from '@/types/cart';

interface ReviewStepProps {
  formData: Partial<RFQFormData>;
  cart: EstimateCart;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  cart,
  onEdit,
  onSubmit,
  onBack,
  isSubmitting,
}) => {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getFileIcon = (type: string) => {
    if (type === 'pdf') return <FileText className="h-4 w-4 text-red-600" />;
    if (type === 'csv' || type === 'xlsx') return <File className="h-4 w-4 text-green-600" />;
    if (type === 'image') return <Image className="h-4 w-4 text-blue-600" />;
    return <File className="h-4 w-4 text-gray-600" />;
  };

  const canSubmit = disclaimerAccepted && termsAccepted && !isSubmitting;

  return (
    <div className="space-y-6">
      {/* Summary Alert */}
      <Alert className="bg-blue-50 border-blue-200">
        <CheckCircle2 className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-900">Verificați Informațiile</AlertTitle>
        <AlertDescription className="text-blue-800">
          Vă rugăm să verificați toate informațiile înainte de a trimite cererea de ofertă. Puteți
          edita orice secțiune făcând clic pe butonul "Editează".
        </AlertDescription>
      </Alert>

      {/* Company Information */}
      {formData.company && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informații Companie
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => onEdit(1)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Editează
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Denumire Companie</p>
                <p className="font-semibold">{formData.company.legalName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">CUI / Cod TVA</p>
                <p className="font-semibold font-mono">{formData.company.cuiVat}</p>
                {formData.company.isVerifiedBusiness && (
                  <Badge className="mt-1 bg-green-100 text-green-800">Verificat</Badge>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Adresa de Facturare</p>
              <p className="text-sm">
                {formData.company.billingAddress.street}
                <br />
                {formData.company.billingAddress.city}, {formData.company.billingAddress.county}
                {formData.company.billingAddress.postalCode && (
                  <>, {formData.company.billingAddress.postalCode}</>
                )}
                <br />
                {formData.company.billingAddress.country}
              </p>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Persoană de Contact</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Nume:</strong> {formData.company.contact.person}
                </div>
                <div>
                  <strong>Telefon:</strong> {formData.company.contact.phone}
                </div>
                <div>
                  <strong>Email:</strong> {formData.company.contact.email}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery Address */}
      {formData.deliveryAddress && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Adresa de Livrare
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => onEdit(2)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Editează
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.sameAsBilling ? (
              <Badge variant="outline">Identică cu adresa de facturare</Badge>
            ) : null}

            <p className="text-sm">
              {formData.deliveryAddress.street}
              <br />
              {formData.deliveryAddress.city}, {formData.deliveryAddress.county}
              {formData.deliveryAddress.postalCode && <>, {formData.deliveryAddress.postalCode}</>}
              <br />
              {formData.deliveryAddress.country}
            </p>

            {formData.desiredDeliveryDate && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data Dorită de Livrare</p>
                  <p className="font-semibold">
                    {format(new Date(formData.desiredDeliveryDate), 'PPP', { locale: ro })}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cart Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Produse Estimate ({cart.lines.length})
            </CardTitle>
          </div>
          <CardDescription>Greutate totală: {formatCurrency(cart.totals.estWeightKg)} kg</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cart Items */}
          <div className="space-y-3">
            {cart.lines.map((line) => (
              <div key={line.id} className="flex justify-between items-start text-sm">
                <div className="flex-1">
                  <p className="font-medium">{line.product?.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {line.quantity} {line.unit}
                    {line.specs.lengthM && ` • ${line.specs.lengthM}m`}
                    {line.specs.finish && ` • ${line.specs.finish}`}
                  </p>
                </div>
                <p className="font-semibold text-right">
                  {formatCurrency(line.indicativeSubtotal || 0)} RON
                </p>
              </div>
            ))}
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>{formatCurrency(cart.totals.estSubtotal)} RON</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">TVA (19%):</span>
              <span>{formatCurrency(cart.totals.vatIndicative || 0)} RON</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Livrare (estimată):</span>
              <span className="text-xs">{cart.totals.deliveryFeeBand}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total estimativ:</span>
              <span className="text-primary">{formatCurrency(cart.totals.grandTotal || 0)} RON</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      {(formData.incoterm || formData.paymentTermsPreference || formData.specialRequirements) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                Preferințe & Cerințe
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => onEdit(3)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Editează
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.incoterm && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Incoterm</p>
                <Badge variant="outline">{formData.incoterm}</Badge>
              </div>
            )}

            {formData.paymentTermsPreference && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Condiții de Plată</p>
                <p className="text-sm">{formData.paymentTermsPreference}</p>
              </div>
            )}

            {formData.specialRequirements && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cerințe Speciale</p>
                <p className="text-sm whitespace-pre-wrap">{formData.specialRequirements}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Attachments */}
      {formData.attachments && formData.attachments.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Paperclip className="h-5 w-5" />
                Atașamente ({formData.attachments.length})
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => onEdit(4)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Editează
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formData.attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center gap-2 text-sm">
                  {getFileIcon(attachment.type)}
                  <span className="font-medium">{attachment.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {attachment.type.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>

            {formData.notes && (
              <>
                <Separator className="my-4" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Notițe</p>
                  <p className="text-sm whitespace-pre-wrap">{formData.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Terms & Disclaimers */}
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle>Acceptare Termeni</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="disclaimer"
              checked={disclaimerAccepted}
              onCheckedChange={(checked) => setDisclaimerAccepted(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="disclaimer" className="text-sm font-medium leading-snug cursor-pointer">
                Înțeleg că prețurile sunt <strong>strict estimative</strong>
              </Label>
              <p className="text-xs text-muted-foreground">
                Prețurile afișate în această cerere sunt orientative și pot varia în funcție de
                disponibilitatea materialelor, condițiile de piață și volumul comenzii. Oferta finală
                cu prețuri exacte va fi comunicată de echipa de vânzări.
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="terms" className="text-sm font-medium leading-snug cursor-pointer">
                Accept termenii și condițiile
              </Label>
              <p className="text-xs text-muted-foreground">
                Prin trimiterea acestei cereri, accept{' '}
                <a href="#" className="underline">
                  termenii și condițiile
                </a>{' '}
                MetalDirect și sunt de acord ca datele mele să fie procesate pentru generarea ofertei.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
          Înapoi
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          size="lg"
          className="min-w-[200px]"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Se trimite...
            </>
          ) : (
            <>
              Trimite Cerere de Ofertă
            </>
          )}
        </Button>
      </div>

      {!canSubmit && !isSubmitting && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Vă rugăm să acceptați ambii termeni pentru a putea trimite cererea de ofertă.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ReviewStep;
