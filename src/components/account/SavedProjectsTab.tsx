import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, FileText, Calendar, Trash2, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import * as projectsApi from '@/lib/api/projects';
import type { SavedProject } from '@/types/user';

const SavedProjectsTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await projectsApi.getUserProjects(user.id);
      setProjects(data);
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca proiectele',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Sigur vrei să ștergi acest proiect?')) return;

    try {
      await projectsApi.deleteProject(projectId);
      toast({
        title: 'Proiect șters',
        description: 'Proiectul a fost eliminat.',
      });
      loadProjects();
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut șterge proiectul',
        variant: 'destructive',
      });
    }
  };

  const handleLoadProject = async (project: SavedProject) => {
    try {
      // Mark as recently used
      await projectsApi.markProjectAsUsed(project.id);

      // Navigate to BOM upload page with project data
      // We'll store the project data in sessionStorage for the BOM page to load
      sessionStorage.setItem('loadedProject', JSON.stringify(project));

      toast({
        title: 'Proiect încărcat',
        description: `Proiectul "${project.name}" a fost încărcat în pagina BOM.`,
      });

      navigate('/bom-upload');
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut încărca proiectul',
        variant: 'destructive',
      });
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Proiecte BOM Salvate</h3>
        <p className="text-sm text-muted-foreground">
          Proiectele tale salvate din încărcările BOM
        </p>
      </div>

      {/* Projects List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-2">Nu ai proiecte salvate</p>
            <p className="text-sm text-muted-foreground mb-4">
              Proiectele BOM pe care le salvezi vor apărea aici
            </p>
            <Button onClick={() => navigate('/bom-upload')} variant="outline">
              Încarcă un fișier BOM
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {project.name}
                    </CardTitle>
                    {project.description && (
                      <CardDescription className="mt-1">{project.description}</CardDescription>
                    )}
                  </div>
                  <Badge variant="secondary">
                    {project.bomData.totalRows} {project.bomData.totalRows === 1 ? 'rând' : 'rânduri'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Creat: {new Date(project.createdAt).toLocaleDateString('ro-RO')}
                      </span>
                    </div>
                    {project.lastUsedAt && (
                      <div className="flex items-center gap-2">
                        <Eye className="h-3 w-3" />
                        <span>
                          Ultima folosire: {new Date(project.lastUsedAt).toLocaleDateString('ro-RO')}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <FileText className="h-3 w-3" />
                      <span>Fișier original: {project.bomData.fileName}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleLoadProject(project)}
                      className="gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Încarcă în Coș
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedProjectsTab;
