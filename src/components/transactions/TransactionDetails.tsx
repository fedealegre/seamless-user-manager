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
  AlertCircle,
  MessageSquare,
  Building,
  CreditCard,
  MapPin,
  Receipt
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { getTranslatedStatusBadge } from "./transaction-utils";

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

  // Check if this is a compensation transaction
  const isCompensation = transaction.transactionType?.toLowerCase() === 'compensacion' || 
                         transaction.transactionType?.toLowerCase() === 'compensation';

  // Determine compensation type and format the reason for display
  const getCompensationReason = () => {
    if (!isCompensation || !transaction.reference) {
      return transaction.reference || t("reason-not-provided");
    }

    // Determine if it's credit or debit based on amount
    const amount = transaction.amount || 0;
    const compensationType = amount >= 0 ? "Crédito" : "Débito";
    
    return `${compensationType}, ${transaction.reference}`;
  };

  // Get additional info safely
  const additionalInfo = transaction.additionalInfo || {};
  const paymentType = additionalInfo.payment_type;
  
  // Helper function to render field if value exists
  const renderField = (label: string, value: string | undefined) => {
    if (!value || value === 'N/A') return null;
    return (
      <>
        <div className="text-sm font-medium">{t(label)}</div>
        <div className="text-sm">{value}</div>
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("transaction-details-title")}</DialogTitle>
          <DialogDescription>
            {t("transaction-details-description")} {transaction.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {/* Transaction Status */}
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
            <div className="font-medium">{t("status")}</div>
            {getTranslatedStatusBadge(transaction.status, settings.language)}
          </div>
          
          {/* Basic Information */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText size={14} />
              <span>{t("basic-information")}</span>
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
          
          {/* Financial Information */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign size={14} />
              <span>{t("financial-information")}</span>
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
          
          {/* Account Information */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User size={14} />
              <span>{t("account-information")}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 p-3 border rounded-md">
              <div className="text-sm font-medium">{t("customer-id")}</div>
              <div className="text-sm">{transaction.customerId}</div>
              
              <div className="text-sm font-medium">{t("wallet-id")}</div>
              <div className="text-sm">{transaction.walletId}</div>
            </div>
          </div>
          
          {/* Date and Time Information */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={14} />
              <span>{t("date-and-time")}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 p-3 border rounded-md">
              {transaction.date && (
                <>
                  <div className="text-sm font-medium">{t("transaction-created-date")}</div>
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
          
          {/* Compensation Details - Only show for compensation transactions */}
          {isCompensation && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare size={14} />
                <span>{t("compensation-details")}</span>
              </div>
              
              <div className="p-3 border rounded-md bg-blue-50/50">
                <div className="text-sm font-medium mb-2">{t("compensation-reason")}</div>
                <div className="text-sm text-muted-foreground">
                  {getCompensationReason()}
                </div>
              </div>
            </div>
          )}
          
          {/* P2P Transfer Details */}
          {paymentType === 'TRANSFER_P2P' && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ArrowRight size={14} />
                <span>{t("transfer-details")}</span>
              </div>
              
              <div className="grid grid-cols-1 gap-4 p-3 border rounded-md">
                {/* Origin Information */}
                {(additionalInfo.receipt_origin_full_name || additionalInfo.receipt_origin_cbu || additionalInfo.receipt_origin_cuit) && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                      <User size={14} />
                      <span>{t("origin-information")}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 ml-4">
                      {renderField("origin-full-name", additionalInfo.receipt_origin_full_name)}
                      {renderField("origin-cbu", additionalInfo.receipt_origin_cbu)}
                      {renderField("origin-cuit", additionalInfo.receipt_origin_cuit)}
                      {renderField("origin-account", additionalInfo.receipt_origin_account)}
                      {renderField("origin-entity", additionalInfo.receipt_origin_entity)}
                    </div>
                  </div>
                )}
                
                {/* Destination Information */}
                {(additionalInfo.receipt_destiny_full_name || additionalInfo.receipt_destiny_cbu || additionalInfo.receipt_destiny_cuit) && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                      <User size={14} />
                      <span>{t("destination-information")}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 ml-4">
                      {renderField("destination-full-name", additionalInfo.receipt_destiny_full_name)}
                      {renderField("destination-cbu", additionalInfo.receipt_destiny_cbu)}
                      {renderField("destination-cuit", additionalInfo.receipt_destiny_cuit)}
                      {renderField("destination-entity", additionalInfo.receipt_destiny_entity)}
                    </div>
                  </div>
                )}
                
                {/* Receipt Information */}
                {(additionalInfo.receipt_concept || additionalInfo.receipt_description) && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                      <Receipt size={14} />
                      <span>{t("receipt-information")}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 ml-4">
                      {renderField("receipt-concept", additionalInfo.receipt_concept)}
                      {renderField("receipt-description", additionalInfo.receipt_description)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* QR Payment Details */}
          {paymentType === 'QR_PAYMENT' && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard size={14} />
                <span>{t("payment-details")}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 p-3 border rounded-md">
                {renderField("merchant-code", additionalInfo.mcc)}
                {renderField("merchant-address", additionalInfo.address)}
                {renderField("account-type", additionalInfo.accountType)}
                {renderField("account-number", additionalInfo.accountNumber)}
                {renderField("internal-transaction-id", additionalInfo.internal_transaction_id)}
              </div>
            </div>
          )}

          {/* Entity Information */}
          {additionalInfo.entity && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building size={14} />
                <span>{t("entity-details")}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 p-3 border rounded-md">
                {renderField("financial-entity", additionalInfo.entity)}
                {renderField("payment-method", paymentType)}
              </div>
            </div>
          )}

          {/* Enhanced Flow Visualization */}
          {paymentType === 'TRANSFER_P2P' && additionalInfo.receipt_origin_full_name && additionalInfo.receipt_destiny_full_name && (
            <div className="p-4 mt-4 border rounded-md">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <User className="h-8 w-8 mx-auto text-primary" />
                  <div className="mt-1 text-sm font-medium">{t("origin-information")}</div>
                  <div className="text-xs text-muted-foreground max-w-[120px] mx-auto break-words">
                    {additionalInfo.receipt_origin_full_name}
                  </div>
                  {additionalInfo.receipt_origin_cbu && (
                    <div className="text-xs text-muted-foreground mt-1">
                      CBU: {additionalInfo.receipt_origin_cbu.slice(-6)}...
                    </div>
                  )}
                </div>
                
                <div className="flex-1 flex justify-center">
                  <div className="relative">
                    <ArrowRight className="h-6 w-6 text-primary" />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium bg-muted px-2 py-1 rounded whitespace-nowrap">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </div>
                  </div>
                </div>
                
                <div className="text-center flex-1">
                  <User className="h-8 w-8 mx-auto text-primary" />
                  <div className="mt-1 text-sm font-medium">{t("destination-information")}</div>
                  <div className="text-xs text-muted-foreground max-w-[120px] mx-auto break-words">
                    {additionalInfo.receipt_destiny_full_name}
                  </div>
                  {additionalInfo.receipt_destiny_cbu && (
                    <div className="text-xs text-muted-foreground mt-1">
                      CBU: {additionalInfo.receipt_destiny_cbu.slice(-6)}...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* QR Payment Flow */}
          {paymentType === 'QR_PAYMENT' && (
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
                  <CreditCard className="h-8 w-8 mx-auto text-primary" />
                  <div className="mt-1 text-sm font-medium">{t("merchant-information")}</div>
                  <div className="text-xs text-muted-foreground">
                    MCC: {additionalInfo.mcc || t('unknown')}
                  </div>
                  {additionalInfo.address && (
                    <div className="text-xs text-muted-foreground">
                      {additionalInfo.address}
                    </div>
                  )}
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
