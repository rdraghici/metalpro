import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createProduct } from '@/lib/api/backoffice';
import type { CreateProductData } from '@/types/backoffice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const BASE_UNITS = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'm', label: 'Meters (m)' },
  { value: 'pcs', label: 'Pieces (pcs)' },
  { value: 'm2', label: 'Square Meters (m²)' },
];

const AVAILABILITY_OPTIONS = [
  { value: 'in_stock', label: 'In Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
  { value: 'on_order', label: 'On Order' },
];

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AddProductDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddProductDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [continueAdding, setContinueAdding] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreateProductData>({
    categoryId: '',
    sku: '',
    title: '',
    grade: '',
    standard: '',
    dimensions: '',
    availability: 'in_stock',
    baseUnit: 'kg',
    pricePerUnit: 0,
    weight: undefined,
    lengthM: undefined,
    isActive: true,
  });

  // Fetch categories when dialog opens
  useEffect(() => {
    if (open) {
      const fetchCategories = async () => {
        setIsLoadingCategories(true);
        try {
          const response = await fetch('http://localhost:3001/api/categories');
          const result = await response.json();
          if (result.success && result.data) {
            setCategories(result.data);
          }
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to load categories',
            variant: 'destructive',
          });
        } finally {
          setIsLoadingCategories(false);
        }
      };
      fetchCategories();
    }
  }, [open, toast]);

  // Generate SKU suggestion based on category and title
  const generateSKU = () => {
    if (!formData.categoryId || !formData.title) return;

    const category = categories.find(c => c.id === formData.categoryId);
    const categoryPrefix = category?.slug.toUpperCase().slice(0, 4) || 'PROD';
    const titlePart = formData.title.replace(/\s+/g, '-').toUpperCase().slice(0, 10);
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();

    setFormData(prev => ({ ...prev, sku: `${categoryPrefix}-${titlePart}-${randomSuffix}` }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.categoryId || !formData.sku || !formData.title || !formData.baseUnit || formData.pricePerUnit <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean up the data - remove empty strings and convert to proper types
      const dataToSubmit: CreateProductData = {
        ...formData,
        grade: formData.grade || undefined,
        standard: formData.standard || undefined,
        dimensions: formData.dimensions || undefined,
        availability: formData.availability || 'in_stock',
        weight: formData.weight ? parseFloat(formData.weight.toString()) : undefined,
        lengthM: formData.lengthM ? parseFloat(formData.lengthM.toString()) : undefined,
        pricePerUnit: parseFloat(formData.pricePerUnit.toString()),
      };

      await createProduct(dataToSubmit);

      toast({
        title: 'Success',
        description: `Product "${formData.title}" has been created successfully`,
      });

      if (continueAdding) {
        // Reset form but keep dialog open
        setFormData({
          categoryId: formData.categoryId, // Keep category for convenience
          sku: '',
          title: '',
          grade: '',
          standard: '',
          dimensions: '',
          availability: 'in_stock',
          baseUnit: 'kg',
          pricePerUnit: 0,
          weight: undefined,
          lengthM: undefined,
          isActive: true,
        });
      } else {
        // Close dialog and refresh list
        onOpenChange(false);
        // Reset form for next time
        setFormData({
          categoryId: '',
          sku: '',
          title: '',
          grade: '',
          standard: '',
          dimensions: '',
          availability: 'in_stock',
          baseUnit: 'kg',
          pricePerUnit: 0,
          weight: undefined,
          lengthM: undefined,
          isActive: true,
        });
      }

      onSuccess(); // Refresh the product list
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create product',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreateProductData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the product details below. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Row 1: Category and SKU */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => handleInputChange('categoryId', value)}
                  disabled={isLoadingCategories}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select a category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <div className="flex gap-2">
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    placeholder="e.g., PROF-HEA100-A1B2"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateSKU}
                    disabled={!formData.categoryId || !formData.title}
                  >
                    Generate
                  </Button>
                </div>
              </div>
            </div>

            {/* Row 2: Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., HEA 100 S235JR"
                required
              />
            </div>

            {/* Row 3: Grade and Standard */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  value={formData.grade || ''}
                  onChange={(e) => handleInputChange('grade', e.target.value)}
                  placeholder="e.g., S235JR"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="standard">Standard</Label>
                <Input
                  id="standard"
                  value={formData.standard || ''}
                  onChange={(e) => handleInputChange('standard', e.target.value)}
                  placeholder="e.g., EN 10025-2"
                />
              </div>
            </div>

            {/* Row 4: Dimensions */}
            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input
                id="dimensions"
                value={formData.dimensions || ''}
                onChange={(e) => handleInputChange('dimensions', e.target.value)}
                placeholder="e.g., 100x96x5x8"
              />
            </div>

            {/* Row 5: Base Unit and Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="baseUnit">Base Unit *</Label>
                <Select
                  value={formData.baseUnit}
                  onValueChange={(value) => handleInputChange('baseUnit', value)}
                >
                  <SelectTrigger id="baseUnit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BASE_UNITS.map(unit => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerUnit">Price per Unit (RON) *</Label>
                <Input
                  id="pricePerUnit"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.pricePerUnit || ''}
                  onChange={(e) => handleInputChange('pricePerUnit', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Row 6: Weight and Length */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.weight || ''}
                  onChange={(e) => handleInputChange('weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lengthM">Length (m)</Label>
                <Input
                  id="lengthM"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.lengthM || ''}
                  onChange={(e) => handleInputChange('lengthM', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Row 7: Availability and Active Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Select
                  value={formData.availability || 'in_stock'}
                  onValueChange={(value) => handleInputChange('availability', value)}
                >
                  <SelectTrigger id="availability">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABILITY_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="isActive">Active Status</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  />
                  <Label htmlFor="isActive" className="font-normal">
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </Label>
                </div>
              </div>
            </div>

            {/* Continue Adding Checkbox */}
            <div className="flex items-center space-x-2 pt-2 border-t">
              <input
                type="checkbox"
                id="continueAdding"
                checked={continueAdding}
                onChange={(e) => setContinueAdding(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="continueAdding" className="font-normal">
                Save and continue adding products
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {continueAdding ? 'Save & Add Another' : 'Add Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}