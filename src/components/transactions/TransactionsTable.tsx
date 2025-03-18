
import React from "react";
import { Transaction } from "@/lib/api/types";
import { formatDistance } from "date-fns";
import { MoreVertical, Eye, XCircle, CircleDollarSign } from "lucide-react";
import { getStatusBadge, getTypeBadge, formatCurrency } from "./transaction-utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface TransactionsTableProps {
  transactions: Transaction[];
  page: number;
  pageSize: number;
  handleViewDetails: (transaction: Transaction) => void;
  handleCancelTransaction: (transaction: Transaction) => void;
  handleCompensateCustomer: (transaction: Transaction) => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  page,
  pageSize,
  handleViewDetails,
  handleCancelTransaction,
  handleCompensateCustomer,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions && transactions.length > 0 ? (
            transactions
              .slice((page - 1) * pageSize, page * pageSize)
              .map((transaction) => (
              <TableRow key={transaction.transactionId}>
                <TableCell>
                  <div className="font-medium">{transaction.transactionId}</div>
                  {transaction.reference && (
                    <div className="text-xs text-muted-foreground">
                      Ref: {transaction.reference}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {transaction.date ? (
                    <>
                      <div className="font-medium">
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistance(new Date(transaction.date), new Date(), { addSuffix: true })}
                      </div>
                    </>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  {getTypeBadge(transaction.type)}
                </TableCell>
                <TableCell>
                  <div className={`font-medium ${transaction.type === 'deposit' || transaction.type === 'compensation' ? 'text-green-600' : transaction.type === 'withdrawal' ? 'text-red-600' : ''}`}>
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(transaction.status)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleViewDetails(transaction)}>
                        <Eye size={16} className="mr-2" /> View Details
                      </DropdownMenuItem>
                      {transaction.status === "pending" && (
                        <DropdownMenuItem 
                          onClick={() => handleCancelTransaction(transaction)}
                          className="text-amber-600"
                        >
                          <XCircle size={16} className="mr-2" /> Cancel Transaction
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleCompensateCustomer(transaction)}
                      >
                        <CircleDollarSign size={16} className="mr-2" /> Compensate Customer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No transactions found. Try a different search or filter.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable;
