import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import BackofficeLayout from '@/components/backoffice/BackofficeLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getRFQById, updateRFQStatus } from '@/lib/api/backoffice';
import type { RFQDetail, UpdateRFQStatusData } from '@/types/backoffice';
import {
  ArrowLeft,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Package,
  Calendar,
  Edit,
  DollarSign,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const BackofficeRFQDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rfq, setRfq] = useState<RFQDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Status update dialog
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

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
      setInternalNotes(data.internalNotes || '');
      setCustomerNotes(data.customerNotes || '');
    } catch (err: any) {
      setError(err.message || 'Failed to load RFQ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!id) return;

    setIsUpdating(true);

    try {
      const updateData: UpdateRFQStatusData = {};

      if (newStatus) {
        updateData.status = newStatus as any;
      }

      if (internalNotes !== rfq?.internalNotes) {
        updateData.internalNotes = internalNotes;
      }

      if (customerNotes !== rfq?.customerNotes) {
        updateData.customerNotes = customerNotes;
      }

      await updateRFQStatus(id, updateData);

      toast({
        title: 'Success',
        description: 'RFQ status updated successfully',
      });

      setIsStatusDialogOpen(false);
      loadRFQ();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update RFQ status',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      submitted: { variant: 'secondary', label: 'Submitted' },
      acknowledged: { variant: 'default', label: 'Acknowledged' },
      in_progress: { variant: 'default', label: 'In Progress' },
      quoted: { variant: 'default', label: 'Quoted' },
      completed: { variant: 'default', label: 'Completed' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
    };

    const config = variants[(status || 'submitted').toLowerCase()] || variants.submitted;
    return <Badge variant={config.variant}>{config.label}</Badge>;
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
          <Button variant="ghost" onClick={() => navigate('/backoffice/rfqs')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to RFQs
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
            <Button variant="ghost" onClick={() => navigate('/backoffice/rfqs')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{rfq.companyName}</h1>
                {getStatusBadge(rfq.status)}
              </div>
              <p className="text-gray-500">Reference: {rfq.referenceNumber}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => {
              setNewStatus(rfq.status);
              setIsStatusDialogOpen(true);
            }}>
              <Edit className="mr-2 h-4 w-4" />
              Update Status
            </Button>
            <Link to={`/backoffice/rfqs/${id}/pricing`}>
              <Button variant="outline">
                <DollarSign className="mr-2 h-4 w-4" />
                Edit Pricing
              </Button>
            </Link>
          </div>
        </div>

        {/* Company & Contact Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Company Name:</span>
                <p className="text-sm">{rfq.companyName}</p>
              </div>
              {rfq.cui && (
                <div>
                  <span className="text-sm font-medium text-gray-500">CUI:</span>
                  <p className="text-sm">{rfq.cui}</p>
                </div>
              )}
              {rfq.regCom && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Reg. Com.:</span>
                  <p className="text-sm">{rfq.regCom}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <p className="text-sm">{rfq.contactPerson}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <a href={`mailto:${rfq.email}`} className="text-sm text-primary hover:underline">
                  {rfq.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <a href={`tel:${rfq.phone}`} className="text-sm text-primary hover:underline">
                  {rfq.phone}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Address */}
        {rfq.deliveryAddress && typeof rfq.deliveryAddress === 'object' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{rfq.deliveryAddress.street}</p>
              <p className="text-sm text-gray-600">
                {rfq.deliveryAddress.city}, {rfq.deliveryAddress.county}
                {rfq.deliveryAddress.postalCode && `, ${rfq.deliveryAddress.postalCode}`}
              </p>
              <p className="text-sm text-gray-600">{rfq.deliveryAddress.country}</p>
            </CardContent>
          </Card>
        )}

        {/* RFQ Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Requested Items ({rfq.items?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="pb-3">SKU</th>
                    <th className="pb-3">Product</th>
                    <th className="pb-3 text-right">Quantity</th>
                    <th className="pb-3 text-right">Unit Price</th>
                    <th className="pb-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rfq.items?.map((item) => (
                    <tr key={item.id} className="text-sm">
                      <td className="py-3">{item.productSku}</td>
                      <td className="py-3">{item.productName}</td>
                      <td className="py-3 text-right">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-3 text-right">
                        {(item as any).finalPrice || (item as any).grossPrice
                          ? `${((item as any).finalPrice || (item as any).grossPrice).toFixed(2)} RON`
                          : '-'}
                      </td>
                      <td className="py-3 text-right">
                        {(item as any).finalPrice || (item as any).grossPrice
                          ? `${(item.quantity * ((item as any).finalPrice || (item as any).grossPrice)).toFixed(2)} RON`
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pricing Summary */}
            {rfq.finalQuoteAmount && (
              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>
                    {(
                      rfq.items?.reduce((sum, item: any) => {
                        const price = item.finalPrice || item.grossPrice || 0;
                        return sum + item.quantity * price;
                      }, 0) || 0
                    ).toFixed(2)}{' '}
                    RON
                  </span>
                </div>
                {rfq.deliveryCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Delivery Cost:</span>
                    <span>{rfq.deliveryCost.toFixed(2)} RON</span>
                  </div>
                )}
                {rfq.processingFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Processing Fee:</span>
                    <span>{rfq.processingFee.toFixed(2)} RON</span>
                  </div>
                )}
                {rfq.vatAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>VAT (21%):</span>
                    <span>{rfq.vatAmount.toFixed(2)} RON</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total:</span>
                  <span className="text-primary">{rfq.finalQuoteAmount.toFixed(2)} RON</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Special Requirements */}
        {rfq.specialRequirements && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Special Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{rfq.specialRequirements}</p>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {rfq.internalNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Internal Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{rfq.internalNotes}</p>
              </CardContent>
            </Card>
          )}

          {rfq.customerNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Customer Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{rfq.customerNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="text-sm">
                <span className="font-medium">Submitted:</span>{' '}
                {rfq.submittedAt ? format(new Date(rfq.submittedAt), 'MMM d, yyyy HH:mm') : 'N/A'}
              </div>
            </div>
            {rfq.acknowledgedAt && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="text-sm">
                  <span className="font-medium">Acknowledged:</span>{' '}
                  {format(new Date(rfq.acknowledgedAt), 'MMM d, yyyy HH:mm')}
                </div>
              </div>
            )}
            {rfq.inProgressAt && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="text-sm">
                  <span className="font-medium">In Progress:</span>{' '}
                  {format(new Date(rfq.inProgressAt), 'MMM d, yyyy HH:mm')}
                </div>
              </div>
            )}
            {rfq.quotedAt && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="text-sm">
                  <span className="font-medium">Quoted:</span>{' '}
                  {format(new Date(rfq.quotedAt), 'MMM d, yyyy HH:mm')}
                </div>
              </div>
            )}
            {rfq.completedAt && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <div className="text-sm">
                  <span className="font-medium">Completed:</span>{' '}
                  {format(new Date(rfq.completedAt), 'MMM d, yyyy HH:mm')}
                </div>
              </div>
            )}
            {rfq.cancelledAt && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="text-sm">
                  <span className="font-medium">Cancelled:</span>{' '}
                  {format(new Date(rfq.cancelledAt), 'MMM d, yyyy HH:mm')}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update RFQ Status</DialogTitle>
            <DialogDescription>
              Update the status and notes for this RFQ
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="ACKNOWLEDGED">Acknowledged</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="QUOTED">Quoted</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Internal Notes</Label>
              <Textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Add internal notes (not visible to customer)"
                rows={3}
              />
            </div>

            <div>
              <Label>Customer Notes</Label>
              <Textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Add customer-facing notes"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update RFQ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BackofficeLayout>
  );
};

export default BackofficeRFQDetail;
