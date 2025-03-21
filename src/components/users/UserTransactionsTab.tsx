
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

interface UserTransactionsTabProps {
  userId: string;
  wallets: Wallet[];
}

export const UserTransactionsTab: React.FC<UserTransactionsTabProps> = ({ userId, wallets }) => {
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { toast } = useToast();
  
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
  const { data: transactions, isLoading } = useQuery({
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
      title: "Cancel Transaction",
      description: `Cancellation of transaction ${transaction.transactionId} not implemented in this view`,
    });
  };

  const handleCompensateCustomer = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowCompensateDialog(true);
  };

  const handleCompensateSubmit = async (amount: string, reason: string) => {
    if (!selectedTransaction || !selectedWalletId) {
      toast({
        title: "Error",
        description: "Missing transaction or wallet information",
        variant: "destructive",
      });
      return;
    }

    try {
      // Assuming these are required fields for compensation
      const compensationRequest = {
        amount,
        reason,
        transaction_code: selectedTransaction.transactionId,
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
        title: "Compensation Processed",
        description: `Transaction ${result.transactionId} has been created for compensation`,
      });

      // Close the dialog and refetch transactions
      setShowCompensateDialog(false);
      setSelectedTransaction(null);
    } catch (error: any) {
      toast({
        title: "Compensation Failed",
        description: error.message || "An error occurred while processing the compensation",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Transactions</CardTitle>
        <CardDescription>
          View transactions for each wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        {wallets.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">No wallets found for this user</p>
        ) : (
          <Tabs 
            value={selectedWalletId || ""}
            onValueChange={(value) => setSelectedWalletId(value)}
            className="w-full"
          >
            <TabsList className="mb-4 w-full h-auto flex-wrap">
              {wallets.map((wallet) => (
                <TabsTrigger key={wallet.id} value={wallet.id.toString()}>
                  {wallet.currency} Wallet ({wallet.id})
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
                    <p className="text-center py-6 text-muted-foreground">No transactions found for this wallet</p>
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
