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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AlertCircle, CircleDollarSign, ArrowRightLeft } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  const validateAmount = (value: string, type: 'credit' | 'adjustment' | "") => {
    if (!value.trim() || isNaN(Number(value))) {
      return t("please-enter-valid-amount");
    }
    
    const amountValue = Number(value);
    
    if (type === 'credit' && amountValue <= 0) {
      return t("credit-must-be-positive");
    }
    
    return undefined;
  };

  const handleSubmit = () => {
    const newErrors: {
      amount?: string; 
      reason?: string; 
      compensationType?: string;
      originWalletId?: string;
    } = {};
    
    // Validate compensation type
    if (!compensationType) {
      newErrors.compensationType = t("please-select-compensation-type");
    }
    
    // Validate amount based on compensation type
    const amountError = validateAmount(amount, compensationType as 'credit' | 'adjustment');
    if (amountError) {
      newErrors.amount = amountError;
    }
    
    // Validate reason
    if (!reason.trim()) {
      newErrors.reason = t("please-provide-reason");
    }
    
    // Validate origin wallet
    if (!originWalletId) {
      newErrors.originWalletId = t("please-select-company-wallet");
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(amount, reason, compensationType as 'credit' | 'adjustment', parseInt(originWalletId));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    
    const error = validateAmount(value, compensationType as 'credit' | 'adjustment');
    setErrors(prev => ({ ...prev, amount: error }));
  };

  // Fixed function - it accepts one value parameter
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
          <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50 mb-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <CircleDollarSign size={16} className="text-blue-600" />
            </div>
            <div>
              <div className="font-medium">{t("customer-id")}: {transaction.customerId}</div>
              <div className="text-sm text-muted-foreground">
                {t("wallet-id")}: {transaction.walletId} - {t("currency")}: {transaction.currency || "USD"}
              </div>
            </div>
          </div>
          
          {!hasMatchingWallets && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t("no-matching-currency-wallets")}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("compensation-type")}</Label>
              <RadioGroup
                value={compensationType}
                onValueChange={handleCompensationTypeChange}
                className={`grid grid-cols-2 gap-2 ${errors.compensationType ? "border border-destructive rounded-md p-1" : ""}`}
                disabled={!hasMatchingWallets}
              >
                <div className="flex items-center space-x-2 rounded-md border p-2">
                  <RadioGroupItem value="credit" id="credit" disabled={!hasMatchingWallets} />
                  <Label htmlFor="credit" className="flex-1 cursor-pointer">{t("credit")}</Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-2">
                  <RadioGroupItem value="adjustment" id="adjustment" disabled={!hasMatchingWallets} />
                  <Label htmlFor="adjustment" className="flex-1 cursor-pointer">{t("adjustment")}</Label>
                </div>
              </RadioGroup>
              
              {errors.compensationType && (
                <div className="flex items-center text-sm text-destructive gap-1">
                  <AlertCircle size={12} /> {errors.compensationType}
                </div>
              )}
              
              <div className="text-xs text-muted-foreground mt-1">
                {compensationType === 'credit' && t("credit-description")}
                {compensationType === 'adjustment' && t("adjustment-description")}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="originWallet">{t("company-wallet")}</Label>
              {hasMatchingWallets && matchingCurrencyWallets.length === 1 ? (
                <div className="flex items-center gap-3 p-3 rounded-md border">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <ArrowRightLeft size={14} className="text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">{matchingCurrencyWallets[0].name || `${matchingCurrencyWallets[0].currency} Wallet`}</div>
                    <div className="text-sm text-muted-foreground">
                      ID: {matchingCurrencyWallets[0].id} | {matchingCurrencyWallets[0].currency}
                    </div>
                  </div>
                </div>
              ) : hasMatchingWallets ? (
                <>
                  <Select value={originWalletId} onValueChange={handleOriginWalletChange}>
                    <SelectTrigger className={errors.originWalletId ? "border-destructive" : ""}>
                      <SelectValue placeholder={t("select-company-wallet")} />
                    </SelectTrigger>
                    <SelectContent>
                      {matchingCurrencyWallets.map((wallet) => (
                        <SelectItem key={wallet.id} value={wallet.id.toString()}>
                          {wallet.name || `${wallet.currency} Wallet`} - ID: {wallet.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.originWalletId && (
                    <div className="flex items-center text-sm text-destructive gap-1">
                      <AlertCircle size={12} /> {errors.originWalletId}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-muted-foreground italic">
                  {t("no-matching-currency-wallets-available", "No company wallets with matching currency available.")}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">{t("compensation-amount")}</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">
                  {transaction.currency || 'USD'}
                </span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className={`pl-12 ${errors.amount ? "border-destructive" : ""}`}
                  value={amount}
                  onChange={handleAmountChange}
                  disabled={!hasMatchingWallets}
                />
              </div>
              
              {errors.amount && (
                <div className="flex items-center text-sm text-destructive gap-1">
                  <AlertCircle size={12} /> {errors.amount}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">{t("reason-for-compensation")}</Label>
              <Textarea
                id="reason"
                placeholder={t("explain-compensation-reason")}
                className={errors.reason ? "border-destructive" : ""}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (e.target.value.trim()) {
                    setErrors(prev => ({ ...prev, reason: undefined }));
                  }
                }}
                disabled={!hasMatchingWallets}
              />
              
              {errors.reason && (
                <div className="flex items-center text-sm text-destructive gap-1">
                  <AlertCircle size={12} /> {errors.reason}
                </div>
              )}
            </div>
            
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
