import { useState } from 'react';
import { Building2, MapPin, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const CompanyInfoTab = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Company fields
  const [companyName, setCompanyName] = useState(user?.company?.name || '');
  const [cui, setCui] = useState(user?.company?.cui || '');
  const [regCom, setRegCom] = useState(user?.company?.regCom || '');
  const [address, setAddress] = useState(user?.company?.address || '');
  const [city, setCity] = useState(user?.company?.city || '');
  const [county, setCounty] = useState(user?.company?.county || '');
  const [postalCode, setPostalCode] = useState(user?.company?.postalCode || '');

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await updateUser({
        company: {
          name: companyName,
          cui,
          regCom: regCom || undefined,
          address,
          city,
          county,
          postalCode: postalCode || undefined,
          country: 'România',
          isVerified: user?.company?.isVerified || false,
        },
      });

      toast({
        title: 'Informații actualizate',
        description: 'Datele companiei au fost salvate cu succes.',
      });

      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Eroare',
        description: error instanceof Error ? error.message : 'Nu s-au putut salva modificările',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setCompanyName(user?.company?.name || '');
    setCui(user?.company?.cui || '');
    setRegCom(user?.company?.regCom || '');
    setAddress(user?.company?.address || '');
    setCity(user?.company?.city || '');
    setCounty(user?.company?.county || '');
    setPostalCode(user?.company?.postalCode || '');
    setIsEditing(false);
  };

  if (!user || user.role !== 'business') {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            Informațiile companiei sunt disponibile doar pentru conturi business.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                <Building2 className="h-5 w-5 inline mr-2" />
                Informații Companie
              </CardTitle>
              <CardDescription>Datele legale ale companiei tale</CardDescription>
            </div>
            {user.company?.isVerified && (
              <Badge variant="default">Companie Verificată</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nume Companie</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={!isEditing}
                placeholder="SC Exemplu SRL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cui">CUI</Label>
              <Input
                id="cui"
                value={cui}
                onChange={(e) => setCui(e.target.value)}
                disabled={!isEditing}
                placeholder="RO12345678"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="regCom">Registrul Comerțului (opțional)</Label>
              <Input
                id="regCom"
                value={regCom}
                onChange={(e) => setRegCom(e.target.value)}
                disabled={!isEditing}
                placeholder="J40/1234/2020"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Editează Date Companie</Button>
            ) : (
              <>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Se salvează...' : 'Salvează Modificările'}
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                  Anulează
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Company Address */}
      <Card>
        <CardHeader>
          <CardTitle>
            <MapPin className="h-5 w-5 inline mr-2" />
            Adresa Sediului Social
          </CardTitle>
          <CardDescription>Adresa principală a companiei</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Adresă</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={!isEditing}
              placeholder="Strada Exemplu nr. 123"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Oraș</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!isEditing}
                placeholder="București"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="county">Județ</Label>
              <Input
                id="county"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                disabled={!isEditing}
                placeholder="București"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Cod Poștal</Label>
              <Input
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                disabled={!isEditing}
                placeholder="012345"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Verification */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>
            <FileText className="h-5 w-5 inline mr-2" />
            Verificare Business
          </CardTitle>
          <CardDescription>
            Procesare mai rapidă a ofertelor pentru companii verificate
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user.company?.isVerified ? (
            <div className="flex items-center gap-2 text-green-600">
              <Badge variant="default">Verificat</Badge>
              <p className="text-sm">Compania ta a fost verificată de echipa MetalPro</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Verificarea business include validarea CUI și a certificatului de înregistrare.
                Companiile verificate beneficiază de procesare prioritară a ofertelor.
              </p>
              <Button variant="outline" disabled>
                Solicită Verificare (În curând)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyInfoTab;
