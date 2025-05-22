
import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Wallet, Transaction } from "@/lib/api/types";
import { WalletsTable } from "@/components/wallets/WalletsTable";
import { WalletsLoadingSkeleton } from "@/components/wallets/WalletsLoadingSkeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserTransactionsTab } from "./UserTransactionsTab";
import { useToast } from "@/hooks/use-toast";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { userService } from "@/lib/api/user-service";
import { usePermissions } from "@/hooks/use-permissions";
import CompensateCustomerDialog from "../transactions/CompensateCustomerDialog";

interface UserWalletsTabProps {
  userId: string;
  wallets: Wallet[];
  isLoading: boolean;
}

export const UserWalletsTab: React.FC<UserWalletsTabProps> = ({ userId, wallets, isLoading }) => {
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [showTransactions, setShowTransactions] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [showCompensateDialog, setShowCompensateDialog] = useState<boolean>(false);
  const [compensateWallet, setCompensateWallet] = useState<Wallet | null>(null);
  const pageSize = 5; // Smaller pageSize for wallets since there are usually fewer
  const { toast } = useToast();
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const queryClient = useQueryClient();
  const { canChangeTransactionStatus } = usePermissions();
  
  // Fetch company wallets
  const { data: companyWallets = [] } = useQuery({
    queryKey: ['company-wallets'],
    queryFn: () => userService.getCompanyWallets()
  });

  // Set first wallet as selected when wallets load
  useEffect(() => {
    if (wallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(wallets[0].id.toString());
    }
  }, [wallets, selectedWalletId]);

  const handleSelectWallet = (walletId: string) => {
    setSelectedWalletId(walletId);
    setShowTransactions(true);
  };

  const handleBackToWallets = () => {
    setShowTransactions(false);
  };

  const handleCompensateCustomer = (walletId: string) => {
    if (!canChangeTransactionStatus()) {
      toast({
        title: t("access-denied"),
        description: t("only-compensator-can-compensate"),
        variant: "destructive",
      });
      return;
    }

    const wallet = wallets.find(w => w.id.toString() === walletId);
    if (wallet) {
      setCompensateWallet(wallet);
      setShowCompensateDialog(true);
    }
  };

  // Create a dummy transaction for the compensation dialog
  const createDummyTransaction = (): Transaction | null => {
    if (!compensateWallet) return null;
    
    return {
      id: 0,
      transactionId: `COMP-${Date.now()}`,
      customerId: userId,
      walletId: compensateWallet.id.toString(),
      date: new Date().toISOString(),
      amount: 0,
      currency: compensateWallet.currency || "USD",
      status: "pending",
      movementType: "deposit",
      transactionType: "compensation"
    };
  };

  const handleCompensateSubmit = async (
    amount: string, 
    reason: string, 
    compensationType: 'credit' | 'adjustment',
    originWalletId: number
  ) => {
    if (!compensateWallet) {
      toast({
        title: t("error"),
        description: t("missing-wallet-info"),
        variant: "destructive",
      });
      return;
    }
    
    try {
      const companyId = 1;
      const userIdNum = userId;
      const walletIdNum = compensateWallet.id;
      
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
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ['user-wallets', userId],
      });
      
      setShowCompensateDialog(false);
      setCompensateWallet(null);
    } catch (error: any) {
      toast({
        title: t("compensation-failed"),
        description: error.message || t("compensation-error"),
        variant: "destructive",
      });
    }
  };

  // Calculate pagination values
  const totalWallets = wallets.length;
  const totalPages = Math.ceil(totalWallets / pageSize);
  
  // Get the wallets for the current page
  const startIndex = (page - 1) * pageSize;
  const paginatedWallets = wallets.slice(startIndex, startIndex + pageSize);

  if (showTransactions && selectedWalletId) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("wallet-transactions")}</CardTitle>
            <CardDescription>
              {t("transactions-for-wallet")} {selectedWalletId}
            </CardDescription>
          </div>
          <Button variant="outline" onClick={handleBackToWallets}>
            {t("back-to-wallets")}
          </Button>
        </CardHeader>
        <CardContent>
          <UserTransactionsTab
            userId={userId}
            wallets={wallets.filter(w => w.id.toString() === selectedWalletId)}
          />
        </CardContent>
      </Card>
    );
  }

  // Create dummy transaction object for compensation
  const dummyTransaction = createDummyTransaction();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("user-wallets")}</CardTitle>
        <CardDescription>
          {isLoading ? t("loading") : wallets.length > 0 
            ? `${wallets.length} ${t("wallets")} ${t("found")}. ${t("click-wallet-view-transactions")}` 
            : t("no-wallets-found")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <WalletsLoadingSkeleton />
        ) : (
          <>
            <WalletsTable 
              wallets={paginatedWallets} 
              onSelectWallet={handleSelectWallet}
              onCompensateWallet={canChangeTransactionStatus() ? handleCompensateCustomer : undefined}
              paginationProps={{
                page,
                pageSize,
                totalPages,
                totalItems: totalWallets,
                setPage,
              }}
            />
            
            {compensateWallet && dummyTransaction && (
              <CompensateCustomerDialog
                transaction={dummyTransaction}
                open={showCompensateDialog}
                onOpenChange={(open) => {
                  setShowCompensateDialog(open);
                  if (!open) setCompensateWallet(null);
                }}
                onSubmit={handleCompensateSubmit}
                companyWallets={companyWallets}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
