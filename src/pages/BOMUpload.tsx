import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Upload, ArrowLeft, Info, ShoppingCart } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import UploadDropzone from '@/components/bom/UploadDropzone';
import BOMMapper from '@/components/bom/BOMMapper';
import UnmatchedRowMapper from '@/components/bom/UnmatchedRowMapper';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { downloadBOMTemplate } from '@/lib/utils/csvExport';
import { parseBOM } from '@/lib/utils/bomParser';
import * as projectsApi from '@/lib/api/projects';
import type { BOMRow, BOMUploadResult } from '@/types/bom';
import type { Product } from '@/types';

// Import product catalog
import { allProducts } from '@/data/products';
import { categories } from '@/data/products';

const BOMUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { user, isAuthenticated, promptSignup } = useAuth();
  const analytics = useAnalytics();

  const [uploadResult, setUploadResult] = useState<BOMUploadResult | null>(null);
  const [bomRows, setBomRows] = useState<BOMRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingRow, setEditingRow] = useState<BOMRow | null>(null);
  const [resetKey, setResetKey] = useState(0);

  // Check for loaded project from account page
  useEffect(() => {
    const loadedProjectData = sessionStorage.getItem('loadedProject');
    if (loadedProjectData) {
      try {
        const project = JSON.parse(loadedProjectData);

        // Recreate upload result from saved project
        const result: BOMUploadResult = {
          fileName: project.bomData.fileName,
          totalRows: project.bomData.totalRows,
          rows: project.bomData.rows,
          parseErrors: [],
        };

        setUploadResult(result);
        setBomRows(project.bomData.rows);

        toast({
          title: 'Proiect încărcat',
          description: `Proiectul "${project.name}" a fost încărcat cu succes.`,
        });

        // Clear session storage
        sessionStorage.removeItem('loadedProject');
      } catch (error) {
        console.error('Failed to load project:', error);
      }
    }
  }, [toast]);

  const handleFileSelected = async (file: File) => {
    setIsProcessing(true);

    try {
      // Parse BOM file
      const result = await parseBOM(file, allProducts);

      setUploadResult(result);
      setBomRows(result.rows);

      // Track BOM upload
      const matchedRows = result.rows.filter(r => r.matchedProductId).length;
      const unmatchedRows = result.rows.length - matchedRows;

      analytics.trackBOMUpload({
        fileName: result.fileName,
        totalRows: result.totalRows,
        matchedRows,
        unmatchedRows,
        parseErrors: result.parseErrors?.length || 0,
      });

      if (result.parseErrors && result.parseErrors.length > 0) {
        toast({
          title: 'Avertisment la parsare',
          description: `Fișierul a fost procesat, dar au apărut ${result.parseErrors.length} erori.`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Fișier procesat cu succes',
          description: `${result.totalRows} rânduri au fost procesate din fișierul BOM.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Eroare',
        description:
          error instanceof Error ? error.message : 'Nu s-a putut procesa fișierul BOM.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTemplate = () => {
    downloadBOMTemplate();
    toast({
      title: 'Șablon descărcat',
      description: 'Fișierul șablon BOM a fost descărcat cu succes.',
    });
  };

  const handleRowEdit = (rowIndex: number) => {
    const row = bomRows.find((r) => r.rowIndex === rowIndex);
    if (row) {
      setEditingRow(row);
    }
  };

  const handleRowDelete = (rowIndex: number) => {
    setBomRows((prev) => prev.filter((r) => r.rowIndex !== rowIndex));
    toast({
      title: 'Rând șters',
      description: `Rândul #${rowIndex} a fost șters din lista BOM.`,
    });
  };

  const handleManualMapConfirm = (row: BOMRow, productId: string) => {
    const product = allProducts.find((p) => p.id === productId);
    if (!product) return;

    // Update the row with manual mapping
    setBomRows((prev) =>
      prev.map((r) =>
        r.rowIndex === row.rowIndex
          ? {
              ...r,
              matchedProductId: productId,
              matchConfidence: 'high',
              matchReason: `Mapare manuală: ${product.title}`,
              isManuallyMapped: true,
            }
          : r
      )
    );

    setEditingRow(null);

    toast({
      title: 'Mapare confirmată',
      description: `Rândul #${row.rowIndex} a fost mapat la ${product.title}.`,
    });
  };

  const handleAddToCart = async (selectedRows: BOMRow[]) => {
    let addedCount = 0;

    for (const row of selectedRows) {
      const product = allProducts.find((p) => p.id === row.matchedProductId);
      if (!product) continue;

      try {
        // Convert BOM unit to Cart unit
        let cartUnit = row.unit || product.baseUnit;
        if (cartUnit === 'buc') cartUnit = 'pcs';

        await addToCart(
          {
            productId: product.id,
            quantity: row.qty,
            unit: cartUnit as 'kg' | 'm' | 'pcs',
            specs: {
              lengthM: row.length_m,
              finish: row.finish,
            },
          },
          product
        );

        addedCount++;
      } catch (error) {
        console.error(`Failed to add row ${row.rowIndex} to cart:`, error);
      }
    }

    if (addedCount > 0) {
      toast({
        title: 'Produse adăugate în coș',
        description: `${addedCount} ${addedCount === 1 ? 'produs a fost adăugat' : 'produse au fost adăugate'} în coș.`,
      });

      // Clear the BOM after successful addition
      setBomRows([]);
      setUploadResult(null);

      // Navigate to cart
      setTimeout(() => {
        navigate('/cart');
      }, 1000);
    } else {
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut adăuga produsele în coș.',
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    // Reset all BOM-related state to ensure clean reset
    setBomRows([]);
    setUploadResult(null);
    setEditingRow(null);
    setIsProcessing(false);
    // Increment resetKey to force remount of upload form
    setResetKey((prev) => prev + 1);
  };

  const handleSaveProject = async () => {
    if (!isAuthenticated || !user) {
      promptSignup?.('bom_save');
      toast({
        title: 'Autentificare necesară',
        description: 'Trebuie să fii autentificat pentru a salva proiecte BOM.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (!uploadResult || bomRows.length === 0) {
      toast({
        title: 'Nu există date de salvat',
        description: 'Încarcă mai întâi un fișier BOM.',
        variant: 'destructive',
      });
      return;
    }

    // Prompt for project name
    const projectName = prompt('Introdu un nume pentru acest proiect BOM:');
    if (!projectName) return;

    const projectDescription = prompt('Descriere opțională (poți lăsa gol):');

    try {
      await projectsApi.createProject(user.id, {
        name: projectName,
        description: projectDescription || undefined,
        fileName: uploadResult.fileName,
        rows: bomRows,
      });

      toast({
        title: 'Proiect salvat',
        description: `Proiectul "${projectName}" a fost salvat cu succes.`,
      });
    } catch (error) {
      toast({
        title: 'Eroare',
        description: error instanceof Error ? error.message : 'Nu s-a putut salva proiectul',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/catalog')}
              className="gap-2 -ml-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Înapoi la Catalog
            </Button>

            <div className="flex items-center gap-3 mb-2">
              <Upload className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Încărcare BOM</h1>
            </div>
            <p className="text-muted-foreground">
              Încărcați fișierul Bill of Materials (BOM) pentru a adăuga produse în coș rapid
            </p>
          </div>

          {/* Instructions */}
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Cum funcționează?</AlertTitle>
            <AlertDescription>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Descărcați șablonul BOM și completați-l cu produsele necesare</li>
                <li>Încărcați fișierul completat (CSV sau Excel)</li>
                <li>
                  Sistemul va încerca să potrivească automat fiecare rând cu produsele din catalog
                </li>
                <li>Mapați manual rândurile care nu au fost potrivite automat</li>
                <li>Adăugați produsele mapate în coș cu un singur clic</li>
              </ol>
            </AlertDescription>
          </Alert>

          {/* Main Content */}
          {!uploadResult ? (
            <div key={resetKey} className="space-y-6">
              {/* Template Download Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Pas 1: Descărcați Șablonul BOM</CardTitle>
                  <CardDescription>
                    Începeți prin a descărca șablonul nostru standard pentru a vă asigura că
                    fișierul dvs. are formatul corect
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleDownloadTemplate} className="gap-2">
                    <Download className="h-4 w-4" />
                    Descarcă Șablon CSV
                  </Button>
                </CardContent>
              </Card>

              {/* Upload Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Pas 2: Încărcați Fișierul BOM</CardTitle>
                  <CardDescription>
                    Trageți fișierul completat aici sau faceți clic pentru a selecta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UploadDropzone
                    onFileSelected={handleFileSelected}
                    acceptedTypes={['.csv', '.xlsx', '.xls']}
                    maxSizeMB={10}
                    disabled={isProcessing}
                  />
                </CardContent>
              </Card>

              {isProcessing && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground mt-4">Se procesează fișierul BOM...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Rezultate Procesare BOM</h2>
                  <p className="text-muted-foreground">
                    Fișier: {uploadResult.fileName} • {uploadResult.totalRows} rânduri
                  </p>
                </div>
                <Button variant="outline" onClick={handleReset}>
                  Încarcă Alt Fișier
                </Button>
              </div>

              {/* Parse Errors */}
              {uploadResult.parseErrors && uploadResult.parseErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertTitle>Erori de Parsare</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      {uploadResult.parseErrors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* BOM Mapper */}
              {bomRows.length > 0 && (
                <BOMMapper
                  rows={bomRows}
                  products={allProducts}
                  onRowEdit={handleRowEdit}
                  onRowDelete={handleRowDelete}
                  onAddToCart={handleAddToCart}
                  onSaveProject={handleSaveProject}
                />
              )}

              {/* No Rows */}
              {bomRows.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">
                      Nu există rânduri valide în fișierul BOM. Verificați formatul și încercați
                      din nou.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Manual Mapper Dialog */}
      <UnmatchedRowMapper
        row={editingRow}
        products={allProducts}
        categories={categories}
        onConfirm={handleManualMapConfirm}
        onCancel={() => setEditingRow(null)}
      />
    </div>
  );
};

export default BOMUpload;
