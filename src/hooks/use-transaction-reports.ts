
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/lib/api/user-service";
import { Transaction } from "@/lib/api/types";
import { useState, useEffect } from "react";

export interface TransactionReportData {
  transactionsByType: Record<string, { count: number; amount: number }>;
  monthlyTransactions: Array<{ 
    month: string; 
    type: string;
    amount: number;
    count: number;
  }>;
  transactionList: Transaction[];
  availableTransactionTypes: string[];
  availableUserTypes: string[];
  isLoading: boolean;
  error: Error | null;
}

export function useTransactionReports(
  startDate?: Date,
  endDate?: Date,
  selectedTypes?: string[],
  userType?: string
): TransactionReportData {
  // In a real application, these queries would use the filters
  // Fetch simulated transaction data
  const {
    data: transactions,
    isLoading,
    error
  } = useQuery({
    queryKey: ['transaction-reports', { startDate, endDate, selectedTypes, userType }],
    queryFn: async () => {
      // Generate sample transactions
      return Array.from({ length: 100 }, (_, i) => {
        const types = ['deposit', 'withdrawal', 'transfer', 'payment', 'refund'];
        const userTypes = ['personal', 'business', 'merchant'];
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        
        const typeIndex = Math.floor(Math.random() * types.length);
        const type = types[typeIndex];
        
        const userTypeIndex = Math.floor(Math.random() * userTypes.length);
        const walletUserType = userTypes[userTypeIndex];
        
        return {
          id: i + 1,
          transactionId: `TX-${(1000000 + i).toString()}`,
          date: date.toISOString(),
          walletId: `W-${10000 + Math.floor(Math.random() * 1000)}`,
          customerId: `CU-${10000 + Math.floor(Math.random() * 1000)}`,
          type: type,
          movementType: type,
          status: Math.random() > 0.2 ? 'completed' : 'pending',
          amount: Math.floor(Math.random() * 1000) + 10,
          currency: 'USD',
          additionalInfo: {
            userType: walletUserType
          }
        } as Transaction;
      });
    }
  });

  const [processedData, setProcessedData] = useState<Omit<TransactionReportData, 'isLoading' | 'error'>>({
    transactionsByType: {},
    monthlyTransactions: [],
    transactionList: [],
    availableTransactionTypes: [],
    availableUserTypes: []
  });

  useEffect(() => {
    if (!transactions) return;

    // Filter transactions based on criteria if provided
    let filteredTransactions = [...transactions];
    
    if (startDate) {
      filteredTransactions = filteredTransactions.filter(t => 
        t.date && new Date(t.date) >= startDate
      );
    }
    
    if (endDate) {
      filteredTransactions = filteredTransactions.filter(t => 
        t.date && new Date(t.date) <= endDate
      );
    }
    
    if (selectedTypes && selectedTypes.length > 0) {
      filteredTransactions = filteredTransactions.filter(t => 
        selectedTypes.includes(t.type || t.movementType || '')
      );
    }
    
    if (userType) {
      filteredTransactions = filteredTransactions.filter(t => 
        t.additionalInfo?.userType === userType
      );
    }

    // Aggregate transactions by type
    const transactionsByType: Record<string, { count: number; amount: number }> = {};
    const typeSet = new Set<string>();
    const userTypeSet = new Set<string>();
    
    filteredTransactions.forEach(transaction => {
      const type = transaction.type || transaction.movementType || 'unknown';
      typeSet.add(type);
      
      if (transaction.additionalInfo?.userType) {
        userTypeSet.add(transaction.additionalInfo.userType);
      }
      
      if (!transactionsByType[type]) {
        transactionsByType[type] = { count: 0, amount: 0 };
      }
      
      transactionsByType[type].count += 1;
      transactionsByType[type].amount += transaction.amount || 0;
    });

    // Generate monthly transaction data
    const monthlyData: Record<string, Record<string, { count: number; amount: number }>> = {};
    
    filteredTransactions.forEach(transaction => {
      if (!transaction.date) return;
      
      const date = new Date(transaction.date);
      const month = date.toISOString().substring(0, 7); // YYYY-MM
      const type = transaction.type || transaction.movementType || 'unknown';
      
      if (!monthlyData[month]) {
        monthlyData[month] = {};
      }
      
      if (!monthlyData[month][type]) {
        monthlyData[month][type] = { count: 0, amount: 0 };
      }
      
      monthlyData[month][type].count += 1;
      monthlyData[month][type].amount += transaction.amount || 0;
    });

    // Convert monthly data to array format
    const monthlyTransactions = Object.entries(monthlyData).flatMap(([month, types]) => 
      Object.entries(types).map(([type, data]) => ({
        month,
        type,
        amount: data.amount,
        count: data.count
      }))
    );

    // Sort by month
    monthlyTransactions.sort((a, b) => a.month.localeCompare(b.month));

    setProcessedData({
      transactionsByType,
      monthlyTransactions,
      transactionList: filteredTransactions,
      availableTransactionTypes: Array.from(typeSet),
      availableUserTypes: Array.from(userTypeSet)
    });
  }, [transactions, startDate, endDate, selectedTypes, userType]);

  return {
    ...processedData,
    isLoading,
    error
  };
}
