
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { GripVertical, Save, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Benefit } from "@/types/benefits";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";

interface ReorderBenefitsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  benefits: Benefit[];
}

export const ReorderBenefitsDialog: React.FC<ReorderBenefitsDialogProps> = ({
  open,
  onOpenChange,
  benefits,
}) => {
  const { settings } = useBackofficeSettings();
  const { toast } = useToast();
  const t = (key: string) => translate(key, settings.language);
  
  const [orderedBenefits, setOrderedBenefits] = useState<Benefit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (open && benefits.length > 0) {
      // Sort benefits by order when dialog opens
      const sortedBenefits = [...benefits].sort((a, b) => a.orden - b.orden);
      setOrderedBenefits(sortedBenefits);
    }
  }, [open, benefits]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) {
      return;
    }

    const items = Array.from(orderedBenefits);
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);

    // Update order numbers based on new positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      orden: index + 1,
    }));

    setOrderedBenefits(updatedItems);
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
      
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{t('reorder-benefits') || 'Reordenar Beneficios'}</DialogTitle>
          <DialogDescription>
            {t('reorder-benefits-description') || 'Arrastra y suelta los beneficios para cambiar su orden. Los cambios se guardarán al hacer clic en "Guardar Cambios".'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-1">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="benefits-list">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`space-y-3 ${
                        snapshot.isDraggingOver ? 'bg-blue-50 rounded-lg' : ''
                      }`}
                    >
                      {orderedBenefits.map((benefit, index) => (
                        <Draggable
                          key={benefit.id}
                          draggableId={benefit.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center gap-3 p-4 border rounded-lg bg-white transition-all ${
                                snapshot.isDragging 
                                  ? 'shadow-lg border-blue-300 transform rotate-2' 
                                  : 'shadow-sm hover:shadow-md'
                              }`}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing transition-colors"
                              >
                                <GripVertical className="h-5 w-5" />
                              </div>
                              
                              <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-semibold flex-shrink-0">
                                {benefit.orden}
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
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
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
