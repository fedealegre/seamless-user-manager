import React, { useState } from "react";
import { Card as CardComponent, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import { useUserCards } from "@/hooks/use-user-cards";
import { useUserCardTransactions } from "@/hooks/use-user-card-transactions";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import TransactionsPagination from "@/components/transactions/TransactionsPagination";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { Transaction } from "@/lib/api/types";

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

  const selectedCard = cards.find(card => card.id.toString() === selectedCardId);

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
                <>
                  <div className="space-y-4">
                    <TransactionsTable 
                      transactions={transactions}
                      page={currentPage}
                      pageSize={itemsPerPage}
                      handleViewDetails={(transaction: Transaction) => {
                        console.log("View details:", transaction);
                      }}
                      handleCancelTransaction={(transaction: Transaction) => {
                        console.log("Cancel transaction:", transaction);
                      }}
                      handleCompensateCustomer={(transaction: Transaction) => {
                        console.log("Compensate transaction:", transaction);
                      }}
                      handleChangeStatus={(transaction: Transaction) => {
                        console.log("Change status:", transaction);
                      }}
                    />
                    
                    {totalPages > 1 && (
                      <TransactionsPagination
                        page={currentPage}
                        setPage={setCurrentPage}
                        totalPages={totalPages}
                        totalTransactions={totalTransactions}
                        pageSize={itemsPerPage}
                      />
                    )}
                  </div>
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </CardComponent>
  );
};