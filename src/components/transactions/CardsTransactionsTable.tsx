import React from "react";
import { Transaction, Card } from "@/lib/api-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, Ban, DollarSign, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { formatCurrency, getTranslatedStatusBadge, getTranslatedTypeBadge, getTranslatedTransactionTypeBadge } from "@/components/transactions/transaction-utils";
import { usePermissions } from "@/hooks/use-permissions";
import { useToast } from "@/hooks/use-toast";

interface CardsTransactionsTableProps {
  transactions: Transaction[];
  cards: Card[];
  page: number;
  pageSize: number;
  onViewDetails: (transaction: Transaction) => void;
  onCancel?: (transaction: Transaction) => void;
  onCompensate?: (transaction: Transaction) => void;
  onChangeStatus?: (transaction: Transaction) => void;
}

const CardsTransactionsTable: React.FC<CardsTransactionsTableProps> = ({
  transactions,
  cards,
  page,
  pageSize,
  onViewDetails,
  onCancel,
  onCompensate,
  onChangeStatus,
}) => {
  const { settings, formatDateTime } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const { canChangeTransactionStatus, canCancelTransaction } = usePermissions();
  const { toast } = useToast();

  // Create a map for quick card lookup
  const cardsMap = React.useMemo(() => {
    const map: Record<string, Card> = {};
    cards.forEach(card => {
      map[card.id.toString()] = card;
    });
    return map;
  }, [cards]);

  const handleRestrictedAction = (actionKey: string) => {
    toast({
      title: t("access-denied"),
      description: t(actionKey),
      variant: "destructive",
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("no-transactions-found")}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("status")}</TableHead>
            <TableHead>{t("date")}</TableHead>
            <TableHead>{t("movement-type")}</TableHead>
            <TableHead>{t("transaction-type")}</TableHead>
            <TableHead className="text-right">{t("amount")}</TableHead>
            <TableHead>{t("transaction-id")}</TableHead>
            <TableHead>{t("card")}</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, index) => {
            const card = transaction.cardId ? cardsMap[transaction.cardId] : null;
            const merchant = transaction.additionalInfo?.merchant || "";
            const category = transaction.additionalInfo?.category || "";
            
            return (
              <TableRow key={`${transaction.id}-${index}`}>
                <TableCell>
                  {getTranslatedStatusBadge(transaction.status, settings.language)}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">
                      {transaction.date ? formatDateTime(transaction.date) : t("unknown")}
                    </div>
                    {merchant && (
                      <div className="text-xs text-muted-foreground">
                        {merchant}
                      </div>
                    )}
                    {category && (
                      <div className="text-xs text-muted-foreground">
                        {category}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {getTranslatedTypeBadge(transaction.movementType, settings.language)}
                </TableCell>
                <TableCell>
                  {getTranslatedTransactionTypeBadge(
                    transaction.additionalInfo?.payment_type || transaction.transactionType || transaction.type,
                    settings.language
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className={`font-medium ${
                    transaction.amount && transaction.amount < 0 
                      ? 'text-red-600' 
                      : 'text-green-600'
                  }`}>
                    {formatCurrency(transaction.amount, transaction.currency, settings.language === 'es' ? 'es-ES' : 'en-US')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-mono text-sm max-w-[120px] truncate">
                    {transaction.transactionId || transaction.id}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">
                    {card ? card.maskedCardNumber : t("unknown")}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(transaction)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {t("view-details")}
                      </DropdownMenuItem>

                      {transaction.status?.toLowerCase() === 'pending' && onChangeStatus && (
                        <DropdownMenuItem
                          onClick={() => {
                            if (canChangeTransactionStatus()) {
                              onChangeStatus(transaction);
                            } else {
                              handleRestrictedAction("only-compensator-can-change-status");
                            }
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          {t("change-status")}
                        </DropdownMenuItem>
                      )}

                      {onCompensate && (
                        <DropdownMenuItem
                          onClick={() => {
                            if (canCancelTransaction()) {
                              onCompensate(transaction);
                            } else {
                              handleRestrictedAction("only-compensator-can-compensate");
                            }
                          }}
                        >
                          <DollarSign className="mr-2 h-4 w-4" />
                          {t("compensate-customer")}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CardsTransactionsTable;