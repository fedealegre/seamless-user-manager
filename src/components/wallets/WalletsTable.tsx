
import React, { useState } from "react";
import { Eye, Users, UserPlus, Link } from "lucide-react";
import { Wallet } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import TransactionsPagination from "@/components/transactions/TransactionsPagination";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WalletsTableProps {
  wallets: (Wallet & { userIds?: string[], userId?: string })[];
  onSelectWallet?: (walletId: string) => void;
  showUser?: boolean;
  onAddUserToWallet?: (walletId: string) => void;
  onViewWalletUsers?: (walletId: string) => void;
  paginationProps?: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    setPage: (page: number) => void;
  };
}

export const WalletsTable: React.FC<WalletsTableProps> = ({ 
  wallets, 
  onSelectWallet, 
  showUser = false,
  onAddUserToWallet,
  onViewWalletUsers,
  paginationProps 
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const navigate = useNavigate();
  
  // Helper function to navigate to user's wallet transactions
  const handleViewUserWallet = (userId: string, walletId: string) => {
    if (userId) {
      navigate(`/users/${userId}?tab=transactions`);
    }
  };
  
  // Helper function for wallet status badge
  const getStatusBadge = (status?: string) => {
    const statusKey = status?.toLowerCase() || "unknown";
    const translatedStatus = t(statusKey);
    
    switch (statusKey) {
      case "active":
        return <Badge className="bg-green-500">{translatedStatus}</Badge>;
      case "frozen":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">{translatedStatus}</Badge>;
      case "blocked":
        return <Badge variant="destructive">{translatedStatus}</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-orange-500 text-orange-500">{translatedStatus}</Badge>;
      default:
        return <Badge variant="secondary">{status || t("unknown")}</Badge>;
    }
  };

  // Format currency display
  const formatCurrency = (amount?: number, currency?: string) => {
    if (amount === undefined) return "-";
    
    // Format according to the current language setting
    const locale = settings.language === "en" ? "en-US" : "es-ES";
    
    // Basic formatting
    let formatted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    
    return formatted;
  };

  // Get the wallets for the current page
  const displayedWallets = wallets;

  // Function to display users count
  const renderUsersCount = (wallet: Wallet & { userIds?: string[], userId?: string }) => {
    const count = wallet.userIds?.length || (wallet.userId ? 1 : 0);
    
    return (
      <div className="flex items-center gap-1">
        <span>{count}</span>
        {count > 0 && onViewWalletUsers && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewWalletUsers(wallet.id.toString());
                  }}
                >
                  <Users className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("view-users")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              {showUser && <TableHead>{t("users")}</TableHead>}
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("currency")}</TableHead>
              <TableHead className="text-right">{t("balance")}</TableHead>
              <TableHead className="text-right">{t("available-balance")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedWallets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showUser ? 7 : 6} className="h-24 text-center">
                  {t("no-wallets-found")}
                </TableCell>
              </TableRow>
            ) : (
              displayedWallets.map((wallet) => (
                <TableRow key={`${wallet.id}`}>
                  <TableCell className="font-medium">{wallet.id}</TableCell>
                  {showUser && <TableCell>{renderUsersCount(wallet)}</TableCell>}
                  <TableCell>{getStatusBadge(wallet.status)}</TableCell>
                  <TableCell>{wallet.currency || "-"}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(wallet.balance, wallet.currency)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(wallet.availableBalance, wallet.currency)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {onSelectWallet && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => onSelectWallet(wallet.id.toString())}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t("view-transactions")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      {wallet.userId && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => handleViewUserWallet(wallet.userId!, wallet.id.toString())}
                              >
                                <Link className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t("view-user-wallet")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      {onAddUserToWallet && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onAddUserToWallet(wallet.id.toString())}
                              >
                                <UserPlus className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t("add-user-to-wallet")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {paginationProps && (
        <TransactionsPagination
          page={paginationProps.page}
          totalPages={paginationProps.totalPages}
          setPage={paginationProps.setPage}
          totalTransactions={paginationProps.totalItems}
          pageSize={paginationProps.pageSize}
        />
      )}
    </div>
  );
};
