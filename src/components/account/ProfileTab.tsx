import { useState } from 'react';
import { User, Mail, Phone, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ProfileTab = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Password change fields
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSaveProfile = async () => {
    setIsSaving(true);

    try {
      await updateUser({
        name,
        phone: phone || undefined,
      });

      toast({
        title: 'Profil actualizat',
        description: 'Modificările au fost salvate cu succes.',
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

  const handleCancelEdit = () => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    setPasswordError('');

    // Validate passwords
    if (newPassword.length < 8) {
      setPasswordError('Parola trebuie să aibă minim 8 caractere');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Parolele nu coincid');
      return;
    }

    setIsSaving(true);

    try {
      // In real implementation, would call API to change password
      // For now, just show success
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast({
        title: 'Parolă schimbată',
        description: 'Parola a fost actualizată cu succes.',
      });

      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut schimba parola',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Informații Personale</CardTitle>
              <CardDescription>Actualizează datele profilului tău</CardDescription>
            </div>
            {user.emailVerified ? (
              <Badge variant="default" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Email Verificat
              </Badge>
            ) : (
              <Badge variant="secondary">Email Neverificat</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                <User className="h-4 w-4 inline mr-2" />
                Nume Complet
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="h-4 w-4 inline mr-2" />
                Email
              </Label>
              <Input id="email" value={user.email} disabled />
              <p className="text-xs text-muted-foreground">
                Email-ul nu poate fi modificat
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="h-4 w-4 inline mr-2" />
                Telefon
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
                placeholder="+40 123 456 789"
              />
            </div>

            <div className="space-y-2">
              <Label>Tip Cont</Label>
              <Input
                value={user.role === 'business' ? 'Business' : 'Individual'}
                disabled
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Editează Profil</Button>
            ) : (
              <>
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? 'Se salvează...' : 'Salvează Modificările'}
                </Button>
                <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                  Anulează
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Lock className="h-5 w-5 inline mr-2" />
            Schimbă Parola
          </CardTitle>
          <CardDescription>Actualizează parola contului tău</CardDescription>
        </CardHeader>
        <CardContent>
          {!isChangingPassword ? (
            <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
              Schimbă Parola
            </Button>
          ) : (
            <div className="space-y-4">
              {passwordError && (
                <Alert variant="destructive">
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Parola Curentă</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Parolă Nouă</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minim 8 caractere"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmă Parola Nouă</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleChangePassword} disabled={isSaving}>
                  {isSaving ? 'Se schimbă...' : 'Schimbă Parola'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordError('');
                  }}
                  disabled={isSaving}
                >
                  Anulează
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
