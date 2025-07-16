
import React, { useState } from "react";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import BackofficeLayout from "@/components/BackofficeLayout";
import { BenefitsTable } from "@/components/benefits/BenefitsTable";
import { BenefitsFilters } from "@/components/benefits/BenefitsFilters";
import { CreateBenefitDialog } from "@/components/benefits/CreateBenefitDialog";
import { BulkUploadDialog } from "@/components/benefits/BulkUploadDialog";
import { BenefitFilters } from "@/types/benefits";

const Benefits: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [bulkUploadDialogOpen, setBulkUploadDialogOpen] = useState(false);
  const [filters, setFilters] = useState<BenefitFilters>({});

  const handleFiltersChange = (newFilters: BenefitFilters) => {
    setFilters(newFilters);
  };

  return (
    <BackofficeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gestión de Beneficios</h1>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setBulkUploadDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Carga Masiva
            </Button>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Crear Beneficio
            </Button>
          </div>
        </div>

        {/* Filters */}
        <BenefitsFilters onFiltersChange={handleFiltersChange} />

        {/* Table */}
        <BenefitsTable filters={filters} />

        {/* Dialogs */}
        <CreateBenefitDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />

        <BulkUploadDialog
          open={bulkUploadDialogOpen}
          onOpenChange={setBulkUploadDialogOpen}
        />
      </div>
    </BackofficeLayout>
  );
};

export default Benefits;
