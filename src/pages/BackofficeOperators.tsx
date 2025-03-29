
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService as api } from "@/lib/api";
import { BackofficeUser } from "@/lib/api/types";
import BackofficeUsersTable from "@/components/backoffice-users/BackofficeUsersTable";
import AddBackofficeUserDialog from "@/components/backoffice-users/AddBackofficeUserDialog";
import DeleteBackofficeUserDialog from "@/components/backoffice-users/DeleteBackofficeUserDialog";
import BlockBackofficeUserDialog from "@/components/backoffice-users/BlockBackofficeUserDialog";
import UnblockBackofficeUserDialog from "@/components/backoffice-users/UnblockBackofficeUserDialog";
import EditRolesDialog from "@/components/backoffice-users/EditRolesDialog";
import EditBackofficeUserDialog from "@/components/backoffice-users/EditBackofficeUserDialog";
import BackofficeUsersLoadingSkeleton from "@/components/backoffice-users/BackofficeUsersLoadingSkeleton";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, AlertTriangle, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BackofficeOperators: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showUnblockDialog, setShowUnblockDialog] = useState(false);
  const [showEditRolesDialog, setShowEditRolesDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<BackofficeUser | null>(null);

  // Fetch backoffice users
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["backofficeUsers"],
    queryFn: () => api.listBackofficeUsers(),
    retry: 1,
  });

  // Filter users based on search
  const filteredUsers = searchQuery
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.roles && user.roles.some(role => role.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : users;

  // Handle selection of user for various operations
  const handleUserAction = (user: BackofficeUser, action: string) => {
    setSelectedUser(user);
    switch (action) {
      case "delete":
        setShowDeleteDialog(true);
        break;
      case "block":
        setShowBlockDialog(true);
        break;
      case "unblock":
        setShowUnblockDialog(true);
        break;
      case "editRoles":
        setShowEditRolesDialog(true);
        break;
      case "edit":
        setShowEditUserDialog(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Backoffice Operators Management</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Add New Operator
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Backoffice Operators</CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full md:w-[300px]"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <BackofficeUsersLoadingSkeleton />
          ) : isError ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error Loading Operators</AlertTitle>
                <AlertDescription>
                  {error instanceof Error ? error.message : "Failed to load backoffice operators. Please try again."}
                </AlertDescription>
              </Alert>
              <Button variant="outline" onClick={() => refetch()} className="mt-2">
                <RefreshCw className="h-4 w-4 mr-2" /> Retry
              </Button>
            </div>
          ) : (
            <BackofficeUsersTable
              users={filteredUsers}
              onUserAction={handleUserAction}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialogs for user management */}
      {showAddDialog && (
        <AddBackofficeUserDialog
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
        />
      )}

      {selectedUser && showDeleteDialog && (
        <DeleteBackofficeUserDialog
          open={showDeleteDialog}
          user={selectedUser}
          onClose={() => setShowDeleteDialog(false)}
        />
      )}

      {selectedUser && showBlockDialog && (
        <BlockBackofficeUserDialog
          open={showBlockDialog}
          user={selectedUser}
          onClose={() => setShowBlockDialog(false)}
        />
      )}

      {selectedUser && showUnblockDialog && (
        <UnblockBackofficeUserDialog
          open={showUnblockDialog}
          user={selectedUser}
          onClose={() => setShowUnblockDialog(false)}
        />
      )}

      {selectedUser && showEditRolesDialog && (
        <EditRolesDialog
          open={showEditRolesDialog}
          user={selectedUser}
          onClose={() => setShowEditRolesDialog(false)}
        />
      )}

      {selectedUser && showEditUserDialog && (
        <EditBackofficeUserDialog
          open={showEditUserDialog}
          user={selectedUser}
          onClose={() => setShowEditUserDialog(false)}
        />
      )}
    </div>
  );
};

export default BackofficeOperators;
