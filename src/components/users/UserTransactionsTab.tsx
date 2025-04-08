
import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/lib/api/user-service";
import { Wallet, Transaction } from "@/lib/api/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import TransactionsLoadingSkeleton from "@/components/transactions/TransactionsLoadingSkeleton";
import { useToast } from "@/hooks/use-toast";
import TransactionDetails from "@/components/transactions/TransactionDetails";
import CompensateCustomerDialog from "@/components/transactions/CompensateCustomerDialog";
import ChangeTransactionStatusDialog from "@/components/transactions/ChangeTransactionStatusDialog";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import ExportCSVButton from "@/components/common/ExportCSVButton";
import { usePermissions } from "@/hooks/use-permissions";
import TransactionsPagination from "@/components/transactions/TransactionsPagination";

interface UserTransactionsTabProps {
  userId: string;
  wallets: Wallet[];
}

export const UserTransactionsTab: React.FC<UserTransactionsTabProps> = ({ userId, wallets }) => {
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { toast } = useToast();
  const { settings, formatDateTime } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const queryClient = useQueryClient();
  const { canCancelTransaction, canChangeTransactionStatus } = usePermissions();
  
  // Dialog states
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [showCompensateDialog, setShowCompensateDialog] = useState(false);
  const [showChangeStatusDialog, setShowChangeStatusDialog] = useState(false);

  // Get the first wallet ID when wallets are loaded
  useEffect(() => {
    if (wallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(wallets[0].id.toString());
    }
  }, [wallets, selectedWalletId]);

  // Fetch transactions for the selected wallet using userService
  const { data: allTransactions = [], isLoading } = useQuery({
    queryKey: ['user-transactions', userId, selectedWalletId],
    queryFn: () => {
      if (!selectedWalletId) return Promise.resolve([]);
      return userService.getWalletTransactions(userId, selectedWalletId);
    },
    enabled: !!selectedWalletId,
  });

  // Calculate pagination
  const totalTransactions = allTransactions.length;
  const totalPages = Math.ceil(totalTransactions / pageSize);
  
  // Get transactions for current page
  const startIndex = (page - 1) * pageSize;
  const transactions = allTransactions.slice(startIndex, startIndex + pageSize);

  // Handlers for transaction actions
  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
  };

  const handleCancelTransaction = (transaction: Transaction) => {
    if (!canCancelTransaction()) {
      toast({
        title: t("access-denied"),
        description: t("only-compensator-can-cancel-transaction"),
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: t("cancel-transaction"),
      description: `${t("transaction-cancellation-not-implemented")} ${transaction.transactionId || transaction.id}`,
    });
  };

  const handleCompensateCustomer = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowCompensateDialog(true);
  };

  const handleChangeStatus = (transaction: Transaction) => {
    if (!canChangeTransactionStatus()) {
      toast({
        title: t("access-denied"),
        description: t("only-compensator-can-change-status"),
        variant: "destructive",
      });
      return;
    }
    
    setSelectedTransaction(transaction);
    setShowChangeStatusDialog(true);
  };

  const handleCompensateSubmit = async (amount: string, reason: string, compensationType: 'credit' | 'adjustment') => {
    if (!selectedTransaction || !selectedWalletId) {
      toast({
        title: t("error"),
        description: t("missing-transaction-wallet-info"),
        variant: "destructive",
      });
      return;
    }

    try {
      const companyId = 1;
      const userId = selectedTransaction.customerId;
      const walletId = parseInt(selectedTransaction.walletId);
      const originWalletId = 999;
      
      await userService.compensateCustomer(
        companyId,
        userId,
        walletId,
        originWalletId,
        {
          amount,
          reason,
          transaction_code: `COMP-${Date.now()}`,
          admin_user: "Current Admin",
          transaction_type: "COMPENSATE",
          compensation_type: compensationType
        }
      );
      
      toast({
        title: t("compensation-processed"),
        description: t("compensation-transaction-created"),
      });
      
      // Refresh transactions - fixed the invalidate query syntax
      if (selectedWalletId) {
        queryClient.invalidateQueries({
          queryKey: ['user-transactions', userId, selectedWalletId]
        });
      }
      
      setShowCompensateDialog(false);
      setSelectedTransaction(null);
    } catch (error: any) {
      toast({
        title: t("compensation-failed"),
        description: error.message || t("compensation-error"),
        variant: "destructive",
      });
    }
  };

  const handleSubmitStatusChange = async (newStatus: string, reason: string) => {
    if (!selectedTransaction || !selectedWalletId) {
      toast({
        title: t("error"),
        description: t("missing-transaction-wallet-info"),
        variant: "destructive",
      });
      return;
    }

    try {
      const transactionIdentifier = selectedTransaction.transactionId || selectedTransaction.id.toString();
      
      await userService.changeTransactionStatus(
        selectedWalletId,
        transactionIdentifier,
        {
          newStatus: newStatus as 'cancelled' | 'rejected' | 'confirmed' | 'approved',
          reason
        }
      );
      
      toast({
        title: t("status-updated"),
        description: t("transaction-status-changed-success"),
      });
      
      // Refresh transactions - fixed the invalidate query syntax
      if (selectedWalletId) {
        queryClient.invalidateQueries({
          queryKey: ['user-transactions', userId, selectedWalletId]
        });
      }
      
      setShowChangeStatusDialog(false);
      setSelectedTransaction(null);
    } catch (error: any) {
      toast({
        title: t("status-change-failed"),
        description: error.message || t("only-pending-transactions"),
        variant: "destructive",
      });
    }
  };

  // Function to find the wallet by ID
  const findWallet = (walletId: string) => {
    return wallets.find(wallet => wallet.id.toString() === walletId);
  };

  // Function to map transaction data for CSV export
  const mapTransactionToCSV = (transaction: Transaction) => {
    const wallet = findWallet(transaction.walletId);
    
    return [
      transaction.transactionId || transaction.id.toString(),
      transaction.reference || '',
      transaction.date ? formatDateTime(new Date(transaction.date)) : '',
      t(transaction.movementType?.toLowerCase() || 'unknown'),
      t(transaction.transactionType?.toLowerCase() || 'unknown'),
      transaction.amount?.toString() || '',
      transaction.currency || wallet?.currency || '',
      t(transaction.status?.toLowerCase() || 'unknown'),
      userId,
      wallet?.id.toString() || '',
    ];
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t("user-transactions")}</CardTitle>
          <CardDescription>
            {t("view-wallet-transactions")}
          </CardDescription>
        </div>
        
        {transactions && transactions.length > 0 && (
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
        )}
      </CardHeader>
      <CardContent>
        {wallets.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">{t("no-wallets-found")}</p>
        ) : (
          <Tabs 
            value={selectedWalletId || ""}
            onValueChange={(value) => {
              setSelectedWalletId(value);
              setPage(1); // Reset page when changing wallet
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
                {isLoading ? (
                  <TransactionsLoadingSkeleton />
                ) : (
                  transactions && transactions.length > 0 ? (
                    <div className="space-y-4">
                      <TransactionsTable
                        transactions={transactions}
                        page={page}
                        pageSize={pageSize}
                        handleViewDetails={handleViewDetails}
                        handleCancelTransaction={handleCancelTransaction}
                        handleCompensateCustomer={handleCompensateCustomer}
                        handleChangeStatus={handleChangeStatus}
                      />
                      <TransactionsPagination 
                        page={page}
                        totalPages={totalPages}
                        setPage={setPage}
                        totalTransactions={totalTransactions}
                        pageSize={pageSize}
                      />
                    </div>
                  ) : (
                    <p className="text-center py-6 text-muted-foreground">{t("no-transactions-found")}</p>
                  )
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>

      {/* Transaction Details Dialog */}
      {selectedTransaction && (
        <TransactionDetails
          transaction={selectedTransaction}
          open={showTransactionDetails}
          onOpenChange={setShowTransactionDetails}
        />
      )}

      {/* Compensate Customer Dialog */}
      {selectedTransaction && (
        <CompensateCustomerDialog
          transaction={selectedTransaction}
          open={showCompensateDialog}
          onOpenChange={setShowCompensateDialog}
          onSubmit={handleCompensateSubmit}
        />
      )}

      {/* Change Transaction Status Dialog */}
      {selectedTransaction && (
        <ChangeTransactionStatusDialog
          transaction={selectedTransaction}
          open={showChangeStatusDialog}
          onOpenChange={setShowChangeStatusDialog}
          onSubmit={handleSubmitStatusChange}
        />
      )}
    </Card>
  );
};
