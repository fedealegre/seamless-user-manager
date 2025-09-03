
import React from "react";
import FilterButton from "@/components/transactions/FilterButton";
import ExportCSVButton from "@/components/common/ExportCSVButton";
import { Button } from "@/components/ui/button";
import { CircleDollarSign } from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";

interface UserTransactionsHeaderProps {
  t: (key: string) => string;
  transactions: any[];
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFiltersCount: number;
  userId: string;
  allTransactions: any[];
  mapTransactionToCSV: (tx: any) => any[];
  onCompensateCustomer?: () => void;
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
  onCompensateCustomer,
}) => {
  const { canChangeTransactionStatus } = usePermissions();
  const showCompensateButton = canChangeTransactionStatus();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h3 className="text-2xl font-semibold leading-none tracking-tight">{t("user-transactions")}</h3>
        <p className="text-muted-foreground">{t("view-wallet-transactions")}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
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
        
        {showCompensateButton && onCompensateCustomer && (
          <Button 
            onClick={onCompensateCustomer}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            <CircleDollarSign className="mr-2 h-4 w-4" />
            {t('compensate-customer')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserTransactionsHeader;
