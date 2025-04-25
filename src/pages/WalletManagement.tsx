import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Wallet, Users } from "lucide-react";
import { userService } from "@/lib/api/user-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WalletsTable } from "@/components/wallets/WalletsTable";
import { WalletsLoadingSkeleton } from "@/components/wallets/WalletsLoadingSkeleton";
import { useToast } from "@/hooks/use-toast";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { WalletUsersDialog } from "@/components/wallets/WalletUsersDialog";

const WalletManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const queryClient = useQueryClient();
  
  // Dialog states
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [showWalletUsers, setShowWalletUsers] = useState(false);
  
  const { 
    data: walletsWithUsers = [], 
    isLoading
  } = useQuery({
    queryKey: ["all-wallets"],
    queryFn: async () => {
      try {
        const allWallets = await userService.getAllWallets();
        
        // Get wallet-user associations to determine multiple users
        const associations = await userService.getWalletUserAssociations();
        
        // Group by wallet ID to count users per wallet
        const walletsWithMultipleUsers = allWallets.map(item => {
          const walletId = item.wallet.id.toString();
          const userIds = associations
            .filter(assoc => assoc.walletId.toString() === walletId)
            .map(assoc => assoc.userId);
          
          return {
            ...item,
            wallet: { 
              ...item.wallet,
              userIds: userIds.length > 0 ? userIds : [item.userId]
            }
          };
        });
        
        return walletsWithMultipleUsers;
      } catch (error) {
        console.error("Failed to fetch wallets:", error);
        toast({
          title: t("error"),
          description: t("no-wallets-found"),
          variant: "destructive",
        });
        return [];
      }
    }
  });

  const allWallets = walletsWithUsers.map(item => item.wallet);

  const filteredWallets = walletsWithUsers.filter(item => {
    const wallet = item.wallet;
    const walletMatch = 
      wallet.id.toString().includes(searchTerm) || 
      (wallet.currency && wallet.currency.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (wallet.status && wallet.status.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Check if any of the user IDs match
    const userMatch = item.userId.includes(searchTerm) || 
      (wallet.userIds?.some(userId => userId.includes(searchTerm)) ?? false);
    
    return walletMatch || userMatch;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleViewWalletUsers = (walletId: string) => {
    setSelectedWalletId(walletId);
    setShowWalletUsers(true);
  };

  const handleUserAdded = () => {
    // Refresh the wallet data after adding a user
    queryClient.invalidateQueries({
      queryKey: ["all-wallets"]
    });
    
    if (selectedWalletId) {
      queryClient.invalidateQueries({
        queryKey: ["wallet-users", selectedWalletId]
      });
    }
  };

  // Calculate unique currencies
  const uniqueCurrencies = [...new Set(allWallets.map(wallet => wallet.currency || 'N/A'))];
  const primaryCurrency = uniqueCurrencies.length > 0 ? uniqueCurrencies[0] : 'USD';

  // Calculate total unique users
  const uniqueUsers = new Set();
  walletsWithUsers.forEach(item => {
    if (item.wallet.userIds && item.wallet.userIds.length > 0) {
      item.wallet.userIds.forEach(userId => uniqueUsers.add(userId));
    } else if (item.userId) {
      uniqueUsers.add(item.userId);
    }
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("wallets")}</h1>
          <p className="text-muted-foreground">
            {t("monitor-and-manage-payment-transactions")}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("users-with-wallets")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {uniqueUsers.size}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("total-users-with-wallets")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("active-wallets")}
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allWallets.filter(wallet => wallet.status?.toLowerCase() === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("currently-active")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("total-balance")}
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allWallets.reduce((sum, wallet) => sum + (wallet.balance || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {primaryCurrency}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("total-available-balance")}
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allWallets.reduce((sum, wallet) => sum + (wallet.availableBalance || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {primaryCurrency}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("all-wallets")}</CardTitle>
          <CardDescription>
            {t("manage-wallets-for-all-users")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <form onSubmit={handleSearch} className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("search-wallets")}
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
          </div>

          {isLoading ? (
            <WalletsLoadingSkeleton showUser={true} />
          ) : (
            <WalletsTable 
              wallets={filteredWallets.map(item => ({
                ...item.wallet,
                userId: item.userId
              }))} 
              showUser={true}
              onViewWalletUsers={handleViewWalletUsers}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialog for viewing wallet users */}
      {selectedWalletId && (
        <WalletUsersDialog
          walletId={selectedWalletId}
          open={showWalletUsers}
          onOpenChange={setShowWalletUsers}
        />
      )}
    </div>
  );
};

export default WalletManagement;
