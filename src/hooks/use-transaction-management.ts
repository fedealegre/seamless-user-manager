
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/api";
import { Transaction } from "@/lib/api/types";
import { useToast } from "@/hooks/use-toast";

interface TransactionFilters {
  status: string;
  transactionType: string;
  startDate: string;
  endDate: string;
  currency: string;
}

export const useTransactionManagement = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showCompensateDialog, setShowCompensateDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({
    status: "",
    transactionType: "",
    startDate: "",
    endDate: "",
    currency: "",
  });
  
  const { toast } = useToast();

  // Fetch transactions query
  const { data: transactions, isLoading, refetch } = useQuery({
    queryKey: ["transactions", page, pageSize, searchTerm, filters],
    queryFn: async () => {
      // In a real implementation, you would use the filters
      // For demo, we'll use a fixed user and wallet
      const userId = "1";
      const walletId = "101";
      
      try {
        const txns = await apiService.getWalletTransactions(userId, walletId);
        
        // Apply client-side filtering (in a real app, this would be done by the API)
        return txns.filter(t => {
          if (searchTerm && 
              !t.transactionId.includes(searchTerm) && 
              !t.reference?.includes(searchTerm)) {
            return false;
          }
          
          if (filters.status && t.status !== filters.status) {
            return false;
          }
          
          if (filters.transactionType && t.type !== filters.transactionType) {
            return false;
          }
          
          if (filters.currency && t.currency !== filters.currency) {
            return false;
          }
          
          if (filters.startDate && t.date && new Date(t.date) < new Date(filters.startDate)) {
            return false;
          }
          
          if (filters.endDate && t.date && new Date(t.date) > new Date(filters.endDate)) {
            return false;
          }
          
          return true;
        });
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        toast({
          title: "Error",
          description: "Failed to load transactions",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    refetch();
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsDialog(true);
  };

  const handleCloseDetailsDialog = (open: boolean) => {
    setShowDetailsDialog(open);
    if (!open) {
      // Clean up the selected transaction when dialog is closed
      setTimeout(() => {
        setSelectedTransaction(null);
      }, 300); // Small delay to ensure animation completes
    }
  };

  const handleCancelTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowCancelDialog(true);
  };

  const handleCloseCancelDialog = (open: boolean) => {
    setShowCancelDialog(open);
    if (!open) {
      // Clean up the selected transaction when dialog is closed
      setTimeout(() => {
        setSelectedTransaction(null);
      }, 300); // Small delay to ensure animation completes
    }
  };

  const handleCompensateCustomer = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowCompensateDialog(true);
  };

  const handleCloseCompensateDialog = (open: boolean) => {
    setShowCompensateDialog(open);
    if (!open) {
      // Clean up the selected transaction when dialog is closed
      setTimeout(() => {
        setSelectedTransaction(null);
      }, 300); // Small delay to ensure animation completes
    }
  };

  const handleApplyFilters = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
    setShowFilters(false);
    refetch();
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      transactionType: "",
      startDate: "",
      endDate: "",
      currency: "",
    });
    setPage(1);
    refetch();
  };

  const handleSubmitCancel = async (reason: string) => {
    if (!selectedTransaction) return;
    
    try {
      await apiService.cancelTransaction(selectedTransaction.transactionId, { reason });
      toast({
        title: "Transaction Cancelled",
        description: `Transaction ${selectedTransaction.transactionId} has been cancelled successfully.`,
      });
      refetch();
    } catch (error) {
      console.error("Failed to cancel transaction:", error);
      toast({
        title: "Error",
        description: "Failed to cancel transaction. Only pending transactions can be cancelled.",
        variant: "destructive",
      });
    } finally {
      setShowCancelDialog(false);
      setSelectedTransaction(null);
    }
  };

  const handleSubmitCompensation = async (amount: string, reason: string) => {
    if (!selectedTransaction) return;
    
    try {
      // In a real implementation, you would get these values from context or API
      const companyId = 1;
      const userId = selectedTransaction.customerId;
      const walletId = parseInt(selectedTransaction.walletId);
      const originWalletId = 999; // Company wallet, would come from context/API
      
      await apiService.compensateCustomer(
        companyId,
        userId,
        walletId,
        originWalletId,
        {
          amount,
          reason,
          transaction_code: `COMP-${Date.now()}`,
          admin_user: "Current Admin", // Would come from auth context
          transaction_type: "COMPENSATE"
        }
      );
      
      toast({
        title: "Compensation Processed",
        description: `Customer ${userId} has been compensated with ${amount} successfully.`,
      });
      refetch();
    } catch (error) {
      console.error("Failed to process compensation:", error);
      toast({
        title: "Error",
        description: "Failed to process compensation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowCompensateDialog(false);
      setSelectedTransaction(null);
    }
  };

  // Calculate total pages - in a real app this would come from the API
  const totalTransactions = transactions?.length || 0;
  const totalPages = Math.ceil(totalTransactions / pageSize);
  const activeFiltersCount = Object.values(filters).filter(v => v !== "").length;

  return {
    page,
    pageSize,
    searchTerm,
    showFilters,
    showDetailsDialog,
    showCancelDialog,
    showCompensateDialog,
    selectedTransaction,
    filters,
    transactions,
    isLoading,
    totalPages,
    totalTransactions,
    activeFiltersCount,
    setSearchTerm,
    setShowFilters,
    handleSearch,
    handleViewDetails,
    handleCancelTransaction,
    handleCompensateCustomer,
    handleApplyFilters,
    resetFilters,
    handleSubmitCancel,
    handleSubmitCompensation,
    setPage,
    handleCloseDetailsDialog,
    handleCloseCancelDialog,
    handleCloseCompensateDialog,
  };
};

export type UseTransactionManagementReturn = ReturnType<typeof useTransactionManagement>;
