import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/lib/api/user-service";
import { Transaction } from "@/lib/api/types";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/hooks/use-permissions";
import { translate } from "@/lib/translations";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";

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
  const { canCancelTransaction, canChangeTransactionStatus } = usePermissions();
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  const { data: allTransactions = [], isLoading, refetch } = useQuery({
    queryKey: ["transactions", searchTerm, filters],
    queryFn: async () => {
      try {
        const txns = await userService.getAllTransactions();
        
        let filteredTxns = [...txns];
        
        if (filters.status && filters.status !== 'all') {
          filteredTxns = filteredTxns.filter(t => 
            t.status?.toLowerCase() === filters.status.toLowerCase()
          );
        }
        
        if (filters.transactionType && filters.transactionType !== 'all') {
          filteredTxns = filteredTxns.filter(t => {
            // Handle both old format (transactionType/type) and new QR format (transaction_type)
            const txType = t.transaction_type || t.transactionType || t.type;
            const paymentType = t.additionalInfo?.payment_type;
            
            return txType?.toLowerCase() === filters.transactionType.toLowerCase() ||
                   paymentType?.toLowerCase() === filters.transactionType.toLowerCase();
          });
        }
        
        if (filters.currency && filters.currency !== 'all') {
          filteredTxns = filteredTxns.filter(t => 
            t.currency?.toLowerCase() === filters.currency.toLowerCase()
          );
        }
        
        if (filters.startDate) {
          const startDate = new Date(filters.startDate);
          startDate.setHours(0, 0, 0, 0);
          
          filteredTxns = filteredTxns.filter(t => {
            if (!t.date) return false;
            const txDate = new Date(t.date);
            return txDate >= startDate;
          });
        }
        
        if (filters.endDate) {
          const endDate = new Date(filters.endDate);
          endDate.setHours(23, 59, 59, 999);
          
          filteredTxns = filteredTxns.filter(t => {
            if (!t.date) return false;
            const txDate = new Date(t.date);
            return txDate <= endDate;
          });
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

  const totalTransactions = allTransactions.length || 0;
  const totalPages = Math.ceil(totalTransactions / pageSize);

  const startIndex = (page - 1) * pageSize;
  const transactions = allTransactions.slice(startIndex, startIndex + pageSize);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
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
    if (!canCancelTransaction()) {
      toast({
        title: t("access-denied"),
        description: t("only-compensator-can-cancel-transaction"),
        variant: "destructive",
      });
      return;
    }
    
    setSelectedTransaction(transaction);
    setShowCancelDialog(true);
  };

  const handleCompensateCustomer = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowCompensateDialog(true);
  };

  const handleChangeStatus = (transaction: Transaction) => {
    if (!canChangeTransactionStatus()) {
      toast({
        title: t("access-denied"),
        description: t("only-compensator-can-change-status"),
        variant: "destructive",
      });
      return;
    }
    
    setSelectedTransaction(transaction);
    setShowChangeStatusDialog(true);
  };

  const handleCloseCancelDialog = (open: boolean) => {
    setShowCancelDialog(open);
    if (!open) {
      setTimeout(() => {
        setSelectedTransaction(null);
      }, 300);
    }
  };
  
  const handleCloseCompensateDialog = (open: boolean) => {
    setShowCompensateDialog(open);
    if (!open) {
      setTimeout(() => {
        setSelectedTransaction(null);
      }, 300);
    }
  };

  const handleCloseChangeStatusDialog = (open: boolean) => {
    setShowChangeStatusDialog(open);
    if (!open) {
      setTimeout(() => {
        setSelectedTransaction(null);
      }, 300);
    }
  };

  const handleApplyFilters = (newFilters: TransactionFilters) => {
    setFilters(newFilters);
    setPage(1);
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

  const handleSubmitStatusChange = async (newStatus: string, reason: string) => {
    if (!selectedTransaction) return;
    
    if (!canChangeTransactionStatus()) {
      toast({
        title: t("access-denied"),
        description: t("only-compensator-can-change-status"),
        variant: "destructive",
      });
      setShowChangeStatusDialog(false);
      setSelectedTransaction(null);
      return;
    }
    
    try {
      const transactionIdentifier = selectedTransaction.transactionId || selectedTransaction.id.toString();
      const currentWalletId = selectedTransaction.walletId;
      
      await userService.changeTransactionStatus(
        currentWalletId,
        transactionIdentifier,
        {
          newStatus: newStatus as 'cancelled' | 'rejected' | 'confirmed' | 'approved',
          reason
        }
      );
      
      toast({
        title: "Status Updated",
        description: `Transaction ${transactionIdentifier} status has been changed to ${newStatus}`,
      });
      refetch();
    } catch (error) {
      console.error("Failed to change transaction status:", error);
      toast({
        title: "Error",
        description: "Failed to change transaction status. Only pending transactions can be modified.",
        variant: "destructive",
      });
    } finally {
      setShowChangeStatusDialog(false);
      setSelectedTransaction(null);
    }
  };

  const handleSubmitCancel = async (reason: string) => {
    if (!selectedTransaction) return;
    
    if (!canCancelTransaction()) {
      toast({
        title: t("access-denied"),
        description: t("only-compensator-can-cancel-transaction"),
        variant: "destructive",
      });
      setShowCancelDialog(false);
      setSelectedTransaction(null);
      return;
    }
    
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

  const activeFiltersCount = Object.values(filters).filter(v => v !== "").length;

  // Extract unique statuses and types from all transactions for dynamic filtering
  const availableStatuses = useMemo(() => {
    const statusSet = new Set<string>();
    allTransactions.forEach(tx => {
      if (tx.status) {
        statusSet.add(tx.status);
      }
    });
    
    return Array.from(statusSet).map(status => ({
      value: status,
      label: t(status.toLowerCase()) || status
    }));
  }, [allTransactions, t]);

  const availableTypes = useMemo(() => {
    const typeSet = new Set<string>();
    allTransactions.forEach(tx => {
      // Handle both old format (transactionType/type) and new QR format (transaction_type)
      const txType = tx.transaction_type || tx.transactionType || tx.type;
      if (txType) {
        typeSet.add(txType);
      }
      // Also check payment_type in additional_info for QR payments
      if (tx.additionalInfo?.payment_type) {
        typeSet.add(tx.additionalInfo.payment_type);
      }
    });
    
    return Array.from(typeSet).map(type => ({
      value: type,
      label: t(type.toLowerCase().replace(/\s+/g, '_')) || type
    }));
  }, [allTransactions, t]);

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
    allTransactions,
    isLoading,
    totalPages,
    totalTransactions,
    activeFiltersCount,
    availableStatuses,
    availableTypes,
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
