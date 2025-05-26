
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
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/hooks/use-permissions";
import { userService } from "@/lib/api/user-service";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

interface UserTransactionsTabProps {
  userId: string;
  wallets: Wallet[];
}

export const UserTransactionsTab: React.FC<UserTransactionsTabProps> = ({ userId, wallets }) => {
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showCompensateDialogDirect, setShowCompensateDialogDirect] = useState(false);
  const { settings, formatDateTime } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const { toast } = useToast();
  const { canChangeTransactionStatus } = usePermissions();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (wallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(wallets[0].id.toString());
    }
  }, [wallets, selectedWalletId]);

  // Fetch company wallets for compensation
  const { data: companyWallets = [] } = useQuery({
    queryKey: ['company-wallets'],
    queryFn: () => userService.getCompanyWallets()
  });

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
    forceRefreshTransactions,
    t: transactionT
  } = useUserTransactions(userId, selectedWalletId);

  const { mapTransactionToCSV } = useTransactionCSVMapper({
    wallets,
    formatDateTime,
    t,
    userId
  });

  const handleDirectCompensation = () => {
    if (!canChangeTransactionStatus()) {
      toast({
        title: t("access-denied"),
        description: t("only-compensator-can-compensate"),
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedWalletId) {
      toast({
        title: t("error"),
        description: t("select-wallet-first"),
        variant: "destructive",
      });
      return;
    }
    
    setShowCompensateDialogDirect(true);
  };

  // Create a dummy transaction object for direct compensation
  const createDummyTransaction = (): Transaction => {
    const wallet = wallets.find(w => w.id.toString() === selectedWalletId);
    return {
      id: 0,
      transactionId: `DIRECT-${Date.now()}`,
      customerId: userId,
      walletId: selectedWalletId!,
      date: new Date().toISOString(),
      amount: 0,
      currency: wallet?.currency || "USD",
      status: "pending",
      movementType: "deposit",
      transactionType: "Compensacion"
    };
  };

  const handleDirectCompensateSubmit = async (
    amount: string, 
    reason: string, 
    compensationType: 'credit' | 'adjustment',
    originWalletId: number
  ) => {
    if (!selectedWalletId) {
      toast({
        title: t("error"),
        description: t("select-wallet-first"),
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log('💰 Processing direct compensation...', { 
        userId, 
        selectedWalletId, 
        amount, 
        reason, 
        compensationType,
        timestamp: new Date().toISOString()
      });
      
      const companyId = 1;
      const walletIdNum = parseInt(selectedWalletId);
      
      await userService.compensateCustomer(
        companyId,
        userId,
        walletIdNum,
        originWalletId,
        {
          amount,
          reason,
          transaction_code: `COMP-${Date.now()}`,
          admin_user: "Current Admin",
          transaction_type: "Compensacion",
          compensation_type: compensationType,
        }
      );
      
      console.log('✅ Direct compensation successful, force refreshing transactions...');
      
      toast({
        title: t("compensation-processed"),
        description: t("compensation-transaction-created"),
      });
      
      // Force refresh transactions first
      await forceRefreshTransactions();
      
      // Then invalidate related queries
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['user-wallets', userId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['company-wallets'],
        })
      ]);
      
      console.log('🔄 All queries invalidated after direct compensation');
      
      setShowCompensateDialogDirect(false);
    } catch (error: any) {
      console.error('❌ Direct compensation failed:', error);
      toast({
        title: t("compensation-failed"),
        description: error.message || t("compensation-error"),
        variant: "destructive",
      });
    }
  };

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
          onCompensateCustomer={handleDirectCompensation}
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
            companyWallets={companyWallets}
          />
          <ChangeTransactionStatusDialog
            transaction={selectedTransaction}
            open={showChangeStatusDialog}
            onOpenChange={setShowChangeStatusDialog}
            onSubmit={handleSubmitStatusChange}
          />
        </>
      )}
      
      {/* Direct compensation dialog */}
      {selectedWalletId && (
        <CompensateCustomerDialog
          transaction={createDummyTransaction()}
          open={showCompensateDialogDirect}
          onOpenChange={setShowCompensateDialogDirect}
          onSubmit={handleDirectCompensateSubmit}
          companyWallets={companyWallets}
        />
      )}
    </Card>
  );
};

export default UserTransactionsTab;
