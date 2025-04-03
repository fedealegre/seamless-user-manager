
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

interface UserTransactionsTabProps {
  userId: string;
  wallets: Wallet[];
}

export const UserTransactionsTab: React.FC<UserTransactionsTabProps> = ({ userId, wallets }) => {
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { toast } = useToast();
  const { settings } = useBackofficeSettings();
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
      // Assuming these are required fields for compensation
      const compensationRequest = {
        amount,
        reason,
        transaction_code: selectedTransaction.transactionId || selectedTransaction.id.toString(),
        admin_user: "current-admin", // This should come from auth context in a real app
        transaction_type: "COMPENSATE" as const,
      };

      // Use the company ID from the wallet if available, or use a default
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

      // Close the dialog and refetch transactions
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("user-transactions")}</CardTitle>
        <CardDescription>
          {t("view-wallet-transactions")}
        </CardDescription>
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
                  {wallet.currency} {t("wallets")} ({wallet.id})
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
