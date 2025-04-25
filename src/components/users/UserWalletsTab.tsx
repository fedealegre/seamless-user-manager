import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Wallet } from "@/lib/api/types";
import { WalletsTable } from "@/components/wallets/WalletsTable";
import { WalletsLoadingSkeleton } from "@/components/wallets/WalletsLoadingSkeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserTransactionsTab } from "./UserTransactionsTab";
import { useToast } from "@/hooks/use-toast";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { userService } from "@/lib/api/user-service";
import { AddUserToWalletDialog } from "@/components/wallets/AddUserToWalletDialog";

interface UserWalletsTabProps {
  userId: string;
  wallets: Wallet[];
  isLoading: boolean;
}

export const UserWalletsTab: React.FC<UserWalletsTabProps> = ({ userId, wallets, isLoading }) => {
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [showTransactions, setShowTransactions] = useState<boolean>(false);
  const [page, setPage = useState(1);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const pageSize = 5; // Smaller pageSize for wallets since there are usually fewer
  const { toast } = useToast();
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const queryClient = useQueryClient();

  // Set first wallet as selected when wallets load
  useEffect(() => {
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

  const handleAddUserToWallet = (walletId: string) => {
    setSelectedWalletId(walletId);
    setShowAddUserDialog(true);
  };

  const handleUserAdded = () => {
    // Refresh the wallets data
    queryClient.invalidateQueries({
      queryKey: ['user-wallets', userId]
    });
    
    if (selectedWalletId) {
      queryClient.invalidateQueries({
        queryKey: ['wallet-users', selectedWalletId]
      });
    }
    
    toast({
      title: t("success"),
      description: t("user-added-to-wallet"),
    });
  };

  // Calculate pagination values
  const totalWallets = wallets.length;
  const totalPages = Math.ceil(totalWallets / pageSize);
  
  // Get the wallets for the current page
  const startIndex = (page - 1) * pageSize;
  const paginatedWallets = wallets.slice(startIndex, startIndex + pageSize);

  if (showTransactions && selectedWalletId) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("wallet-transactions")}</CardTitle>
            <CardDescription>
              {t("transactions-for-wallet")} {selectedWalletId}
            </CardDescription>
          </div>
          <Button variant="outline" onClick={handleBackToWallets}>
            {t("back-to-wallets")}
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
        <CardTitle>{t("user-wallets")}</CardTitle>
        <CardDescription>
          {isLoading ? t("loading") : wallets.length > 0 
            ? `${wallets.length} ${t("wallets")} ${t("found")}. ${t("click-wallet-view-transactions")}` 
            : t("no-wallets-found")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <WalletsLoadingSkeleton />
        ) : (
          <>
            <WalletsTable 
              wallets={paginatedWallets} 
              onSelectWallet={handleSelectWallet}
              paginationProps={{
                page,
                pageSize,
                totalPages,
                totalItems: totalWallets,
                setPage,
              }}
            />
            
            {/* Add User to Wallet Dialog */}
            {selectedWalletId && (
              <AddUserToWalletDialog
                walletId={selectedWalletId}
                open={showAddUserDialog}
                onOpenChange={setShowAddUserDialog}
                onUserAdded={handleUserAdded}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
