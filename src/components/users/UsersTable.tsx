
import React from "react";
import { User } from "@/lib/api/types";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Eye, Lock, LockOpen, X, Wallet, FileText, UserIcon } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface UsersTableProps {
  users: User[];
  setSelectedUser: (user: User) => void;
  setShowDeleteDialog: (show: boolean) => void;
  setShowBlockDialog: (show: boolean) => void;
  setShowUnblockDialog: (show: boolean) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  setSelectedUser,
  setShowDeleteDialog,
  setShowBlockDialog,
  setShowUnblockDialog,
}) => {
  const navigate = useNavigate();

  const viewUserDetails = (user: User) => {
    navigate(`/users/${user.id}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id} className="cursor-pointer" onClick={() => viewUserDetails(user)}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center">
                      <UserIcon size={16} />
                    </div>
                    <div>
                      <div className="font-medium">{user.name} {user.surname}</div>
                      <div className="text-sm text-muted-foreground">@{user.username}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{user.id}</div>
                  {user.publicId && <div className="text-xs text-muted-foreground">{user.publicId}</div>}
                </TableCell>
                <TableCell>
                  {user.email && <div className="text-sm">{user.email}</div>}
                  {user.phoneNumber && <div className="text-sm">{user.phoneNumber}</div>}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.status === "ACTIVE" ? "outline" : "destructive"}
                    className={user.status === "ACTIVE" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                  >
                    {user.status || (user.blocked ? "BLOCKED" : "ACTIVE")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        viewUserDetails(user);
                      }}>
                        <Eye size={16} className="mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        viewUserDetails(user);
                      }}>
                        <Wallet size={16} className="mr-2" /> View Wallets
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        viewUserDetails(user);
                      }}>
                        <FileText size={16} className="mr-2" /> Transactions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.status === "ACTIVE" || !user.blocked ? (
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUser(user);
                            setShowBlockDialog(true);
                          }}
                          className="text-amber-600"
                        >
                          <Lock size={16} className="mr-2" /> Block User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUser(user);
                            setShowUnblockDialog(true);
                          }}
                          className="text-green-600"
                        >
                          <LockOpen size={16} className="mr-2" /> Unblock User
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                          setShowDeleteDialog(true);
                        }}
                        className="text-destructive"
                      >
                        <X size={16} className="mr-2" /> Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No users found. Try a different search.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
