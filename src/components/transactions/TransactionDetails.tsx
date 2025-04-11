
import React from "react";
import { Transaction } from "@/lib/api/types";
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
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

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
  const { settings, formatDate, formatDateTime } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
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
          <DialogTitle>{t("transaction-details")}</DialogTitle>
          <DialogDescription>
            {t("complete-information-for-transaction")} {transaction.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {/* Transaction Status */}
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
            <div className="font-medium">{t("status")}</div>
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
              {t(transaction.status?.toLowerCase() || 'unknown')}
            </Badge>
          </div>
          
          {/* Transaction ID Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText size={14} />
              <span>{t("transaction-information")}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 p-3 border rounded-md">
              <div className="text-sm font-medium">{t("transaction-id")}</div>
              <div className="text-sm">{transaction.id}</div>
              
              {transaction.originalTransactionId && (
                <>
                  <div className="text-sm font-medium">{t("original-transaction-id")}</div>
                  <div className="text-sm">{transaction.originalTransactionId}</div>
                </>
              )}
              
              {transaction.originTransactionId && (
                <>
                  <div className="text-sm font-medium">{t("origin-transaction-id")}</div>
                  <div className="text-sm">{transaction.originTransactionId}</div>
                </>
              )}
              
              {transaction.destinationTransactionId && (
                <>
                  <div className="text-sm font-medium">{t("destination-transaction-id")}</div>
                  <div className="text-sm">{transaction.destinationTransactionId}</div>
                </>
              )}
              
              {transaction.reference && (
                <>
                  <div className="text-sm font-medium">{t("reference")}</div>
                  <div className="text-sm">{transaction.reference}</div>
                </>
              )}
            </div>
          </div>
          
          {/* Transaction Details */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tag size={14} />
              <span>{t("transaction-details")}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 p-3 border rounded-md">
              <div className="text-sm font-medium">{t("type")}</div>
              <div className="text-sm capitalize">{t(transaction.movementType?.toLowerCase() || 'unknown')}</div>
              
              <div className="text-sm font-medium">{t("amount")}</div>
              <div className="text-sm font-semibold">
                {formatCurrency(transaction.amount, transaction.currency)}
              </div>
              
              <div className="text-sm font-medium">{t("currency")}</div>
              <div className="text-sm">{transaction.currency || t('unknown')}</div>
              
              <div className="text-sm font-medium">{t("transaction-type")}</div>
              <div className="text-sm">{t(transaction.transactionType?.toLowerCase() || 'standard')}</div>
            </div>
          </div>
          
          {/* User & Wallet Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User size={14} />
              <span>{t("user-wallet-information")}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 p-3 border rounded-md">
              <div className="text-sm font-medium">{t("customer-id")}</div>
              <div className="text-sm">{transaction.customerId}</div>
              
              <div className="text-sm font-medium">{t("wallet-id")}</div>
              <div className="text-sm">{transaction.walletId}</div>
            </div>
          </div>
          
          {/* Date Information */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={14} />
              <span>{t("date-information")}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 p-3 border rounded-md">
              {transaction.date && (
                <>
                  <div className="text-sm font-medium">{t("transaction-date")}</div>
                  <div className="text-sm">
                    {formatDateTime(new Date(transaction.date))}
                  </div>
                </>
              )}
              
              {transaction.initDate && (
                <>
                  <div className="text-sm font-medium">{t("initiated-date")}</div>
                  <div className="text-sm">
                    {formatDateTime(new Date(transaction.initDate))}
                  </div>
                </>
              )}
              
              {transaction.endDate && (
                <>
                  <div className="text-sm font-medium">{t("end-date")}</div>
                  <div className="text-sm">
                    {formatDateTime(new Date(transaction.endDate))}
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Flow Visualization */}
          {(transaction.transactionType === 'TRANSFER_CASH_IN' || transaction.transactionType === 'TRANSFER_CASH_OUT') && (
            <div className="p-4 mt-4 border rounded-md">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <Wallet className="h-8 w-8 mx-auto text-primary" />
                  <div className="mt-1 text-sm font-medium">{t("origin-wallet")}</div>
                  <div className="text-xs text-muted-foreground">
                    {t("id")}: {transaction.walletId}
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
                  <div className="mt-1 text-sm font-medium">{t("destination-wallet")}</div>
                  <div className="text-xs text-muted-foreground">
                    {t("id")}: {transaction.destinationTransactionId || t('unknown')}
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
                  {transaction.status === 'cancelled' ? t('transaction-cancelled') : t('transaction-failed')}
                </div>
                <div className="text-xs text-red-700">
                  {t("transaction-status-no-funds")}
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
