
import React, { useState } from "react";
import { Transaction, ChangeTransactionStatusRequest } from "@/lib/api/types";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface ChangeTransactionStatusDialogProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (request: ChangeTransactionStatusRequest) => void;
}

const ChangeTransactionStatusDialog: React.FC<ChangeTransactionStatusDialogProps> = ({
  transaction,
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [status, setStatus] = useState<'cancelled' | 'rejected' | 'confirmed' | 'approved'>('confirmed');
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError(t("reason-required"));
      return;
    }
    
    onSubmit({
      status,
      reason
    });
    setReason("");
    setError("");
    setStatus('confirmed');
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("change-transaction-status")}</DialogTitle>
          <DialogDescription>
            {t("change-transaction-status-description")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50 mb-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <CheckCircle2 size={16} className="text-blue-600" />
            </div>
            <div>
              <div className="font-medium">{t("transaction-id")}: {transactionIdentifier}</div>
              <div className="text-sm text-muted-foreground">
                {t("amount")}: {formatCurrency(transaction.amount, transaction.currency)}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("new-status")}</Label>
              <RadioGroup value={status} onValueChange={(value) => setStatus(value as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="confirmed" id="confirmed" />
                  <Label htmlFor="confirmed">{t("confirmed")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="approved" id="approved" />
                  <Label htmlFor="approved">{t("approved")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rejected" id="rejected" />
                  <Label htmlFor="rejected">{t("rejected")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cancelled" id="cancelled" />
                  <Label htmlFor="cancelled">{t("cancelled")}</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">{t("reason-for-status-change")}</Label>
              <Textarea
                id="reason"
                placeholder={t("reason-for-status-change-placeholder")}
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
                <p>{t("status-change-audit-notice")}</p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit}>
            {t("confirm-status-change")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeTransactionStatusDialog;
