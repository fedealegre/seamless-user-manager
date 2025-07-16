
import React, { useState } from "react";
import { Plus, Upload, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BenefitsTable } from "@/components/benefits/BenefitsTable";
import { BenefitsFilters } from "@/components/benefits/BenefitsFilters";
import { CreateBenefitDialog } from "@/components/benefits/CreateBenefitDialog";
import { BulkUploadDialog } from "@/components/benefits/BulkUploadDialog";
import { ReorderBenefitsDialog } from "@/components/benefits/ReorderBenefitsDialog";
import { BenefitFilters } from "@/types/benefits";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

const Benefits: React.FC = () => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [bulkUploadDialogOpen, setBulkUploadDialogOpen] = useState(false);
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
  const [filters, setFilters] = useState<BenefitFilters>({});

  const handleFiltersChange = (newFilters: BenefitFilters) => {
    setFilters(newFilters);
  };

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
            variant="outline"
            onClick={() => setBulkUploadDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {t('bulk-upload') || 'Carga Masiva'}
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

      {/* Table */}
      <BenefitsTable 
        filters={filters} 
        onReorderRequest={() => setReorderDialogOpen(true)} 
      />

      {/* Dialogs */}
      <CreateBenefitDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <BulkUploadDialog
        open={bulkUploadDialogOpen}
        onOpenChange={setBulkUploadDialogOpen}
      />

      <ReorderBenefitsDialog
        open={reorderDialogOpen}
        onOpenChange={setReorderDialogOpen}
        benefits={[]} // This will be passed from the table component
      />
    </div>
  );
};

export default Benefits;
