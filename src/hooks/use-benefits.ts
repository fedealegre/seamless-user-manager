import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CurrentBenefitsService as BenefitsService, ListBenefitsParams } from '@/lib/api/services/benefits';
import { Benefit } from '@/types/benefits';
import { useToast } from '@/hooks/use-toast';

export const BENEFITS_QUERY_KEY = 'benefits';

// Hook for listing benefits with pagination and filters
export const useBenefits = (params: ListBenefitsParams = {}) => {
  return useQuery({
    queryKey: [BENEFITS_QUERY_KEY, 'list', params],
    queryFn: () => BenefitsService.listBenefits(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook for getting a single benefit
export const useBenefit = (id: string) => {
  return useQuery({
    queryKey: [BENEFITS_QUERY_KEY, 'detail', id],
    queryFn: () => BenefitsService.getBenefit(id),
    enabled: !!id,
  });
};

// Hook for creating a benefit
export const useCreateBenefit = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (benefit: Benefit) => BenefitsService.createBenefit(benefit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BENEFITS_QUERY_KEY] });
      toast({
        title: "Beneficio creado",
        description: "El beneficio se ha creado exitosamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo crear el beneficio",
        variant: "destructive",
      });
      console.error('Create benefit error:', error);
    },
  });
};

// Hook for updating a benefit
export const useUpdateBenefit = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (benefit: Benefit) => BenefitsService.updateBenefit(benefit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BENEFITS_QUERY_KEY] });
      toast({
        title: "Beneficio actualizado",
        description: "El beneficio se ha actualizado exitosamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el beneficio",
        variant: "destructive",
      });
      console.error('Update benefit error:', error);
    },
  });
};

// Hook for deleting a benefit
export const useDeleteBenefit = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => BenefitsService.deleteBenefit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BENEFITS_QUERY_KEY] });
      toast({
        title: "Beneficio eliminado",
        description: "El beneficio se ha eliminado exitosamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el beneficio",
        variant: "destructive",
      });
      console.error('Delete benefit error:', error);
    },
  });
};

// Hook for reordering benefits
export const useReorderBenefits = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (reorderData: { id: string; order: number }[]) => {
      // Use individual PATCH requests for each benefit's order
      return Promise.all(
        reorderData.map(({ id, order }) => 
          BenefitsService.updateBenefitFields(id, { order })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BENEFITS_QUERY_KEY] });
      toast({
        title: "Orden actualizado",
        description: "El orden de los beneficios se ha actualizado exitosamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el orden de los beneficios",
        variant: "destructive",
      });
      console.error('Reorder benefits error:', error);
    },
  });
};