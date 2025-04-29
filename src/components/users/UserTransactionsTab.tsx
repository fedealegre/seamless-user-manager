
import React, { useState, useEffect } from "react";
import { Wallet, Transaction } from "@/lib/api/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import UserTransactionsHeader from "./UserTransactionsHeader";
import UserTransactionsTabs from "./UserTransactionsTabs";
import TransactionDetails from "../transactions/TransactionDetails";
import CompensateCustomerDialog from "../transactions/CompensateCustomerDialog";
import ChangeTransactionStatusDialog from "../transactions/ChangeTransactionStatusDialog";
import { useUserTransactions } from "@/hooks/use-user-transactions";
import { useTransactionCSVMapper } from "../transactions/TransactionCSVMapper";

interface UserTransactionsTabProps {
  userId: string;
  wallets: Wallet[];
}

export const UserTransactionsTab: React.FC<UserTransactionsTabProps> = ({ userId, wallets }) => {
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { settings, formatDateTime } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  useEffect(() => {
    if (wallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(wallets[0].id.toString());
    }
  }, [wallets, selectedWalletId]);

  const {
    page,
    setPage,
    pageSize,
    filters,
    isLoading,
    transactions,
    allTransactions,
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
    t: transactionT
  } = useUserTransactions(userId, selectedWalletId);

  const { mapTransactionToCSV } = useTransactionCSVMapper({
    wallets,
    formatDateTime,
    t,
    userId
  });

  return (
    <Card>
      <CardHeader>
        <UserTransactionsHeader
          t={t}
          transactions={transactions}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          activeFiltersCount={getActiveFiltersCount()}
          userId={userId}
          allTransactions={allTransactions}
          mapTransactionToCSV={mapTransactionToCSV}
        />
      </CardHeader>
      <CardContent>
        <UserTransactionsTabs
          wallets={wallets}
          selectedWalletId={selectedWalletId}
          setSelectedWalletId={setSelectedWalletId}
          page={page}
          setPage={setPage}
          showFilters={showFilters}
          filters={filters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          isLoading={isLoading}
          transactions={transactions}
          pageSize={pageSize}
          totalPages={totalPages}
          totalTransactions={totalTransactions}
          handlePageSizeChange={handlePageSizeChange}
          t={t}
          handleViewDetails={handleViewDetails}
          handleCancelTransaction={handleCancelTransaction}
          handleCompensateCustomer={handleCompensateCustomer}
          handleChangeStatus={handleChangeStatus}
        />
      </CardContent>
      {selectedTransaction && (
        <>
          <TransactionDetails
            transaction={selectedTransaction}
            open={showTransactionDetails}
            onOpenChange={setShowTransactionDetails}
          />
          <CompensateCustomerDialog
            transaction={selectedTransaction}
            open={showCompensateDialog}
            onOpenChange={setShowCompensateDialog}
            onSubmit={handleCompensateSubmit}
          />
          <ChangeTransactionStatusDialog
            transaction={selectedTransaction}
            open={showChangeStatusDialog}
            onOpenChange={setShowChangeStatusDialog}
            onSubmit={handleSubmitStatusChange}
          />
        </>
      )}
    </Card>
  );
};

export default UserTransactionsTab;
