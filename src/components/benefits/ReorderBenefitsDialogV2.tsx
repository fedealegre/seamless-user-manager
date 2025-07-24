import React, { useState, useMemo, useCallback } from "react";
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
import { Save, X, Search, ArrowUp, ArrowDown, MoveUp, MoveDown, FileUp, FileDown } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Benefit } from "@/types/benefits";
import { SortableBenefitItem } from "./SortableBenefitItem";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ReorderBenefitsDialogV2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  benefits: Benefit[];
  onReorderSuccess: (reorderedBenefits: Benefit[]) => void;
}

const ITEMS_PER_PAGE = 20;

export const ReorderBenefitsDialogV2: React.FC<ReorderBenefitsDialogV2Props> = ({
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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBenefits, setSelectedBenefits] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("visual");

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
      const sortedBenefits = [...benefits].sort((a, b) => a.orden - b.orden);
      setOrderedBenefits(sortedBenefits);
      setSearchQuery("");
      setCurrentPage(1);
      setSelectedBenefits(new Set());
    }
  }, [open, benefits]);

  // Filter benefits based on search query
  const filteredBenefits = useMemo(() => {
    if (!searchQuery) return orderedBenefits;
    return orderedBenefits.filter(benefit => 
      benefit.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      benefit.categoria.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [orderedBenefits, searchQuery]);

  // Paginated benefits for current page
  const paginatedBenefits = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredBenefits.slice(startIndex, endIndex);
  }, [filteredBenefits, currentPage]);

  // Total pages calculation
  const totalPages = Math.ceil(filteredBenefits.length / ITEMS_PER_PAGE);

  // Benefit IDs for current page
  const benefitIds = useMemo(() => paginatedBenefits.map(benefit => benefit.id), [paginatedBenefits]);

  const handleDragEnd = (event: DragEndEvent) => {
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
  };

  const handleMoveTo = (benefitId: string, newPosition: number) => {
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
  };

  const handleMoveToTop = (benefitId: string) => {
    handleMoveTo(benefitId, 1);
  };

  const handleMoveToBottom = (benefitId: string) => {
    handleMoveTo(benefitId, orderedBenefits.length);
  };

  const handleBatchMoveToPosition = (position: number) => {
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
  };

  const handleSelectAll = () => {
    if (selectedBenefits.size === paginatedBenefits.length) {
      setSelectedBenefits(new Set());
    } else {
      setSelectedBenefits(new Set(paginatedBenefits.map(b => b.id)));
    }
  };

  const handleSelectBenefit = (benefitId: string) => {
    const newSelection = new Set(selectedBenefits);
    if (newSelection.has(benefitId)) {
      newSelection.delete(benefitId);
    } else {
      newSelection.add(benefitId);
    }
    setSelectedBenefits(newSelection);
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{t('reorder-benefits') || 'Reordenar Beneficios'}</DialogTitle>
          <DialogDescription>
            {t('reorder-benefits-description') || 'Gestiona el orden de los beneficios utilizando diferentes métodos de reordenamiento.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mb-4">
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
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
              </div>
              <Badge variant="secondary">
                {filteredBenefits.length} de {orderedBenefits.length} beneficios
              </Badge>
            </div>

            <TabsContent value="visual" className="flex-1 min-h-0 overflow-auto">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={benefitIds} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3 mb-4">
                    {paginatedBenefits.map((benefit, index) => (
                      <div key={benefit.id} className="flex items-center gap-3">
                        <div className="flex-1">
                          <SortableBenefitItem
                            benefit={benefit}
                            index={(currentPage - 1) * ITEMS_PER_PAGE + index}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Input
                            type="number"
                            min="1"
                            max={orderedBenefits.length}
                            value={benefit.orden}
                            onChange={(e) => {
                              const newPos = parseInt(e.target.value);
                              if (!isNaN(newPos)) {
                                handleMoveTo(benefit.id, newPos);
                              }
                            }}
                            className="w-20 h-8 text-xs"
                          />
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleMoveToTop(benefit.id)}
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleMoveToBottom(benefit.id)}
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </TabsContent>

            <TabsContent value="batch" className="flex-1 min-h-0 overflow-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <Checkbox
                    checked={selectedBenefits.size === paginatedBenefits.length && paginatedBenefits.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="font-medium">Seleccionar todos en esta página</span>
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

                <div className="space-y-3">
                  {paginatedBenefits.map((benefit, index) => (
                    <div key={benefit.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Checkbox
                        checked={selectedBenefits.has(benefit.id)}
                        onCheckedChange={() => handleSelectBenefit(benefit.id)}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{benefit.titulo}</div>
                        <div className="text-sm text-muted-foreground">
                          Categoría: {benefit.categoria} | Orden actual: {benefit.orden}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 flex-shrink-0">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
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