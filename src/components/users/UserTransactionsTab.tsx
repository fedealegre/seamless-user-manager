
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/api";
import { Wallet, Transaction } from "@/lib/api/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import TransactionsLoadingSkeleton from "@/components/transactions/TransactionsLoadingSkeleton";
import { useToast } from "@/components/ui/use-toast";

interface UserTransactionsTabProps {
  userId: string;
  wallets: Wallet[];
}

export const UserTransactionsTab: React.FC<UserTransactionsTabProps> = ({ userId, wallets }) => {
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { toast } = useToast();

  // Get the first wallet ID when wallets are loaded
  React.useEffect(() => {
    if (wallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(wallets[0].id.toString());
    }
  }, [wallets, selectedWalletId]);

  // Fetch transactions for the selected wallet
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['user-transactions', userId, selectedWalletId],
    queryFn: () => {
      if (!selectedWalletId) return Promise.resolve([]);
      return apiService.getWalletTransactions(userId, selectedWalletId);
    },
    enabled: !!selectedWalletId,
  });

  // Dummy handlers for transaction actions (these would be implemented in a real app)
  const handleViewDetails = (transaction: Transaction) => {
    toast({
      title: "Transaction Details",
      description: `Viewing details for transaction ${transaction.transactionId}`,
    });
  };

  const handleCancelTransaction = (transaction: Transaction) => {
    toast({
      title: "Cancel Transaction",
      description: `Cancellation of transaction ${transaction.transactionId} not implemented in this view`,
    });
  };

  const handleCompensateCustomer = (transaction: Transaction) => {
    toast({
      title: "Compensate Customer",
      description: `Compensation for transaction ${transaction.transactionId} not implemented in this view`,
    });
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
    </Card>
  );
};
