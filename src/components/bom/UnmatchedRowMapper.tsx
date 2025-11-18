import { useState, useMemo } from 'react';
import { Search, Check } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { BOMRow } from '@/types/bom';
import type { Product, Category } from '@/types';

interface UnmatchedRowMapperProps {
  row: BOMRow | null;
  products: Product[];
  categories: Category[];
  onConfirm: (row: BOMRow, productId: string) => void;
  onCancel: () => void;
}

const UnmatchedRowMapper: React.FC<UnmatchedRowMapperProps> = ({
  row,
  products,
  categories,
  onConfirm,
  onCancel,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('__all__');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((p) => p.isActive);

    // Filter by category
    if (selectedCategoryId && selectedCategoryId !== '__all__') {
      filtered = filtered.filter((p) => p.categoryId === selectedCategoryId);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.sku?.toLowerCase().includes(query) ||
          p.grade?.toLowerCase().includes(query) ||
          p.family?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [products, selectedCategoryId, searchQuery]);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId),
    [products, selectedProductId]
  );

  const handleConfirm = () => {
    if (row && selectedProductId) {
      onConfirm(row, selectedProductId);
      // Reset state
      setSelectedCategoryId('__all__');
      setSearchQuery('');
      setSelectedProductId('');
    }
  };

  const handleCancel = () => {
    // Reset state
    setSelectedCategoryId('');
    setSearchQuery('');
    setSelectedProductId('');
    onCancel();
  };

  if (!row) return null;

  return (
    <Dialog open={!!row} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Mapare Manuală - Rând #{row.rowIndex}</DialogTitle>
          <DialogDescription>
            Selectați produsul corespunzător din catalog pentru acest rând BOM
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Original BOM Row Data */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Familie:</span>
                  <p className="font-semibold">{row.family || '—'}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Grad:</span>
                  <p className="font-semibold">{row.grade || '—'}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Dimensiune:</span>
                  <p className="font-semibold">{row.dimension || '—'}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Cantitate:</span>
                  <p className="font-semibold">
                    {row.qty} {row.unit}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category-select">Categorie Produs</Label>
              <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                <SelectTrigger id="category-select">
                  <SelectValue placeholder="Toate categoriile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Toate categoriile</SelectItem>
                  {categories
                    .filter((c) => c.isActive)
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search-input">Căutare Produs</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-input"
                  placeholder="Caută după nume, SKU, grad..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="space-y-2">
            <Label>Selectați Produsul ({filteredProducts.length} găsite)</Label>
            <ScrollArea className="h-[300px] rounded-md border">
              <div className="p-4 space-y-2">
                {filteredProducts.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    Nu s-au găsit produse. Încercați să modificați filtrele.
                  </div>
                ) : (
                  filteredProducts.map((product) => {
                    const isSelected = product.id === selectedProductId;
                    return (
                      <Card
                        key={product.id}
                        className={`cursor-pointer transition-colors hover:bg-accent ${
                          isSelected ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setSelectedProductId(product.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{product.title}</p>
                                {isSelected && <Check className="h-4 w-4 text-primary" />}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {product.sku}
                                </Badge>
                                {product.grade && (
                                  <Badge variant="outline" className="text-xs">
                                    {product.grade}
                                  </Badge>
                                )}
                                {product.family && (
                                  <Badge variant="secondary" className="text-xs">
                                    {product.family}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Selected Product Summary */}
          {selectedProduct && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-900">Produs Selectat:</span>
                </div>
                <p className="text-green-800">{selectedProduct.title}</p>
                <p className="text-sm text-green-700 mt-1">
                  SKU: {selectedProduct.sku} • Grad: {selectedProduct.grade}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Anulează
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedProductId}>
            Confirmă Maparea
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnmatchedRowMapper;
