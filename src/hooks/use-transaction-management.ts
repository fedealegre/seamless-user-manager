
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/api";
import { Transaction, TransactionListParams } from "@/lib/api/types";
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

  const getApiParams = (): TransactionListParams => {
    return {
      status: filters.status || undefined,
      type: filters.transactionType || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      currency: filters.currency || undefined,
      page,
      pageSize
    };
  };

  const { data: transactions, isLoading, refetch } = useQuery({
    queryKey: ["transactions", page, pageSize, searchTerm, filters],
    queryFn: async () => {
      const userId = "1";
      const walletId = "101";
      
      try {
        const params = getApiParams();
        // Fix here: Using listTransactions directly with walletId and params
        const txns = await apiService.listTransactions(walletId, params);
        
        if (searchTerm) {
          return txns.filter(t => 
            (t.transactionId?.includes(searchTerm) || t.id.toString().includes(searchTerm)) || 
            t.reference?.includes(searchTerm)
          );
        }
        
        return txns;
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
    setPage(1);
    refetch();
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsDialog(true);
  };

  const handleCloseDetailsDialog = (open: boolean) => {
    setShowDetailsDialog(open);
    if (!open) {
      setTimeout(() => {
        setSelectedTransaction(null);
      }, 300);
    }
  };

  const handleCancelTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowCancelDialog(true);
  };

  const handleCloseCancelDialog = (open: boolean) => {
    setShowCancelDialog(open);
    if (!open) {
      setTimeout(() => {
        setSelectedTransaction(null);
      }, 300);
    }
  };

  const handleCompensateCustomer = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowCompensateDialog(true);
  };

  const handleCloseCompensateDialog = (open: boolean) => {
    setShowCompensateDialog(open);
    if (!open) {
      setTimeout(() => {
        setSelectedTransaction(null);
      }, 300);
    }
  };

  const handleApplyFilters = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
    setPage(1);
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
      // Get transaction identifier (either id or transactionId)
      const transactionIdentifier = selectedTransaction.transactionId || selectedTransaction.id.toString();
      
      // Using the correct parameter order for cancelTransaction
      await apiService.cancelTransaction(transactionIdentifier, reason);
      toast({
        title: "Transaction Cancelled",
        description: `Transaction ${transactionIdentifier} has been cancelled successfully.`,
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
      const companyId = 1;
      const userId = selectedTransaction.customerId;
      const walletId = parseInt(selectedTransaction.walletId);
      const originWalletId = 999;
      
      await apiService.compensateCustomer(
        companyId,
        userId,
        walletId,
        originWalletId,
        {
          amount,
          reason,
          transaction_code: `COMP-${Date.now()}`,
          admin_user: "Current Admin",
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
    totalPages: Math.ceil((transactions?.length || 0) / pageSize),
    totalTransactions: transactions?.length || 0,
    activeFiltersCount: Object.values(filters).filter(v => v !== "").length,
    setSearchTerm,
    setShowFilters,
    handleSearch: (e: React.FormEvent) => {
      e.preventDefault();
      setPage(1);
      refetch();
    },
    handleViewDetails: (transaction: Transaction) => {
      setSelectedTransaction(transaction);
      setShowDetailsDialog(true);
    },
    handleCancelTransaction: (transaction: Transaction) => {
      setSelectedTransaction(transaction);
      setShowCancelDialog(true);
    },
    handleCompensateCustomer: (transaction: Transaction) => {
      setSelectedTransaction(transaction);
      setShowCompensateDialog(true);
    },
    handleApplyFilters,
    resetFilters,
    handleSubmitCancel,
    handleSubmitCompensation,
    setPage,
    handleCloseDetailsDialog: (open: boolean) => {
      setShowDetailsDialog(open);
      if (!open) {
        setTimeout(() => {
          setSelectedTransaction(null);
        }, 300);
      }
    },
    handleCloseCancelDialog: (open: boolean) => {
      setShowCancelDialog(open);
      if (!open) {
        setTimeout(() => {
          setSelectedTransaction(null);
        }, 300);
      }
    },
    handleCloseCompensateDialog: (open: boolean) => {
      setShowCompensateDialog(open);
      if (!open) {
        setTimeout(() => {
          setSelectedTransaction(null);
        }, 300);
      }
    },
  };
  
  function handleApplyFilters(newFilters: TransactionFilters) {
    setFilters(newFilters);
    setPage(1);
    setShowFilters(false);
    refetch();
  }
  
  function resetFilters() {
    setFilters({
      status: "",
      transactionType: "",
      startDate: "",
      endDate: "",
      currency: "",
    });
    setPage(1);
    refetch();
  }
};

export type UseTransactionManagementReturn = ReturnType<typeof useTransactionManagement>;
