
import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Benefit, BenefitFilters } from "@/types/benefits";
import { DeleteBenefitDialog } from "./DeleteBenefitDialog";
import { EditBenefitDialog } from "./EditBenefitDialog";
import { formatDateTime } from "@/lib/date-utils";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface BenefitsTableProps {
  filters: BenefitFilters;
  benefits: Benefit[];
  onReorderRequest?: () => void;
}

export const BenefitsTable: React.FC<BenefitsTableProps> = ({ 
  filters, 
  benefits, 
  onReorderRequest 
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const { settings } = useBackofficeSettings();
  
  const t = (key: string) => translate(key, settings.language);

  const getStatusBadge = (estado: string) => {
    const statusConfig = {
      activo: { label: t('active'), variant: "default" as const, className: "bg-green-100 text-green-800" },
      inactivo: { label: t('inactive'), variant: "secondary" as const, className: "bg-gray-100 text-gray-800" },
      programado: { label: t('scheduled'), variant: "default" as const, className: "bg-blue-100 text-blue-800" },
      finalizado: { label: t('finished'), variant: "destructive" as const, className: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[estado as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const handleEdit = (benefit: Benefit) => {
    setSelectedBenefit(benefit);
    setEditDialogOpen(true);
  };

  const handleDelete = (benefit: Benefit) => {
    setSelectedBenefit(benefit);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">{t('order')}</TableHead>
                <TableHead>{t('title')}</TableHead>
                <TableHead>{t('category')}</TableHead>
                <TableHead className="w-24">{t('value-percentage')}</TableHead>
                <TableHead>{t('validity')}</TableHead>
                <TableHead className="w-32">{t('status')}</TableHead>
                <TableHead className="w-32">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {benefits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {t('no-benefits-found')}
                  </TableCell>
                </TableRow>
              ) : (
                benefits.map((benefit) => (
                  <TableRow key={benefit.id}>
                    <TableCell className="font-medium">{benefit.orden}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {benefit.imagen && (
                          <img 
                            src={benefit.imagen} 
                            alt={benefit.titulo}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <div className="font-medium">{benefit.titulo}</div>
                          <div className="text-sm text-muted-foreground">{benefit.descripcion}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{benefit.categoria}</TableCell>
                    <TableCell>{benefit.valorPorcentaje}%</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDateTime(benefit.fechaInicio, 'UTC', 'es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })} -</div>
                        <div>{formatDateTime(benefit.fechaFin, 'UTC', 'es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(benefit.estado)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(benefit)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(benefit)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <DeleteBenefitDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        benefit={selectedBenefit}
      />

      <EditBenefitDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        benefit={selectedBenefit}
      />
    </>
  );
};
