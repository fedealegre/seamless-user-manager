import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/lib/api/user-service";
import { Transaction, ChangeTransactionStatusRequest } from "@/lib/api/types";
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
  const [showChangeStatusDialog, setShowChangeStatusDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({
    status: "",
    transactionType: "",
    startDate: "",
    endDate: "",
    currency: "",
  });
  
  const { toast } = useToast();

  const userId = "827";
  const walletId = "152";

  const { data: transactions, isLoading, refetch } = useQuery({
    queryKey: ["transactions", userId, walletId, page, pageSize, searchTerm, filters],
    queryFn: async () => {
      try {
        const txns = await userService.getWalletTransactions(userId, walletId);
        
        let filteredTxns = [...txns];
        
        if (filters.status) {
          filteredTxns = filteredTxns.filter(t => 
            t.status?.toLowerCase() === filters.status.toLowerCase()
          );
        }
        
        if (filters.transactionType) {
          filteredTxns = filteredTxns.filter(t => 
            t.transactionType?.toLowerCase() === filters.transactionType.toLowerCase() ||
            t.type?.toLowerCase() === filters.transactionType.toLowerCase()
          );
        }
        
        if (filters.currency) {
          filteredTxns = filteredTxns.filter(t => 
            t.currency?.toLowerCase() === filters.currency.toLowerCase()
          );
        }
        
        if (searchTerm) {
          filteredTxns = filteredTxns.filter(t => 
            (t.transactionId?.toString().includes(searchTerm)) || 
            (t.id.toString().includes(searchTerm)) ||
            (t.reference?.includes(searchTerm))
          );
        }
        
        return filteredTxns;
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

  const handleChangeStatus = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowChangeStatusDialog(true);
  };

  const handleCloseChangeStatusDialog = (open: boolean) => {
    setShowChangeStatusDialog(open);
    if (!open) {
      setTimeout(() => {
        setSelectedTransaction(null);
      }, 300);
    }
  };

  const handleSubmitStatusChange = async (request: ChangeTransactionStatusRequest) => {
    if (!selectedTransaction) return;
    
    try {
      const transactionIdentifier = selectedTransaction.transactionId || selectedTransaction.id.toString();
      
      const response = await userService.changeTransactionStatus(
        transactionIdentifier,
        request
      );
      
      if (response.success) {
        toast({
          title: "Status Changed",
          description: `Transaction ${transactionIdentifier} status has been changed to ${request.status} successfully.`,
        });
        refetch();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to change transaction status.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to change transaction status:", error);
      toast({
        title: "Error",
        description: "Failed to change transaction status. An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setShowChangeStatusDialog(false);
      setSelectedTransaction(null);
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
      const transactionIdentifier = selectedTransaction.transactionId || selectedTransaction.id.toString();
      
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

  const handleSubmitCompensation = async (amount: string, reason: string, compensationType: 'credit' | 'adjustment') => {
    if (!selectedTransaction) return;
    
    try {
      const companyId = 1;
      const userId = selectedTransaction.customerId;
      const walletId = parseInt(selectedTransaction.walletId);
      const originWalletId = 999;
      
      await userService.compensateCustomer(
        companyId,
        userId,
        walletId,
        originWalletId,
        {
          amount,
          reason,
          transaction_code: `COMP-${Date.now()}`,
          admin_user: "Current Admin",
          transaction_type: "COMPENSATE",
          compensation_type: compensationType
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
  const totalPages = Math.ceil((transactions?.length || 0) / pageSize);
  const activeFiltersCount = Object.values(filters).filter(v => v !== "").length;

  return {
    page,
    pageSize,
    searchTerm,
    showFilters,
    showDetailsDialog,
    showCancelDialog,
    showCompensateDialog,
    showChangeStatusDialog,
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
    handleChangeStatus,
    handleApplyFilters,
    resetFilters,
    handleSubmitCancel,
    handleSubmitCompensation,
    handleSubmitStatusChange,
    setPage,
    handleCloseDetailsDialog,
    handleCloseCancelDialog,
    handleCloseCompensateDialog,
    handleCloseChangeStatusDialog,
  };
};

export type UseTransactionManagementReturn = ReturnType<typeof useTransactionManagement>;
