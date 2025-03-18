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

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError("Please provide a reason for cancellation");
      return;
    }
    
    onSubmit(reason);
    setReason("");
    setError("");
  };

  const formatCurrency = (amount?: number, currency?: string) => {
    if (amount === undefined) return '-';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Transaction</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this transaction? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50 mb-4">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <XCircle size={16} className="text-amber-600" />
            </div>
            <div>
              <div className="font-medium">Transaction ID: {transaction.transactionId}</div>
              <div className="text-sm text-muted-foreground">
                Amount: {formatCurrency(transaction.amount, transaction.currency)}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="reason">Reason for Cancellation</Label>
            <Textarea
              id="reason"
              placeholder="Please explain why you're cancelling this transaction..."
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
              <p>Note: Only pending transactions can be cancelled.</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleSubmit}>
            Confirm Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelTransactionDialog;
