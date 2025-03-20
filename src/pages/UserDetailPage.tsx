
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserDetails } from "@/hooks/use-user-details";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserIcon } from "lucide-react";
import { UserInfoTab } from "@/components/users/UserInfoTab";
import { UserWalletsTab } from "@/components/users/UserWalletsTab";
import { UserTransactionsTab } from "@/components/users/UserTransactionsTab";

const UserDetailPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  const { 
    user, 
    wallets, 
    isLoadingUser, 
    isLoadingWallets,
    error
  } = useUserDetails(userId);

  useEffect(() => {
    if (error) {
      console.error("Error loading user details:", error);
    }
  }, [error]);

  const handleBack = () => {
    navigate("/users");
  };

  if (isLoadingUser) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-[200px]" />
            <Skeleton className="h-5 w-[300px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">User not found</h2>
            <p className="text-muted-foreground">The requested user could not be found.</p>
          </div>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to User Management
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        <div className="flex flex-col sm:items-end">
          <h1 className="text-2xl font-bold tracking-tight">User Details</h1>
          <p className="text-muted-foreground">View and manage user information</p>
        </div>
      </div>

      <div className="flex items-center gap-4 my-6">
        <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
          <UserIcon size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{user.name} {user.surname}</h2>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
          <TabsTrigger value="info">Personal Info</TabsTrigger>
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info">
          <UserInfoTab user={user} />
        </TabsContent>
        
        <TabsContent value="wallets">
          <UserWalletsTab 
            userId={userId!} 
            wallets={wallets} 
            isLoading={isLoadingWallets} 
          />
        </TabsContent>
        
        <TabsContent value="transactions">
          <UserTransactionsTab userId={userId!} wallets={wallets} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDetailPage;
