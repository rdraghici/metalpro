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

interface BreadcrumbsProps {
  family?: ProductFamily;
  productTitle?: string;
}

const familyLabels: Record<ProductFamily, string> = {
  profiles: "Profile Metalice",
  plates: "Table de Oțel",
  pipes: "Țevi și Tuburi",
  fasteners: "Elemente de Asamblare",
  stainless: "Oțel Inoxidabil",
  nonferrous: "Metale Neferoase",
};

export default function Breadcrumbs({ family, productTitle }: BreadcrumbsProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Acasă</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        {!family && !productTitle && (
          <BreadcrumbItem>
            <BreadcrumbPage>Catalog</BreadcrumbPage>
          </BreadcrumbItem>
        )}

        {family && !productTitle && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/catalog">Catalog</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{familyLabels[family]}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}

        {family && productTitle && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/catalog">Catalog</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/catalog?family=${family}`}>{familyLabels[family]}</Link>
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
