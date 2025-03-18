
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, RefreshCw, Wallet } from "lucide-react";
import { apiService } from "@/lib/api";
import BackofficeLayout from "@/components/BackofficeLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WalletsTable } from "@/components/wallets/WalletsTable";
import { WalletsLoadingSkeleton } from "@/components/wallets/WalletsLoadingSkeleton";
import { useToast } from "@/hooks/use-toast";

const WalletManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("1"); // Default to first user
  const { toast } = useToast();
  
  const { 
    data: wallets = [], 
    isLoading, 
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ["wallets", selectedUserId],
    queryFn: async () => {
      try {
        const walletsList = await apiService.getUserWallets(selectedUserId);
        return walletsList;
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

  const filteredWallets = wallets.filter(wallet => 
    wallet.id.toString().includes(searchTerm) || 
    (wallet.currency && wallet.currency.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (wallet.status && wallet.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <BackofficeLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Wallet Management</h1>
            <p className="text-muted-foreground">
              View and manage user wallets
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Wallet
          </Button>
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
              <div className="text-2xl font-bold">{wallets.length}</div>
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
                {wallets.filter(wallet => wallet.status === "active").length}
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
                ${wallets.reduce((sum, wallet) => sum + (wallet.balance || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                USD equivalent
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Balance
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${wallets.length ? (wallets.reduce((sum, wallet) => sum + (wallet.balance || 0), 0) / wallets.length).toLocaleString(undefined, {maximumFractionDigits: 2}) : '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Per wallet
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Wallets</CardTitle>
            <CardDescription>
              Manage wallets for user ID: {selectedUserId}
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
              <WalletsLoadingSkeleton />
            ) : (
              <WalletsTable wallets={filteredWallets} />
            )}
          </CardContent>
        </Card>
      </div>
    </BackofficeLayout>
  );
};

export default WalletManagement;
