
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserManagement } from "@/hooks/use-user-management";
import UserSearchBar from "@/components/users/UserSearchBar";
import UsersTable from "@/components/users/UsersTable";
import UsersLoadingSkeleton from "@/components/users/UsersLoadingSkeleton";
import UserActionDialogs from "@/components/users/UserActionDialogs";

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
    handleUnblockUser
  } = useUserManagement();

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage and monitor customer accounts</p>
          </div>
          
          <UserSearchBar 
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            handleSearch={handleSearch}
          />
        </div>
        
        <Card>
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
              />
            )}
          </CardContent>
        </Card>
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
