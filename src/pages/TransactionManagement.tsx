
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Transaction Components
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionDetails from "@/components/transactions/TransactionDetails";
import CancelTransactionDialog from "@/components/transactions/CancelTransactionDialog";
import CompensateCustomerDialog from "@/components/transactions/CompensateCustomerDialog";
import ChangeTransactionStatusDialog from "@/components/transactions/ChangeTransactionStatusDialog";
import TransactionSearchBar from "@/components/transactions/TransactionSearchBar";
import FilterButton from "@/components/transactions/FilterButton";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import TransactionsPagination from "@/components/transactions/TransactionsPagination";
import TransactionsLoadingSkeleton from "@/components/transactions/TransactionsLoadingSkeleton";
import ExportCSVButton from "@/components/common/ExportCSVButton";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

// Hook
import { useTransactionManagement } from "@/hooks/use-transaction-management";

const TransactionManagement = () => {
  const {
    page,
    pageSize,
    searchTerm,
    showFilters,
    showDetailsDialog,
    showCancelDialog,
    showCompensateDialog,
    showChangeStatusDialog,
    selectedTransaction,
    filters,
    transactions,
    isLoading,
    totalPages,
    totalTransactions,
    activeFiltersCount,
    setSearchTerm,
    setShowFilters,
    handleSearch,
    handleViewDetails,
    handleCancelTransaction,
    handleCompensateCustomer,
    handleChangeStatus,
    handleApplyFilters,
    resetFilters,
    handleSubmitCancel,
    handleSubmitCompensation,
    handleSubmitStatusChange,
    setPage,
    handleCloseDetailsDialog,
    handleCloseCancelDialog,
    handleCloseCompensateDialog,
    handleCloseChangeStatusDialog,
  } = useTransactionManagement();
  
  const { settings, formatDateTime } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  // Function to map transaction data for CSV export
  const mapTransactionToCSV = (transaction: any) => {
    return [
      transaction.transactionId || transaction.id.toString(),
      transaction.reference || '',
      transaction.date ? formatDateTime(new Date(transaction.date)) : '',
      t(transaction.type?.toLowerCase() || transaction.transactionType?.toLowerCase() || transaction.movementType?.toLowerCase() || 'unknown'),
      transaction.amount?.toString() || '',
      transaction.currency || '',
      t(transaction.status?.toLowerCase() || 'unknown'),
      transaction.customerId || '',
      transaction.walletId || '',
    ];
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("transactions")}</h1>
            <p className="text-muted-foreground">{t("monitor-and-manage-payment-transactions")}</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2">
            <TransactionSearchBar 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSearch={handleSearch}
            />
            
            <FilterButton 
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              activeFiltersCount={activeFiltersCount}
            />
          </div>
        </div>
        
        {showFilters && (
          <TransactionFilters 
            filters={filters} 
            onApply={handleApplyFilters} 
            onReset={resetFilters} 
          />
        )}
        
        <Card>
          <CardHeader className="py-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t("transactions")}</CardTitle>
              <CardDescription>
                {isLoading ? t("loading") : 
                  transactions && transactions.length > 0 
                    ? `${transactions.length} ${t("transactions-found")}` 
                    : t("no-transactions-found")}
              </CardDescription>
            </div>
            
            {transactions && transactions.length > 0 && (
              <ExportCSVButton
                filename={`transactions-${new Date().toISOString().slice(0, 10)}`}
                headers={[
                  t('transaction-id'), 
                  t('reference'), 
                  t('date'), 
                  t('type'), 
                  t('amount'), 
                  t('currency'), 
                  t('status'),
                  t('user-id'),
                  t('wallet-id')
                ]}
                data={transactions}
                mapRow={mapTransactionToCSV}
              >
                {t('export-csv')}
              </ExportCSVButton>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <TransactionsLoadingSkeleton />
            ) : (
              <>
                <TransactionsTable
                  transactions={transactions || []}
                  page={page}
                  pageSize={pageSize}
                  handleViewDetails={handleViewDetails}
                  handleCancelTransaction={handleCancelTransaction}
                  handleCompensateCustomer={handleCompensateCustomer}
                  handleChangeStatus={handleChangeStatus}
                />
                
                {transactions && transactions.length > 0 && (
                  <TransactionsPagination
                    page={page}
                    totalPages={totalPages}
                    setPage={setPage}
                    totalTransactions={totalTransactions}
                    pageSize={pageSize}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Transaction Details Dialog */}
      {selectedTransaction && (
        <TransactionDetails
          open={showDetailsDialog}
          onOpenChange={handleCloseDetailsDialog}
          transaction={selectedTransaction}
        />
      )}
      
      {/* Cancel Transaction Dialog */}
      {selectedTransaction && (
        <CancelTransactionDialog
          open={showCancelDialog}
          onOpenChange={handleCloseCancelDialog}
          transaction={selectedTransaction}
          onSubmit={handleSubmitCancel}
        />
      )}
      
      {/* Compensate Customer Dialog */}
      {selectedTransaction && (
        <CompensateCustomerDialog
          open={showCompensateDialog}
          onOpenChange={handleCloseCompensateDialog}
          transaction={selectedTransaction}
          onSubmit={handleSubmitCompensation}
        />
      )}

      {/* Change Transaction Status Dialog */}
      {selectedTransaction && (
        <ChangeTransactionStatusDialog
          open={showChangeStatusDialog}
          onOpenChange={handleCloseChangeStatusDialog}
          transaction={selectedTransaction}
          onSubmit={handleSubmitStatusChange}
        />
      )}
    </>
  );
};

export default TransactionManagement;
