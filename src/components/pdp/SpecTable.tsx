import { FileDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

interface SpecTableProps {
  product: Product;
}

export default function SpecTable({ product }: SpecTableProps) {
  const { t } = useTranslation();

  const handleDownloadDatasheet = () => {
    // In production, this would trigger actual PDF download
    console.log("Downloading datasheet for", product.sku);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('product.technical_specifications')}</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadDatasheet}
            className="gap-2"
          >
            <FileDown className="h-4 w-4" />
            {t('product.download_technical_sheet')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Dimensions */}
          {product.dimensions && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {t('product.dimensions_section')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.dimensions.height && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm">{t('product.height')}</span>
                    <span className="text-sm font-medium">{product.dimensions.height} mm</span>
                  </div>
                )}
                {product.dimensions.width && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm">{t('product.width')}</span>
                    <span className="text-sm font-medium">{product.dimensions.width} mm</span>
                  </div>
                )}
                {product.dimensions.thickness && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm">{t('product.thickness')}</span>
                    <span className="text-sm font-medium">{product.dimensions.thickness} mm</span>
                  </div>
                )}
                {product.dimensions.diameter && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm">{t('product.diameter')}</span>
                    <span className="text-sm font-medium">{product.dimensions.diameter} mm</span>
                  </div>
                )}
                {product.dimensions.length && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm">{t('product.length')} {t('product.standard_length')}</span>
                    <span className="text-sm font-medium">{product.dimensions.length} m</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Material & Grade */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              {t('product.material_grade_section')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm">{t('product.steel_grade')}</span>
                <span className="text-sm font-medium">{product.grade}</span>
              </div>
              {product.producer && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm">{t('product.producer')}</span>
                  <span className="text-sm font-medium">{product.producer}</span>
                </div>
              )}
            </div>
          </div>

          {/* Chemical Composition (if available) */}
          {product.grade && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {t('product.chemical_composition')}
              </h3>
              <div className="text-sm text-muted-foreground">
                {product.grade === "S235JR" && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex justify-between py-2 border-b">
                      <span>C</span>
                      <span className="font-medium">≤ 0.17</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>Mn</span>
                      <span className="font-medium">≤ 1.40</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>P</span>
                      <span className="font-medium">≤ 0.035</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>S</span>
                      <span className="font-medium">≤ 0.035</span>
                    </div>
                  </div>
                )}
                {product.grade === "S355JR" && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex justify-between py-2 border-b">
                      <span>C</span>
                      <span className="font-medium">≤ 0.24</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>Mn</span>
                      <span className="font-medium">≤ 1.60</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>P</span>
                      <span className="font-medium">≤ 0.035</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>S</span>
                      <span className="font-medium">≤ 0.035</span>
                    </div>
                  </div>
                )}
                {!["S235JR", "S355JR"].includes(product.grade) && (
                  <p className="text-sm py-2">
                    {t('product.chemical_composition_details')}{" "}
                    <button className="text-primary hover:underline inline-flex items-center gap-1">
                      {t('product.see_details')}
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Mechanical Properties */}
          {product.grade && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {t('product.mechanical_properties')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.grade === "S235JR" && (
                  <>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-sm">{t('product.yield_strength')}</span>
                      <span className="text-sm font-medium">235 MPa</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-sm">{t('product.tensile_strength')}</span>
                      <span className="text-sm font-medium">360-510 MPa</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-sm">{t('product.elongation')}</span>
                      <span className="text-sm font-medium">≥ 26%</span>
                    </div>
                  </>
                )}
                {product.grade === "S355JR" && (
                  <>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-sm">{t('product.yield_strength')}</span>
                      <span className="text-sm font-medium">355 MPa</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-sm">{t('product.tensile_strength')}</span>
                      <span className="text-sm font-medium">470-630 MPa</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-sm">{t('product.elongation')}</span>
                      <span className="text-sm font-medium">≥ 22%</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Standards Compliance */}
          {product.standards && product.standards.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {t('product.standards_compliance')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.standards.map((standard, index) => (
                  <div
                    key={index}
                    className="px-3 py-1.5 bg-muted rounded-md text-sm font-medium"
                  >
                    {standard}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tolerances */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              {t('product.tolerances')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm">{t('product.length_tolerance')}</span>
                <span className="text-sm font-medium">±5 mm</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm">{t('product.dimension_tolerance')}</span>
                <span className="text-sm font-medium">{t('product.according_to_standard')} EN 10034</span>
              </div>
            </div>
          </div>

          {/* Surface Finish Options */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              {t('product.surface_finish_options')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 py-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm">{t('product.standard_hot_rolled')}</span>
              </div>
              <div className="flex items-center gap-2 py-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm">{t('product.finish_galvanized')}</span>
              </div>
              <div className="flex items-center gap-2 py-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm">{t('product.finish_painted')}</span>
              </div>
              <div className="flex items-center gap-2 py-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm">{t('product.polished_on_request')}</span>
              </div>
            </div>
          </div>

          {/* Additional Documentation */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              {t('product.additional_documentation')}
            </h3>
            <div className="space-y-2">
              <button className="flex items-center gap-2 text-sm text-primary hover:underline">
                <FileDown className="h-4 w-4" />
                {t('product.certificate_of_conformity')}
              </button>
              <button className="flex items-center gap-2 text-sm text-primary hover:underline">
                <FileDown className="h-4 w-4" />
                {t('product.theoretical_weights_table')}
              </button>
              <button className="flex items-center gap-2 text-sm text-primary hover:underline">
                <ExternalLink className="h-4 w-4" />
                {t('product.usage_guide')}
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
