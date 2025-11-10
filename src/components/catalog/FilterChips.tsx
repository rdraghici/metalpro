import { useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterChipsProps {
  onRemoveFilter?: (filterType: string, value: string) => void;
  onClearAll?: () => void;
}

/**
 * Get Romanian label for dimension filter (without units)
 */
function getDimensionName(dimension: string): string {
  const labels: Record<string, string> = {
    height: 'Înălțime',
    width: 'Lățime',
    webThickness: 'Grosime inimă',
    flangeThickness: 'Grosime talpă',
    weightPerM: 'Greutate pe metru',
    thickness: 'Grosime',
    widthMm: 'Lățime',
    lengthMm: 'Lungime',
    weightPerM2: 'Greutate pe metru pătrat',
  };

  // Convert to camelCase for lookup (handle various formats)
  const key = dimension.toLowerCase();
  const camelKey = dimension.charAt(0).toLowerCase() + dimension.slice(1);

  return labels[camelKey] || labels[key] || dimension;
}

/**
 * Get the unit for dimension filter
 */
function getDimensionUnit(dimension: string): string {
  const key = dimension.toLowerCase();
  const camelKey = dimension.charAt(0).toLowerCase() + dimension.slice(1);

  if (camelKey === 'weightPerM') return 'kg/m';
  if (camelKey === 'weightPerM2') return 'kg/m²';
  return 'mm';
}

export default function FilterChips({ onRemoveFilter, onClearAll }: FilterChipsProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse active filters from URL
  const activeFilters: Array<{ type: string; value: string; label: string }> = [];

  const family = searchParams.get("family");
  if (family) {
    family.split(",").forEach((value) => {
      activeFilters.push({
        type: "family",
        value,
        label: `Categorie: ${getFamilyLabel(value)}`,
      });
    });
  }

  const grade = searchParams.get("grade");
  if (grade) {
    grade.split(",").forEach((value) => {
      activeFilters.push({
        type: "grade",
        value,
        label: `Grad: ${value}`,
      });
    });
  }

  const standard = searchParams.get("standard");
  if (standard) {
    standard.split(",").forEach((value) => {
      activeFilters.push({
        type: "standard",
        value,
        label: `Standard: ${value}`,
      });
    });
  }

  const availability = searchParams.get("availability");
  if (availability) {
    availability.split(",").forEach((value) => {
      activeFilters.push({
        type: "availability",
        value,
        label: `Disponibilitate: ${getAvailabilityLabel(value)}`,
      });
    });
  }

  const search = searchParams.get("search");
  if (search) {
    activeFilters.push({
      type: "search",
      value: search,
      label: `Căutare: "${search}"`,
    });
  }

  const producer = searchParams.get("producer");
  if (producer) {
    producer.split(",").forEach((value) => {
      activeFilters.push({
        type: "producer",
        value,
        label: `Producător: ${value}`,
      });
    });
  }

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice || maxPrice) {
    const priceLabel = minPrice && maxPrice
      ? `Preț: ${minPrice}-${maxPrice} RON`
      : minPrice
      ? `Preț: min ${minPrice} RON`
      : `Preț: max ${maxPrice} RON`;
    activeFilters.push({
      type: "price",
      value: "range",
      label: priceLabel,
    });
  }

  // Dimension filters
  searchParams.forEach((value, key) => {
    if (key.startsWith("minDim_") || key.startsWith("maxDim_")) {
      const dimKey = key.replace("minDim_", "").replace("maxDim_", "");
      const hasMin = searchParams.has(`minDim_${dimKey}`);
      const hasMax = searchParams.has(`maxDim_${dimKey}`);

      if (!activeFilters.some(f => f.type === `dimension-${dimKey}`)) {
        const minVal = searchParams.get(`minDim_${dimKey}`);
        const maxVal = searchParams.get(`maxDim_${dimKey}`);
        const dimName = getDimensionName(dimKey);
        const unit = getDimensionUnit(dimKey);

        const dimLabel = hasMin && hasMax
          ? `${dimName}: ${minVal}-${maxVal}${unit}`
          : hasMin
          ? `${dimName}: min ${minVal}${unit}`
          : `${dimName}: max ${maxVal}${unit}`;

        activeFilters.push({
          type: `dimension-${dimKey}`,
          value: dimKey,
          label: dimLabel,
        });
      }
    }
  });

  const removeFilter = (filterType: string, filterValue: string) => {
    const params = new URLSearchParams(searchParams);

    if (filterType === "search") {
      params.delete("search");
    } else if (filterType === "price") {
      params.delete("minPrice");
      params.delete("maxPrice");
    } else if (filterType.startsWith("dimension-")) {
      const dimKey = filterValue;
      params.delete(`minDim_${dimKey}`);
      params.delete(`maxDim_${dimKey}`);
    } else {
      const currentValues = params.get(filterType);
      if (currentValues) {
        const values = currentValues.split(",").filter((v) => v !== filterValue);
        if (values.length > 0) {
          params.set(filterType, values.join(","));
        } else {
          params.delete(filterType);
        }
      }
    }

    // Reset to page 1 when filters change
    params.set("page", "1");

    setSearchParams(params);
    onRemoveFilter?.(filterType, filterValue);
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("family");
    params.delete("grade");
    params.delete("standard");
    params.delete("availability");
    params.delete("producer");
    params.delete("search");
    params.delete("minPrice");
    params.delete("maxPrice");

    // Remove all dimension filters
    Array.from(searchParams.keys()).forEach((key) => {
      if (key.startsWith("minDim_") || key.startsWith("maxDim_")) {
        params.delete(key);
      }
    });

    params.set("page", "1");
    setSearchParams(params);
    onClearAll?.();
  };

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Filtre active:</span>
      {activeFilters.map((filter, index) => (
        <Badge
          key={`${filter.type}-${filter.value}-${index}`}
          variant="secondary"
          className="gap-1 pr-1"
        >
          {filter.label}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => removeFilter(filter.type, filter.value)}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Șterge filtru {filter.label}</span>
          </Button>
        </Badge>
      ))}
      {activeFilters.length > 1 && (
        <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 px-2 text-xs">
          Șterge toate
        </Button>
      )}
    </div>
  );
}

// Helper functions
function getFamilyLabel(family: string): string {
  const labels: Record<string, string> = {
    profiles: "Profile Metalice",
    plates: "Table de Oțel",
    pipes: "Țevi și Tuburi",
    fasteners: "Elemente de Asamblare",
    stainless: "Oțel Inoxidabil",
    nonferrous: "Metale Neferoase",
  };
  return labels[family] || family;
}

function getAvailabilityLabel(availability: string): string {
  const labels: Record<string, string> = {
    in_stock: "În Stoc",
    on_order: "La Comandă",
    backorder: "Indisponibil",
  };
  return labels[availability] || availability;
}
