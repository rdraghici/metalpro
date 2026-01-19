import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, Package, Weight, Edit2, Check, X } from 'lucide-react';
import type { CartLine, Unit } from '@/types/cart';
import { useCart } from '@/context/CartContext';
import { useTranslation } from '@/hooks/useTranslation';

interface CartLineItemProps {
  line: CartLine;
  editable?: boolean;
}

const CartLineItem: React.FC<CartLineItemProps> = ({ line, editable = true }) => {
  const { updateCartLine, removeCartLine } = useCart();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuantity, setEditedQuantity] = useState(line.quantity);
  const [editedUnit, setEditedUnit] = useState<Unit>(line.unit);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleSaveEdit = () => {
    updateCartLine({
      lineId: line.id,
      quantity: editedQuantity,
      unit: editedUnit,
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedQuantity(line.quantity);
    setEditedUnit(line.unit);
    setIsEditing(false);
  };

  const handleRemove = () => {
    removeCartLine(line.id);
  };

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        {/* Product Image/Icon */}
        <div className="flex-shrink-0 w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
          {line.product?.imageUrl ? (
            <img
              src={line.product.imageUrl}
              alt={line.product.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Package className="h-10 w-10 text-muted-foreground" />
          )}
        </div>

        {/* Product Details */}
        <div className="flex-grow space-y-2">
          {/* Title & SKU */}
          <div>
            <h4 className="font-semibold text-sm">{line.product?.title}</h4>
            <p className="text-xs text-muted-foreground font-mono">SKU: {line.product?.sku}</p>
          </div>

          {/* Specifications */}
          <div className="flex flex-wrap gap-1.5">
            {line.specs.grade && (
              <Badge variant="secondary" className="text-xs">
                {line.specs.grade}
              </Badge>
            )}
            {line.specs.standard && (
              <Badge variant="outline" className="text-xs">
                {line.specs.standard}
              </Badge>
            )}
            {line.specs.dimensionSummary && (
              <Badge variant="outline" className="text-xs">
                {line.specs.dimensionSummary}
              </Badge>
            )}
            {line.specs.lengthM && (
              <Badge variant="outline" className="text-xs">
                {line.specs.lengthM}m
              </Badge>
            )}
            {line.specs.finish && (
              <Badge variant="outline" className="text-xs">
                {line.specs.finish}
              </Badge>
            )}
          </div>

          {/* Cut List Summary */}
          {line.specs.cutList && line.specs.cutList.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <strong>{t('cart.cuts_label')}</strong> {line.specs.cutList.length} {t('cart.cuts_positions')}
              {' • '}
              Total:{' '}
              {line.specs.cutList.reduce((sum, cut) => sum + cut.lengthM * cut.qty, 0).toFixed(1)}
              m
            </div>
          )}

          {/* Quantity & Unit (Editable) */}
          {isEditing && editable ? (
            <div className="flex items-center gap-2 pt-2">
              <Input
                type="number"
                min="1"
                step="0.01"
                value={editedQuantity}
                onChange={(e) => setEditedQuantity(parseFloat(e.target.value) || 1)}
                className="w-24 h-9"
              />
              <Select value={editedUnit} onValueChange={(value) => setEditedUnit(value as Unit)}>
                <SelectTrigger className="w-28 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="m">{t('cart.unit_meters')}</SelectItem>
                  <SelectItem value="kg">{t('cart.unit_kilograms')}</SelectItem>
                  <SelectItem value="pcs">{t('cart.unit_pieces')}</SelectItem>
                  <SelectItem value="bundle">{t('cart.unit_bundle')}</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                <Check className="h-4 w-4 text-green-600" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                <X className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">
                {t('cart.quantity_label')} {line.quantity} {line.unit}
              </span>
              {editable && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-6 px-2"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}

          {/* Weight Estimate */}
          {line.estWeightKg && line.estWeightKg > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Weight className="h-3.5 w-3.5" />
              <span>~{formatCurrency(line.estWeightKg)} kg</span>
            </div>
          )}
        </div>

        {/* Price & Remove Button */}
        <div className="flex-shrink-0 text-right space-y-2">
          {/* Unit Price */}
          {line.indicativeUnitPrice && (
            <div className="text-xs text-muted-foreground">
              {formatCurrency(line.indicativeUnitPrice)} RON/{line.unit}
            </div>
          )}

          {/* Subtotal */}
          {line.indicativeSubtotal && (
            <div className="font-semibold text-primary">
              {formatCurrency(line.indicativeSubtotal)} RON
            </div>
          )}

          {/* Remove Button */}
          {editable && (
            <Button
              size="sm"
              variant="destructive"
              onClick={handleRemove}
              className="w-full mt-2"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {t('cart.remove_item')}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CartLineItem;
