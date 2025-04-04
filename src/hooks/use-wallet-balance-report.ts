
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/lib/api/user-service";
import { useState, useEffect } from "react";

export interface WalletBalanceReportData {
  walletBalances: Array<{
    walletId: string;
    userType: string;
    balance: number;
    currency: string;
  }>;
  totalBalance: number;
  balanceByUserType: Record<string, number>;
  availableUserTypes: string[];
  isLoading: boolean;
  error: Error | null;
}

export function useWalletBalanceReport(
  selectedUserType?: string
): WalletBalanceReportData {
  // Fetch all wallets
  const {
    data: allWallets,
    isLoading,
    error
  } = useQuery({
    queryKey: ['wallet-balance-report', { userType: selectedUserType }],
    queryFn: async () => {
      return userService.getAllWallets();
    }
  });

  const [processedData, setProcessedData] = useState<Omit<WalletBalanceReportData, 'isLoading' | 'error'>>({
    walletBalances: [],
    totalBalance: 0,
    balanceByUserType: {},
    availableUserTypes: []
  });

  useEffect(() => {
    if (!allWallets) return;

    // Generate user types for demo purposes (in real app, we'd get from the API)
    const userTypes = ['personal', 'business', 'merchant'];
    
    // Process wallet data
    const walletBalances = allWallets.map(({ wallet, userId }) => {
      // Random user type for demo purposes
      const userType = userTypes[Math.floor(Math.random() * userTypes.length)];
      
      return {
        walletId: wallet.id.toString(),
        userId,
        userType,
        balance: wallet.availableBalance || 0,
        currency: wallet.currency || 'USD'
      };
    });

    // Filter by user type if provided
    const filteredWallets = selectedUserType 
      ? walletBalances.filter(w => w.userType === selectedUserType)
      : walletBalances;

    // Calculate total balance
    const totalBalance = filteredWallets.reduce((sum, w) => sum + w.balance, 0);

    // Calculate balance by user type
    const balanceByUserType: Record<string, number> = {};
    filteredWallets.forEach(wallet => {
      if (!balanceByUserType[wallet.userType]) {
        balanceByUserType[wallet.userType] = 0;
      }
      balanceByUserType[wallet.userType] += wallet.balance;
    });

    setProcessedData({
      walletBalances: filteredWallets,
      totalBalance,
      balanceByUserType,
      availableUserTypes: userTypes
    });
  }, [allWallets, selectedUserType]);

  return {
    ...processedData,
    isLoading,
    error
  };
}
