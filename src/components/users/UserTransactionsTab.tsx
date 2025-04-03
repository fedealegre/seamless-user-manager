
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/lib/api/user-service";
import { Wallet, Transaction } from "@/lib/api/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import TransactionsLoadingSkeleton from "@/components/transactions/TransactionsLoadingSkeleton";
import { useToast } from "@/hooks/use-toast";
import TransactionDetails from "@/components/transactions/TransactionDetails";
import CompensateCustomerDialog from "@/components/transactions/CompensateCustomerDialog";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import ExportCSVButton from "@/components/common/ExportCSVButton";

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
  
  // Dialog states
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [showCompensateDialog, setShowCompensateDialog] = useState(false);

  // Get the first wallet ID when wallets are loaded
  React.useEffect(() => {
    if (wallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(wallets[0].id.toString());
    }
  }, [wallets, selectedWalletId]);

  // Fetch transactions for the selected wallet using userService
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['user-transactions', userId, selectedWalletId],
    queryFn: () => {
      if (!selectedWalletId) return Promise.resolve([]);
      return userService.getWalletTransactions(userId, selectedWalletId);
    },
    enabled: !!selectedWalletId,
  });

  // Handlers for transaction actions
  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
  };

  const handleCancelTransaction = (transaction: Transaction) => {
    toast({
      title: t("cancel-transaction"),
      description: `${t("transaction-cancellation-not-implemented")} ${transaction.transactionId || transaction.id}`,
    });
  };

  const handleCompensateCustomer = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowCompensateDialog(true);
  };

  const handleCompensateSubmit = async (amount: string, reason: string) => {
    if (!selectedTransaction || !selectedWalletId) {
      toast({
        title: t("error"),
        description: t("missing-transaction-wallet-info"),
        variant: "destructive",
      });
      return;
    }

    try {
      const compensationRequest = {
        amount,
        reason,
        transaction_code: selectedTransaction.transactionId || selectedTransaction.id.toString(),
        admin_user: "current-admin",
        transaction_type: "COMPENSATE" as const,
      };

      const companyId = selectedTransaction.customerId 
        ? parseInt(selectedTransaction.customerId)
        : 1;

      const originWalletId = parseInt(selectedWalletId);
      const walletId = parseInt(selectedWalletId);

      const result = await userService.compensateCustomer(
        companyId,
        userId,
        walletId,
        originWalletId,
        compensationRequest
      );

      toast({
        title: t("compensation-processed"),
        description: t("compensation-transaction-created"),
      });

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
      t(transaction.type?.toLowerCase() || transaction.movementType?.toLowerCase() || 'unknown'),
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
        {wallets.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">{t("no-wallets-found")}</p>
        ) : (
          <Tabs 
            value={selectedWalletId || ""}
            onValueChange={(value) => setSelectedWalletId(value)}
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
                    <TransactionsTable
                      transactions={transactions}
                      page={page}
                      pageSize={pageSize}
                      handleViewDetails={handleViewDetails}
                      handleCancelTransaction={handleCancelTransaction}
                      handleCompensateCustomer={handleCompensateCustomer}
                    />
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
    </Card>
  );
};
