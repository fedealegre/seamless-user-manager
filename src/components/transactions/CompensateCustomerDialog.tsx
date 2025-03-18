
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
import { Input } from "@/components/ui/input";
import { AlertCircle, CircleDollarSign } from "lucide-react";

interface CompensateCustomerDialogProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (amount: string, reason: string) => void;
}

const CompensateCustomerDialog: React.FC<CompensateCustomerDialogProps> = ({
  transaction,
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<{amount?: string; reason?: string}>({});

  const handleSubmit = () => {
    const newErrors: {amount?: string; reason?: string} = {};
    
    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Please enter a valid positive amount";
    }
    
    if (!reason.trim()) {
      newErrors.reason = "Please provide a reason for compensation";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(amount, reason);
    setAmount("");
    setReason("");
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compensate Customer</DialogTitle>
          <DialogDescription>
            Provide compensation to the customer related to this transaction.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50 mb-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <CircleDollarSign size={16} className="text-blue-600" />
            </div>
            <div>
              <div className="font-medium">Customer ID: {transaction.customerId}</div>
              <div className="text-sm text-muted-foreground">
                Wallet ID: {transaction.walletId}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Compensation Amount</Label>
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
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (e.target.value.trim() && !isNaN(Number(e.target.value)) && Number(e.target.value) > 0) {
                      setErrors((prev) => ({ ...prev, amount: undefined }));
                    }
                  }}
                />
              </div>
              
              {errors.amount && (
                <div className="flex items-center text-sm text-destructive gap-1">
                  <AlertCircle size={12} /> {errors.amount}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Compensation</Label>
              <Textarea
                id="reason"
                placeholder="Explain why this compensation is being provided..."
                className={errors.reason ? "border-destructive" : ""}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (e.target.value.trim()) {
                    setErrors((prev) => ({ ...prev, reason: undefined }));
                  }
                }}
              />
              
              {errors.reason && (
                <div className="flex items-center text-sm text-destructive gap-1">
                  <AlertCircle size={12} /> {errors.reason}
                </div>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>This will create a new compensation transaction in the customer's wallet.</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Process Compensation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompensateCustomerDialog;
