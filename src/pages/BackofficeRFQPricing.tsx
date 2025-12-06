import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackofficeLayout from '@/components/backoffice/BackofficeLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { getRFQById, updateRFQPricing, updateRFQStatus } from '@/lib/api/backoffice';
import type { RFQDetail, RFQItem } from '@/types/backoffice';
import { ArrowLeft, Save, Calculator, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PricingItem extends RFQItem {
  editedPrice?: number;
  editedQuantity?: number;
}

const BackofficeRFQPricing = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [rfq, setRfq] = useState<RFQDetail | null>(null);
  const [items, setItems] = useState<PricingItem[]>([]);
  const [deliveryCost, setDeliveryCost] = useState<number>(0);
  const [processingFee, setProcessingFee] = useState<number>(0);
  const [vatRate, setVatRate] = useState<number>(21);
  const [markAsQuoted, setMarkAsQuoted] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadRFQ();
    }
  }, [id]);

  const loadRFQ = async () => {
    if (!id) return;

    setIsLoading(true);
    setError('');

    try {
      const data = await getRFQById(id);
      setRfq(data);

      // Initialize items with existing prices and quantities
      // Use finalPrice if set by operator, otherwise use grossPrice (initial estimate)
      const pricingItems: PricingItem[] = data.items.map((item: any) => ({
        ...item,
        editedPrice: item.finalPrice || item.grossPrice || undefined,
        editedQuantity: item.quantity,
      }));
      setItems(pricingItems);

      // Load existing costs
      setDeliveryCost(data.deliveryCost || 0);
      setProcessingFee(data.processingFee || 0);

      // Calculate VAT rate from existing data if available
      if (data.vatAmount && data.finalQuoteAmount) {
        // Calculate subtotal by multiplying quantity * price for each item
        const subtotalWithCosts =
          data.items.reduce((sum: number, item: any) => {
            const price = item.finalPrice || item.grossPrice || 0;
            const total = item.quantity * price;
            return sum + total;
          }, 0) +
          (data.deliveryCost || 0) +
          (data.processingFee || 0);
        const calculatedVatRate = (data.vatAmount / subtotalWithCosts) * 100;
        setVatRate(Math.round(calculatedVatRate));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load RFQ');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceChange = (itemId: string, price: string) => {
    const numPrice = parseFloat(price) || 0;
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, editedPrice: numPrice } : item
      )
    );
  };

  const handleQuantityChange = (itemId: string, quantity: string) => {
    const numQuantity = parseFloat(quantity) || 0;
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, editedQuantity: numQuantity } : item
      )
    );
  };

  const calculateItemTotal = (item: PricingItem): number => {
    const price = item.editedPrice || 0;
    const quantity = item.editedQuantity || 0;
    return price * quantity;
  };

  const calculateSubtotal = (): number => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const calculateVAT = (): number => {
    const subtotalWithCosts = calculateSubtotal() + deliveryCost + processingFee;
    return (subtotalWithCosts * vatRate) / 100;
  };

  const calculateTotal = (): number => {
    return calculateSubtotal() + deliveryCost + processingFee + calculateVAT();
  };

  const handleSave = async () => {
    if (!id) return;

    // Validate that all items have prices
    const missingPrices = items.filter((item) => !item.editedPrice || item.editedPrice <= 0);
    if (missingPrices.length > 0) {
      toast({
        title: 'Validation Error',
        description: 'Please set prices for all items before saving',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      // Prepare pricing data
      const pricingData = {
        items: items.map((item) => ({
          id: item.id,
          pricePerUnit: item.editedPrice || 0,
        })),
        deliveryCost,
        processingFee,
        vatAmount: calculateVAT(),
        finalQuoteAmount: calculateTotal(),
      };

      // Update pricing
      await updateRFQPricing(id, pricingData);

      // Update status to QUOTED if requested
      if (markAsQuoted && rfq?.status !== 'QUOTED') {
        await updateRFQStatus(id, { status: 'QUOTED' });
      }

      toast({
        title: 'Success',
        description: 'Pricing updated successfully',
      });

      // Navigate back to RFQ detail
      navigate(`/backoffice/rfqs/${id}`);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to save pricing',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <BackofficeLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </BackofficeLayout>
    );
  }

  if (error || !rfq) {
    return (
      <BackofficeLayout>
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => navigate(`/backoffice/rfqs/${id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to RFQ
          </Button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error || 'RFQ not found'}
          </div>
        </div>
      </BackofficeLayout>
    );
  }

  return (
    <BackofficeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" onClick={() => navigate(`/backoffice/rfqs/${id}`)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Pricing</h1>
              <p className="text-gray-500 mt-1">
                {rfq.companyName} - {rfq.referenceNumber}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/backoffice/rfqs/${id}`)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Pricing'}
            </Button>
          </div>
        </div>

        {/* Info Alert */}
        <Alert>
          <Calculator className="h-4 w-4" />
          <AlertDescription>
            Set the price per unit for each item. Totals will be calculated automatically.
          </AlertDescription>
        </Alert>

        {/* Items Pricing Table */}
        <Card>
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="pb-3 w-32">SKU</th>
                    <th className="pb-3">Product</th>
                    <th className="pb-3 text-right w-24">Quantity</th>
                    <th className="pb-3 text-right w-40">Price per Unit (RON)</th>
                    <th className="pb-3 text-right w-32">Total (RON)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 text-sm">{item.productSku}</td>
                      <td className="py-3 text-sm">{item.productName}</td>
                      <td className="py-3">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.editedQuantity || ''}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          className="text-right"
                          placeholder="0"
                        />
                      </td>
                      <td className="py-3">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.editedPrice || ''}
                          onChange={(e) => handlePriceChange(item.id, e.target.value)}
                          className="text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="py-3 text-sm text-right font-medium">
                        {calculateItemTotal(item).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t font-medium">
                  <tr>
                    <td colSpan={4} className="py-3 text-right">
                      Subtotal:
                    </td>
                    <td className="py-3 text-right">{calculateSubtotal().toFixed(2)} RON</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Additional Costs */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Costs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="deliveryCost">Delivery Cost (RON)</Label>
                <Input
                  id="deliveryCost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={deliveryCost}
                  onChange={(e) => setDeliveryCost(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="processingFee">Processing Fee (RON)</Label>
                <Input
                  id="processingFee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={processingFee}
                  onChange={(e) => setProcessingFee(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="vatRate">VAT Rate (%)</Label>
                <Input
                  id="vatRate"
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={vatRate}
                  onChange={(e) => setVatRate(parseFloat(e.target.value) || 0)}
                  placeholder="21"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Summary */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Quote Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal (items):</span>
              <span className="font-medium">{calculateSubtotal().toFixed(2)} RON</span>
            </div>
            {deliveryCost > 0 && (
              <div className="flex justify-between text-sm">
                <span>Delivery Cost:</span>
                <span className="font-medium">{deliveryCost.toFixed(2)} RON</span>
              </div>
            )}
            {processingFee > 0 && (
              <div className="flex justify-between text-sm">
                <span>Processing Fee:</span>
                <span className="font-medium">{processingFee.toFixed(2)} RON</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>VAT ({vatRate}%):</span>
              <span className="font-medium">{calculateVAT().toFixed(2)} RON</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-3 border-t">
              <span>Total Quote:</span>
              <span className="text-primary">{calculateTotal().toFixed(2)} RON</span>
            </div>
          </CardContent>
        </Card>

        {/* Options */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="markAsQuoted"
                checked={markAsQuoted}
                onCheckedChange={(checked) => setMarkAsQuoted(checked as boolean)}
              />
              <Label htmlFor="markAsQuoted" className="cursor-pointer">
                Mark RFQ as "Quoted" when saving
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Warning if prices missing */}
        {items.some((item) => !item.editedPrice || item.editedPrice <= 0) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please set prices for all items before saving. Items without prices cannot be quoted.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </BackofficeLayout>
  );
};

export default BackofficeRFQPricing;
