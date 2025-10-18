import { useSearchParams } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";

export interface FilterOptions {
  families: string[];
  grades: string[];
  standards: string[];
  availabilities: Array<{
    value: "in_stock" | "on_order" | "backorder";
    label: string;
  }>;
}

interface FilterPanelProps {
  options: FilterOptions;
  onFiltersChange?: (filters: Record<string, string[]>) => void;
}

const availabilityOptions = [
  { value: "in_stock" as const, label: "În Stoc" },
  { value: "on_order" as const, label: "La Comandă" },
  { value: "backorder" as const, label: "Indisponibil" },
];

export default function FilterPanel({ options, onFiltersChange }: FilterPanelProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  // Parse active filters from URL on mount and when search params change
  useEffect(() => {
    const filters: Record<string, string[]> = {};

    const family = searchParams.get("family");
    if (family) filters.family = family.split(",");

    const grade = searchParams.get("grade");
    if (grade) filters.grade = grade.split(",");

    const standard = searchParams.get("standard");
    if (standard) filters.standard = standard.split(",");

    const availability = searchParams.get("availability");
    if (availability) filters.availability = availability.split(",");

    setActiveFilters(filters);
  }, [searchParams]);

  const handleFilterToggle = (filterType: string, value: string) => {
    const newFilters = { ...activeFilters };

    if (!newFilters[filterType]) {
      newFilters[filterType] = [];
    }

    const index = newFilters[filterType].indexOf(value);
    if (index > -1) {
      newFilters[filterType].splice(index, 1);
      if (newFilters[filterType].length === 0) {
        delete newFilters[filterType];
      }
    } else {
      newFilters[filterType].push(value);
    }

    setActiveFilters(newFilters);
    updateURLParams(newFilters);
    onFiltersChange?.(newFilters);
  };

  const updateURLParams = (filters: Record<string, string[]>) => {
    const params = new URLSearchParams(searchParams);

    // Remove old filter params
    params.delete("family");
    params.delete("grade");
    params.delete("standard");
    params.delete("availability");

    // Add new filter params
    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(","));
      }
    });

    // Reset to page 1 when filters change
    params.set("page", "1");

    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    const params = new URLSearchParams(searchParams);
    params.delete("family");
    params.delete("grade");
    params.delete("standard");
    params.delete("availability");
    params.set("page", "1");
    setSearchParams(params);
    onFiltersChange?.({});
  };

  const isFilterActive = (filterType: string, value: string) => {
    return activeFilters[filterType]?.includes(value) || false;
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((sum, arr) => sum + arr.length, 0);
  };

  const activeCount = getActiveFilterCount();

  return (
    <div className="border border-card-border rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold">Filtre</h3>
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeCount}
            </Badge>
          )}
        </div>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-8 px-2 text-xs"
          >
            <X className="w-4 h-4 mr-1" />
            Șterge Tot
          </Button>
        )}
      </div>

      {/* Filter Accordions */}
      <Accordion type="multiple" defaultValue={["family", "grade", "standard", "availability"]} className="w-full">
        {/* Family Filter */}
        {options.families.length > 0 && (
          <AccordionItem value="family">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                Categorie
                {activeFilters.family && activeFilters.family.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {activeFilters.family.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {options.families.map((family) => (
                  <div key={family} className="flex items-center space-x-2">
                    <Checkbox
                      id={`family-${family}`}
                      checked={isFilterActive("family", family)}
                      onCheckedChange={() => handleFilterToggle("family", family)}
                    />
                    <label
                      htmlFor={`family-${family}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {getFamilyLabel(family)}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Grade Filter */}
        {options.grades.length > 0 && (
          <AccordionItem value="grade">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                Grad Material
                {activeFilters.grade && activeFilters.grade.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {activeFilters.grade.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {options.grades.map((grade) => (
                  <div key={grade} className="flex items-center space-x-2">
                    <Checkbox
                      id={`grade-${grade}`}
                      checked={isFilterActive("grade", grade)}
                      onCheckedChange={() => handleFilterToggle("grade", grade)}
                    />
                    <label
                      htmlFor={`grade-${grade}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {grade}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Standard Filter */}
        {options.standards.length > 0 && (
          <AccordionItem value="standard">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                Standard
                {activeFilters.standard && activeFilters.standard.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {activeFilters.standard.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {options.standards.map((standard) => (
                  <div key={standard} className="flex items-center space-x-2">
                    <Checkbox
                      id={`standard-${standard}`}
                      checked={isFilterActive("standard", standard)}
                      onCheckedChange={() => handleFilterToggle("standard", standard)}
                    />
                    <label
                      htmlFor={`standard-${standard}`}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {standard}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Availability Filter */}
        <AccordionItem value="availability">
          <AccordionTrigger className="text-sm font-medium">
            <div className="flex items-center gap-2">
              Disponibilitate
              {activeFilters.availability && activeFilters.availability.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {activeFilters.availability.length}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {availabilityOptions.map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`availability-${value}`}
                    checked={isFilterActive("availability", value)}
                    onCheckedChange={() => handleFilterToggle("availability", value)}
                  />
                  <label
                    htmlFor={`availability-${value}`}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

// Helper function to get user-friendly family labels
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
