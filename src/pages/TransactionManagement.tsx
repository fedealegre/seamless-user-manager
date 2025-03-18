
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Transaction Components
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionDetails from "@/components/transactions/TransactionDetails";
import CancelTransactionDialog from "@/components/transactions/CancelTransactionDialog";
import CompensateCustomerDialog from "@/components/transactions/CompensateCustomerDialog";
import TransactionSearchBar from "@/components/transactions/TransactionSearchBar";
import FilterButton from "@/components/transactions/FilterButton";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import TransactionsPagination from "@/components/transactions/TransactionsPagination";
import TransactionsLoadingSkeleton from "@/components/transactions/TransactionsLoadingSkeleton";

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
    handleApplyFilters,
    resetFilters,
    handleSubmitCancel,
    handleSubmitCompensation,
    setPage,
    handleCloseDetailsDialog,
    handleCloseCancelDialog,
    handleCloseCompensateDialog,
  } = useTransactionManagement();

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transaction Management</h1>
            <p className="text-muted-foreground">Monitor and manage payment transactions</p>
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
          <CardHeader className="py-4">
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              {isLoading ? "Loading..." : 
                transactions && transactions.length > 0 
                  ? `${transactions.length} transactions found` 
                  : "No transactions found"}
            </CardDescription>
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
    </>
  );
};

export default TransactionManagement;
