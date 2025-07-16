
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BenefitForm } from "./BenefitForm";
import { Benefit } from "@/types/benefits";

interface EditBenefitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  benefit: Benefit | null;
}

export const EditBenefitDialog: React.FC<EditBenefitDialogProps> = ({
  open,
  onOpenChange,
  benefit,
}) => {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  if (!benefit) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Beneficio</DialogTitle>
        </DialogHeader>
        <BenefitForm
          benefit={benefit}
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
