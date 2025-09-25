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

            {/* Basic Information - Always Visible */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Info className="h-5 w-5" />
                {t("basic-information")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    {t("transaction-date")}
                  </Label>
                  <p className="text-sm font-medium">
                    {transactionData?.date ? formatDateTime(transactionData.date) : "-"}
                  </p>
                </div>
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
                  <p className="text-sm font-medium">{transactionData?.currency || "-"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    {t("transaction-type")}
                  </Label>
                  <p className="text-sm">
                    <Badge variant="outline">
                      {transactionData?.transactionType || "-"}
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
            </div>

            {/* Additional Information from additional_info */}
            {transactionData?.additionalInfo && Object.keys(transactionData.additionalInfo).length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="additional-info">
                  <AccordionTrigger className="text-lg font-medium">
                    <div className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      {t("additional-information")}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      {Object.entries(transactionData.additionalInfo).map(([key, value]) => (
                        <div key={key}>
                          <Label className="text-sm font-medium text-muted-foreground capitalize">
                            {key.replace(/_/g, ' ')}
                          </Label>
                          <p className="text-sm break-words">
                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}