import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import * as addressesApi from '@/lib/api/addresses';
import type { SavedAddress, AddressType } from '@/types/user';

const AddressesTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);

  // Form fields
  const [type, setType] = useState<AddressType>('delivery');
  const [label, setLabel] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load addresses
  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await addressesApi.getUserAddresses(user.id);
      setAddresses(data);
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca adresele',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (addr?: SavedAddress) => {
    if (addr) {
      // Edit mode
      setEditingAddress(addr);
      setType(addr.type);
      setLabel(addr.label);
      setContactPerson(addr.contactPerson);
      setPhone(addr.phone);
      setEmail(addr.email || '');
      setAddress(addr.address);
      setCity(addr.city);
      setCounty(addr.county);
      setPostalCode(addr.postalCode || '');
      setIsDefault(addr.isDefault);
    } else {
      // Add mode
      setEditingAddress(null);
      setType('delivery');
      setLabel('');
      setContactPerson(user?.name || '');
      setPhone(user?.phone || '');
      setEmail('');
      setAddress('');
      setCity('');
      setCounty('');
      setPostalCode('');
      setIsDefault(false);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAddress(null);
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);

    try {
      if (editingAddress) {
        // Update existing
        await addressesApi.updateAddress(editingAddress.id, {
          type,
          label,
          contactPerson,
          phone,
          email: email || undefined,
          address,
          city,
          county,
          postalCode: postalCode || undefined,
          country: 'România',
          isDefault,
        });
        toast({
          title: 'Adresă actualizată',
          description: 'Modificările au fost salvate.',
        });
      } else {
        // Create new
        await addressesApi.createAddress(user.id, {
          type,
          label,
          contactPerson,
          phone,
          email: email || undefined,
          address,
          city,
          county,
          postalCode: postalCode || undefined,
          country: 'România',
          isDefault,
        });
        toast({
          title: 'Adresă adăugată',
          description: 'Adresa a fost salvată cu succes.',
        });
      }

      handleCloseDialog();
      loadAddresses();
    } catch (error) {
      toast({
        title: 'Eroare',
        description: error instanceof Error ? error.message : 'Nu s-a putut salva adresa',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (addrId: string) => {
    if (!confirm('Sigur vrei să ștergi această adresă?')) return;

    try {
      await addressesApi.deleteAddress(addrId);
      toast({
        title: 'Adresă ștearsă',
        description: 'Adresa a fost eliminată.',
      });
      loadAddresses();
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut șterge adresa',
        variant: 'destructive',
      });
    }
  };

  const handleSetDefault = async (addrId: string) => {
    try {
      await addressesApi.setDefaultAddress(addrId);
      toast({
        title: 'Adresă implicită actualizată',
      });
      loadAddresses();
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut seta adresa ca implicită',
        variant: 'destructive',
      });
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Adrese Salvate</h3>
          <p className="text-sm text-muted-foreground">
            Gestionează adresele de livrare și facturare
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Adaugă Adresă
        </Button>
      </div>

      {/* Address List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : addresses.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Nu ai adrese salvate</p>
            <Button onClick={() => handleOpenDialog()} className="mt-4" variant="outline">
              Adaugă Prima Adresă
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <Card key={addr.id} className={addr.isDefault ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {addr.label}
                      {addr.isDefault && (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Implicită
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="capitalize">{addr.type === 'billing' ? 'Facturare' : 'Livrare'}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(addr)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(addr.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="font-medium">{addr.contactPerson}</p>
                <p className="text-muted-foreground">{addr.phone}</p>
                {addr.email && <p className="text-muted-foreground">{addr.email}</p>}
                <p className="text-muted-foreground pt-2">
                  {addr.address}, {addr.city}, {addr.county}
                </p>
                {!addr.isDefault && (
                  <Button
                    variant="link"
                    size="sm"
                    className="px-0 h-auto mt-2"
                    onClick={() => handleSetDefault(addr.id)}
                  >
                    Setează ca implicită
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? 'Editează Adresă' : 'Adaugă Adresă Nouă'}
            </DialogTitle>
            <DialogDescription>
              Completează detaliile adresei de livrare sau facturare
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Type */}
            <div className="space-y-2">
              <Label>Tip Adresă</Label>
              <RadioGroup value={type} onValueChange={(v) => setType(v as AddressType)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery" className="font-normal cursor-pointer">
                    Adresă de Livrare
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="billing" id="billing" />
                  <Label htmlFor="billing" className="font-normal cursor-pointer">
                    Adresă de Facturare
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="label">Etichetă (ex: Sediu Principal, Depozit Cluj)</Label>
              <Input
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Denumire adresă"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Persoană de Contact</Label>
                <Input
                  id="contactPerson"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (opțional)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresă</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Strada Exemplu nr. 123"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Oraș</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="county">Județ</Label>
                <Input
                  id="county"
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Cod Poștal</Label>
                <Input
                  id="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isDefault" className="font-normal cursor-pointer">
                Setează ca adresă implicită
              </Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Se salvează...' : 'Salvează Adresa'}
              </Button>
              <Button variant="outline" onClick={handleCloseDialog} disabled={isSaving}>
                Anulează
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressesTab;
