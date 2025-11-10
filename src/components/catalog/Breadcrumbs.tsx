import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import type { ProductFamily } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

interface BreadcrumbsProps {
  family?: ProductFamily;
  productTitle?: string;
}

// Translation key mappings for categories
const familyTranslationKeys: Record<ProductFamily, string> = {
  profiles: "home.category_profiles_title",
  plates: "home.category_plates_title",
  pipes: "home.category_pipes_title",
  fasteners: "home.category_fasteners_title",
  stainless: "home.category_stainless_title",
  nonferrous: "home.category_nonferrous_title",
};

export default function Breadcrumbs({ family, productTitle }: BreadcrumbsProps) {
  const { t } = useTranslation();
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>{t('breadcrumb.home')}</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        {!family && !productTitle && (
          <BreadcrumbItem>
            <BreadcrumbPage>{t('breadcrumb.catalog')}</BreadcrumbPage>
          </BreadcrumbItem>
        )}

        {family && !productTitle && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/catalog">{t('breadcrumb.catalog')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t(familyTranslationKeys[family])}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}

        {family && productTitle && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/catalog">{t('breadcrumb.catalog')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/catalog?family=${family}`}>{t(familyTranslationKeys[family])}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[200px] truncate">{productTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
