
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { Transaction, User, Wallet } from "@/lib/api/types";

export function useUserDetails(userId?: string) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { toast } = useToast();
  
  // Query for user details
  const { 
    data: user,
    isLoading: isLoadingUser
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => userId ? api.getUserData(userId) : Promise.reject("No user ID provided"),
    enabled: !!userId,
  });

  // Query for user wallets
  const {
    data: wallets,
    isLoading: isLoadingWallets
  } = useQuery({
    queryKey: ["wallets", userId],
    queryFn: () => userId ? api.getUserWallets(userId) : Promise.reject("No user ID provided"),
    enabled: !!userId,
  });

  // Query for user transactions (across all wallets)
  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions
  } = useQuery({
    queryKey: ["transactions", userId, currentPage],
    queryFn: async () => {
      if (!userId || !wallets || wallets.length === 0) {
        return [];
      }
      
      // Fetch transactions from the first wallet as a simplified approach
      // In a real application, you might want to fetch transactions from all wallets
      const firstWallet = wallets[0];
      if (!firstWallet) return [];
      
      return api.getWalletTransactions(
        userId, 
        firstWallet.id.toString(), 
        {
          page: currentPage,
          pageSize: pageSize
        }
      );
    },
    enabled: !!userId && !!wallets && wallets.length > 0,
  });

  const handleViewDetails = (transaction: Transaction) => {
    // Navigate to transaction details or show a modal
    toast({
      title: "Transaction Details",
      description: `Viewing details for transaction ${transaction.transactionId}`,
    });
  };

  const handleCancelTransaction = (transaction: Transaction) => {
    // Show confirmation dialog and call API to cancel
    toast({
      title: "Cancel Transaction",
      description: `Initiating cancellation for transaction ${transaction.transactionId}`,
    });
  };

  const handleCompensateCustomer = (transaction: Transaction) => {
    // Show compensation dialog and call API
    toast({
      title: "Compensate Customer",
      description: `Initiating compensation for transaction ${transaction.transactionId}`,
    });
  };

  useEffect(() => {
    // Reset the current page when userId changes
    setCurrentPage(1);
  }, [userId]);

  return {
    user,
    wallets,
    transactions,
    isLoadingUser,
    isLoadingWallets,
    isLoadingTransactions,
    currentPage,
    pageSize,
    handleViewDetails,
    handleCancelTransaction,
    handleCompensateCustomer,
    setCurrentPage,
    refetchTransactions
  };
}
