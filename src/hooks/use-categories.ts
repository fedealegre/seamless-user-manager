import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CurrentCategoriesService as CategoriesService } from '@/lib/api/services/categories';
import { Category } from '@/types/category';
import { useToast } from '@/hooks/use-toast';

export const CATEGORIES_QUERY_KEY = 'categories';

// Hook for listing categories
export const useCategories = () => {
  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY, 'list'],
    queryFn: () => CategoriesService.listCategories(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook for creating a category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (category: Category) => CategoriesService.createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      toast({
        title: "Categoría creada",
        description: "La categoría se ha creado exitosamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo crear la categoría",
        variant: "destructive",
      });
      console.error('Create category error:', error);
    },
  });
};

// Hook for updating a category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (category: Category) => CategoriesService.updateCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      toast({
        title: "Categoría actualizada",
        description: "La categoría se ha actualizado exitosamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la categoría",
        variant: "destructive",
      });
      console.error('Update category error:', error);
    },
  });
};

// Hook for deleting a category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (code: string) => CategoriesService.deleteCategory(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      toast({
        title: "Categoría eliminada",
        description: "La categoría se ha eliminado exitosamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría",
        variant: "destructive",
      });
      console.error('Delete category error:', error);
    },
  });
};