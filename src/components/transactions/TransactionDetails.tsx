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
  Info, 
  Clock, 
  DollarSign, 
  User,
  QrCode,
  AlertTriangle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface TransactionDetailsProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TransactionDetails({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailsProps) {
  const { settings, formatDateTime } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  const formatCurrency_ = (amount?: number, currency?: string) => {
    if (amount === undefined || amount === null) return "-";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  // Helper function to get the actual transaction data (handles both formats)
  const getTransactionData = () => {
    const transactionId = transaction?.transactionId || transaction?.transaction_id;
    const movementType = transaction?.movementType || transaction?.movement_type;
    const transactionType = transaction?.transactionType || transaction?.transaction_type;
    const transactionDate = transaction?.transaction_date 
      ? new Date(transaction.transaction_date)
      : transaction?.date 
      ? new Date(transaction.date)
      : null;
    
    // Handle payment object for QR payments
    const amount = transaction?.payment?.value 
      ? parseFloat(transaction.payment.value)
      : transaction?.amount;
    const currency = transaction?.payment?.currency || transaction?.currency;

    return {
      ...transaction,
      transactionId,
      movementType,
      transactionType,
      date: transactionDate,
      amount,
      currency,
    };
  };

  const transactionData = getTransactionData();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("transaction-details")} - {transactionData.transactionId}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Warning for cancelled/failed transactions */}
            {(transactionData?.status === 'cancelled' || transactionData?.status === 'failed' || 
              transactionData?.status === 'CANCELLED' || transactionData?.status === 'FAILED') && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {t("transaction-warning")}
                </AlertDescription>
              </Alert>
            )}

            <Accordion type="single" collapsible defaultValue="financial" className="w-full">
              {/* Financial Information */}
              <AccordionItem value="financial">
                <AccordionTrigger className="text-lg font-medium">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    {t("financial-information")}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {t("amount")}
                      </Label>
                      <p className="text-lg font-semibold">
                        {formatCurrency_(transactionData?.amount, transactionData?.currency)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {t("currency")}
                      </Label>
                      <p className="text-sm">{transactionData?.currency || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {t("movement-type")}
                      </Label>
                      <p className="text-sm">
                        <Badge variant={transactionData?.movementType === 'INCOME' ? 'default' : 'secondary'}>
                          {t(transactionData?.movementType?.toLowerCase() || 'unknown')}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {t("status")}
                      </Label>
                      <p className="text-sm">
                        <Badge 
                          variant={
                            transactionData?.status?.toLowerCase() === 'completed' || transactionData?.status === 'COMPLETED' ? 'default' : 
                            transactionData?.status?.toLowerCase() === 'pending' || transactionData?.status === 'PENDING' ? 'secondary' : 
                            'destructive'
                          }
                        >
                          {t(transactionData?.status?.toLowerCase() || 'unknown')}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Account Information */}
              <AccordionItem value="account">
                <AccordionTrigger className="text-lg font-medium">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {translate("account-information")}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {translate("customer-id")}
                      </Label>
                      <p className="text-sm">{transactionData?.customerId || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {translate("wallet-id")}
                      </Label>
                      <p className="text-sm">{transactionData?.walletId || "-"}</p>
                    </div>
                    {transactionData?.additionalInfo?.original_customer_id && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          {translate("original-customer-id")}
                        </Label>
                        <p className="text-sm">{transactionData.additionalInfo.original_customer_id}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Basic Information */}
              <AccordionItem value="basic">
                <AccordionTrigger className="text-lg font-medium">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    {translate("basic-information")}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 gap-4 pt-2">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {translate("transaction-id")}
                      </Label>
                      <p className="text-sm font-mono">{transactionData?.transactionId || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {translate("reference")}
                      </Label>
                      <p className="text-sm">{transactionData?.reference || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {translate("transaction-type")}
                      </Label>
                      <p className="text-sm">
                        <Badge variant="outline">
                          {transactionData?.transactionType || "-"}
                        </Badge>
                      </p>
                    </div>
                    {transactionData?.additionalInfo?.reference_id && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          {translate("reference-id")}
                        </Label>
                        <p className="text-sm font-mono">{transactionData.additionalInfo.reference_id}</p>
                      </div>
                    )}
                    {transactionData?.additionalInfo?.coelsa_id && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          {translate("coelsa-id")}
                        </Label>
                        <p className="text-sm font-mono">{transactionData.additionalInfo.coelsa_id}</p>
                      </div>
                    )}
                    {transactionData?.additionalInfo?.code_id && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          {translate("code-id")}
                        </Label>
                        <p className="text-sm font-mono">{transactionData.additionalInfo.code_id}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Date and Time */}
              <AccordionItem value="datetime">
                <AccordionTrigger className="text-lg font-medium">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {translate("date-time")}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 gap-4 pt-2">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        {translate("transaction-date")}
                      </Label>
                      <p className="text-sm">
                        {transactionData?.date ? formatDateTime(transactionData.date) : "-"}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Status Change History */}
              {transactionData?.statusHistory && transactionData.statusHistory.length > 0 && (
                <AccordionItem value="status-history">
                  <AccordionTrigger className="text-lg font-medium">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      {translate("status-change-history")}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      {transactionData.statusHistory.map((change, index) => (
                        <div key={index} className="p-3 border rounded-md bg-muted/50">
                          <div className="flex justify-between items-center mb-2">
                            <Badge variant="outline">
                              {change.oldStatus} → {change.newStatus}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDateTime(new Date(change.changedAt))}
                            </span>
                          </div>
                          <div className="text-sm">
                            <strong>Reason:</strong> {change.reason}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Changed by: {change.changedBy}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Compensation Details */}
              {(transactionData?.transactionType === 'compensation' || transactionData?.transactionType === 'compensacion') && (
                <AccordionItem value="compensation">
                  <AccordionTrigger className="text-lg font-medium">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      {translate("compensation-details")}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        {translate("compensation-reason")}
                      </Label>
                      <p className="text-sm">{transactionData?.reference || translate("reason-not-provided")}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* QR Payment Details */}
              {(transactionData?.transactionType === 'Pago con QR' || transactionData?.additionalInfo?.payment_type === 'qr_payment') && (
                <AccordionItem value="qr-payment">
                  <AccordionTrigger className="text-lg font-medium">
                    <div className="flex items-center gap-2">
                      <QrCode className="h-5 w-5" />
                      {translate("qr-payment-details")}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6 pt-2">
                      {/* Acceptor Information */}
                      {transactionData?.additionalInfo?.resolver && (
                        <div>
                          <Label className="text-sm font-semibold text-muted-foreground mb-2 block">
                            {translate("acceptor-information")}
                          </Label>
                          <div className="grid grid-cols-2 gap-4 pl-4">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">
                                {translate("resolver")}
                              </Label>
                              <p className="text-sm">{transactionData.additionalInfo.resolver}</p>
                            </div>
                            {transactionData?.additionalInfo?.mcc && (
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                  {translate("mcc")}
                                </Label>
                                <p className="text-sm">{transactionData.additionalInfo.mcc}</p>
                              </div>
                            )}
                            {transactionData?.additionalInfo?.branch && (
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                  {translate("branch")}
                                </Label>
                                <p className="text-sm">{transactionData.additionalInfo.branch}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Destination Information */}
                      {(transactionData?.additionalInfo?.destination_cbu || transactionData?.additionalInfo?.destination_cuit) && (
                        <div>
                          <Label className="text-sm font-semibold text-muted-foreground mb-2 block">
                            {translate("destination-information")}
                          </Label>
                          <div className="grid grid-cols-2 gap-4 pl-4">
                            {transactionData?.additionalInfo?.destination_cbu && (
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                  {translate("destination-cbu")}
                                </Label>
                                <p className="text-sm font-mono">{transactionData.additionalInfo.destination_cbu}</p>
                              </div>
                            )}
                            {transactionData?.additionalInfo?.destination_cuit && (
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                  {translate("destination-cuit")}
                                </Label>
                                <p className="text-sm font-mono">{transactionData.additionalInfo.destination_cuit}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Legacy QR fields for backward compatibility */}
                      {transactionData?.additionalInfo?.qr_code && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            {translate("qr-code")}
                          </Label>
                          <p className="text-sm font-mono">{transactionData.additionalInfo.qr_code}</p>
                        </div>
                      )}
                      {transactionData?.additionalInfo?.destination_account && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            {translate("destination-account")}
                          </Label>
                          <p className="text-sm">{transactionData.additionalInfo.destination_account}</p>
                        </div>
                      )}
                      {transactionData?.additionalInfo?.merchant_info && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            {translate("merchant-info")}
                          </Label>
                          <p className="text-sm">{transactionData.additionalInfo.merchant_info}</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}