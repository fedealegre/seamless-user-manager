
import React from "react";
import { Eye, ShieldOff, Shield } from "lucide-react";
import { Wallet } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface WalletsTableProps {
  wallets: Wallet[];
  userIds?: string[];
  showUser?: boolean;
  onViewDetails?: (walletId: number) => void;
  onBlockWallet?: (walletId: number) => void;
  onUnblockWallet?: (walletId: number) => void;
}

export const WalletsTable: React.FC<WalletsTableProps> = ({
  wallets,
  userIds,
  showUser = false,
  onViewDetails,
  onBlockWallet,
  onUnblockWallet,
}) => {
  const { t } = useLanguage();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">{t("active")}</Badge>;
      case "blocked":
        return <Badge variant="destructive">{t("blocked")}</Badge>;
      case "inactive":
        return <Badge variant="secondary">{t("inactive")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            {showUser && <TableHead>{t("userId")}</TableHead>}
            <TableHead>{t("status")}</TableHead>
            <TableHead>{t("currency")}</TableHead>
            <TableHead className="text-right">{t("balance")}</TableHead>
            <TableHead className="text-right">{t("availableBalance")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wallets.map((wallet, index) => (
            <TableRow key={wallet.id}>
              <TableCell>{wallet.id}</TableCell>
              {showUser && <TableCell>{userIds?.[index] || "-"}</TableCell>}
              <TableCell>{getStatusBadge(wallet.status)}</TableCell>
              <TableCell>{wallet.currency}</TableCell>
              <TableCell className="text-right">
                {wallet.balance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell className="text-right">
                {wallet.availableBalance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onViewDetails && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onViewDetails(wallet.id)}
                      title={t("viewDetails")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {wallet.status === "active" && onBlockWallet && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => onBlockWallet(wallet.id)}
                      title={t("blockWallet")}
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                  )}
                  {wallet.status === "blocked" && onUnblockWallet && (
                    <Button
                      variant="default"
                      size="icon"
                      onClick={() => onUnblockWallet(wallet.id)}
                      title={t("unblockWallet")}
                    >
                      <ShieldOff className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
