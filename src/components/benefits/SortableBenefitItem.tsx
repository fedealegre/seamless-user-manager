
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Benefit } from "@/types/benefits";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface SortableBenefitItemProps {
  benefit: Benefit;
  index: number;
}

export const SortableBenefitItem: React.FC<SortableBenefitItemProps> = ({
  benefit,
  index,
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: benefit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getStatusBadge = (estado: string) => {
    const statusConfig = {
      activo: { label: t('active'), className: "bg-green-100 text-green-800" },
      inactivo: { label: t('inactive'), className: "bg-gray-100 text-gray-800" },
      programado: { label: t('scheduled'), className: "bg-blue-100 text-blue-800" },
      finalizado: { label: t('finished'), className: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[estado as keyof typeof statusConfig];
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 border rounded-lg bg-white transition-all ${
        isDragging 
          ? 'shadow-xl border-blue-300 opacity-50 scale-105 z-50' 
          : 'shadow-sm hover:shadow-md'
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing transition-colors touch-none"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      
      <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-semibold flex-shrink-0">
        {index + 1}
      </div>

      {benefit.imagen && (
        <img 
          src={benefit.imagen} 
          alt={benefit.titulo}
          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
        />
      )}

      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{benefit.titulo}</div>
        <div className="text-sm text-muted-foreground truncate">{benefit.categoria}</div>
      </div>

      <div className="text-sm font-medium flex-shrink-0 mr-4">
        {benefit.valorPorcentaje}%
      </div>

      <div className="flex-shrink-0">
        {getStatusBadge(benefit.estado)}
      </div>
    </div>
  );
};
