
import React from "react";
import { Transaction } from "@/lib/api-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  Tag,
  User,
  Wallet,
  ArrowRight,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface TransactionDetailsProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  transaction,
  open,
  onOpenChange,
}) => {
  const formatCurrency = (amount?: number, currency?: string) => {
    if (amount === undefined) return '-';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Complete information for transaction {transaction.transactionId}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {/* Transaction Status */}
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
            <div className="font-medium">Status</div>
            <Badge 
              variant={
                transaction.status?.toLowerCase() === 'completed' ? 'outline' : 
                transaction.status?.toLowerCase() === 'pending' ? 'secondary' : 
                'destructive'
              }
              className={
                transaction.status?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                transaction.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : 
                ''
              }
            >
              {transaction.status || 'Unknown'}
            </Badge>
          </div>
          
          {/* Transaction ID Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText size={14} />
              <span>Transaction Information</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 p-3 border rounded-md">
              <div className="text-sm font-medium">Transaction ID</div>
              <div className="text-sm">{transaction.transactionId}</div>
              
              {transaction.originalTransactionId && (
                <>
                  <div className="text-sm font-medium">Original Transaction ID</div>
                  <div className="text-sm">{transaction.originalTransactionId}</div>
                </>
              )}
              
              {transaction.originTransactionId && (
                <>
                  <div className="text-sm font-medium">Origin Transaction ID</div>
                  <div className="text-sm">{transaction.originTransactionId}</div>
                </>
              )}
              
              {transaction.destinationTransactionId && (
                <>
                  <div className="text-sm font-medium">Destination Transaction ID</div>
                  <div className="text-sm">{transaction.destinationTransactionId}</div>
                </>
              )}
              
              {transaction.reference && (
                <>
                  <div className="text-sm font-medium">Reference</div>
                  <div className="text-sm">{transaction.reference}</div>
                </>
              )}
            </div>
          </div>
          
          {/* Transaction Details */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tag size={14} />
              <span>Transaction Details</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 p-3 border rounded-md">
              <div className="text-sm font-medium">Type</div>
              <div className="text-sm capitalize">{transaction.type || 'Unknown'}</div>
              
              <div className="text-sm font-medium">Amount</div>
              <div className="text-sm font-semibold">
                {formatCurrency(transaction.amount, transaction.currency)}
              </div>
              
              <div className="text-sm font-medium">Currency</div>
              <div className="text-sm">{transaction.currency || 'Unknown'}</div>
              
              <div className="text-sm font-medium">Transaction Type</div>
              <div className="text-sm">{transaction.transactionType || 'Standard'}</div>
            </div>
          </div>
          
          {/* User & Wallet Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User size={14} />
              <span>User & Wallet Information</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 p-3 border rounded-md">
              <div className="text-sm font-medium">Customer ID</div>
              <div className="text-sm">{transaction.customerId}</div>
              
              <div className="text-sm font-medium">Wallet ID</div>
              <div className="text-sm">{transaction.walletId}</div>
            </div>
          </div>
          
          {/* Date Information */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={14} />
              <span>Date Information</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 p-3 border rounded-md">
              {transaction.date && (
                <>
                  <div className="text-sm font-medium">Transaction Date</div>
                  <div className="text-sm">
                    {new Date(transaction.date).toLocaleString()}
                  </div>
                </>
              )}
              
              {transaction.initDate && (
                <>
                  <div className="text-sm font-medium">Initiated Date</div>
                  <div className="text-sm">
                    {new Date(transaction.initDate).toLocaleString()}
                  </div>
                </>
              )}
              
              {transaction.endDate && (
                <>
                  <div className="text-sm font-medium">End Date</div>
                  <div className="text-sm">
                    {new Date(transaction.endDate).toLocaleString()}
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Flow Visualization */}
          {transaction.type === 'transfer' && (
            <div className="p-4 mt-4 border rounded-md">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <Wallet className="h-8 w-8 mx-auto text-primary" />
                  <div className="mt-1 text-sm font-medium">Origin Wallet</div>
                  <div className="text-xs text-muted-foreground">
                    ID: {transaction.walletId}
                  </div>
                </div>
                
                <div className="flex-1 flex justify-center">
                  <div className="relative">
                    <ArrowRight className="h-6 w-6 text-primary" />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium bg-muted px-2 py-1 rounded whitespace-nowrap">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Wallet className="h-8 w-8 mx-auto text-primary" />
                  <div className="mt-1 text-sm font-medium">Destination Wallet</div>
                  <div className="text-xs text-muted-foreground">
                    ID: {transaction.destinationTransactionId || 'Unknown'}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Warning for cancelled or failed transactions */}
          {(transaction.status?.toLowerCase() === 'cancelled' || transaction.status?.toLowerCase() === 'failed') && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-red-800">
                  {transaction.status === 'cancelled' ? 'Transaction Cancelled' : 'Transaction Failed'}
                </div>
                <div className="text-xs text-red-700">
                  This transaction has been {transaction.status?.toLowerCase()}. No funds were transferred.
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetails;
