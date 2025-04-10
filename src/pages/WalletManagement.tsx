import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

const WalletManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  const { 
    data: walletsWithUsers = [], 
    isLoading
  } = useQuery({
    queryKey: ["all-wallets"],
    queryFn: async () => {
      try {
        const allWallets = await userService.getAllWallets();
        return allWallets;
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
    
    const userMatch = item.userId.includes(searchTerm);
    
    return walletMatch || userMatch;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Calculate unique currencies
  const uniqueCurrencies = [...new Set(allWallets.map(wallet => wallet.currency || 'N/A'))];
  const primaryCurrency = uniqueCurrencies.length > 0 ? uniqueCurrencies[0] : 'USD';

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
              {new Set(walletsWithUsers.map(item => item.userId)).size}
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
              {primaryCurrency} {allWallets.reduce((sum, wallet) => sum + (wallet.availableBalance || 0), 0).toLocaleString()}
            </div>
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
            <WalletsTable wallets={filteredWallets.map(item => ({
              ...item.wallet,
              userId: item.userId
            }))} 
            showUser={true} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletManagement;
