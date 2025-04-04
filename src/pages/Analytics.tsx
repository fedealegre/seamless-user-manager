
import React, { useState } from "react";
import BackofficeLayout from "@/components/BackofficeLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import WalletBehaviorChart from "@/components/dashboard/WalletBehaviorChart";
import UserGrowthChart from "@/components/dashboard/UserGrowthChart";
import BillingDataChart from "@/components/dashboard/BillingDataChart";
import DateRangeFilter from "@/components/dashboard/DateRangeFilter";
import { useWalletStatistics } from "@/hooks/use-wallet-statistics";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

const Analytics = () => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  const { 
    totalBalance,
    totalUsers,
    usersByType,
    walletBalanceHistory,
    transactionHistory,
    monthlyBilling,
    userGrowth,
    isLoading, 
    error 
  } = useWalletStatistics(startDate, endDate);

  const clearDateFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  if (error) {
    return (
      <BackofficeLayout>
        <div className="p-6 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-xl font-bold text-red-800 mb-2">{t("error-loading-dashboard")}</h2>
          <p className="text-red-600">{error.message}</p>
        </div>
      </BackofficeLayout>
    );
  }

  return (
    <BackofficeLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">{t("analytics-dashboard")}</h1>
        
        {/* Header with KPIs */}
        <DashboardHeader 
          totalBalance={totalBalance}
          totalUsers={totalUsers}
          usersByType={usersByType}
          isLoading={isLoading}
        />
        
        {/* Date Range Filter */}
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onClearDates={clearDateFilters}
        />
        
        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Wallet Behavior Chart */}
          <WalletBehaviorChart
            walletBalanceHistory={walletBalanceHistory}
            transactionHistory={transactionHistory}
            isLoading={isLoading}
          />
          
          {/* User Growth Chart */}
          <UserGrowthChart
            userGrowth={userGrowth}
            isLoading={isLoading}
          />
          
          {/* Billing Data Chart */}
          <BillingDataChart
            monthlyBilling={monthlyBilling}
            isLoading={isLoading}
          />
        </div>
      </div>
    </BackofficeLayout>
  );
};

export default Analytics;
