import { useState } from "react";
import { Plus, Trash2, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CutListItem } from "@/hooks/useProductConfig";

interface CutListEditorProps {
  cutList: CutListItem[];
  onAddItem: (item: Omit<CutListItem, "id">) => void;
  onUpdateItem: (id: string, updates: Partial<CutListItem>) => void;
  onRemoveItem: (id: string) => void;
  onClearList: () => void;
  wastePercentage: number;
}

export default function CutListEditor({
  cutList,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onClearList,
  wastePercentage,
}: CutListEditorProps) {
  const [newLength, setNewLength] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<string>("");

  const handleAddItem = () => {
    const length = parseFloat(newLength);
    const quantity = parseInt(newQuantity);

    if (isNaN(length) || isNaN(quantity) || length <= 0 || quantity <= 0) {
      return;
    }

    onAddItem({ length, quantity });
    setNewLength("");
    setNewQuantity("");
  };

  const handleExportCSV = () => {
    if (cutList.length === 0) return;

    const csvContent = [
      ["Lungime (m)", "Cantitate (buc)"],
      ...cutList.map(item => [item.length.toString(), item.quantity.toString()]),
    ]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cut-list-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n");

      // Skip header row
      lines.slice(1).forEach(line => {
        const [lengthStr, quantityStr] = line.split(",");
        const length = parseFloat(lengthStr?.trim());
        const quantity = parseInt(quantityStr?.trim());

        if (!isNaN(length) && !isNaN(quantity) && length > 0 && quantity > 0) {
          onAddItem({ length, quantity });
        }
      });
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = "";
  };

  const totalLength = cutList.reduce((sum, item) => sum + (item.length * item.quantity), 0);
  const totalPieces = cutList.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Listă Debitări</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={cutList.length === 0}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <label>
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <span>
                  <Upload className="h-4 w-4" />
                  Import CSV
                </span>
              </Button>
              <input
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                className="hidden"
              />
            </label>
            {cutList.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearList}
                className="text-destructive hover:text-destructive"
              >
                Șterge tot
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add New Item Form */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="Lungime (m)"
                value={newLength}
                onChange={(e) => setNewLength(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddItem();
                  }
                }}
              />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                min="1"
                placeholder="Cantitate (buc)"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddItem();
                  }
                }}
              />
            </div>
            <Button onClick={handleAddItem} className="gap-2">
              <Plus className="h-4 w-4" />
              Adaugă
            </Button>
          </div>

          {/* Cut List Table */}
          {cutList.length > 0 ? (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lungime (m)</TableHead>
                    <TableHead>Cantitate (buc)</TableHead>
                    <TableHead className="text-right">Total (m)</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cutList.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.length}
                          onChange={(e) =>
                            onUpdateItem(item.id, { length: parseFloat(e.target.value) || 0 })
                          }
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            onUpdateItem(item.id, { quantity: parseInt(e.target.value) || 1 })
                          }
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {(item.length * item.quantity).toFixed(2)} m
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveItem(item.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Summary */}
              <div className="p-4 border-t bg-muted/50 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Total bucăți:</span>
                  <span>{totalPieces} buc</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Total lungime:</span>
                  <span>{totalLength.toFixed(2)} m</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Deșeuri estimate:</span>
                  <span className={wastePercentage > 15 ? "text-orange-600" : ""}>
                    {wastePercentage.toFixed(1)}%
                  </span>
                </div>
                {wastePercentage > 15 && (
                  <div className="text-xs text-orange-600 pt-2">
                    Atenție: Procentul de deșeuri este ridicat. Considerați optimizarea listei
                    de debitări.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
              <p className="text-sm">Nu există elemente în lista de debitări</p>
              <p className="text-xs mt-1">Adăugați lungimi și cantități mai sus</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
