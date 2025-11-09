import { useState, useEffect } from 'react';
import { FileText, Calendar, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import * as orderHistoryApi from '@/lib/api/orderHistory';
import type { OrderHistoryItem, RFQStatus } from '@/types/user';

const OrderHistoryTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;

    console.log('🔍 Loading orders for user:', user.id);
    setIsLoading(true);
    try {
      const data = await orderHistoryApi.getUserOrderHistory(user.id);
      console.log('📋 Orders loaded:', data.length, 'orders');
      console.log('📦 Order data:', data);
      setOrders(data);
    } catch (error) {
      console.error('❌ Error loading orders:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca comenzile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: RFQStatus) => {
    const statusConfig: Record<RFQStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      submitted: { label: 'Trimis', variant: 'secondary' },
      acknowledged: { label: 'Confirmat', variant: 'outline' },
      in_progress: { label: 'În Procesare', variant: 'default' },
      quoted: { label: 'Ofertă Primită', variant: 'default' },
      completed: { label: 'Finalizat', variant: 'default' },
      cancelled: { label: 'Anulat', variant: 'destructive' },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Istoric Comenzi (RFQ)</h3>
        <p className="text-sm text-muted-foreground">
          Vizualizează cererile de ofertă trimise și statusul lor
        </p>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-2">Nu ai comenzi trimise</p>
            <p className="text-sm text-muted-foreground mb-4">
              Cererile de ofertă (RFQ) pe care le trimiți vor apărea aici
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const itemCount = order.rfqData.cartItems?.length || 0;

            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Cerere Ofertă #{order.id.split('_')[1]}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {order.rfqData.companyInfo?.legalName || 'Companie nespecificată'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Summary Info */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Trimis: {new Date(order.submittedAt).toLocaleDateString('ro-RO', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Package className="h-3 w-3" />
                          <span>
                            {itemCount} {itemCount === 1 ? 'produs' : 'produse'}
                          </span>
                        </div>
                        {order.quote && (
                          <div className="text-primary font-semibold">
                            Valoare ofertă: {order.quote.totalPrice?.toLocaleString('ro-RO')} {order.quote.currency || 'RON'}
                          </div>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleOrderDetails(order.id)}
                        className="gap-2"
                      >
                        {isExpanded ? (
                          <>
                            Ascunde Detalii <ChevronUp className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Vezi Detalii <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="pt-3 border-t space-y-4">
                        {/* Company Info */}
                        <div>
                          <h4 className="font-semibold mb-2">Informații Companie</h4>
                          <div className="text-sm space-y-1 text-muted-foreground">
                            <p>Nume: {order.rfqData.companyInfo?.legalName || '-'}</p>
                            {order.rfqData.companyInfo?.cui && <p>CUI: {order.rfqData.companyInfo.cui}</p>}
                            <p>Contact: {order.rfqData.companyInfo?.contact?.name || '-'}</p>
                            <p>Email: {order.rfqData.companyInfo?.contact?.email || '-'}</p>
                            <p>Telefon: {order.rfqData.companyInfo?.contact?.phone || '-'}</p>
                          </div>
                        </div>

                        {/* Delivery Info */}
                        {order.rfqData.deliveryInfo?.deliveryAddress && (
                          <div>
                            <h4 className="font-semibold mb-2">Adresă Livrare</h4>
                            <div className="text-sm text-muted-foreground">
                              <p>
                                {order.rfqData.deliveryInfo.deliveryAddress.street || '-'}, {order.rfqData.deliveryInfo.deliveryAddress.city || '-'},{' '}
                                {order.rfqData.deliveryInfo.deliveryAddress.county || '-'}
                              </p>
                              {order.rfqData.deliveryInfo.deliveryAddress.postalCode && (
                                <p>Cod poștal: {order.rfqData.deliveryInfo.deliveryAddress.postalCode}</p>
                              )}
                              {order.rfqData.deliveryInfo.desiredDeliveryDate && (
                                <p>Dată dorită: {new Date(order.rfqData.deliveryInfo.desiredDeliveryDate).toLocaleDateString('ro-RO')}</p>
                              )}
                              {order.rfqData.deliveryInfo.incoterm && (
                                <p>Incoterm: {order.rfqData.deliveryInfo.incoterm}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Cart Items */}
                        <div>
                          <h4 className="font-semibold mb-2">Produse</h4>
                          <div className="space-y-2">
                            {order.rfqData.cartItems?.map((item: any, idx: number) => (
                              <div key={idx} className="text-sm bg-muted/50 p-2 rounded">
                                <div className="flex justify-between">
                                  <span className="font-medium">{item.product?.title || 'Produs'}</span>
                                  <span className="text-muted-foreground">
                                    {item.quantity} {item.unit || 'buc'}
                                  </span>
                                </div>
                                {item.specs && (
                                  <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                                    {item.specs.grade && <p>Grad: {item.specs.grade}</p>}
                                    {item.specs.standard && <p>Standard: {item.specs.standard}</p>}
                                    {item.specs.dimensionSummary && <p>Dimensiuni: {item.specs.dimensionSummary}</p>}
                                    {item.specs.lengthM && <p>Lungime: {item.specs.lengthM}m</p>}
                                    {item.specs.finish && <p>Finisaj: {item.specs.finish}</p>}
                                  </div>
                                )}
                                {item.estWeightKg && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Greutate estimativă: {item.estWeightKg.toFixed(2)} kg
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Special Requirements */}
                        {order.rfqData.specialRequirements && (
                          <div>
                            <h4 className="font-semibold mb-2">Cerințe Speciale</h4>
                            <p className="text-sm text-muted-foreground">{order.rfqData.specialRequirements}</p>
                          </div>
                        )}

                        {/* Quote Details */}
                        {order.quote && (
                          <div className="bg-primary/5 p-3 rounded">
                            <h4 className="font-semibold mb-2">Detalii Ofertă</h4>
                            <div className="text-sm space-y-1">
                              <p>
                                <strong>Valoare totală:</strong> {order.quote.totalPrice?.toLocaleString('ro-RO')}{' '}
                                {order.quote.currency || 'RON'}
                              </p>
                              {order.quote.validUntil && (
                                <p>
                                  <strong>Valabilă până la:</strong>{' '}
                                  {new Date(order.quote.validUntil).toLocaleDateString('ro-RO')}
                                </p>
                              )}
                              {order.quote.notes && (
                                <p className="text-muted-foreground mt-2">{order.quote.notes}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryTab;
