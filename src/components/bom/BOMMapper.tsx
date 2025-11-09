import { useState, useMemo } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  XCircle,
  Edit2,
  Trash2,
  ShoppingCart,
  Save,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import type { BOMRow, BOMMatchConfidence } from '@/types/bom';
import type { Product } from '@/types';
import { getBOMMatchingStats } from '@/lib/utils/bomParser';

interface BOMMapperProps {
  rows: BOMRow[];
  products: Product[];
  onRowEdit: (rowIndex: number) => void;
  onRowDelete: (rowIndex: number) => void;
  onAddToCart: (selectedRows: BOMRow[]) => void;
  onSaveProject?: () => void;
}

const BOMMapper: React.FC<BOMMapperProps> = ({
  rows,
  products,
  onRowEdit,
  onRowDelete,
  onAddToCart,
  onSaveProject,
}) => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const stats = useMemo(() => getBOMMatchingStats(rows), [rows]);

  const getConfidenceBadge = (confidence: BOMMatchConfidence) => {
    switch (confidence) {
      case 'high':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Încredere Mare
          </Badge>
        );
      case 'medium':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Încredere Medie
          </Badge>
        );
      case 'low':
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Încredere Scăzută
          </Badge>
        );
      case 'none':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Nepotrivit
          </Badge>
        );
    }
  };

  const getMatchedProduct = (row: BOMRow): Product | undefined => {
    if (!row.matchedProductId) return undefined;
    return products.find((p) => p.id === row.matchedProductId);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select only rows with high or medium confidence
      const selectableRows = new Set(
        rows
          .filter((row) => row.matchConfidence === 'high' || row.matchConfidence === 'medium')
          .map((row) => row.rowIndex)
      );
      setSelectedRows(selectableRows);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (rowIndex: number, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(rowIndex);
    } else {
      newSelected.delete(rowIndex);
    }
    setSelectedRows(newSelected);
  };

  const handleAddSelectedToCart = () => {
    const selected = rows.filter((row) => selectedRows.has(row.rowIndex));
    onAddToCart(selected);
  };

  const canAddToCart =
    selectedRows.size > 0 &&
    Array.from(selectedRows).every((idx) => {
      const row = rows.find((r) => r.rowIndex === idx);
      return row && row.matchedProductId;
    });

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistici Auto-Matching</CardTitle>
          <CardDescription>
            {rows.length} rânduri procesate din fișierul BOM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="text-3xl font-bold text-green-700">{stats.highConfidence}</div>
              <div className="text-sm text-green-600 mt-1">Încredere Mare</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-700">{stats.mediumConfidence}</div>
              <div className="text-sm text-yellow-600 mt-1">Încredere Medie</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-200">
              <div className="text-3xl font-bold text-orange-700">{stats.lowConfidence}</div>
              <div className="text-sm text-orange-600 mt-1">Încredere Scăzută</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="text-3xl font-bold text-red-700">{stats.unmatched}</div>
              <div className="text-sm text-red-600 mt-1">Nepotrivite</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-3xl font-bold text-blue-700">{stats.matchRate.toFixed(0)}%</div>
              <div className="text-sm text-blue-600 mt-1">Rata de Potrivire</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Alert */}
      {stats.unmatched > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Atenție</AlertTitle>
          <AlertDescription>
            {stats.unmatched} {stats.unmatched === 1 ? 'rând nu a putut fi' : 'rânduri nu au putut fi'} potrivite
            automat. Puteți edita aceste rânduri pentru a le mapa manual.
          </AlertDescription>
        </Alert>
      )}

      {/* BOM Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Previzualizare BOM</CardTitle>
              <CardDescription>
                {selectedRows.size > 0 ? `${selectedRows.size} rânduri selectate` : 'Selectați rândurile pentru a adăuga în coș'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {onSaveProject && (
                <Button
                  variant="outline"
                  onClick={onSaveProject}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline">Salvează Proiect</span>
                </Button>
              )}
              <Button
                onClick={handleAddSelectedToCart}
                disabled={!canAddToCart}
                className="gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Adaugă în Coș ({selectedRows.size})</span>
                <span className="sm:hidden">Coș ({selectedRows.size})</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedRows.size > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Familie</TableHead>
                  <TableHead>Grad</TableHead>
                  <TableHead>Dimensiune</TableHead>
                  <TableHead className="text-right">Cantitate</TableHead>
                  <TableHead>Unitate</TableHead>
                  <TableHead>Potrivire</TableHead>
                  <TableHead>Produs Potrivit</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                      Nu există rânduri de afișat
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => {
                    const matchedProduct = getMatchedProduct(row);
                    const isSelectable =
                      row.matchConfidence === 'high' || row.matchConfidence === 'medium';
                    const isSelected = selectedRows.has(row.rowIndex);

                    return (
                      <TableRow
                        key={row.rowIndex}
                        className={cn(
                          row.matchConfidence === 'none' && 'bg-red-50/50',
                          row.matchConfidence === 'low' && 'bg-orange-50/50',
                          isSelected && 'bg-blue-50'
                        )}
                      >
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            disabled={!isSelectable}
                            onCheckedChange={(checked) =>
                              handleSelectRow(row.rowIndex, checked === true)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {row.rowIndex}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{row.family || '—'}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-mono">{row.grade || '—'}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-mono">{row.dimension || '—'}</span>
                        </TableCell>
                        <TableCell className="text-right font-semibold">{row.qty}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{row.unit}</Badge>
                        </TableCell>
                        <TableCell>{getConfidenceBadge(row.matchConfidence)}</TableCell>
                        <TableCell>
                          {matchedProduct ? (
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{matchedProduct.title}</p>
                              <p className="text-xs text-muted-foreground">{row.matchReason}</p>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {row.matchReason || 'Nicio potrivire'}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRowEdit(row.rowIndex)}
                              title="Editează maparea"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRowDelete(row.rowIndex)}
                              title="Șterge rând"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BOMMapper;
