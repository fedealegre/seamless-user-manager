
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Wallet } from "@/lib/api/types";
import { getUserService } from "@/lib/api";
import { WalletsTable } from "@/components/wallets/WalletsTable";
import { WalletsLoadingSkeleton } from "@/components/wallets/WalletsLoadingSkeleton";
import BackofficeLayout from "@/components/BackofficeLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

const COLORS = ["#4f46e5", "#06b6d4", "#8b5cf6", "#ec4899"];

const WalletManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();
  
  const { data: allWallets, isLoading, error } = useQuery({
    queryKey: ["all-wallets"],
    queryFn: async () => {
      const userService = getUserService();
      return userService.getAllWallets();
    },
  });

  const filteredWallets = allWallets?.filter((wallet) => {
    const walletData = wallet.wallet;
    const lowerCaseQuery = searchQuery.toLowerCase();
    
    return (
      walletData.id.toString().includes(lowerCaseQuery) ||
      walletData.currency.toLowerCase().includes(lowerCaseQuery) ||
      walletData.status.toLowerCase().includes(lowerCaseQuery) ||
      wallet.userId.toLowerCase().includes(lowerCaseQuery)
    );
  });

  // Count wallets by status
  const activeWalletsCount = allWallets?.filter(item => item.wallet.status === "active").length || 0;
  const blockedWalletsCount = allWallets?.filter(item => item.wallet.status === "blocked").length || 0;
  
  // Count wallets by currency for pie chart
  const currencyCounts: Record<string, number> = {};
  allWallets?.forEach(item => {
    const { currency } = item.wallet;
    currencyCounts[currency] = (currencyCounts[currency] || 0) + 1;
  });
  
  const topCurrencies = Object.entries(currencyCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  return (
    <BackofficeLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">{t("wallets")}</h1>
          <p className="text-muted-foreground">
            {t("wallets")}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("total")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allWallets?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("activeWallets")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeWalletsCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("blockedWallets")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blockedWalletsCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("topCurrencies")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              {topCurrencies.length > 0 ? (
                <ResponsiveContainer width="100%" height={100}>
                  <PieChart>
                    <Pie
                      data={topCurrencies}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={40}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {topCurrencies.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value}`, `${name}`]}
                      labelFormatter={() => ""}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[100px] items-center justify-center">
                  <p className="text-sm text-muted-foreground">{t("noResults")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mb-4">
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {isLoading ? (
          <WalletsLoadingSkeleton showUser={true} />
        ) : error ? (
          <Card>
            <CardContent className="py-10">
              <div className="text-center text-muted-foreground">
                Error loading wallets data
              </div>
            </CardContent>
          </Card>
        ) : filteredWallets && filteredWallets.length > 0 ? (
          <WalletsTable 
            wallets={filteredWallets.map(w => w.wallet)} 
            userIds={filteredWallets.map(w => w.userId)}
            showUser={true}
          />
        ) : (
          <Card>
            <CardContent className="py-10">
              <div className="text-center text-muted-foreground">
                {t("noResults")}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </BackofficeLayout>
  );
};

export default WalletManagement;
