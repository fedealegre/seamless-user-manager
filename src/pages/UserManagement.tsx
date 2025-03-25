import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserManagement } from "@/hooks/use-user-management";
import UserSearchBar from "@/components/users/UserSearchBar";
import UsersTable from "@/components/users/UsersTable";
import UsersLoadingSkeleton from "@/components/users/UsersLoadingSkeleton";
import UserActionDialogs from "@/components/users/UserActionDialogs";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

const UserManagement = () => {
  
  const {
    users,
    isLoading,
    searchParams,
    setSearchParams,
    handleSearch,
    selectedUser,
    setSelectedUser,
    showDeleteDialog,
    setShowDeleteDialog,
    showBlockDialog,
    setShowBlockDialog,
    showUnblockDialog,
    setShowUnblockDialog,
    handleDeleteUser,
    handleBlockUser,
    handleUnblockUser,
    searchHistory,
    clearSearchHistory
  } = useUserManagement();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("search");

  const handleViewUserDetails = (userId: number) => {
    navigate(`/users/${userId}`);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage and monitor customer accounts</p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search Users</TabsTrigger>
            <TabsTrigger value="history">Search History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="mt-6">
            <UserSearchBar 
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              handleSearch={handleSearch}
            />
            
            <Card className="mt-6">
              <CardHeader className="py-4">
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  {isLoading ? "Loading..." : 
                    users && users.length > 0 
                      ? `${users.length} users found` 
                      : "No users found"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <UsersLoadingSkeleton />
                ) : (
                  <UsersTable
                    users={users || []}
                    setSelectedUser={setSelectedUser}
                    setShowDeleteDialog={setShowDeleteDialog}
                    setShowBlockDialog={setShowBlockDialog}
                    setShowUnblockDialog={setShowUnblockDialog}
                    onViewDetails={handleViewUserDetails}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader className="py-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Searches</CardTitle>
                  {searchHistory.length > 0 && (
                    <button 
                      onClick={clearSearchHistory}
                      className="text-sm text-destructive hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <CardDescription>
                  Your recent user searches
                </CardDescription>
              </CardHeader>
              <CardContent>
                {searchHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No recent searches</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchHistory.map((item, index) => (
                      <Card key={index} className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex flex-wrap justify-between items-start gap-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {item.searchBy === "name" ? "Name" : 
                                 item.searchBy === "surname" ? "Surname" : 
                                 "ID/Email"}:
                                <span className="ml-2 text-muted-foreground">{item.query}</span>
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(item.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <button 
                              onClick={() => {
                                setSearchParams(item);
                                handleSearch(new Event('submit') as any);
                                setActiveTab("search");
                              }}
                              className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-full"
                            >
                              Search Again
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <UserActionDialogs
        selectedUser={selectedUser}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        showBlockDialog={showBlockDialog}
        setShowBlockDialog={setShowBlockDialog}
        showUnblockDialog={showUnblockDialog}
        setShowUnblockDialog={setShowUnblockDialog}
        handleDeleteUser={handleDeleteUser}
        handleBlockUser={handleBlockUser}
        handleUnblockUser={handleUnblockUser}
      />
    </>
  );
};

export default UserManagement;
