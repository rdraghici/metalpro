import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackofficeLayout from '@/components/backoffice/BackofficeLayout';
import ProductImageUpload from '@/components/backoffice/ProductImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/lib/api/backoffice';
import type { Product, CreateProductData } from '@/types/backoffice';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface Category {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
}

const BackofficeProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = id !== 'new';

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Image state
  const [images, setImages] = useState<string[]>([]);
  const [primaryImage, setPrimaryImage] = useState<string | null>(null);

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
    weight: 0,
    lengthM: 0,
    isActive: true,
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');

        const result = await response.json();
        setCategories(result.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditMode && id) {
      loadProduct();
    }
  }, [id, isEditMode]);

  const loadProduct = async () => {
    if (!id) return;

    setIsLoading(true);
    setError('');

    try {
      const product = await getProductById(id);
      setFormData({
        categoryId: product.categoryId,
        sku: product.sku,
        title: product.title,
        grade: product.grade || '',
        standard: product.standard || '',
        dimensions: product.dimensions || '',
        availability: product.availability || 'in_stock',
        baseUnit: product.baseUnit,
        pricePerUnit: product.pricePerUnit,
        weight: product.weight || 0,
        lengthM: product.lengthM || 0,
        isActive: product.isActive,
      });

      // Load images
      setImages(product.imageUrls || []);
      setPrimaryImage(product.imageUrl || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.categoryId || !formData.sku || !formData.title || !formData.baseUnit) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (formData.pricePerUnit <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Price per unit must be greater than 0',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      if (isEditMode && id) {
        await updateProduct(id, formData);
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        await createProduct(formData);
        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      }
      navigate('/backoffice/products');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || `Failed to ${isEditMode ? 'update' : 'create'} product`,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    setIsSaving(true);
    try {
      await deleteProduct(id);
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      navigate('/backoffice/products');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete product',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof CreateProductData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  if (error) {
    return (
      <BackofficeLayout>
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => navigate('/backoffice/products')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        </div>
      </BackofficeLayout>
    );
  }

  return (
    <BackofficeLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/backoffice/products')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditMode ? 'Edit Product' : 'New Product'}
              </h1>
              <p className="text-gray-500 mt-1">
                {isEditMode ? 'Update product information' : 'Add a new product to the catalog'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {isEditMode && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isSaving}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => navigate('/backoffice/products')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">
                  SKU <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  placeholder="PROD-001"
                  required
                />
              </div>

              <div>
                <Label htmlFor="categoryId">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => handleChange('categoryId', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name} ({category.slug})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="title">
                Product Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Product name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  value={formData.grade}
                  onChange={(e) => handleChange('grade', e.target.value)}
                  placeholder="e.g., S235JR"
                />
              </div>

              <div>
                <Label htmlFor="standard">Standard</Label>
                <Input
                  id="standard"
                  value={formData.standard}
                  onChange={(e) => handleChange('standard', e.target.value)}
                  placeholder="e.g., EN 10025"
                />
              </div>

              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={(e) => handleChange('dimensions', e.target.value)}
                  placeholder="e.g., 100x50x5"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Units */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Units</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="pricePerUnit">
                  Price per Unit (RON) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="pricePerUnit"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.pricePerUnit}
                  onChange={(e) => handleChange('pricePerUnit', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="baseUnit">
                  Base Unit <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.baseUnit} onValueChange={(value) => handleChange('baseUnit', value)}>
                  <SelectTrigger id="baseUnit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="t">Tonne (t)</SelectItem>
                    <SelectItem value="m">Meter (m)</SelectItem>
                    <SelectItem value="buc">Piece (buc)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="availability">Availability</Label>
                <Select
                  value={formData.availability || 'in_stock'}
                  onValueChange={(value) => handleChange('availability', value)}
                >
                  <SelectTrigger id="availability">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="on_order">On Order</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Physical Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Physical Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label htmlFor="lengthM">Length (m)</Label>
                <Input
                  id="lengthM"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.lengthM}
                  onChange={(e) => handleChange('lengthM', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleChange('isActive', checked)}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Product is active (visible to customers)
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Product Images - Only show when editing existing product */}
        {isEditMode && id && formData.sku && (
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductImageUpload
                productId={id}
                productSku={formData.sku}
                images={images}
                primaryImage={primaryImage}
                onImagesChange={(updatedImages, updatedPrimaryImage) => {
                  setImages(updatedImages);
                  setPrimaryImage(updatedPrimaryImage);
                }}
                disabled={isSaving}
              />
            </CardContent>
          </Card>
        )}
      </form>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </BackofficeLayout>
  );
};

export default BackofficeProductForm;
