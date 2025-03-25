
import { useEffect, useState } from "react";
import { userService } from "@/lib/api/user-service";
import { Transaction } from "@/lib/api/types";
import { useQueryClient } from "@tanstack/react-query";

export function useTransactionGenerator() {
  const [isGenerating, setIsGenerating] = useState(true);
  const [latestTransaction, setLatestTransaction] = useState<Transaction | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isGenerating) {
      // Generate a new transaction every 30 seconds
      intervalId = setInterval(async () => {
        try {
          const newTransaction = await userService.generateRandomTransaction();
          setLatestTransaction(newTransaction);
          
          // Invalidate relevant queries to refresh the data
          queryClient.invalidateQueries({ 
            queryKey: ['user-transactions']
          });
          
          queryClient.invalidateQueries({ 
            queryKey: ['transactions']
          });
          
          // If the transaction belongs to a specific wallet, invalidate that query too
          if (newTransaction.walletId) {
            queryClient.invalidateQueries({ 
              queryKey: ['wallet-transactions', newTransaction.walletId]
            });
          }
        } catch (error) {
          console.error("Failed to generate transaction:", error);
        }
      }, 30000); // 30 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isGenerating, queryClient]);

  const toggleGeneration = () => {
    setIsGenerating(prev => !prev);
  };

  return {
    isGenerating,
    toggleGeneration,
    latestTransaction
  };
}
