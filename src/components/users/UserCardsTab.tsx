import React, { useState } from "react";
import { Card as CardComponent, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Eye, RefreshCw, CircleDollarSign } from "lucide-react";
import { useUserCards } from "@/hooks/use-user-cards";
import { useUserCardTransactions } from "@/hooks/use-user-card-transactions";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { Transaction } from "@/lib/api/types";
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
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { 
  getTranslatedStatusBadge, 
  getTranslatedTypeBadge, 
  formatCurrency 
} from "@/components/transactions/transaction-utils";
import { formatTimeDifference } from "@/lib/date-utils";

interface UserCardsTabProps {
  userId: string;
}

export const UserCardsTab: React.FC<UserCardsTabProps> = ({ userId }) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  const [selectedCardId, setSelectedCardId] = useState<string>("");

  // Fetch user cards
  const { cards, isLoadingCards, error: cardsError } = useUserCards(userId);

  // Set initial selected card
  React.useEffect(() => {
    if (cards.length > 0 && !selectedCardId) {
      const defaultCard = cards.find(card => card.isDefault) || cards[0];
      setSelectedCardId(defaultCard.id.toString());
    }
  }, [cards, selectedCardId]);

  // Fetch card transactions
  const {
    transactions,
    totalTransactions,
    totalPages,
    currentPage,
    itemsPerPage,
    isLoading: isLoadingTransactions,
    setCurrentPage,
    setItemsPerPage,
  } = useUserCardTransactions(selectedCardId, userId);

  const handleViewDetails = (transaction: Transaction) => {
    console.log("View details:", transaction);
  };

  const handleCancel = (transaction: Transaction) => {
    console.log("Cancel transaction:", transaction);
  };

  const handleCompensate = (transaction: Transaction) => {
    console.log("Compensate transaction:", transaction);
  };

  const handleChangeStatus = (transaction: Transaction) => {
    console.log("Change status:", transaction);
  };

  if (isLoadingCards) {
    return (
      <CardComponent>
        <CardHeader>
          <CardTitle>{t("user-cards")}</CardTitle>
          <CardDescription>{t("view-card-transactions")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-muted rounded" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </CardContent>
      </CardComponent>
    );
  }

  if (cardsError || !cards?.length) {
    return (
      <CardComponent>
        <CardHeader>
          <CardTitle>{t("user-cards")}</CardTitle>
          <CardDescription>{t("view-card-transactions")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t("no-cards-found")}</p>
          </div>
        </CardContent>
      </CardComponent>
    );
  }

  return (
    <CardComponent>
      <CardHeader>
        <CardTitle>{t("user-cards")}</CardTitle>
        <CardDescription>{t("view-card-transactions")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCardId} onValueChange={setSelectedCardId} className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 h-auto p-2">
            {cards.map((card) => (
              <TabsTrigger
                key={card.id}
                value={card.id.toString()}
                className="flex flex-col items-start p-4 h-auto space-y-2"
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-sm font-medium">{card.maskedCardNumber}</span>
                  {card.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      {t("default-card")}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    {t(card.cardType)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {t(card.brand)}
                  </Badge>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {cards.map((card) => (
            <TabsContent key={card.id} value={card.id.toString()}>
              {/* Card Info */}
              <div className="flex justify-center mb-6">
                <div className="bg-muted/50 rounded-lg p-2 min-w-48">
                  <p className="text-sm text-muted-foreground text-center">{t("card-type")}</p>
                  <p className="text-lg font-semibold text-center">{t(card.cardType)} - {t(card.brand)}</p>
                  {card.availableLimit && (
                    <p className="text-sm text-muted-foreground text-center">
                      Límite: {card.availableLimit} {card.currency}
                    </p>
                  )}
                </div>
              </div>

              {/* Transactions Table */}
              {isLoadingTransactions ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-64 bg-muted rounded" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("transaction-id")}</TableHead>
                          <TableHead>{t("amount")}</TableHead>
                          <TableHead>{t("merchant")}</TableHead>
                          <TableHead>{t("category")}</TableHead>
                          <TableHead>{t("status")}</TableHead>
                          <TableHead>{t("date")}</TableHead>
                          <TableHead className="text-right">{t("actions")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                              {t("no-transactions-found")}
                            </TableCell>
                          </TableRow>
                        ) : (
                          transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell className="font-mono text-sm">
                                {transaction.transactionId}
                              </TableCell>
                              <TableCell>
                                <span className={transaction.amount && transaction.amount < 0 ? "text-red-600" : "text-green-600"}>
                                  {formatCurrency(transaction.amount, transaction.currency)}
                                </span>
                              </TableCell>
                              <TableCell>
                                {transaction.additionalInfo?.merchant || "-"}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {transaction.additionalInfo?.category || "-"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {getTranslatedStatusBadge(transaction.status, settings.language)}
                              </TableCell>
                              <TableCell>
                                {transaction.date ? formatTimeDifference(new Date(transaction.date)) : "-"}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <span className="sr-only">Abrir menú</span>
                                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                                      </svg>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleViewDetails(transaction)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      {t("view-details")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleCancel(transaction)}>
                                      <RefreshCw className="mr-2 h-4 w-4" />
                                      {t("cancel")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleCompensate(transaction)}>
                                      <CircleDollarSign className="mr-2 h-4 w-4" />
                                      {t("compensate-customer")}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Simple Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Anterior
                      </Button>
                      <span className="flex items-center px-3 text-sm">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Siguiente
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </CardComponent>
  );
};