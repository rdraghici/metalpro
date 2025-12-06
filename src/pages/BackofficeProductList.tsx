import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import BackofficeLayout from '@/components/backoffice/BackofficeLayout';
import AddProductDialog from '@/components/backoffice/AddProductDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getProducts, bulkUpdateProductStatus, bulkDeleteProducts } from '@/lib/api/backoffice';
import type { Product, PaginatedResponse } from '@/types/backoffice';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Power, Download, Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BackofficeProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const [products, setProducts] = useState<PaginatedResponse<Product> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [activeFilter, setActiveFilter] = useState(searchParams.get('isActive') || 'all');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

  // Add Product Dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Export Dialog state
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx'>('csv');
  const [includeInactive, setIncludeInactive] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Import Dialog state
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);

  useEffect(() => {
    loadProducts();
  }, [page, activeFilter]);

  const loadProducts = async () => {
    setIsLoading(true);
    setError('');

    try {
      const params: any = {
        page,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      if (activeFilter !== 'all') {
        params.isActive = activeFilter === 'active';
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      const data = await getProducts(params);
      setProducts(data);

      // Update URL params
      const newParams: any = { page: page.toString() };
      if (activeFilter !== 'all') newParams.isActive = activeFilter;
      if (searchTerm) newParams.search = searchTerm;
      setSearchParams(newParams);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadProducts();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === products?.data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products?.data.map((p) => p.id) || []);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkActivate = async () => {
    if (selectedIds.length === 0) return;

    setIsBulkActionLoading(true);
    try {
      await bulkUpdateProductStatus(selectedIds, true);
      toast({
        title: 'Success',
        description: `${selectedIds.length} products activated`,
      });
      setSelectedIds([]);
      loadProducts();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to activate products',
        variant: 'destructive',
      });
    } finally {
      setIsBulkActionLoading(false);
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedIds.length === 0) return;

    setIsBulkActionLoading(true);
    try {
      await bulkUpdateProductStatus(selectedIds, false);
      toast({
        title: 'Success',
        description: `${selectedIds.length} products deactivated`,
      });
      setSelectedIds([]);
      loadProducts();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to deactivate products',
        variant: 'destructive',
      });
    } finally {
      setIsBulkActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    setIsBulkActionLoading(true);
    try {
      await bulkDeleteProducts(selectedIds);
      toast({
        title: 'Success',
        description: `${selectedIds.length} products deleted`,
      });
      setSelectedIds([]);
      setIsDeleteDialogOpen(false);
      loadProducts();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete products',
        variant: 'destructive',
      });
    } finally {
      setIsBulkActionLoading(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams({
        format: exportFormat,
        includeInactive: includeInactive.toString(),
      });

      const response = await fetch(`http://localhost:3001/api/backoffice/products/export?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('backoffice_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'Products exported successfully',
      });

      setIsExportDialogOpen(false);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to export products',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        title: 'Error',
        description: 'Please select a file',
        variant: 'destructive',
      });
      return;
    }

    setIsImporting(true);
    setImportResults(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:3001/api/backoffice/products/import', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('backoffice_token')}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Import failed');
      }

      setImportResults(result);
      toast({
        title: 'Success',
        description: `Imported ${result.created} new products, updated ${result.updated} products`,
      });

      loadProducts();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to import products',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImportResults(null);
    }
  };

  return (
    <BackofficeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-500 mt-1">Manage your product catalog</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsExportDialogOpen(true)}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="flex gap-2">
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button onClick={handleSearch} size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Active Filter */}
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('all');
                  setPage(1);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <Card className="border-primary bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedIds.length} product{selectedIds.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBulkActivate}
                    disabled={isBulkActionLoading}
                  >
                    <Power className="mr-2 h-4 w-4" />
                    Activate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBulkDeactivate}
                    disabled={isBulkActionLoading}
                  >
                    <Power className="mr-2 h-4 w-4" />
                    Deactivate
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={isBulkActionLoading}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        ) : products && products.data && products.data.length > 0 ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Products ({products.pagination.total})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left text-sm text-gray-600">
                        <th className="pb-3 w-12">
                          <Checkbox
                            checked={
                              selectedIds.length === products.data.length &&
                              products.data.length > 0
                            }
                            onCheckedChange={handleSelectAll}
                          />
                        </th>
                        <th className="pb-3">SKU</th>
                        <th className="pb-3">Product</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3 text-right">Price</th>
                        <th className="pb-3 pl-8">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {products.data.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="py-3">
                            <Checkbox
                              checked={selectedIds.includes(product.id)}
                              onCheckedChange={() => handleSelectOne(product.id)}
                            />
                          </td>
                          <td className="py-3 text-sm font-mono">{product.sku}</td>
                          <td className="py-3">
                            <div className="text-sm font-medium">{product.title}</div>
                            {product.grade && (
                              <div className="text-xs text-gray-500">{product.grade}</div>
                            )}
                          </td>
                          <td className="py-3 text-sm">{product.category?.name}</td>
                          <td className="py-3 text-sm text-right">
                            {product.pricePerUnit.toFixed(2)} RON
                          </td>
                          <td className="py-3 pl-8">
                            <Badge variant={product.isActive ? 'default' : 'secondary'}>
                              {product.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link to={`/backoffice/products/${product.id}/edit`}>
                                <Button size="sm" variant="ghost">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pagination */}
            {products.pagination.pages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Page {products.pagination.page} of {products.pagination.pages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === products.pagination.pages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <p>No products found</p>
              <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Product
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Products</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.length} product
              {selectedIds.length !== 1 ? 's' : ''}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Product Dialog */}
      <AddProductDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={loadProducts}
      />

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Products</DialogTitle>
            <DialogDescription>
              Choose export format and options
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={exportFormat} onValueChange={(value: 'csv' | 'xlsx') => setExportFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                  <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeInactive"
                checked={includeInactive}
                onCheckedChange={(checked) => setIncludeInactive(checked as boolean)}
              />
              <Label htmlFor="includeInactive" className="font-normal cursor-pointer">
                Include inactive products
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)} disabled={isExporting}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={(open) => {
        setIsImportDialogOpen(open);
        if (!open) {
          setSelectedFile(null);
          setImportResults(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Products</DialogTitle>
            <DialogDescription>
              Upload a CSV or Excel file with product data
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>File</Label>
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                disabled={isImporting}
              />
              {selectedFile && (
                <p className="text-sm text-gray-500">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>

            {importResults && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Import Results:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Processed: {importResults.processed}</div>
                      <div className="text-green-600">Created: {importResults.created}</div>
                      <div className="text-blue-600">Updated: {importResults.updated}</div>
                      <div className="text-red-600">Errors: {importResults.errors}</div>
                    </div>

                    {importResults.errorDetails && importResults.errorDetails.length > 0 && (
                      <div className="mt-4 max-h-48 overflow-y-auto">
                        <h5 className="font-semibold text-sm mb-2">Errors:</h5>
                        <div className="space-y-1">
                          {importResults.errorDetails.map((err: any, idx: number) => (
                            <div key={idx} className="text-xs text-red-600 border-l-2 border-red-300 pl-2 py-1">
                              Row {err.row} (SKU: {err.sku}): {err.error}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
              <h4 className="font-semibold mb-2">Expected Format:</h4>
              <p className="text-gray-600 mb-2">
                CSV/Excel file with the following columns:
              </p>
              <code className="text-xs block bg-white p-2 rounded border">
                sku, title, category, grade, standard, dimensions, availability, baseUnit, pricePerUnit, weight, lengthM, isActive
              </code>
              <p className="text-gray-600 mt-2 text-xs">
                Category should use the slug (e.g., "profiles", "plates", "tubes")
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsImportDialogOpen(false);
                setSelectedFile(null);
                setImportResults(null);
              }}
              disabled={isImporting}
            >
              {importResults ? 'Close' : 'Cancel'}
            </Button>
            {!importResults && (
              <Button onClick={handleImport} disabled={!selectedFile || isImporting}>
                {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Import
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BackofficeLayout>
  );
};

export default BackofficeProductList;
