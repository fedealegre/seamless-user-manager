import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Loader2 } from "lucide-react";
import { useUserCards } from "@/hooks/use-user-cards";
import { useUserCardsTransactions } from "@/hooks/use-user-cards-transactions";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import FilterButton from "@/components/transactions/FilterButton";
import CardTransactionFilters from "@/components/transactions/CardTransactionFilters";
import CardsTransactionsTable from "@/components/transactions/CardsTransactionsTable";
import TransactionDetails from "@/components/transactions/TransactionDetails";
import CompensateCustomerDialog from "@/components/transactions/CompensateCustomerDialog";
import ChangeTransactionStatusDialog from "@/components/transactions/ChangeTransactionStatusDialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/lib/api/types";

interface UserCardsTabProps {
  userId: string;
}

export const UserCardsTab: React.FC<UserCardsTabProps> = ({ userId }) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const { cards, isLoadingCards, error } = useUserCards(userId);
  const [showFilters, setShowFilters] = useState(false);

  const {
    page,
    setPage,
    pageSize,
    filters,
    isLoading: isLoadingTransactions,
    transactions,
    totalPages,
    totalTransactions,
    selectedTransaction,
    showTransactionDetails,
    showCompensateDialog,
    showChangeStatusDialog,
    setShowTransactionDetails,
    setShowCompensateDialog,
    setShowChangeStatusDialog,
    handleApplyFilters,
    handleResetFilters,
    handleViewDetails,
    handleCancelTransaction,
    handleCompensateCustomer,
    handleChangeStatus,
    handleCompensateSubmit,
    handleSubmitStatusChange,
    handlePageSizeChange,
    getActiveFiltersCount,
  } = useUserCardsTransactions(userId, cards || []);

  if (isLoadingCards) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">{t("loading")}...</span>
      </div>
    );
  }

  if (!cards || cards.length === 0 || error) {
    return (
      <div className="text-center py-8">
        <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          {error ? t("error-loading-cards") : t("no-cards-found")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>{t("cards")}</CardTitle>
          <CardDescription>
            {t("manage-user-cards-description")}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <FilterButton
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          activeFiltersCount={getActiveFiltersCount()}
        />
      </div>

      {showFilters && (
        <CardTransactionFilters
          filters={filters}
          cards={cards}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />
      )}

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("transactions")} ({totalTransactions})</CardTitle>
              <CardDescription>
                {t("all-card-transactions-description")}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 {t("transactions-per-page")}</SelectItem>
                  <SelectItem value="25">25 {t("transactions-per-page")}</SelectItem>
                  <SelectItem value="50">50 {t("transactions-per-page")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingTransactions ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">{t("loading-transactions")}...</span>
            </div>
          ) : (
            <CardsTransactionsTable
              transactions={transactions}
              cards={cards}
              page={page}
              pageSize={pageSize}
              onViewDetails={handleViewDetails}
              onCancel={handleCancelTransaction}
              onCompensate={handleCompensateCustomer}
              onChangeStatus={handleChangeStatus}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                {t("previous")}
              </Button>
              <span className="text-sm text-muted-foreground">
                {t("page")} {page} {t("of")} {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                {t("next")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {selectedTransaction && (
        <>
          <TransactionDetails
            transaction={selectedTransaction as Transaction}
            open={showTransactionDetails}
            onClose={() => setShowTransactionDetails(false)}
          />
          
          <CompensateCustomerDialog
            transaction={selectedTransaction as Transaction}
            open={showCompensateDialog}
            onClose={() => setShowCompensateDialog(false)}
            onSubmit={handleCompensateSubmit}
          />
          
          <ChangeTransactionStatusDialog
            transaction={selectedTransaction as Transaction}
            open={showChangeStatusDialog}
            onClose={() => setShowChangeStatusDialog(false)}
            onSubmit={handleSubmitStatusChange}
          />
        </>
      )}
    </div>
  );
};