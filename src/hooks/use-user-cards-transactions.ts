import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Transaction, Card } from "@/lib/api-types";
import { userService } from "@/lib/api/user-service";
import { useToast } from "@/hooks/use-toast";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { usePermissions } from "@/hooks/use-permissions";

export type CardFiltersType = {
  status: string;
  transactionType: string;
  startDate: string;
  endDate: string;
  transactionId: string;
  cardIds: string[];
};

export function useUserCardsTransactions(userId: string, cards: Card[]) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [filters, setFilters] = useState<CardFiltersType>({
    status: "",
    transactionType: "",
    startDate: "",
    endDate: "",
    transactionId: "",
    cardIds: [],
  });
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [showCompensateDialog, setShowCompensateDialog] = useState(false);
  const [showChangeStatusDialog, setShowChangeStatusDialog] = useState(false);
  
  const { toast } = useToast();
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const queryClient = useQueryClient();
  const { canCancelTransaction, canChangeTransactionStatus } = usePermissions();

  // Determine which cards to fetch transactions for
  const selectedCardIds = filters.cardIds.length > 0 ? filters.cardIds : cards.map(c => c.id.toString());

  // Fetch transactions for all selected cards
  const { data: allTransactions = [], isLoading, refetch } = useQuery({
    queryKey: ['user-cards-transactions', userId, selectedCardIds, pageSize],
    queryFn: async () => {
      if (!selectedCardIds.length) return [];
      
      console.log('🔄 Fetching card transactions for cards:', selectedCardIds);
      const promises = selectedCardIds.map(cardId => 
        userService.getCardTransactions(cardId, userId)
      );
      
      const results = await Promise.all(promises);
      const combined = results.flat();
      console.log('📊 Combined card transactions:', combined.length);
      return combined;
    },
    enabled: !!userId && cards.length > 0,
    staleTime: 0,
  });

  // Apply filters and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...allTransactions];

    // Apply filters
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter(tx => tx.status?.toLowerCase() === filters.status.toLowerCase());
    }

    if (filters.transactionType && filters.transactionType !== "all") {
      filtered = filtered.filter(tx => {
        const paymentType = tx.additionalInfo?.payment_type?.toLowerCase() || "";
        const txType = tx.transactionType?.toLowerCase() || tx.type?.toLowerCase() || "";
        return paymentType === filters.transactionType.toLowerCase() || 
               txType === filters.transactionType.toLowerCase();
      });
    }

    if (filters.transactionId && filters.transactionId.trim()) {
      const searchId = filters.transactionId.toLowerCase().trim();
      filtered = filtered.filter(tx => {
        const txId = (tx.transactionId || tx.id?.toString() || "").toLowerCase();
        return txId.includes(searchId);
      });
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      startDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(tx => tx.date && new Date(tx.date) >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(tx => tx.date && new Date(tx.date) <= endDate);
    }

    // Sort by date, newest first
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return dateB - dateA;
    });
  }, [allTransactions, filters]);

  // Pagination
  const totalTransactions = filteredTransactions.length;
  const totalPages = Math.ceil(totalTransactions / pageSize);
  const startIndex = (page - 1) * pageSize;
  const transactions = filteredTransactions.slice(startIndex, startIndex + pageSize);

  // Filter handlers
  const handleApplyFilters = (newFilters: CardFiltersType) => {
    setFilters(newFilters);
    setPage(1);
  };
  
  const handleResetFilters = () => {
    setFilters({
      status: "",
      transactionType: "",
      startDate: "",
      endDate: "",
      transactionId: "",
      cardIds: [],
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

  // Function to refresh transactions
  const refreshTransactions = async () => {
    console.log('🔄 Refreshing card transactions...');
    await refetch();
    await queryClient.invalidateQueries({
      queryKey: ['user-cards-transactions', userId],
    });
    console.log('✅ Card transactions refreshed successfully');
  };

  const handleCompensateSubmit = async (
    amount: string, 
    reason: string, 
    compensationType: 'credit' | 'adjustment',
    originWalletId: number = 999
  ) => {
    if (!selectedTransaction) {
      toast({
        title: t("error"),
        description: t("missing-transaction-wallet-info"),
        variant: "destructive",
      });
      return;
    }
    try {
      console.log('🏦 Processing card transaction compensation...', { selectedTransaction, amount, reason, compensationType });
      
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
      
      toast({
        title: t("compensation-processed"),
        description: t("compensation-transaction-created"),
      });
      
      await refreshTransactions();
      setShowCompensateDialog(false);
      setSelectedTransaction(null);
    } catch (error: any) {
      console.error('❌ Card transaction compensation failed:', error);
      toast({
        title: t("compensation-failed"),
        description: error.message || t("compensation-error"),
        variant: "destructive",
      });
    }
  };

  const handleSubmitStatusChange = async (newStatus: string, reason: string) => {
    if (!selectedTransaction) {
      toast({
        title: t("error"),
        description: t("missing-transaction-wallet-info"),
        variant: "destructive",
      });
      return;
    }
    try {
      console.log('🔄 Changing card transaction status...', { selectedTransaction, newStatus, reason });
      
      const transactionIdentifier = selectedTransaction.transactionId || selectedTransaction.id.toString();
      await userService.changeTransactionStatus(
        selectedTransaction.walletId,
        transactionIdentifier,
        {
          newStatus: newStatus as 'cancelled' | 'rejected' | 'confirmed' | 'approved',
          reason,
        }
      );
      
      toast({
        title: t("status-updated"),
        description: t("transaction-status-changed-success"),
      });
      
      await refreshTransactions();
      setShowChangeStatusDialog(false);
      setSelectedTransaction(null);
    } catch (error: any) {
      console.error('❌ Card status change failed:', error);
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
    let count = 0;
    if (filters.status && filters.status !== "all") count++;
    if (filters.transactionType && filters.transactionType !== "all") count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.transactionId && filters.transactionId.trim()) count++;
    if (filters.cardIds.length > 0 && filters.cardIds.length < cards.length) count++;
    return count;
  };

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
    refreshTransactions,
    t
  };
}