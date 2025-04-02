
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

interface WalletsTableProps {
  wallets: (Wallet & { userId?: string })[];
  onSelectWallet?: (walletId: string) => void;
  showUser?: boolean;
}

export const WalletsTable: React.FC<WalletsTableProps> = ({ wallets, onSelectWallet, showUser = false }) => {
  // Helper function for wallet status badge
  const getStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "frozen":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Frozen</Badge>;
      case "blocked":
        return <Badge variant="destructive">Blocked</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status || "Unknown"}</Badge>;
    }
  };

  // Format currency display
  const formatCurrency = (amount?: number, currency?: string) => {
    if (amount === undefined) return "-";
    
    // Basic formatting
    let formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    
    return formatted;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            {showUser && <TableHead>User ID</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="text-right">Available Balance</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wallets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showUser ? 7 : 6} className="h-24 text-center">
                No wallets found
              </TableCell>
            </TableRow>
          ) : (
            wallets.map((wallet) => (
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
                        title="View Transactions"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="icon">
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
  );
};
