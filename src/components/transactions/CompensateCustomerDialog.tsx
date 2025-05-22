
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
import CompensationType from "./compensation/CompensationType";
import OriginWalletSelector from "./compensation/OriginWalletSelector";
import AmountInput from "./compensation/AmountInput";
import ReasonInput from "./compensation/ReasonInput";
import NoMatchingWalletsAlert from "./compensation/NoMatchingWalletsAlert";
import { validateAmount } from "./compensation/validation";

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
  const [compensationType, setCompensationType] = useState<'credit' | 'adjustment' | "">("");
  const [originWalletId, setOriginWalletId] = useState<string>("");
  const [errors, setErrors] = useState<{
    amount?: string; 
    reason?: string; 
    compensationType?: string;
    originWalletId?: string;
  }>({});
  
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  // Filter company wallets with the same currency as the customer's wallet
  const matchingCurrencyWallets = useMemo(() => {
    const customerCurrency = transaction.currency || "USD";
    return companyWallets.filter(wallet => wallet.currency === customerCurrency);
  }, [companyWallets, transaction.currency]);
  
  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setAmount("");
      setReason("");
      setCompensationType("");
      setOriginWalletId(matchingCurrencyWallets.length === 1 ? matchingCurrencyWallets[0].id.toString() : "");
      setErrors({});
    }
  }, [open, matchingCurrencyWallets]);

  const handleSubmit = () => {
    const newErrors: {
      amount?: string; 
      reason?: string; 
      compensationType?: string;
      originWalletId?: string;
    } = {};
    
    // Validate compensation type
    if (!compensationType) {
      newErrors.compensationType = "please-select-compensation-type";
    }
    
    // Validate amount based on compensation type
    const amountError = validateAmount(amount, compensationType as 'credit' | 'adjustment');
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
    
    onSubmit(amount, reason, compensationType as 'credit' | 'adjustment', parseInt(originWalletId));
  };

  const handleAmountChange = (newAmount: string) => {
    setAmount(newAmount);
    const error = validateAmount(newAmount, compensationType as 'credit' | 'adjustment');
    setErrors(prev => ({ ...prev, amount: error }));
  };

  const handleCompensationTypeChange = (value: string) => {
    setCompensationType(value as 'credit' | 'adjustment');
    
    // Re-validate amount when compensation type changes
    const error = validateAmount(amount, value as 'credit' | 'adjustment');
    setErrors(prev => ({ ...prev, amount: error, compensationType: undefined }));
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
            <CompensationType 
              value={compensationType}
              onChange={handleCompensationTypeChange}
              error={errors.compensationType}
              disabled={!hasMatchingWallets}
            />
            
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
