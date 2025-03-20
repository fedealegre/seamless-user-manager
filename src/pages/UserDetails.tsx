
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, User, Wallet as WalletIcon, FileText } from "lucide-react";
import { useUserDetails } from "@/hooks/use-user-details";
import UserDetailsTab from "@/components/users/UserDetailsTab";
import { WalletsTable } from "@/components/wallets/WalletsTable";
import { WalletsLoadingSkeleton } from "@/components/wallets/WalletsLoadingSkeleton";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import TransactionsLoadingSkeleton from "@/components/transactions/TransactionsLoadingSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const UserDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  const {
    user,
    wallets,
    transactions,
    isLoadingUser,
    isLoadingWallets,
    isLoadingTransactions,
    currentPage,
    pageSize,
    handleViewDetails,
    handleCancelTransaction,
    handleCompensateCustomer,
    setCurrentPage
  } = useUserDetails(userId);

  useEffect(() => {
    // If no userId is provided, redirect back to user management
    if (!userId) {
      navigate("/users");
    }
  }, [userId, navigate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate("/users")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isLoadingUser ? (
            <Skeleton className="h-9 w-40" />
          ) : (
            `${user?.name || ""} ${user?.surname || ""}`
          )}
        </h1>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <User className="h-4 w-4" /> Details
              </TabsTrigger>
              <TabsTrigger value="wallets" className="flex items-center gap-2">
                <WalletIcon className="h-4 w-4" /> Wallets
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> Transactions
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="pt-4">
              {isLoadingUser ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <UserDetailsTab user={user} />
              )}
            </TabsContent>
            
            <TabsContent value="wallets" className="pt-4">
              {isLoadingWallets ? (
                <WalletsLoadingSkeleton />
              ) : (
                <WalletsTable wallets={wallets || []} />
              )}
            </TabsContent>
            
            <TabsContent value="transactions" className="pt-4">
              {isLoadingTransactions ? (
                <TransactionsLoadingSkeleton />
              ) : (
                <TransactionsTable 
                  transactions={transactions || []}
                  page={currentPage}
                  pageSize={pageSize}
                  handleViewDetails={handleViewDetails}
                  handleCancelTransaction={handleCancelTransaction}
                  handleCompensateCustomer={handleCompensateCustomer}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetails;
