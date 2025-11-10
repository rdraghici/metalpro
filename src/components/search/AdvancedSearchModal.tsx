import { useState, useEffect } from 'react';
import { Search, Save, Clock, Trash2, Star, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';
import type { ProductFilters, ProductFamily, Availability } from '@/types/product';

interface AdvancedSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFilters: ProductFilters;
  onApplyFilters: (filters: ProductFilters) => void;
  familyOptions?: string[];
  gradeOptions?: string[];
  standardOptions?: string[];
}

export default function AdvancedSearchModal({
  open,
  onOpenChange,
  currentFilters,
  onApplyFilters,
  familyOptions = [],
  gradeOptions = [],
  standardOptions = [],
}: AdvancedSearchModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    savedSearches,
    recentSearches,
    saveSearch,
    deleteSavedSearch,
    markSearchAsUsed,
    getFilterDescription,
    findSimilarSavedSearch,
  } = useAdvancedSearch();

  const [filters, setFilters] = useState<ProductFilters>(currentFilters);
  const [searchName, setSearchName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  // Update local filters when currentFilters change
  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  // Available product families
  const availableFamilies: { value: ProductFamily; label: string }[] = [
    { value: 'profiles', label: 'Profile' },
    { value: 'plates', label: 'Table' },
    { value: 'pipes', label: 'Țevi' },
    { value: 'fasteners', label: 'Elemente de Fixare' },
    { value: 'stainless', label: 'Inox' },
    { value: 'nonferrous', label: 'Neferoase' },
  ];

  // Available availability statuses
  const availableStatuses: { value: Availability; label: string }[] = [
    { value: 'in_stock', label: 'În Stoc' },
    { value: 'on_order', label: 'La Comandă' },
    { value: 'backorder', label: 'Comandă Viitoare' },
  ];

  const toggleArrayFilter = (key: keyof ProductFilters, value: string) => {
    const currentValues = (filters[key] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    setFilters({
      ...filters,
      [key]: newValues.length > 0 ? newValues : undefined,
    });
  };

  const handleSearchTextChange = (value: string) => {
    setFilters({
      ...filters,
      search: value || undefined,
    });
  };

  const handleApplySearch = () => {
    onApplyFilters(filters);
    onOpenChange(false);
    toast({
      title: 'Filtre aplicate',
      description: getFilterDescription(filters),
    });
  };

  const handleSaveSearch = () => {
    if (!user) {
      toast({
        title: 'Autentificare necesară',
        description: 'Trebuie să fii autentificat pentru a salva căutări.',
        variant: 'destructive',
      });
      return;
    }

    if (!searchName.trim()) {
      toast({
        title: 'Nume lipsă',
        description: 'Te rugăm să introduci un nume pentru căutare.',
        variant: 'destructive',
      });
      return;
    }

    // Check if similar search already exists
    const existing = findSimilarSavedSearch(filters);
    if (existing) {
      toast({
        title: 'Căutare existentă',
        description: `O căutare similară există deja: "${existing.name}"`,
        variant: 'destructive',
      });
      return;
    }

    saveSearch(searchName, filters);
    setSearchName('');
    setShowSaveForm(false);
    toast({
      title: 'Căutare salvată',
      description: `Căutarea "${searchName}" a fost salvată cu succes.`,
    });
  };

  const handleLoadSavedSearch = (searchId: string) => {
    const search = savedSearches.find(s => s.id === searchId);
    if (search) {
      setFilters(search.filters);
      markSearchAsUsed(searchId);
      toast({
        title: 'Căutare încărcată',
        description: `Căutarea "${search.name}" a fost încărcată.`,
      });
    }
  };

  const handleLoadRecentSearch = (recentFilters: ProductFilters) => {
    setFilters(recentFilters);
    toast({
      title: 'Căutare încărcată',
      description: 'Căutarea recentă a fost încărcată.',
    });
  };

  const handleDeleteSavedSearch = (searchId: string, searchName: string) => {
    deleteSavedSearch(searchId);
    toast({
      title: 'Căutare ștearsă',
      description: `Căutarea "${searchName}" a fost ștearsă.`,
    });
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const hasFilters = Object.keys(filters).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Căutare Avansată
          </DialogTitle>
          <DialogDescription>
            Construiește o căutare complexă folosind multiple criterii
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Search Text Input */}
          <div className="space-y-2">
            <Label htmlFor="search-text">Caută în titlu, SKU, descriere</Label>
            <Input
              id="search-text"
              placeholder="Ex: Profile UNP, S235JR, etc."
              value={filters.search || ''}
              onChange={(e) => handleSearchTextChange(e.target.value)}
            />
          </div>

          <Separator />

          {/* Product Family */}
          <div className="space-y-3">
            <Label>Categorie Produse</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableFamilies.map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`family-${value}`}
                    checked={filters.family?.includes(value) || false}
                    onCheckedChange={() => toggleArrayFilter('family', value)}
                  />
                  <Label htmlFor={`family-${value}`} className="font-normal cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Grade */}
          {gradeOptions.length > 0 && (
            <>
              <div className="space-y-3">
                <Label>Grad Material</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-40 overflow-y-auto">
                  {gradeOptions.map((grade) => (
                    <div key={grade} className="flex items-center space-x-2">
                      <Checkbox
                        id={`grade-${grade}`}
                        checked={filters.grade?.includes(grade) || false}
                        onCheckedChange={() => toggleArrayFilter('grade', grade)}
                      />
                      <Label htmlFor={`grade-${grade}`} className="font-normal cursor-pointer">
                        {grade}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Standard */}
          {standardOptions.length > 0 && (
            <>
              <div className="space-y-3">
                <Label>Standard</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-40 overflow-y-auto">
                  {standardOptions.map((standard) => (
                    <div key={standard} className="flex items-center space-x-2">
                      <Checkbox
                        id={`standard-${standard}`}
                        checked={filters.standard?.includes(standard) || false}
                        onCheckedChange={() => toggleArrayFilter('standard', standard)}
                      />
                      <Label htmlFor={`standard-${standard}`} className="font-normal cursor-pointer">
                        {standard}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Availability */}
          <div className="space-y-3">
            <Label>Disponibilitate</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableStatuses.map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`availability-${value}`}
                    checked={filters.availability?.includes(value) || false}
                    onCheckedChange={() => toggleArrayFilter('availability', value)}
                  />
                  <Label htmlFor={`availability-${value}`} className="font-normal cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Searches (for logged-in users) */}
          {user && savedSearches.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <Label>Căutări Salvate</Label>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {savedSearches.map((search) => (
                    <div
                      key={search.id}
                      className="flex items-center justify-between p-2 border rounded hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <button
                          onClick={() => handleLoadSavedSearch(search.id)}
                          className="text-left"
                        >
                          <div className="font-medium">{search.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {getFilterDescription(search.filters)}
                          </div>
                        </button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSavedSearch(search.id, search.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Label>Căutări Recente</Label>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {recentSearches.slice(0, 5).map((recentFilters, index) => (
                    <button
                      key={index}
                      onClick={() => handleLoadRecentSearch(recentFilters)}
                      className="w-full text-left p-2 border rounded hover:bg-muted/50 transition-colors"
                    >
                      <div className="text-sm text-muted-foreground">
                        {getFilterDescription(recentFilters)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Current Filter Summary */}
          {hasFilters && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label>Filtre Curente</Label>
                <div className="p-3 bg-muted rounded-md text-sm">
                  {getFilterDescription(filters)}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <div className="flex-1 flex gap-2">
            {hasFilters && (
              <Button variant="outline" onClick={handleClearFilters} className="gap-2">
                <X className="h-4 w-4" />
                Șterge Tot
              </Button>
            )}

            {user && hasFilters && !showSaveForm && (
              <Button variant="outline" onClick={() => setShowSaveForm(true)} className="gap-2">
                <Save className="h-4 w-4" />
                Salvează
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Anulează
            </Button>
            <Button onClick={handleApplySearch} disabled={!hasFilters}>
              <Search className="h-4 w-4 mr-2" />
              Aplică Căutarea
            </Button>
          </div>
        </div>

        {/* Save Search Form */}
        {showSaveForm && (
          <div className="pt-4 border-t space-y-3">
            <Label htmlFor="search-name">Nume Căutare</Label>
            <div className="flex gap-2">
              <Input
                id="search-name"
                placeholder="Ex: Profile S235JR în stoc"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveSearch();
                  }
                }}
              />
              <Button onClick={handleSaveSearch}>Salvează</Button>
              <Button variant="outline" onClick={() => {
                setShowSaveForm(false);
                setSearchName('');
              }}>
                Anulează
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
