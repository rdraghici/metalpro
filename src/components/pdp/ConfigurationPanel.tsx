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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Configurație Produs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selling Unit Selector */}
        <div className="space-y-3">
          <Label>Unitate de vânzare</Label>
          <RadioGroup
            value={config.sellingUnit}
            onValueChange={(value) => onSellingUnitChange(value as SellingUnit)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="m" id="unit-m" />
              <Label htmlFor="unit-m" className="font-normal cursor-pointer">
                Metri (m)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="kg" id="unit-kg" />
              <Label htmlFor="unit-kg" className="font-normal cursor-pointer">
                Kilograme (kg)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pcs" id="unit-pcs" />
              <Label htmlFor="unit-pcs" className="font-normal cursor-pointer">
                Bucăți (buc)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bundle" id="unit-bundle" />
              <Label htmlFor="unit-bundle" className="font-normal cursor-pointer">
                Pachet
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Length Options */}
        {config.sellingUnit !== "kg" && (
          <div className="space-y-3">
            <Label htmlFor="length-select">Lungime</Label>
            <Select
              value={config.lengthOption}
              onValueChange={(value) => onLengthOptionChange(value as LengthOption)}
            >
              <SelectTrigger id="length-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6m">6 metri (standard)</SelectItem>
                <SelectItem value="12m">12 metri</SelectItem>
                <SelectItem value="custom">Lungime personalizată</SelectItem>
              </SelectContent>
            </Select>

            {config.lengthOption === "custom" && (
              <div className="mt-2">
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="12"
                  placeholder="Introduceți lungimea (m)"
                  value={config.customLength || ""}
                  onChange={(e) => onCustomLengthChange(parseFloat(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Lungime maximă: 12 metri
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quantity Input */}
        <div className="space-y-3">
          <Label htmlFor="quantity">Cantitate</Label>
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
          <Label htmlFor="finish-select">Finisaj suprafață</Label>
          <Select
            value={config.finish}
            onValueChange={(value) => onFinishChange(value as FinishOption)}
          >
            <SelectTrigger id="finish-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (laminat la cald)</SelectItem>
              <SelectItem value="galvanized">Zincat (+15%)</SelectItem>
              <SelectItem value="painted">Vopsit (+20%)</SelectItem>
              <SelectItem value="polished">Lustruit (+30%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cut to Length Toggle */}
        {config.sellingUnit !== "kg" && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="cut-to-length">Debitare la dimensiune</Label>
                <p className="text-xs text-muted-foreground">
                  Specificați lungimi personalizate pentru debitare
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
