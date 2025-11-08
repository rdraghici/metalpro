import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Package, ShoppingCart, CheckCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/catalog/Breadcrumbs";
import SpecTable from "@/components/pdp/SpecTable";
import ConfigurationPanel from "@/components/pdp/ConfigurationPanel";
import CutListEditor from "@/components/pdp/CutListEditor";
import WeightEstimator from "@/components/pdp/WeightEstimator";
import PriceEstimator from "@/components/pdp/PriceEstimator";
import DeliveryCue from "@/components/pdp/DeliveryCue";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProductConfig } from "@/hooks/useProductConfig";
import { getProductBySlug } from "@/lib/api/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/types";
import type { AddToCartPayload } from "@/types/cart";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    config,
    weightEstimate,
    priceEstimate,
    wastePercentage,
    isValid,
    setSellingUnit,
    setLengthOption,
    setCustomLength,
    setQuantity,
    setFinish,
    toggleCutToLength,
    addCutListItem,
    updateCutListItem,
    removeCutListItem,
    clearCutList,
  } = useProductConfig(product);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;

      setIsLoading(true);
      try {
        const fetchedProduct = await getProductBySlug(slug);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToEstimate = async () => {
    if (!isValid || !product) return;

    try {
      // Build the cart payload from current configuration
      const payload: AddToCartPayload = {
        productId: product.id,
        quantity: config.quantity,
        unit: config.sellingUnit,
        specs: {
          grade: product.grade,
          standard: product.standards[0], // First standard
          dimensionSummary: product.title,
          lengthM: config.lengthOption === 'custom' ? config.customLength :
                   config.lengthOption === '12m' ? 12 : 6,
          finish: config.finish,
          cutList: config.cutToLength ? config.cutList : undefined,
        },
      };

      // Add to cart
      await addToCart(payload, product);

      // Show success toast
      toast({
        title: "Produs adăugat în coș",
        description: (
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-semibold">{product.title}</p>
              <p className="text-sm text-muted-foreground">
                {config.quantity} {config.sellingUnit} • ~{weightEstimate.totalWeight.toFixed(2)} kg
              </p>
            </div>
          </div>
        ),
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut adăuga produsul în coș. Vă rugăm încercați din nou.",
        variant: "destructive",
      });
    }
  };

  const getAvailabilityBadge = () => {
    if (!product) return null;

    const variants = {
      in_stock: { label: "În Stoc", className: "bg-green-500" },
      on_order: { label: "La Comandă", className: "bg-orange-500" },
      backorder: { label: "Indisponibil", className: "bg-gray-500" },
    };

    const variant = variants[product.availability];

    return (
      <Badge className={`${variant.className} text-white`}>
        {variant.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Se încarcă produsul...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Produs negăsit</h1>
            <p className="text-muted-foreground mb-6">
              Produsul pe care îl căutați nu există sau a fost șters.
            </p>
            <Button asChild>
              <Link to="/catalog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Înapoi la catalog
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumbs */}
        <section className="py-4 border-b">
          <div className="container mx-auto px-4">
            <Breadcrumbs family={product.family} productTitle={product.title} />
          </div>
        </section>

        {/* Product Header */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image / Icon */}
              <div className="flex items-center justify-center bg-muted rounded-lg p-12 min-h-[400px]">
                <Package className="h-32 w-32 text-muted-foreground" />
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>SKU: <span className="font-mono">{product.sku}</span></span>
                      {product.producer && (
                        <>
                          <span>•</span>
                          <span>Producător: {product.producer}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {getAvailabilityBadge()}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Grad: {product.grade}</Badge>
                  {product.standards.slice(0, 2).map((standard, index) => (
                    <Badge key={index} variant="outline">
                      {standard}
                    </Badge>
                  ))}
                </div>

                <div className="pt-4">
                  <div className="text-sm text-muted-foreground mb-1">Preț indicativ</div>
                  <div className="flex items-baseline gap-2">
                    {product.indicativePrice.min && (
                      <span className="text-3xl font-bold">
                        de la {product.indicativePrice.min.toFixed(2)}
                      </span>
                    )}
                    <span className="text-lg text-muted-foreground">
                      RON/{product.priceUnit}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <DeliveryCue product={product} totalWeight={weightEstimate.totalWeight} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Configuration & Estimators */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Configuration Panel */}
              <div className="lg:col-span-2 space-y-6">
                <ConfigurationPanel
                  config={config}
                  onSellingUnitChange={setSellingUnit}
                  onLengthOptionChange={setLengthOption}
                  onCustomLengthChange={setCustomLength}
                  onQuantityChange={setQuantity}
                  onFinishChange={setFinish}
                  onCutToLengthToggle={toggleCutToLength}
                />

                {config.cutToLength && (
                  <CutListEditor
                    cutList={config.cutList}
                    onAddItem={addCutListItem}
                    onUpdateItem={updateCutListItem}
                    onRemoveItem={removeCutListItem}
                    onClearList={clearCutList}
                    wastePercentage={wastePercentage}
                  />
                )}

                {/* Spec Table */}
                <SpecTable product={product} />
              </div>

              {/* Estimators Sidebar */}
              <div className="space-y-6">
                <WeightEstimator weightEstimate={weightEstimate} />

                <PriceEstimator priceEstimate={priceEstimate} priceUnit={product.priceUnit} />

                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleAddToEstimate}
                  disabled={!isValid}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Adaugă la Estimare
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  asChild
                >
                  <Link to="/catalog">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Înapoi la catalog
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products (Placeholder) */}
        <section className="py-12 bg-muted/30 border-t">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Produse similare</h2>
            <div className="text-center py-12 text-muted-foreground">
              <p>Secțiunea pentru produse similare va fi implementată în curând</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
