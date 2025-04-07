
import React, { useState } from "react";
import { Transaction } from "@/lib/api/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, XCircle } from "lucide-react";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface CancelTransactionDialogProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reason: string) => void;
}

const CancelTransactionDialog: React.FC<CancelTransactionDialogProps> = ({
  transaction,
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError(t("please-provide-reason"));
      return;
    }
    
    onSubmit(reason);
    setReason("");
    setError("");
  };

  const formatCurrency = (amount?: number, currency?: string) => {
    if (amount === undefined) return '-';
    
    return new Intl.NumberFormat(settings.language === 'en' ? 'en-US' : 'es-ES', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  // Get the transaction identifier (either transactionId or id)
  const transactionIdentifier = transaction.transactionId || transaction.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("cancel-transaction")}</DialogTitle>
          <DialogDescription>
            {t("cancel-transaction-confirmation")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50 mb-4">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <XCircle size={16} className="text-amber-600" />
            </div>
            <div>
              <div className="font-medium">{t("transaction-id")}: {transactionIdentifier}</div>
              <div className="text-sm text-muted-foreground">
                {t("amount")}: {formatCurrency(transaction.amount, transaction.currency)}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="reason">{t("reason-for-cancellation")}</Label>
            <Textarea
              id="reason"
              placeholder={t("explain-cancellation-reason")}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim()) setError("");
              }}
              className={error ? "border-destructive" : ""}
            />
            
            {error && (
              <div className="flex items-center text-sm text-destructive gap-1">
                <AlertCircle size={12} /> {error}
              </div>
            )}
            
            <div className="text-sm text-muted-foreground mt-2">
              <p>{t("only-pending-can-be-cancelled")}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button variant="destructive" onClick={handleSubmit}>
            {t("confirm-cancellation")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelTransactionDialog;
