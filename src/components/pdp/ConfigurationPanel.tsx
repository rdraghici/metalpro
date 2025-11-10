import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { ProductConfiguration, SellingUnit, LengthOption, FinishOption } from "@/hooks/useProductConfig";
import { useTranslation } from "@/hooks/useTranslation";

interface ConfigurationPanelProps {
  config: ProductConfiguration;
  onSellingUnitChange: (unit: SellingUnit) => void;
  onLengthOptionChange: (option: LengthOption) => void;
  onCustomLengthChange: (length: number) => void;
  onQuantityChange: (quantity: number) => void;
  onFinishChange: (finish: FinishOption) => void;
  onCutToLengthToggle: () => void;
}

export default function ConfigurationPanel({
  config,
  onSellingUnitChange,
  onLengthOptionChange,
  onCustomLengthChange,
  onQuantityChange,
  onFinishChange,
  onCutToLengthToggle,
}: ConfigurationPanelProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('product.product_configuration')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selling Unit Selector */}
        <div className="space-y-3">
          <Label>{t('product.selling_unit')}</Label>
          <RadioGroup
            value={config.sellingUnit}
            onValueChange={(value) => onSellingUnitChange(value as SellingUnit)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="m" id="unit-m" />
              <Label htmlFor="unit-m" className="font-normal cursor-pointer">
                {t('product.unit_meters')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="kg" id="unit-kg" />
              <Label htmlFor="unit-kg" className="font-normal cursor-pointer">
                {t('product.unit_kilograms')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pcs" id="unit-pcs" />
              <Label htmlFor="unit-pcs" className="font-normal cursor-pointer">
                {t('product.unit_pieces')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bundle" id="unit-bundle" />
              <Label htmlFor="unit-bundle" className="font-normal cursor-pointer">
                {t('product.unit_bundle')}
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Length Options */}
        {config.sellingUnit !== "kg" && (
          <div className="space-y-3">
            <Label htmlFor="length-select">{t('product.length')}</Label>
            <Select
              value={config.lengthOption}
              onValueChange={(value) => onLengthOptionChange(value as LengthOption)}
            >
              <SelectTrigger id="length-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6m">{t('product.length_6m')}</SelectItem>
                <SelectItem value="12m">{t('product.length_12m')}</SelectItem>
                <SelectItem value="custom">{t('product.length_custom')}</SelectItem>
              </SelectContent>
            </Select>

            {config.lengthOption === "custom" && (
              <div className="mt-2">
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="12"
                  placeholder={t('product.enter_length')}
                  value={config.customLength || ""}
                  onChange={(e) => onCustomLengthChange(parseFloat(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t('product.max_length')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quantity Input */}
        <div className="space-y-3">
          <Label htmlFor="quantity">{t('product.quantity')}</Label>
          <div className="flex items-center gap-2">
            <Input
              id="quantity"
              type="number"
              min="1"
              value={config.quantity}
              onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground min-w-[40px]">
              {config.sellingUnit}
            </span>
          </div>
        </div>

        {/* Finish Selector */}
        <div className="space-y-3">
          <Label htmlFor="finish-select">{t('product.surface_finish')}</Label>
          <Select
            value={config.finish}
            onValueChange={(value) => onFinishChange(value as FinishOption)}
          >
            <SelectTrigger id="finish-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">{t('product.standard_hot_rolled')}</SelectItem>
              <SelectItem value="galvanized">{t('product.galvanized')}</SelectItem>
              <SelectItem value="painted">{t('product.painted')}</SelectItem>
              <SelectItem value="polished">{t('product.polished')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cut to Length Toggle */}
        {config.sellingUnit !== "kg" && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="cut-to-length">{t('product.custom_cutting')}</Label>
                <p className="text-xs text-muted-foreground">
                  {t('product.specify_custom_lengths')}
                </p>
              </div>
              <Switch
                id="cut-to-length"
                checked={config.cutToLength}
                onCheckedChange={onCutToLengthToggle}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
