import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
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
import { Save, X, Search, ArrowUp, ArrowDown, MoveUp, MoveDown } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Benefit } from "@/types/benefits";
import { SortableBenefitItem } from "./SortableBenefitItem";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";

interface OptimizedReorderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  benefits: Benefit[];
  onReorderSuccess: (reorderedBenefits: Benefit[]) => void;
}

const ITEM_HEIGHT = 120; // Height of each benefit item
const BATCH_ITEM_HEIGHT = 80; // Height of each item in batch mode

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

// Virtualized benefit item for batch mode
const VirtualizedBatchItem = React.memo<{
  index: number;
  style: any;
  data: {
    benefits: Benefit[];
    selectedBenefits: Set<string>;
    onSelectBenefit: (id: string) => void;
  };
}>(({ index, style, data }) => {
  const { benefits, selectedBenefits, onSelectBenefit } = data;
  const benefit = benefits[index];

  if (!benefit) return null;

  return (
    <div style={style} className="px-2">
      <div className="flex items-center gap-3 p-3 border rounded-lg mx-1 my-1">
        <Checkbox
          checked={selectedBenefits.has(benefit.id)}
          onCheckedChange={() => onSelectBenefit(benefit.id)}
        />
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{benefit.titulo}</div>
          <div className="text-sm text-muted-foreground truncate">
            Categoría: {benefit.categoria} | Orden actual: {benefit.orden}
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
  
  const [orderedBenefits, setOrderedBenefits] = useState<Benefit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBenefits, setSelectedBenefits] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("visual");
  
  const listRef = useRef<List>(null);
  const batchListRef = useRef<List>(null);

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
      setSelectedBenefits(new Set());
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

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setOrderedBenefits((benefits) => {
      const allBenefits = [...benefits];
      const oldIndex = allBenefits.findIndex(benefit => benefit.id === active.id);
      const overIndex = allBenefits.findIndex(benefit => benefit.id === over.id);

      if (oldIndex === -1 || overIndex === -1) return benefits;

      const newOrder = arrayMove(allBenefits, oldIndex, overIndex);
      
      // Update order numbers based on new positions
      return newOrder.map((benefit, index) => ({
        ...benefit,
        orden: index + 1,
      }));
    });
  }, []);

  const handleMoveTo = useCallback((benefitId: string, newPosition: number) => {
    if (newPosition < 1 || newPosition > orderedBenefits.length) return;

    setOrderedBenefits((benefits) => {
      const newBenefits = [...benefits];
      const currentIndex = newBenefits.findIndex(b => b.id === benefitId);
      if (currentIndex === -1) return benefits;

      const [movedBenefit] = newBenefits.splice(currentIndex, 1);
      newBenefits.splice(newPosition - 1, 0, movedBenefit);

      return newBenefits.map((benefit, index) => ({
        ...benefit,
        orden: index + 1,
      }));
    });
  }, [orderedBenefits.length]);

  const handleMoveToTop = useCallback((benefitId: string) => {
    handleMoveTo(benefitId, 1);
  }, [handleMoveTo]);

  const handleMoveToBottom = useCallback((benefitId: string) => {
    handleMoveTo(benefitId, orderedBenefits.length);
  }, [handleMoveTo, orderedBenefits.length]);

  const handleBatchMoveToPosition = useCallback((position: number) => {
    if (selectedBenefits.size === 0) return;

    setOrderedBenefits((benefits) => {
      const newBenefits = [...benefits];
      const selectedItems = newBenefits.filter(b => selectedBenefits.has(b.id));
      const remainingItems = newBenefits.filter(b => !selectedBenefits.has(b.id));

      // Insert selected items at the specified position
      const insertIndex = Math.min(position - 1, remainingItems.length);
      remainingItems.splice(insertIndex, 0, ...selectedItems);

      return remainingItems.map((benefit, index) => ({
        ...benefit,
        orden: index + 1,
      }));
    });

    setSelectedBenefits(new Set());
  }, [selectedBenefits]);

  const handleSelectAll = useCallback(() => {
    if (selectedBenefits.size === filteredBenefits.length) {
      setSelectedBenefits(new Set());
    } else {
      setSelectedBenefits(new Set(filteredBenefits.map(b => b.id)));
    }
  }, [selectedBenefits.size, filteredBenefits]);

  const handleSelectBenefit = useCallback((benefitId: string) => {
    setSelectedBenefits(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(benefitId)) {
        newSelection.delete(benefitId);
      } else {
        newSelection.add(benefitId);
      }
      return newSelection;
    });
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t('success'),
        description: t('benefits-order-updated') || 'Orden de beneficios actualizado correctamente',
      });
      
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

  // Calculate dialog height dynamically
  const dialogHeight = Math.min(window.innerHeight * 0.9, 800);
  const contentHeight = dialogHeight - 200; // Account for header and footer

  // Prepare data for virtualized lists
  const visualListData = useMemo(() => ({
    benefits: filteredBenefits,
    onMoveTo: handleMoveTo,
    onMoveToTop: handleMoveToTop,
    onMoveToBottom: handleMoveToBottom,
    totalCount: orderedBenefits.length,
  }), [filteredBenefits, handleMoveTo, handleMoveToTop, handleMoveToBottom, orderedBenefits.length]);

  const batchListData = useMemo(() => ({
    benefits: filteredBenefits,
    selectedBenefits,
    onSelectBenefit: handleSelectBenefit,
  }), [filteredBenefits, selectedBenefits, handleSelectBenefit]);

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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mb-4 flex-shrink-0">
              <TabsTrigger value="visual">Reordenamiento Visual</TabsTrigger>
              <TabsTrigger value="batch">Reordenamiento Masivo</TabsTrigger>
            </TabsList>

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

            <TabsContent value="visual" className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col">
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
            </TabsContent>

            <TabsContent value="batch" className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col">
              <div className="flex flex-col gap-4 flex-1 min-h-0">
                {/* Batch controls */}
                <div className="flex-shrink-0 space-y-4">
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <Checkbox
                      checked={selectedBenefits.size === filteredBenefits.length && filteredBenefits.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="font-medium">Seleccionar todos</span>
                    {selectedBenefits.size > 0 && (
                      <Badge variant="secondary">
                        {selectedBenefits.size} seleccionados
                      </Badge>
                    )}
                  </div>

                  {selectedBenefits.size > 0 && (
                    <div className="flex gap-2 p-4 bg-muted rounded-lg">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBatchMoveToPosition(1)}
                      >
                        <MoveUp className="h-4 w-4 mr-2" />
                        Mover al inicio
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBatchMoveToPosition(orderedBenefits.length)}
                      >
                        <MoveDown className="h-4 w-4 mr-2" />
                        Mover al final
                      </Button>
                    </div>
                  )}
                </div>

                {/* Virtualized batch list */}
                <div className="flex-1 min-h-0 border rounded-lg">
                  <List
                    ref={batchListRef}
                    height={contentHeight - 200}
                    width="100%"
                    itemCount={filteredBenefits.length}
                    itemSize={BATCH_ITEM_HEIGHT}
                    itemData={batchListData}
                    className="scrollbar-thin scrollbar-thumb-border scrollbar-track-background"
                  >
                    {VirtualizedBatchItem}
                  </List>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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