
import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionsLoadingSkeleton from "@/components/transactions/TransactionsLoadingSkeleton";
import UserTransactionsTableSection from "./UserTransactionsTableSection";
import { Wallet, Transaction } from "@/lib/api/types";

interface UserTransactionsTabsProps {
  wallets: Wallet[];
  selectedWalletId: string | null;
  setSelectedWalletId: (id: string) => void;
  page: number;
  setPage: (page: number) => void;
  showFilters: boolean;
  filters: any;
  onApplyFilters: (filters: any) => void;
  onResetFilters: () => void;
  isLoading: boolean;
  transactions: Transaction[];
  pageSize: number;
  totalPages: number;
  totalTransactions: number;
  handlePageSizeChange: (value: string) => void;
  t: (key: string) => string;
  handleViewDetails: (transaction: Transaction) => void;
  handleCancelTransaction: (transaction: Transaction) => void;
  handleCompensateCustomer: (transaction: Transaction) => void;
  handleChangeStatus: (transaction: Transaction) => void;
}

const UserTransactionsTabs: React.FC<UserTransactionsTabsProps> = ({
  wallets,
  selectedWalletId,
  setSelectedWalletId,
  page,
  setPage,
  showFilters,
  filters,
  onApplyFilters,
  onResetFilters,
  isLoading,
  transactions,
  pageSize,
  totalPages,
  totalTransactions,
  handlePageSizeChange,
  t,
  handleViewDetails,
  handleCancelTransaction,
  handleCompensateCustomer,
  handleChangeStatus,
}) => {
  if (wallets.length === 0) {
    return (
      <p className="text-center py-6 text-muted-foreground">{t("no-wallets-found")}</p>
    );
  }
  return (
    <Tabs
      value={selectedWalletId || ""}
      onValueChange={(value) => {
        setSelectedWalletId(value);
        setPage(1);
      }}
      className="w-full"
    >
      <TabsList className="mb-4 w-full h-auto flex-wrap">
        {wallets.map((wallet) => (
          <TabsTrigger key={wallet.id} value={wallet.id.toString()}>
            {wallet.currency} {t("wallet")} ({wallet.id})
          </TabsTrigger>
        ))}
      </TabsList>
      {wallets.map((wallet) => (
        <TabsContent key={wallet.id} value={wallet.id.toString()}>
          <div className="mb-6">
            {showFilters && (
              <TransactionFilters
                filters={filters}
                onApply={onApplyFilters}
                onReset={onResetFilters}
              />
            )}
          </div>
          {isLoading ? (
            <TransactionsLoadingSkeleton />
          ) : (
            <UserTransactionsTableSection
              transactions={transactions}
              page={page}
              setPage={setPage}
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
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};
export default UserTransactionsTabs;
