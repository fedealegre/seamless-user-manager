
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BenefitFilters } from "@/types/benefits";

interface BenefitsFiltersProps {
  onFiltersChange: (filters: BenefitFilters) => void;
}

export const BenefitsFilters: React.FC<BenefitsFiltersProps> = ({
  onFiltersChange,
}) => {
  const [localFilters, setLocalFilters] = useState<BenefitFilters>({});

  const handleSearch = () => {
    onFiltersChange(localFilters);
  };

  const handleClear = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium">Título</label>
          <Input
            placeholder="Buscar por título..."
            value={localFilters.titulo || ""}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, titulo: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Estado</label>
          <Select
            value={localFilters.estado || ""}
            onValueChange={(value) =>
              setLocalFilters({
                ...localFilters,
                estado: value === "todos" ? undefined : value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
              <SelectItem value="programado">Programado</SelectItem>
              <SelectItem value="finalizado">Finalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSearch} className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Buscar
          </Button>
          <Button variant="outline" onClick={handleClear}>
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
};
