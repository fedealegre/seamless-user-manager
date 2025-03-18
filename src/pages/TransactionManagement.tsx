
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/api-service";
import { Transaction, User, Wallet } from "@/lib/api-types";
import { formatDistance } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Search, 
  MoreVertical, 
  Eye, 
  XCircle,
  CircleDollarSign,
  ArrowUpDown,
  Filter,
  Calendar 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import TransactionDetails from "@/components/transactions/TransactionDetails";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import CancelTransactionDialog from "@/components/transactions/CancelTransactionDialog";
import CompensateCustomerDialog from "@/components/transactions/CompensateCustomerDialog";

// Sample transaction status badges with appropriate colors
const getStatusBadge = (status?: string) => {
  switch(status?.toLowerCase()) {
    case 'completed':
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
    case 'failed':
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
    default:
      return <Badge variant="outline">{status || 'Unknown'}</Badge>;
  }
};

// Sample transaction type badges with appropriate colors
const getTypeBadge = (type?: string) => {
  switch(type?.toLowerCase()) {
    case 'deposit':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Deposit</Badge>;
    case 'withdrawal':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Withdrawal</Badge>;
    case 'transfer':
      return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Transfer</Badge>;
    case 'compensation':
      return <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">Compensation</Badge>;
    default:
      return <Badge>{type || 'Unknown'}</Badge>;
  }
};

const formatCurrency = (amount?: number, currency?: string) => {
  if (amount === undefined) return '-';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
};

const TransactionManagement = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showCompensateDialog, setShowCompensateDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [filters, setFilters] = useState({
    status: "",
    transactionType: "",
    startDate: "",
    endDate: "",
    currency: "",
  });
  
  const { toast } = useToast();

  // Fetch transactions (for demo, using mock data from user ID 1, wallet ID 101)
  const { data: transactions, isLoading, refetch } = useQuery({
    queryKey: ["transactions", page, pageSize, searchTerm, filters],
    queryFn: async () => {
      // In a real implementation, you would use the filters
      // For demo, we'll use a fixed user and wallet
      const userId = "1";
      const walletId = "101";
      
      try {
        const txns = await apiService.getWalletTransactions(userId, walletId);
        
        // Apply client-side filtering (in a real app, this would be done by the API)
        return txns.filter(t => {
          if (searchTerm && 
              !t.transactionId.includes(searchTerm) && 
              !t.reference?.includes(searchTerm)) {
            return false;
          }
          
          if (filters.status && t.status !== filters.status) {
            return false;
          }
          
          if (filters.transactionType && t.type !== filters.transactionType) {
            return false;
          }
          
          if (filters.currency && t.currency !== filters.currency) {
            return false;
          }
          
          if (filters.startDate && t.date && new Date(t.date) < new Date(filters.startDate)) {
            return false;
          }
          
          if (filters.endDate && t.date && new Date(t.date) > new Date(filters.endDate)) {
            return false;
          }
          
          return true;
        });
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    refetch();
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsDialog(true);
  };

  const handleCancelTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowCancelDialog(true);
  };

  const handleCompensateCustomer = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowCompensateDialog(true);
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
    setShowFilters(false);
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

  const handleSubmitCancel = async (reason: string) => {
    if (!selectedTransaction) return;
    
    try {
      await apiService.cancelTransaction(selectedTransaction.transactionId, { reason });
      toast({
        title: "Transaction Cancelled",
        description: `Transaction ${selectedTransaction.transactionId} has been cancelled successfully.`,
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

  const handleSubmitCompensation = async (amount: string, reason: string) => {
    if (!selectedTransaction) return;
    
    try {
      // In a real implementation, you would get these values from context or API
      const companyId = 1;
      const userId = selectedTransaction.customerId;
      const walletId = parseInt(selectedTransaction.walletId);
      const originWalletId = 999; // Company wallet, would come from context/API
      
      await apiService.compensateCustomer(
        companyId,
        userId,
        walletId,
        originWalletId,
        {
          amount,
          reason,
          transaction_code: `COMP-${Date.now()}`,
          admin_user: "Current Admin", // Would come from auth context
          transaction_type: "COMPENSATE"
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

  // Calculate total pages - in a real app this would come from the API
  const totalTransactions = transactions?.length || 0;
  const totalPages = Math.ceil(totalTransactions / pageSize);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transaction Management</h1>
            <p className="text-muted-foreground">Monitor and manage payment transactions</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by ID or Reference..."
                  className="pl-8 w-full md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
            
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter size={16} />
              Filters
              {Object.values(filters).some(v => v !== "") && (
                <Badge className="ml-1 bg-primary/20 text-primary text-xs">
                  {Object.values(filters).filter(v => v !== "").length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <TransactionFilters 
            filters={filters} 
            onApply={handleApplyFilters} 
            onReset={resetFilters} 
          />
        )}
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              {isLoading ? "Loading..." : 
                transactions && transactions.length > 0 
                  ? `${transactions.length} transactions found` 
                  : "No transactions found"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
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
            )}
            
            {transactions && transactions.length > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{Math.min((page - 1) * pageSize + 1, totalTransactions)}</span> to{" "}
                  <span className="font-medium">{Math.min(page * pageSize, totalTransactions)}</span> of{" "}
                  <span className="font-medium">{totalTransactions}</span> transactions
                </div>
                
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className={page <= 1 ? "pointer-events-none opacity-50" : ""} 
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setPage(pageNum)}
                            isActive={page === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className={page >= totalPages ? "pointer-events-none opacity-50" : ""} 
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Transaction Details Dialog */}
      {selectedTransaction && (
        <TransactionDetails
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          transaction={selectedTransaction}
        />
      )}
      
      {/* Cancel Transaction Dialog */}
      {selectedTransaction && (
        <CancelTransactionDialog
          open={showCancelDialog}
          onOpenChange={setShowCancelDialog}
          transaction={selectedTransaction}
          onSubmit={handleSubmitCancel}
        />
      )}
      
      {/* Compensate Customer Dialog */}
      {selectedTransaction && (
        <CompensateCustomerDialog
          open={showCompensateDialog}
          onOpenChange={setShowCompensateDialog}
          transaction={selectedTransaction}
          onSubmit={handleSubmitCompensation}
        />
      )}
    </>
  );
};

export default TransactionManagement;
