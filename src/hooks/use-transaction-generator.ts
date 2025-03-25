
import { useEffect, useState } from "react";
import { userService } from "@/lib/api/user-service";
import { Transaction } from "@/lib/api/types";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export function useTransactionGenerator() {
  const [isGenerating, setIsGenerating] = useState(true);
  const [latestTransaction, setLatestTransaction] = useState<Transaction | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isGenerating) {
      // Generate a new transaction every 30 seconds
      intervalId = setInterval(async () => {
        try {
          const newTransaction = await userService.generateRandomTransaction();
          setLatestTransaction(newTransaction);
          
          // Show a toast notification
          toast({
            title: "New Transaction Generated",
            description: `${newTransaction.type} transaction of ${newTransaction.amount} ${newTransaction.currency} for user ${newTransaction.customerId}`,
          });
          
          // Invalidate relevant queries to refresh the data
          queryClient.invalidateQueries({ 
            queryKey: ['user-transactions']
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
  }, [isGenerating, queryClient, toast]);

  const toggleGeneration = () => {
    setIsGenerating(prev => !prev);
  };

  return {
    isGenerating,
    toggleGeneration,
    latestTransaction
  };
}
