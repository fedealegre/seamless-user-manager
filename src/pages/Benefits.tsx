import React, { useState, useMemo } from "react";
import { Plus, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BenefitsTable } from "@/components/benefits/BenefitsTable";
import { BenefitsFilters } from "@/components/benefits/BenefitsFilters";
import { CreateBenefitDialog } from "@/components/benefits/CreateBenefitDialog";
import { OptimizedReorderDialog } from "@/components/benefits/OptimizedReorderDialog";
import BenefitsPagination from "@/components/benefits/BenefitsPagination";
import { BenefitFilters, Benefit } from "@/types/benefits";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { useBenefits } from "@/hooks/use-benefits";
import { Skeleton } from "@/components/ui/skeleton";

const Benefits: React.FC = () => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
  const [filters, setFilters] = useState<BenefitFilters>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Use react-query to fetch benefits from backend
  const { data: benefitsData, isLoading, error } = useBenefits({
    page,
    size: pageSize,
    title: filters.titulo,
    status: filters.estado
  });

  const handleFiltersChange = (newFilters: BenefitFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleReorderSuccess = () => {
    setReorderDialogOpen(false);
  };

  // Client-side sorting by order (since backend provides ordered data)
  const sortedBenefits = useMemo(() => {
    if (!benefitsData?.benefits) return [];
    return [...benefitsData.benefits].sort((a, b) => a.orden - b.orden);
  }, [benefitsData?.benefits]);

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-destructive">Error al cargar beneficios</h2>
          <p className="text-muted-foreground mt-2">
            No se pudieron cargar los beneficios. Por favor, intenta nuevamente.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('benefits')}</h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setReorderDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            {t('reorder-benefits') || 'Reordenar'}
          </Button>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('create-benefit')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <BenefitsFilters onFiltersChange={handleFiltersChange} />

      {/* Page Size Selector */}
      <div className="flex items-center justify-end mb-2">
        <label htmlFor="page-size-select" className="mr-2 text-sm text-muted-foreground">
          {t("items-per-page")}:
        </label>
        <select
          id="page-size-select"
          value={pageSize.toString()}
          onChange={(e) => {
            setPageSize(parseInt(e.target.value));
            setPage(1); // Reset to first page when changing page size
          }}
          className="w-20 px-2 py-1 border border-input bg-background text-sm rounded-md"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <>
          <BenefitsTable 
            filters={filters} 
            benefits={sortedBenefits} 
            onReorderRequest={() => setReorderDialogOpen(true)}
          />
          
          <BenefitsPagination
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={benefitsData?.totalPages || 1}
            totalBenefits={benefitsData?.totalElements || 0}
          />
        </>
      )}

      {/* Dialogs */}
      <CreateBenefitDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <OptimizedReorderDialog
        open={reorderDialogOpen}
        onOpenChange={setReorderDialogOpen}
        benefits={sortedBenefits}
        onReorderSuccess={handleReorderSuccess}
      />
    </div>
  );
};

export default Benefits;