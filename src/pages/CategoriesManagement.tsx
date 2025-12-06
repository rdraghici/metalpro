import { useState, useEffect } from "react";
import { Plus, Trash2, GripVertical, Save, X } from "lucide-react";
import BackofficeLayout from "@/components/backoffice/BackofficeLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface Category {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  _count?: {
    products: number;
  };
}

const ICON_OPTIONS = [
  "shapes",
  "square",
  "pipe",
  "bolt",
  "sparkles",
  "layers",
];

export default function CategoriesManagement() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Category>>({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState({
    slug: "",
    name: "",
    nameEn: "",
    description: "",
    icon: "shapes",
  });
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("backoffice_token");
      const response = await fetch(`${API_URL}/api/backoffice/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch categories");

      const result = await response.json();
      setCategories(result.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("backoffice_token");
      const response = await fetch(`${API_URL}/api/backoffice/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(createForm),
      });

      if (!response.ok) throw new Error("Failed to create category");

      toast({
        title: "Success",
        description: "Category created successfully",
      });

      setShowCreateDialog(false);
      setCreateForm({ slug: "", name: "", nameEn: "", description: "", icon: "shapes" });
      fetchCategories();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const token = localStorage.getItem("backoffice_token");
      const response = await fetch(`${API_URL}/api/backoffice/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) throw new Error("Failed to update category");

      toast({
        title: "Success",
        description: "Category updated successfully",
      });

      setEditingId(null);
      setEditForm({});
      fetchCategories();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteCategory) return;

    try {
      const token = localStorage.getItem("backoffice_token");
      const response = await fetch(`${API_URL}/api/backoffice/categories/${deleteCategory.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to delete category");
      }

      toast({
        title: "Success",
        description: "Category deleted successfully",
      });

      setDeleteCategory(null);
      fetchCategories();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditForm({
      slug: category.slug,
      name: category.name,
      nameEn: category.nameEn,
      description: category.description || "",
      icon: category.icon || "shapes",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  if (loading) {
    return (
      <BackofficeLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </BackofficeLayout>
    );
  }

  return (
    <BackofficeLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Categories Management</h1>
            <p className="text-muted-foreground">Manage product categories</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Order</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Slug</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Name (RO)</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Name (EN)</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Icon</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Products</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                        <span className="text-sm">{category.sortOrder}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {editingId === category.id ? (
                        <Input
                          value={editForm.slug || ""}
                          onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                          className="h-8"
                        />
                      ) : (
                        <span className="text-sm font-mono">{category.slug}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === category.id ? (
                        <Input
                          value={editForm.name || ""}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="h-8"
                        />
                      ) : (
                        <span className="text-sm">{category.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === category.id ? (
                        <Input
                          value={editForm.nameEn || ""}
                          onChange={(e) => setEditForm({ ...editForm, nameEn: e.target.value })}
                          className="h-8"
                        />
                      ) : (
                        <span className="text-sm">{category.nameEn}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === category.id ? (
                        <select
                          value={editForm.icon || "shapes"}
                          onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                          className="h-8 px-2 border rounded text-sm"
                        >
                          {ICON_OPTIONS.map((icon) => (
                            <option key={icon} value={icon}>
                              {icon}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-sm text-muted-foreground">{category.icon}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{category._count?.products || 0}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {editingId === category.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleUpdate(category.id)}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEdit(category)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setDeleteCategory(category)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new product category to your store
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Slug</label>
              <Input
                value={createForm.slug}
                onChange={(e) => setCreateForm({ ...createForm, slug: e.target.value })}
                placeholder="e.g., profiles"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Name (Romanian)</label>
              <Input
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                placeholder="e.g., Profile Metalice"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Name (English)</label>
              <Input
                value={createForm.nameEn}
                onChange={(e) => setCreateForm({ ...createForm, nameEn: e.target.value })}
                placeholder="e.g., Metal Profiles"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                placeholder="Brief description"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Icon</label>
              <select
                value={createForm.icon}
                onChange={(e) => setCreateForm({ ...createForm, icon: e.target.value })}
                className="w-full h-10 px-3 border rounded"
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteCategory?.name}"?
              {deleteCategory?._count?.products && deleteCategory._count.products > 0 ? (
                <span className="block mt-2 text-destructive font-medium">
                  This category has {deleteCategory._count.products} product(s) and cannot be deleted.
                </span>
              ) : (
                <span className="block mt-2">
                  This action cannot be undone.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={!!deleteCategory?._count?.products && deleteCategory._count.products > 0}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </BackofficeLayout>
  );
}
