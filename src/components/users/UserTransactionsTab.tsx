import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/lib/api/user-service";
import { Wallet, Transaction } from "@/lib/api/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { usePermissions } from "@/hooks/use-permissions";
import UserTransactionsHeader from "./UserTransactionsHeader";
import UserTransactionsTabs from "./UserTransactionsTabs";

interface UserTransactionsTabProps {
  userId: string;
  wallets: Wallet[];
}

type FiltersType = {
  status: string;
  transactionType: string;
  startDate: string;
  endDate: string;
  currency: string;
};

export const UserTransactionsTab: React.FC<UserTransactionsTabProps> = ({ userId, wallets }) => {
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  const { settings, formatDateTime } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<FiltersType>({
    status: "",
    transactionType: "",
    startDate: "",
    endDate: "",
    currency: "",
  });

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [showCompensateDialog, setShowCompensateDialog] = useState(false);
  const [showChangeStatusDialog, setShowChangeStatusDialog] = useState(false);

  useEffect(() => {
    if (wallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(wallets[0].id.toString());
    }
  }, [wallets, selectedWalletId]);

  const { data: allTransactions = [], isLoading } = useQuery({
    queryKey: ['user-transactions', userId, selectedWalletId],
    queryFn: () => {
      if (!selectedWalletId) return Promise.resolve([]);
      return userService.getWalletTransactions(userId, selectedWalletId);
    },
    enabled: !!selectedWalletId,
  });

  const filteredTransactions = (allTransactions as Transaction[]).filter(tx => {
    if (filters.status && filters.status !== "all" && tx.status?.toLowerCase() !== filters.status.toLowerCase())
      return false;
    if (filters.transactionType && filters.transactionType !== "all") {
      const txType = tx.transactionType?.toLowerCase() || tx.type?.toLowerCase() || "";
      if (txType !== filters.transactionType.toLowerCase()) return false;
    }
    if (filters.currency && filters.currency !== "all") {
      if ((tx.currency?.toLowerCase() || "") !== filters.currency.toLowerCase()) return false;
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

  const totalTransactions = filteredTransactions.length;
  const totalPages = Math.ceil(totalTransactions / pageSize);
  const startIndex = (page - 1) * pageSize;
  const transactions = filteredTransactions.slice(startIndex, startIndex + pageSize);

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
    });
    setPage(1);
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
  };

  const { canCancelTransaction, canChangeTransactionStatus } = usePermissions();

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

  const handleCompensateSubmit = async (amount: string, reason: string, compensationType: 'credit' | 'adjustment') => {
    if (!selectedTransaction || !selectedWalletId) {
      toast({
        title: t("error"),
        description: t("missing-transaction-wallet-info"),
        variant: "destructive",
      });
      return;
    }
    try {
      const companyId = 1;
      const userIdNum = selectedTransaction.customerId;
      const walletIdNum = parseInt(selectedTransaction.walletId);
      const originWalletId = 999;
      await userService.compensateCustomer(companyId, userIdNum, walletIdNum, originWalletId, {
        amount,
        reason,
        transaction_code: `COMP-${Date.now()}`,
        admin_user: "Current Admin",
        transaction_type: "COMPENSATE",
        compensation_type: compensationType,
      });
      toast({
        title: t("compensation-processed"),
        description: t("compensation-transaction-created"),
      });
      queryClient.invalidateQueries({
        queryKey: ['user-transactions', userId, selectedWalletId],
      });
      setShowCompensateDialog(false);
      setSelectedTransaction(null);
    } catch (error: any) {
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
      const transactionIdentifier = selectedTransaction.transactionId || selectedTransaction.id.toString();
      await userService.changeTransactionStatus(
        selectedWalletId,
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
      queryClient.invalidateQueries({
        queryKey: ['user-transactions', userId, selectedWalletId],
      });
      setShowChangeStatusDialog(false);
      setSelectedTransaction(null);
    } catch (error: any) {
      toast({
        title: t("status-change-failed"),
        description: error.message || t("only-pending-transactions"),
        variant: "destructive",
      });
    }
  };

  const findWallet = (walletId: string) => {
    return wallets.find(wallet => wallet.id.toString() === walletId);
  };

  const mapTransactionToCSV = (transaction: Transaction) => {
    const wallet = findWallet(transaction.walletId);
    return [
      transaction.transactionId || transaction.id.toString(),
      transaction.reference || '',
      transaction.date ? formatDateTime(new Date(transaction.date)) : '',
      t(transaction.movementType?.toLowerCase() || 'unknown'),
      t(transaction.transactionType?.toLowerCase() || 'unknown'),
      transaction.amount?.toString() || '',
      transaction.currency || wallet?.currency || '',
      t(transaction.status?.toLowerCase() || 'unknown'),
      userId,
      wallet?.id.toString() || '',
    ];
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([k, v]) => !!v && v !== "all").length;
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setPage(1);
  };

  return (
    <Card>
      <CardHeader>
        <UserTransactionsHeader
          t={t}
          transactions={transactions}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          activeFiltersCount={getActiveFiltersCount()}
          userId={userId}
          allTransactions={allTransactions}
          mapTransactionToCSV={mapTransactionToCSV}
        />
      </CardHeader>
      <CardContent>
        <UserTransactionsTabs
          wallets={wallets}
          selectedWalletId={selectedWalletId}
          setSelectedWalletId={setSelectedWalletId}
          page={page}
          setPage={setPage}
          showFilters={showFilters}
          filters={filters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          isLoading={isLoading}
          transactions={transactions}
          pageSize={pageSize}
          totalPages={totalPages}
          totalTransactions={totalTransactions}
          handlePageSizeChange={handlePageSizeChange}
          t={t}
          handleViewDetails={handleViewDetails}
          handleCancelTransaction={handleCancelTransaction}
          handleCompensateCustomer={handleCompensateCustomer}
          handleChangeStatus={handleChangeStatus}
        />
      </CardContent>
      {selectedTransaction && (
        <>
          <TransactionDetails
            transaction={selectedTransaction}
            open={showTransactionDetails}
            onOpenChange={setShowTransactionDetails}
          />
          <CompensateCustomerDialog
            transaction={selectedTransaction}
            open={showCompensateDialog}
            onOpenChange={setShowCompensateDialog}
            onSubmit={handleCompensateSubmit}
          />
          <ChangeTransactionStatusDialog
            transaction={selectedTransaction}
            open={showChangeStatusDialog}
            onOpenChange={setShowChangeStatusDialog}
            onSubmit={handleSubmitStatusChange}
          />
        </>
      )}
    </Card>
  );
};

export default UserTransactionsTab;
