
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService as api } from "@/lib/api";
import { BackofficeUser } from "@/lib/api/types";
import BackofficeLayout from "@/components/BackofficeLayout";
import BackofficeUsersTable from "@/components/backoffice-users/BackofficeUsersTable";
import AddBackofficeUserDialog from "@/components/backoffice-users/AddBackofficeUserDialog";
import DeleteBackofficeUserDialog from "@/components/backoffice-users/DeleteBackofficeUserDialog";
import BlockBackofficeUserDialog from "@/components/backoffice-users/BlockBackofficeUserDialog";
import UnblockBackofficeUserDialog from "@/components/backoffice-users/UnblockBackofficeUserDialog";
import EditRolesDialog from "@/components/backoffice-users/EditRolesDialog";
import BackofficeUsersLoadingSkeleton from "@/components/backoffice-users/BackofficeUsersLoadingSkeleton";
import { Button } from "@/components/ui/button";
import { UserPlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const BackofficeUsers: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showUnblockDialog, setShowUnblockDialog] = useState(false);
  const [showEditRolesDialog, setShowEditRolesDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<BackofficeUser | null>(null);

  // Fetch backoffice users
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["backofficeUsers"],
    queryFn: () => api.listBackofficeUsers(),
  });

  // Filter users based on search
  const filteredUsers = searchQuery
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      default:
        break;
    }
  };

  return (
    <BackofficeLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Backoffice Users Management</h1>
          <Button onClick={() => setShowAddDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Add New User
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Backoffice Users</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or role..."
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
              <p className="text-center py-6 text-destructive">
                Error loading backoffice users. Please try again.
              </p>
            ) : (
              <BackofficeUsersTable
                users={filteredUsers}
                onUserAction={handleUserAction}
              />
            )}
          </CardContent>
        </Card>
      </div>

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
    </BackofficeLayout>
  );
};

export default BackofficeUsers;
