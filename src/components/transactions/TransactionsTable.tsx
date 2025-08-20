
import React from "react";
import { Transaction } from "@/lib/api/types";
import { MoreVertical, Eye, RefreshCw, CircleDollarSign } from "lucide-react";
import { 
  getTranslatedStatusBadge, 
  getTranslatedTypeBadge, 
  getTranslatedTransactionTypeBadge, 
  formatCurrency 
} from "./transaction-utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { formatTimeDifference } from "@/lib/date-utils";
import { usePermissions } from "@/hooks/use-permissions";
import { useToast } from "@/hooks/use-toast";

interface TransactionsTableProps {
  transactions: Transaction[];
  page: number;
  pageSize: number;
  handleViewDetails: (transaction: Transaction) => void;
  handleCancelTransaction: (transaction: Transaction) => void;
  handleCompensateCustomer: (transaction: Transaction) => void;
  handleChangeStatus?: (transaction: Transaction) => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  page,
  pageSize,
  handleViewDetails,
  handleCancelTransaction,
  handleCompensateCustomer,
  handleChangeStatus,
}) => {
  const { settings, formatDateTime, getTimezoneFromOffset } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const locale = settings.language === "en" ? "en-US" : "es-ES";
  const { canChangeTransactionStatus } = usePermissions();
  const { toast } = useToast();
  
  const handleRestrictedAction = (actionType: string) => {
    toast({
      title: t("access-denied"),
      description: t(`only-compensator-can-${actionType}`),
      variant: "destructive",
    });
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("status")}</TableHead>
            <TableHead>{t("date")}</TableHead>
            <TableHead>{t("movement-type")}</TableHead>
            <TableHead>{t("transaction-type")}</TableHead>
            <TableHead>{t("amount")}</TableHead>
            <TableHead>{t("transaction-id")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions && transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {getTranslatedStatusBadge(transaction.status, settings.language)}
                </TableCell>
                <TableCell>
                  {transaction.date ? (
                    <>
                      <div className="font-medium">
                        {formatDateTime(new Date(transaction.date))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimeDifference(
                          new Date(transaction.date), 
                          locale,
                          getTimezoneFromOffset(settings.utcOffset)
                        )}
                      </div>
                    </>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  {getTranslatedTypeBadge(transaction.movementType || "unknown", settings.language)}
                </TableCell>
                <TableCell>
                  {getTranslatedTransactionTypeBadge(transaction.additionalInfo?.payment_type || transaction.transactionType || transaction.type || "unknown", settings.language)}
                </TableCell>
                <TableCell>
                  <div className={`font-medium ${(transaction.movementType === 'deposit' || transaction.movementType === 'INCOME') ? 'text-green-600' : transaction.movementType === 'OUTCOME' ? 'text-red-600' : ''}`}>
                    {formatCurrency(transaction.amount, transaction.currency, locale)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{transaction.transactionId || transaction.id}</div>
                  {transaction.reference && (
                    <div className="text-xs text-muted-foreground">
                      {t("reference")}: {transaction.reference}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleViewDetails(transaction)}>
                        <Eye size={16} className="mr-2" /> {t("view")} {t("details")}
                      </DropdownMenuItem>
                      {transaction.status?.toLowerCase() === "pending" && handleChangeStatus && (
                        <DropdownMenuItem 
                          onClick={() => canChangeTransactionStatus() 
                            ? handleChangeStatus(transaction)
                            : handleRestrictedAction("change-status")
                          }
                          className="text-amber-600"
                        >
                          <RefreshCw size={16} className="mr-2" /> {t("change")} {t("status")}
                        </DropdownMenuItem>
                      )}
                      {canChangeTransactionStatus() && (
                        <DropdownMenuItem 
                          onClick={() => handleCompensateCustomer(transaction)}
                        >
                          <CircleDollarSign size={16} className="mr-2" /> {t("compensate")} {t("customer")}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                {t("no-transactions-found")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable;
