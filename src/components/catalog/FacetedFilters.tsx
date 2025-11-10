import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { ProductFilters, ProductFamily, Availability } from '@/types/product';
import type { FilterOptions } from '@/lib/utils/filterUtils';
import { getActiveFilterCount } from '@/lib/utils/filterUtils';
import { useTranslation } from '@/hooks/useTranslation';

interface FacetedFiltersProps {
  filters: ProductFilters;
  filterOptions: FilterOptions;
  onFiltersChange: (filters: ProductFilters) => void;
  resultCount: number;
}

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({ title, isOpen, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-b pb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 text-sm font-medium hover:text-primary transition-colors"
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      {isOpen && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

export default function FacetedFilters({
  filters,
  filterOptions,
  onFiltersChange,
  resultCount
}: FacetedFiltersProps) {
  const { t } = useTranslation();

  // Track which filter sections are open
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(['family', 'grade', 'availability'])
  );

  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  // Filter update handlers
  const toggleArrayFilter = (
    key: keyof ProductFilters,
    value: string
  ) => {
    const currentValues = (filters[key] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    onFiltersChange({
      ...filters,
      [key]: newValues.length > 0 ? newValues : undefined
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const activeFilterCount = getActiveFilterCount(filters);

  return (
    <div className="w-full space-y-4">
      {/* Header with results count and clear button */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{t('catalog.filters')}</h3>
          <p className="text-sm text-muted-foreground">
            {t(resultCount === 1 ? 'catalog.results_count' : 'catalog.results_count_plural', { count: resultCount })}
          </p>
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            {t('catalog.clear_filters')} ({activeFilterCount})
          </Button>
        )}
      </div>

      <Separator />

      {/* Filter Sections */}
      <div className="space-y-4">
        {/* Product Family */}
        {filterOptions.families.length > 0 && (
          <FilterSection
            title={t('catalog.category')}
            isOpen={openSections.has('family')}
            onToggle={() => toggleSection('family')}
          >
            <div className="space-y-2">
              {filterOptions.families.map(option => (
                <div key={option.value} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`family-${option.value}`}
                      checked={filters.family?.includes(option.value as ProductFamily) || false}
                      onCheckedChange={() => toggleArrayFilter('family', option.value)}
                    />
                    <Label
                      htmlFor={`family-${option.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {option.count}
                  </Badge>
                </div>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Grade */}
        {filterOptions.grades.length > 0 && (
          <FilterSection
            title={t('catalog.material_grade')}
            isOpen={openSections.has('grade')}
            onToggle={() => toggleSection('grade')}
          >
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filterOptions.grades.map(option => (
                <div key={option.value} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`grade-${option.value}`}
                      checked={filters.grade?.includes(option.value) || false}
                      onCheckedChange={() => toggleArrayFilter('grade', option.value)}
                    />
                    <Label
                      htmlFor={`grade-${option.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {option.count}
                  </Badge>
                </div>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Standards */}
        {filterOptions.standards.length > 0 && (
          <FilterSection
            title={t('catalog.standard')}
            isOpen={openSections.has('standard')}
            onToggle={() => toggleSection('standard')}
          >
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filterOptions.standards.map(option => (
                <div key={option.value} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`standard-${option.value}`}
                      checked={filters.standard?.includes(option.value) || false}
                      onCheckedChange={() => toggleArrayFilter('standard', option.value)}
                    />
                    <Label
                      htmlFor={`standard-${option.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {option.count}
                  </Badge>
                </div>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Availability */}
        {filterOptions.availabilities.length > 0 && (
          <FilterSection
            title={t('catalog.availability')}
            isOpen={openSections.has('availability')}
            onToggle={() => toggleSection('availability')}
          >
            <div className="space-y-2">
              {filterOptions.availabilities.map(option => (
                <div key={option.value} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`availability-${option.value}`}
                      checked={filters.availability?.includes(option.value as Availability) || false}
                      onCheckedChange={() => toggleArrayFilter('availability', option.value)}
                    />
                    <Label
                      htmlFor={`availability-${option.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {option.count}
                  </Badge>
                </div>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Producer */}
        {filterOptions.producers.length > 0 && (
          <FilterSection
            title={t('catalog.producer')}
            isOpen={openSections.has('producer')}
            onToggle={() => toggleSection('producer')}
          >
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filterOptions.producers.map(option => (
                <div key={option.value} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`producer-${option.value}`}
                      checked={filters.producer?.includes(option.value) || false}
                      onCheckedChange={() => toggleArrayFilter('producer', option.value)}
                    />
                    <Label
                      htmlFor={`producer-${option.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {option.count}
                  </Badge>
                </div>
              ))}
            </div>
          </FilterSection>
        )}

      </div>
    </div>
  );
}
