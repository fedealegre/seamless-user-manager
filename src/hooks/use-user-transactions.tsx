
import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/lib/api/user-service";
import { Transaction } from "@/lib/api/types";
import { useToast } from "@/hooks/use-toast";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { usePermissions } from "@/hooks/use-permissions";

export type FiltersType = {
  status: string;
  transactionType: string;
  startDate: string;
  endDate: string;
  currency: string;
  transactionId: string;
};

export function useUserTransactions(userId: string, selectedWalletId: string | null) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [filters, setFilters] = useState<FiltersType>({
    status: "",
    transactionType: "",
    startDate: "",
    endDate: "",
    currency: "",
    transactionId: "",
  });
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [showCompensateDialog, setShowCompensateDialog] = useState(false);
  const [showChangeStatusDialog, setShowChangeStatusDialog] = useState(false);
  
  const { toast } = useToast();
  const { settings, formatDateTime } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const queryClient = useQueryClient();
  const { canCancelTransaction, canChangeTransactionStatus } = usePermissions();

  // Fetch transactions data with fresh data after compensation
  const { data: allTransactions = [], isLoading, refetch } = useQuery({
    queryKey: ['user-transactions', userId, selectedWalletId],
    queryFn: () => {
      if (!selectedWalletId) return Promise.resolve([]);
      console.log('🔄 Fetching transactions for wallet:', selectedWalletId, 'at', new Date().toISOString());
      return userService.getWalletTransactions(userId, selectedWalletId);
    },
    enabled: !!selectedWalletId,
    staleTime: 0, // Always refetch to ensure fresh data
  });

  // Apply filters to transactions
  const filteredTransactions = (allTransactions as Transaction[]).filter(tx => {
    if (filters.status && filters.status !== "all" && tx.status?.toLowerCase() !== filters.status.toLowerCase())
      return false;
    if (filters.transactionType && filters.transactionType !== "all") {
      // Handle both old format (transactionType/type) and new QR format (transaction_type)
      const txType = tx.transaction_type || tx.transactionType || tx.type;
      const paymentType = tx.additionalInfo?.payment_type;
      
      if (txType?.toLowerCase() !== filters.transactionType.toLowerCase() && 
          paymentType?.toLowerCase() !== filters.transactionType.toLowerCase()) {
        return false;
      }
    }
    if (filters.currency && filters.currency !== "all") {
      if ((tx.currency?.toLowerCase() || "") !== filters.currency.toLowerCase()) return false;
    }
    if (filters.transactionId && filters.transactionId.trim()) {
      const searchId = filters.transactionId.toLowerCase().trim();
      const txId = (tx.transactionId || tx.id?.toString() || "").toLowerCase();
      if (!txId.includes(searchId)) return false;
    }
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      startDate.setHours(0, 0, 0, 0);
      if (!tx.date || new Date(tx.date) < startDate) return false;
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      if (!tx.date || new Date(tx.date) > endDate) return false;
    }
    return true;
  });

  // Calculate pagination values
  const totalTransactions = filteredTransactions.length;
  const totalPages = Math.ceil(totalTransactions / pageSize);
  const startIndex = (page - 1) * pageSize;
  const transactions = filteredTransactions.slice(startIndex, startIndex + pageSize);

  // Filter handlers
  const handleApplyFilters = (newFilters: FiltersType) => {
    setFilters(newFilters);
    setPage(1);
  };
  
  const handleResetFilters = () => {
    setFilters({
      status: "",
      transactionType: "",
      startDate: "",
      endDate: "",
      currency: "",
      transactionId: "",
    });
    setPage(1);
  };

  // Transaction action handlers
  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
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
    toast({
      title: t("cancel-transaction"),
      description: `${t("transaction-cancellation-not-implemented")} ${transaction.transactionId || transaction.id}`,
    });
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

  // Function to refresh transactions after compensation
  const refreshTransactions = async () => {
    console.log('🔄 Refreshing transactions after compensation...');
    
    // Force refetch of current transactions
    await refetch();
    
    // Invalidate all related queries to ensure fresh data
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['user-transactions', userId, selectedWalletId],
      }),
      queryClient.invalidateQueries({
        queryKey: ['user-wallets', userId],
      }),
      queryClient.invalidateQueries({
        queryKey: ['company-wallets'],
      })
    ]);
    
    console.log('✅ Transactions refreshed successfully');
  };

  const handleCompensateSubmit = async (
    amount: string, 
    reason: string, 
    compensationType: 'credit' | 'adjustment',
    originWalletId: number = 999 // Default value if not provided
  ) => {
    if (!selectedTransaction || !selectedWalletId) {
      toast({
        title: t("error"),
        description: t("missing-transaction-wallet-info"),
        variant: "destructive",
      });
      return;
    }
    try {
      console.log('🏦 Processing compensation from transaction...', { selectedTransaction, amount, reason, compensationType });
      
      const companyId = 1;
      const userIdNum = selectedTransaction.customerId;
      const walletIdNum = parseInt(selectedTransaction.walletId);
      
      await userService.compensateCustomer(companyId, userIdNum, walletIdNum, originWalletId, {
        amount,
        reason,
        transaction_code: `COMP-${Date.now()}`,
        admin_user: "Current Admin",
        transaction_type: "Compensacion",
        compensation_type: compensationType,
      });
      
      console.log('✅ Transaction compensation successful, refreshing data...');
      
      toast({
        title: t("compensation-processed"),
        description: t("compensation-transaction-created"),
      });
      
      // Refresh transactions table
      await refreshTransactions();
      
      setShowCompensateDialog(false);
      setSelectedTransaction(null);
    } catch (error: any) {
      console.error('❌ Transaction compensation failed:', error);
      toast({
        title: t("compensation-failed"),
        description: error.message || t("compensation-error"),
        variant: "destructive",
      });
    }
  };

  const handleSubmitStatusChange = async (newStatus: string, reason: string) => {
    if (!selectedTransaction || !selectedWalletId) {
      toast({
        title: t("error"),
        description: t("missing-transaction-wallet-info"),
        variant: "destructive",
      });
      return;
    }
    try {
      console.log('🔄 Changing transaction status...', { selectedTransaction, newStatus, reason });
      
      const transactionIdentifier = selectedTransaction.transactionId || selectedTransaction.id.toString();
      await userService.changeTransactionStatus(
        selectedWalletId,
        transactionIdentifier,
        {
          newStatus: newStatus as 'cancelled' | 'rejected' | 'confirmed' | 'approved',
          reason,
        }
      );
      
      console.log('✅ Transaction status changed successfully, refreshing data...');
      
      toast({
        title: t("status-updated"),
        description: t("transaction-status-changed-success"),
      });
      
      // Refresh transactions table
      await refreshTransactions();
      
      setShowChangeStatusDialog(false);
      setSelectedTransaction(null);
    } catch (error: any) {
      console.error('❌ Status change failed:', error);
      toast({
        title: t("status-change-failed"),
        description: error.message || t("only-pending-transactions"),
        variant: "destructive",
      });
    }
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setPage(1);
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([k, v]) => !!v && v !== "all").length;
  };

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
    setPage,
    pageSize,
    filters,
    isLoading,
    transactions,
    allTransactions,
    totalPages,
    totalTransactions,
    selectedTransaction,
    showTransactionDetails,
    showCompensateDialog,
    showChangeStatusDialog,
    setShowTransactionDetails,
    setShowCompensateDialog,
    setShowChangeStatusDialog,
    handleApplyFilters,
    handleResetFilters,
    handleViewDetails,
    handleCancelTransaction,
    handleCompensateCustomer,
    handleChangeStatus,
    handleCompensateSubmit,
    handleSubmitStatusChange,
    handlePageSizeChange,
    getActiveFiltersCount,
    availableStatuses,
    availableTypes,
    refreshTransactions, // Export the refresh function
    t
  };
}
