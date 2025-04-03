
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, RefreshCw, Wallet, Users } from "lucide-react";
import { userService } from "@/lib/api/user-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WalletsTable } from "@/components/wallets/WalletsTable";
import { WalletsLoadingSkeleton } from "@/components/wallets/WalletsLoadingSkeleton";
import { useToast } from "@/hooks/use-toast";

const WalletManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const { 
    data: walletsWithUsers = [], 
    isLoading, 
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ["all-wallets"],
    queryFn: async () => {
      try {
        const allWallets = await userService.getAllWallets();
        return allWallets;
      } catch (error) {
        console.error("Failed to fetch wallets:", error);
        toast({
          title: "Error",
          description: "Failed to load wallets",
          variant: "destructive",
        });
        return [];
      }
    }
  });

  // Get all wallet objects for calculations
  const allWallets = walletsWithUsers.map(item => item.wallet);

  const filteredWallets = walletsWithUsers.filter(item => {
    const wallet = item.wallet;
    const walletMatch = 
      wallet.id.toString().includes(searchTerm) || 
      (wallet.currency && wallet.currency.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (wallet.status && wallet.status.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Also search by user ID
    const userMatch = item.userId.includes(searchTerm);
    
    return walletMatch || userMatch;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet Management</h1>
          <p className="text-muted-foreground">
            View and manage all wallets across the platform
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Wallets
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allWallets.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Wallets
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allWallets.filter(wallet => wallet.status?.toLowerCase() === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${allWallets.reduce((sum, wallet) => sum + (wallet.balance || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              USD equivalent
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Users with Wallets
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(walletsWithUsers.map(item => item.userId)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Total users with wallets
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Wallets</CardTitle>
          <CardDescription>
            Manage wallets for all users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <form onSubmit={handleSearch} className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search wallets..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
            <Button variant="outline" onClick={handleRefresh} disabled={isRefetching}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
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
