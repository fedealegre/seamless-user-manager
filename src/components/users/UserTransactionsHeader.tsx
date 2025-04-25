
import React from "react";
import FilterButton from "@/components/transactions/FilterButton";
import ExportCSVButton from "@/components/common/ExportCSVButton";

interface UserTransactionsHeaderProps {
  t: (key: string) => string;
  transactions: any[];
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFiltersCount: number;
  userId: string;
  allTransactions: any[];
  mapTransactionToCSV: (tx: any) => any[];
}

const UserTransactionsHeader: React.FC<UserTransactionsHeaderProps> = ({
  t,
  transactions,
  showFilters,
  setShowFilters,
  activeFiltersCount,
  userId,
  allTransactions,
  mapTransactionToCSV,
}) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <div>
        <h3 className="text-2xl font-semibold leading-none tracking-tight">{t("user-transactions")}</h3>
        <p className="text-muted-foreground">{t("view-wallet-transactions")}</p>
      </div>
      {transactions && transactions.length > 0 && (
        <div className="flex items-center gap-2">
          <FilterButton
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            activeFiltersCount={activeFiltersCount}
          />
          <ExportCSVButton
            filename={`user-${userId}-transactions-${new Date().toISOString().slice(0, 10)}`}
            headers={[
              t('transaction-id'),
              t('reference'),
              t('date'),
              t('movement-type'),
              t('transaction-type'),
              t('amount'),
              t('currency'),
              t('status'),
              t('user-id'),
              t('wallet-id')
            ]}
            data={allTransactions}
            mapRow={mapTransactionToCSV}
          >
            {t('export-csv')}
          </ExportCSVButton>
        </div>
      )}
    </div>
  );
};

export default UserTransactionsHeader;
