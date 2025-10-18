import { Truck, Calendar, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/types";

interface DeliveryCueProps {
  product: Product;
  totalWeight: number;
}

export default function DeliveryCue({ product, totalWeight }: DeliveryCueProps) {
  // Calculate delivery window based on availability
  const getDeliveryWindow = () => {
    if (product.availability === "in_stock") {
      return "3-5 zile lucrătoare";
    } else if (product.availability === "on_order") {
      return "7-14 zile lucrătoare";
    } else {
      return "Se confirmă la comandă";
    }
  };

  // Calculate estimated delivery date
  const getEstimatedDeliveryDate = () => {
    if (product.availability === "backorder") {
      return "Se confirmă";
    }

    const today = new Date();
    const daysToAdd = product.availability === "in_stock" ? 5 : 14;
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + daysToAdd);

    return deliveryDate.toLocaleDateString("ro-RO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Check if special transport is needed
  const needsSpecialTransport = totalWeight > 1000;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Truck className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-sm mb-1">Interval livrare</div>
              <div className="text-sm text-muted-foreground">{getDeliveryWindow()}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-sm mb-1">Estimare livrare</div>
              <div className="text-sm text-muted-foreground">
                până la {getEstimatedDeliveryDate()}
              </div>
            </div>
          </div>

          {needsSpecialTransport && (
            <div className="flex items-start gap-3 pt-3 border-t">
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-sm mb-1 text-orange-700">
                  Transport special necesar
                </div>
                <div className="text-xs text-muted-foreground">
                  Comanda dumneavoastră depășește {totalWeight.toFixed(0)} kg. Costul
                  transportului va fi calculat individual în funcție de destinație și
                  acces la locație.
                </div>
              </div>
            </div>
          )}

          <div className="pt-3 border-t">
            <div className="text-xs text-muted-foreground">
              Taxă transport: Se calculează în funcție de greutate, volum și destinație.
              Vă vom comunica costul exact odată cu oferta.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
