
import React, { useState } from "react";
import { Wallet } from "@/lib/api/types";
import { WalletsTable } from "@/components/wallets/WalletsTable";
import { WalletsLoadingSkeleton } from "@/components/wallets/WalletsLoadingSkeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTransactionsTab } from "./UserTransactionsTab";
import { useToast } from "@/hooks/use-toast";

interface UserWalletsTabProps {
  userId: string;
  wallets: Wallet[];
  isLoading: boolean;
}

export const UserWalletsTab: React.FC<UserWalletsTabProps> = ({ userId, wallets, isLoading }) => {
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [showTransactions, setShowTransactions] = useState<boolean>(false);
  const { toast } = useToast();

  // Set first wallet as selected when wallets load
  React.useEffect(() => {
    if (wallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(wallets[0].id.toString());
    }
  }, [wallets, selectedWalletId]);

  const handleSelectWallet = (walletId: string) => {
    setSelectedWalletId(walletId);
    setShowTransactions(true);
  };

  const handleBackToWallets = () => {
    setShowTransactions(false);
  };

  if (showTransactions && selectedWalletId) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Wallet Transactions</CardTitle>
            <CardDescription>
              Transactions for wallet ID: {selectedWalletId}
            </CardDescription>
          </div>
          <Button variant="outline" onClick={handleBackToWallets}>
            Back to Wallets
          </Button>
        </CardHeader>
        <CardContent>
          <UserTransactionsTab
            userId={userId}
            wallets={wallets.filter(w => w.id.toString() === selectedWalletId)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Wallets</CardTitle>
        <CardDescription>
          {isLoading ? "Loading..." : wallets.length > 0 
            ? `${wallets.length} wallets found. Click on a wallet to view transactions.` 
            : "No wallets found for this user"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <WalletsLoadingSkeleton />
        ) : (
          <WalletsTable 
            wallets={wallets} 
            onSelectWallet={handleSelectWallet}
          />
        )}
      </CardContent>
    </Card>
  );
};
