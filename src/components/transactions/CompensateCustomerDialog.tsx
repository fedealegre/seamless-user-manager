
import React, { useState, useEffect, useMemo } from "react";
import { Transaction, Wallet } from "@/lib/api/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

// Import new component parts
import CustomerInfo from "./compensation/CustomerInfo";
import OriginWalletSelector from "./compensation/OriginWalletSelector";
import AmountInput from "./compensation/AmountInput";
import ReasonInput from "./compensation/ReasonInput";
import NoMatchingWalletsAlert from "./compensation/NoMatchingWalletsAlert";

interface CompensateCustomerDialogProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (amount: string, reason: string, compensationType: 'credit' | 'adjustment', originWalletId: number) => void;
  companyWallets?: Wallet[];
}

const CompensateCustomerDialog: React.FC<CompensateCustomerDialogProps> = ({
  transaction,
  open,
  onOpenChange,
  onSubmit,
  companyWallets = [],
}) => {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [originWalletId, setOriginWalletId] = useState<string>("");
  const [errors, setErrors] = useState<{
    amount?: string; 
    reason?: string; 
    originWalletId?: string;
  }>({});
  
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  // Filter company wallets with the same currency as the customer's wallet
  const matchingCurrencyWallets = useMemo(() => {
    const customerCurrency = transaction.currency || "USD";
    return companyWallets.filter(wallet => wallet.currency === customerCurrency);
  }, [companyWallets, transaction.currency]);

  // Determine compensation type automatically based on amount sign
  const compensationType = useMemo(() => {
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue)) return 'credit';
    return amountValue >= 0 ? 'credit' : 'adjustment';
  }, [amount]);
  
  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setAmount("");
      setReason("");
      setOriginWalletId(matchingCurrencyWallets.length === 1 ? matchingCurrencyWallets[0].id.toString() : "");
      setErrors({});
    }
  }, [open, matchingCurrencyWallets]);

  const validateAmount = (value: string): string | undefined => {
    if (!value.trim() || isNaN(Number(value))) {
      return "please-enter-valid-amount";
    }
    
    const amountValue = Number(value);
    
    // Allow both positive and negative values
    if (amountValue === 0) {
      return "amount-cannot-be-zero";
    }
    
    return undefined;
  };

  const handleSubmit = () => {
    const newErrors: {
      amount?: string; 
      reason?: string; 
      originWalletId?: string;
    } = {};
    
    // Validate amount
    const amountError = validateAmount(amount);
    if (amountError) {
      newErrors.amount = amountError;
    }
    
    // Validate reason
    if (!reason.trim()) {
      newErrors.reason = "please-provide-reason";
    }
    
    // Validate origin wallet
    if (!originWalletId) {
      newErrors.originWalletId = "please-select-company-wallet";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(amount, reason, compensationType, parseInt(originWalletId));
  };

  const handleAmountChange = (newAmount: string) => {
    setAmount(newAmount);
    const error = validateAmount(newAmount);
    setErrors(prev => ({ ...prev, amount: error }));
  };

  const handleOriginWalletChange = (value: string) => {
    setOriginWalletId(value);
    setErrors(prev => ({ ...prev, originWalletId: undefined }));
  };

  const handleReasonChange = (value: string) => {
    setReason(value);
    if (value.trim()) {
      setErrors(prev => ({ ...prev, reason: undefined }));
    }
  };

  const hasMatchingWallets = matchingCurrencyWallets.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("compensate-customer")}</DialogTitle>
          <DialogDescription>
            {t("provide-compensation-description")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <CustomerInfo transaction={transaction} />
          
          {!hasMatchingWallets && <NoMatchingWalletsAlert />}
          
          <div className="space-y-4">
            <OriginWalletSelector 
              wallets={matchingCurrencyWallets}
              value={originWalletId}
              onChange={handleOriginWalletChange}
              error={errors.originWalletId}
              disabled={!hasMatchingWallets}
            />
            
            <AmountInput 
              value={amount}
              onChange={handleAmountChange}
              currency={transaction.currency || "USD"}
              error={errors.amount}
              disabled={!hasMatchingWallets}
            />

            {/* Show compensation type indicator */}
            {amount && !isNaN(parseFloat(amount)) && (
              <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
                <div className="font-medium">
                  {t("compensation-type")}: {compensationType === 'credit' ? t("credit") : t("adjustment")}
                </div>
                <div className="text-xs mt-1">
                  {compensationType === 'credit' 
                    ? t("credit-description") 
                    : t("adjustment-description")
                  }
                </div>
              </div>
            )}
            
            <ReasonInput 
              value={reason}
              onChange={handleReasonChange}
              error={errors.reason}
              disabled={!hasMatchingWallets}
            />
            
            <div className="text-sm text-muted-foreground">
              <p>{t("create-new-compensation-transaction")}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={!hasMatchingWallets}>
            {t("process-compensation")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompensateCustomerDialog;
