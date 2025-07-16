
import React, { useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Save, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Benefit } from "@/types/benefits";
import { SortableBenefitItem } from "./SortableBenefitItem";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";

interface ReorderBenefitsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  benefits: Benefit[];
  onReorderSuccess: (reorderedBenefits: Benefit[]) => void;
}

export const ReorderBenefitsDialog: React.FC<ReorderBenefitsDialogProps> = ({
  open,
  onOpenChange,
  benefits,
  onReorderSuccess,
}) => {
  const { settings } = useBackofficeSettings();
  const { toast } = useToast();
  const t = (key: string) => translate(key, settings.language);
  
  const [orderedBenefits, setOrderedBenefits] = useState<Benefit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Configure sensors for better touch and mouse support
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize benefits when dialog opens
  React.useEffect(() => {
    if (open && benefits.length > 0) {
      // Sort benefits by order when dialog opens
      const sortedBenefits = [...benefits].sort((a, b) => a.orden - b.orden);
      setOrderedBenefits(sortedBenefits);
    }
  }, [open, benefits]);

  // Memoize the benefit IDs for SortableContext
  const benefitIds = useMemo(() => orderedBenefits.map(benefit => benefit.id), [orderedBenefits]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setOrderedBenefits((benefits) => {
      const oldIndex = benefits.findIndex(benefit => benefit.id === active.id);
      const newIndex = benefits.findIndex(benefit => benefit.id === over.id);

      const newOrder = arrayMove(benefits, oldIndex, newIndex);
      
      // Update order numbers based on new positions
      return newOrder.map((benefit, index) => ({
        ...benefit,
        orden: index + 1,
      }));
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Here you would make an API call to update the order
      // For now, we'll just simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t('success'),
        description: t('benefits-order-updated') || 'Orden de beneficios actualizado correctamente',
      });
      
      // Call the success callback with the reordered benefits
      onReorderSuccess(orderedBenefits);
    } catch (error) {
      toast({
        title: t('error'),
        description: t('error-updating-order') || 'Error al actualizar el orden de beneficios',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{t('reorder-benefits') || 'Reordenar Beneficios'}</DialogTitle>
          <DialogDescription>
            {t('reorder-benefits-description') || 'Arrastra y suelta los beneficios para cambiar su orden. Los cambios se guardarán al hacer clic en "Guardar Cambios".'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-auto p-1">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={benefitIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {orderedBenefits.map((benefit, index) => (
                  <SortableBenefitItem
                    key={benefit.id}
                    benefit={benefit}
                    index={index}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? t('saving') : (t('save-changes') || 'Guardar Cambios')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
