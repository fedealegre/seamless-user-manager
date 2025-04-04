
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/lib/api/user-service";
import { Wallet, Transaction } from "@/lib/api/types";
import { useEffect, useState } from "react";

export interface WalletStatistics {
  totalBalance: number;
  totalUsers: number;
  usersByType: Record<string, number>;
  transactionsByType: Record<string, { count: number; amount: number }>;
  walletBalanceHistory: Array<{ date: string; balance: number }>;
  transactionHistory: Array<{ 
    date: string; 
    type: string; 
    amount: number;
    count: number;
  }>;
  monthlyBilling: Array<{ 
    month: string; 
    amount: number;
    count: number;
  }>;
  userGrowth: Array<{
    date: string;
    active: number;
    blocked: number;
    pending: number;
    total: number;
  }>;
  isLoading: boolean;
  error: Error | null;
}

export function useWalletStatistics(
  startDate?: Date,
  endDate?: Date
): WalletStatistics {
  // Fetch all wallets
  const {
    data: allWallets,
    isLoading: isLoadingWallets,
    error: walletsError
  } = useQuery({
    queryKey: ['dashboard-all-wallets'],
    queryFn: async () => {
      return userService.getAllWallets();
    }
  });

  // Fetch all users
  const { 
    data: users,
    isLoading: isLoadingUsers,
    error: usersError 
  } = useQuery({
    queryKey: ['dashboard-all-users'],
    queryFn: async () => {
      return userService.searchUsers({ });
    }
  });

  // Generate sample transaction data for the dashboard
  // In a real application, this would be replaced with actual API calls
  const [processedData, setProcessedData] = useState<Omit<WalletStatistics, 'isLoading' | 'error'>>({
    totalBalance: 0,
    totalUsers: 0,
    usersByType: {},
    transactionsByType: {},
    walletBalanceHistory: [],
    transactionHistory: [],
    monthlyBilling: [],
    userGrowth: []
  });

  useEffect(() => {
    if (!allWallets || !users) return;

    // Calculate total available balance across all wallets
    const totalBalance = allWallets.reduce((sum, { wallet }) => {
      return sum + (wallet.availableBalance || 0);
    }, 0);

    // Count users by type (using additional info as user type for demo)
    const usersByType: Record<string, number> = {};
    users.forEach(user => {
      const userType = user.additionalInfo?.userType || 'Standard';
      usersByType[userType] = (usersByType[userType] || 0) + 1;
    });

    // Generate wallet balance history (simulated data)
    const today = new Date();
    const walletBalanceHistory = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - 29 + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Generate a somewhat realistic balance curve
      const baseBalance = totalBalance * 0.7;
      const randomFactor = 1 + (Math.sin(i / 5) * 0.15) + (Math.random() * 0.1);
      
      return {
        date: dateStr,
        balance: Math.round(baseBalance * randomFactor)
      };
    });

    // Generate transaction types data
    const transactionTypes = ['deposit', 'withdrawal', 'transfer', 'payment', 'refund'];
    const transactionsByType: Record<string, { count: number; amount: number }> = {};
    
    transactionTypes.forEach(type => {
      // Simulated counts and amounts
      transactionsByType[type] = {
        count: Math.floor(Math.random() * 1000) + 100,
        amount: Math.floor(Math.random() * 100000) + 10000
      };
    });

    // Generate transaction history
    const transactionHistory = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - 29 + i);
      const dateStr = date.toISOString().split('T')[0];
      const type = transactionTypes[i % transactionTypes.length];
      
      return {
        date: dateStr,
        type,
        amount: Math.floor(Math.random() * 10000) + 1000,
        count: Math.floor(Math.random() * 100) + 10
      };
    });

    // Generate monthly billing data
    const monthlyBilling = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(today.getMonth() - 11 + i);
      const monthStr = date.toISOString().substring(0, 7); // YYYY-MM
      
      return {
        month: monthStr,
        amount: Math.floor(Math.random() * 500000) + 100000,
        count: Math.floor(Math.random() * 5000) + 1000
      };
    });

    // Generate user growth data
    const userGrowth = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(today.getMonth() - 11 + i);
      const dateStr = date.toISOString().substring(0, 7); // YYYY-MM
      
      const baseActive = Math.floor(users.length * 0.6 * ((i + 1) / 12));
      const baseBlocked = Math.floor(users.length * 0.1 * ((i + 1) / 12));
      const basePending = Math.floor(users.length * 0.3 * ((i + 1) / 12));
      
      return {
        date: dateStr,
        active: baseActive,
        blocked: baseBlocked,
        pending: basePending,
        total: baseActive + baseBlocked + basePending
      };
    });

    setProcessedData({
      totalBalance,
      totalUsers: users.length,
      usersByType,
      transactionsByType,
      walletBalanceHistory,
      transactionHistory,
      monthlyBilling,
      userGrowth
    });
  }, [allWallets, users, startDate, endDate]);

  return {
    ...processedData,
    isLoading: isLoadingWallets || isLoadingUsers,
    error: walletsError || usersError
  };
}
