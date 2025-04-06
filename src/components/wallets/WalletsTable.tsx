
import React from "react";
import { Edit, ExternalLink, Eye } from "lucide-react";
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

interface WalletsTableProps {
  wallets: (Wallet & { userId?: string })[];
  onSelectWallet?: (walletId: string) => void;
  showUser?: boolean;
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
  paginationProps 
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
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

  // Get the wallets for the current page if pagination is enabled
  const displayedWallets = wallets;

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
                <TableRow key={`${wallet.id}-${wallet.userId || ''}`}>
                  <TableCell className="font-medium">{wallet.id}</TableCell>
                  {showUser && <TableCell>{wallet.userId || '-'}</TableCell>}
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
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => onSelectWallet(wallet.id.toString())}
                          title={t("view")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="icon" title={t("edit")}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
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
