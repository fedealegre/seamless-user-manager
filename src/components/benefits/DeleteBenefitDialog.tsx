
import React from "react";
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
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { useDeleteBenefit } from "@/hooks/use-benefits";

interface DeleteBenefitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  benefit: Benefit | null;
}

export const DeleteBenefitDialog: React.FC<DeleteBenefitDialogProps> = ({
  open,
  onOpenChange,
  benefit,
}) => {
  const { settings } = useBackofficeSettings();
  const deleteBenefitMutation = useDeleteBenefit();
  
  const t = (key: string) => translate(key, settings.language);

  const handleDelete = async () => {
    if (!benefit) return;

    deleteBenefitMutation.mutate(benefit.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  if (!benefit) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('confirm-deletion')}</DialogTitle>
          <DialogDescription>
            {t('delete-benefit-confirmation').replace('{title}', benefit.titulo)}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteBenefitMutation.isPending}
          >
            {t('cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteBenefitMutation.isPending}
          >
            {deleteBenefitMutation.isPending ? t('deleting') : t('delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
