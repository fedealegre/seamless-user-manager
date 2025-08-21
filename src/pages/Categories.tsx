import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/types/category";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/use-categories";
import { Skeleton } from "@/components/ui/skeleton";

const Categories: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ code: "", nombre: "", descripcion: "" });

  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ code: "", nombre: "", descripcion: "" });
    setDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ code: category.code, nombre: category.nombre, descripcion: category.descripcion || "" });
    setDialogOpen(true);
  };

  const handleDelete = async (code: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      try {
        await deleteCategory.mutateAsync(code);
      } catch (error) {
        // Error is handled by the hook
      }
    }
  };

  const handleSave = async () => {
    if (!formData.nombre.trim() || !formData.code.trim()) return;

    // Validate code format (3 digits)
    if (!/^\d{3}$/.test(formData.code)) {
      alert("El código debe tener exactamente 3 dígitos");
      return;
    }

    // Check for duplicate code
    const isDuplicateCode = categories.some(cat => 
      cat.code === formData.code && cat.id !== editingCategory?.id
    );
    if (isDuplicateCode) {
      alert("Ya existe una categoría con este código");
      return;
    }

    const categoryData: Category = {
      id: formData.code,
      code: formData.code,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      fechaCreacion: new Date(),
    };

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync(categoryData);
      } else {
        await createCategory.mutateAsync(categoryData);
      }

      setDialogOpen(false);
      setFormData({ code: "", nombre: "", descripcion: "" });
    } catch (error) {
      // Error is handled by the hooks
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestionar Categorías</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Añadir Nueva
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="w-32">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                </TableRow>
              ))
            ) : (
              categories.sort((a, b) => a.code.localeCompare(b.code)).map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-mono font-medium">{category.code}</TableCell>
                  <TableCell className="font-medium">{category.nombre}</TableCell>
                  <TableCell>{category.descripcion}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(category)}
                        className="h-8 w-8"
                        disabled={updateCategory.isPending}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category.code)}
                        className="h-8 w-8"
                        disabled={deleteCategory.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Código de 3 dígitos (ej: 001)"
                maxLength={3}
                pattern="[0-9]{3}"
              />
            </div>
            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Nombre de la categoría"
              />
            </div>
            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción de la categoría"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={createCategory.isPending || updateCategory.isPending}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!formData.nombre.trim() || !formData.code.trim() || createCategory.isPending || updateCategory.isPending}
            >
              {createCategory.isPending || updateCategory.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
