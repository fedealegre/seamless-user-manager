import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useReorderBenefits } from "@/hooks/use-benefits";
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
import { FixedSizeList as List } from 'react-window';
import { Save, X, Search, ArrowUp, ArrowDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Benefit } from "@/types/benefits";
import { SortableBenefitItem } from "./SortableBenefitItem";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";

interface OptimizedReorderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  benefits: Benefit[];
  onReorderSuccess: () => void;
}

const ITEM_HEIGHT = 120; // Height of each benefit item

// Virtualized benefit item for visual reordering
const VirtualizedBenefitItem = React.memo<{
  index: number;
  style: any;
  data: {
    benefits: Benefit[];
    onMoveTo: (id: string, position: number) => void;
    onMoveToTop: (id: string) => void;
    onMoveToBottom: (id: string) => void;
    totalCount: number;
  };
}>(({ index, style, data }) => {
  const { benefits, onMoveTo, onMoveToTop, onMoveToBottom, totalCount } = data;
  const benefit = benefits[index];

  if (!benefit) return null;

  return (
    <div style={style} className="px-2">
      <div className="flex items-center gap-3 h-[110px]">
        <div className="flex-1">
          <SortableBenefitItem benefit={benefit} index={index} />
        </div>
        <div className="flex flex-col gap-1 flex-shrink-0">
          <Input
            type="number"
            min="1"
            max={totalCount}
            value={benefit.orden}
            onChange={(e) => {
              const newPos = parseInt(e.target.value);
              if (!isNaN(newPos)) {
                onMoveTo(benefit.id, newPos);
              }
            }}
            className="w-20 h-8 text-xs"
          />
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onMoveToTop(benefit.id)}
            >
              <ArrowUp className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onMoveToBottom(benefit.id)}
            >
              <ArrowDown className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});


export const OptimizedReorderDialog: React.FC<OptimizedReorderDialogProps> = ({
  open,
  onOpenChange,
  benefits,
  onReorderSuccess,
}) => {
  const { settings } = useBackofficeSettings();
  const { toast } = useToast();
  const t = (key: string) => translate(key, settings.language);
  const reorderBenefits = useReorderBenefits();
  
  const [orderedBenefits, setOrderedBenefits] = useState<Benefit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const listRef = useRef<List>(null);

  // Track original order for comparison
  const originalOrderById = useMemo(() => {
    const map = new Map<string, number>();
    [...benefits].sort((a, b) => a.orden - b.orden).forEach(benefit => {
      map.set(benefit.id, benefit.orden);
    });
    return map;
  }, [benefits]);

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
  useEffect(() => {
    if (open && benefits.length > 0) {
      const sortedBenefits = [...benefits].sort((a, b) => a.orden - b.orden);
      setOrderedBenefits(sortedBenefits);
      setSearchQuery("");
    }
  }, [open, benefits]);

  // Filter benefits based on search query with debouncing
  const filteredBenefits = useMemo(() => {
    if (!searchQuery.trim()) return orderedBenefits;
    const query = searchQuery.toLowerCase();
    return orderedBenefits.filter(benefit => 
      benefit.titulo.toLowerCase().includes(query) ||
      benefit.categoria.toLowerCase().includes(query)
    );
  }, [orderedBenefits, searchQuery]);

  // Benefit IDs for drag and drop
  const benefitIds = useMemo(() => filteredBenefits.map(benefit => benefit.id), [filteredBenefits]);

  // Helper function to reorder benefits with minimal order changes
  const reorderAndRotate = useCallback((benefits: Benefit[], fromIndex: number, toIndex: number): Benefit[] => {
    if (fromIndex === toIndex) return benefits;
    
    const newBenefits = [...benefits];
    const [movedItem] = newBenefits.splice(fromIndex, 1);
    newBenefits.splice(toIndex, 0, movedItem);
    
    // Only update order values for affected range
    const minIndex = Math.min(fromIndex, toIndex);
    const maxIndex = Math.max(fromIndex, toIndex);
    
    // Get the order values of items at the boundary positions
    const startOrder = benefits[minIndex].orden;
    
    // Preserve existing order values outside the affected range
    return newBenefits.map((benefit, index) => {
      if (index >= minIndex && index <= maxIndex) {
        // Rotate order values within the affected range
        return {
          ...benefit,
          orden: startOrder + (index - minIndex)
        };
      }
      return benefit;
    });
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setOrderedBenefits((benefits) => {
      const oldIndex = benefits.findIndex(benefit => benefit.id === active.id);
      const newIndex = benefits.findIndex(benefit => benefit.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return benefits;

      return reorderAndRotate(benefits, oldIndex, newIndex);
    });
  }, [reorderAndRotate]);

  const handleMoveTo = useCallback((benefitId: string, newPosition: number) => {
    if (newPosition < 1 || newPosition > orderedBenefits.length) return;

    setOrderedBenefits((benefits) => {
      const currentIndex = benefits.findIndex(b => b.id === benefitId);
      if (currentIndex === -1) return benefits;

      return reorderAndRotate(benefits, currentIndex, newPosition - 1);
    });
  }, [orderedBenefits.length, reorderAndRotate]);

  const handleMoveToTop = useCallback((benefitId: string) => {
    handleMoveTo(benefitId, 1);
  }, [handleMoveTo]);

  const handleMoveToBottom = useCallback((benefitId: string) => {
    handleMoveTo(benefitId, orderedBenefits.length);
  }, [handleMoveTo, orderedBenefits.length]);


  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Calculate changes - only send benefits whose order actually changed
      const changes = orderedBenefits
        .map((benefit) => ({ 
          id: benefit.id, 
          order: benefit.orden,  // Use actual order value, not index + 1
          original: originalOrderById.get(benefit.id) 
        }))
        .filter(x => x.original !== x.order)
        .map(({ id, order }) => ({ id, order }));

      if (changes.length === 0) {
        toast({
          title: t('info') || 'Información',
          description: t('no-changes-detected') || 'No se detectaron cambios en el orden',
        });
        onReorderSuccess();
        return;
      }

      console.debug('Reordering benefits - sending changes for:', changes);
      await reorderBenefits.mutateAsync(changes);
      onReorderSuccess();
    } catch (error) {
      console.error("Error saving benefit order:", error);
      toast({
        title: t('error'),
        description: t('error-saving-order') || 'Error al guardar el orden de beneficios',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  // Calculate dialog height dynamically
  const dialogHeight = Math.min(window.innerHeight * 0.9, 800);
  const contentHeight = dialogHeight - 200; // Account for header and footer

  // Prepare data for virtualized list
  const visualListData = useMemo(() => ({
    benefits: filteredBenefits,
    onMoveTo: handleMoveTo,
    onMoveToTop: handleMoveToTop,
    onMoveToBottom: handleMoveToBottom,
    totalCount: orderedBenefits.length,
  }), [filteredBenefits, handleMoveTo, handleMoveToTop, handleMoveToBottom, orderedBenefits.length]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-6xl w-[95vw] flex flex-col"
        style={{ height: `${dialogHeight}px` }}
      >
        <DialogHeader className="flex-shrink-0 pb-4 border-b">
          <DialogTitle>{t('reorder-benefits') || 'Reordenar Beneficios'}</DialogTitle>
          <DialogDescription>
            {t('reorder-benefits-description') || 'Gestiona el orden de los beneficios de forma eficiente con scroll virtual.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {/* Search and filters */}
          <div className="flex gap-4 mb-4 flex-shrink-0">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por título o categoría..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Badge variant="secondary">
                {filteredBenefits.length} de {orderedBenefits.length} beneficios
              </Badge>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Visual reordering content */}
          <div className="flex-1 min-h-0 border rounded-lg">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={benefitIds} strategy={verticalListSortingStrategy}>
                <List
                  ref={listRef}
                  height={contentHeight - 100}
                  width="100%"
                  itemCount={filteredBenefits.length}
                  itemSize={ITEM_HEIGHT}
                  itemData={visualListData}
                  className="scrollbar-thin scrollbar-thumb-border scrollbar-track-background"
                >
                  {VirtualizedBenefitItem}
                </List>
              </SortableContext>
            </DndContext>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Guardando...' : 'Guardar Orden'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};