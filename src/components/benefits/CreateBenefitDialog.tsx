
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BenefitForm } from "./BenefitForm";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface CreateBenefitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateBenefitDialog: React.FC<CreateBenefitDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('new-benefit')}</DialogTitle>
        </DialogHeader>
        <BenefitForm onSuccess={handleSuccess} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
