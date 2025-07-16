
import React, { useState } from "react";
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
  const [isDeleting, setIsDeleting] = useState(false);
  const { settings } = useBackofficeSettings();
  
  const t = (key: string) => translate(key, settings.language);

  const handleDelete = async () => {
    if (!benefit) return;

    setIsDeleting(true);
    try {
      console.log("Deleting benefit:", benefit.id);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting benefit:", error);
    } finally {
      setIsDeleting(false);
    }
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
            disabled={isDeleting}
          >
            {t('cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? t('deleting') : t('delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
