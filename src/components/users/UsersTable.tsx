
import React from "react";
import { User } from "@/lib/api/types";
import { MoreVertical, Eye, Lock, LockOpen, X, UserIcon } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UsersTableProps {
  users: User[];
  setSelectedUser: (user: User) => void;
  setShowDeleteDialog: (show: boolean) => void;
  setShowBlockDialog: (show: boolean) => void;
  setShowUnblockDialog: (show: boolean) => void;
  onViewDetails: (userId: number) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  setSelectedUser,
  setShowDeleteDialog,
  setShowBlockDialog,
  setShowUnblockDialog,
  onViewDetails,
}) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Cell Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.id}
                  {user.publicId && <div className="text-xs text-muted-foreground truncate max-w-[180px]">{user.publicId}</div>}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.name.charAt(0)}{user.surname?.charAt(0) || ''}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name} {user.surname}</div>
                      {user.username && <div className="text-xs text-muted-foreground">@{user.username}</div>}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {user.cellPhone || 
                   (user.phoneNumber && <span className="text-sm">{user.phoneNumber}</span>) || 
                   <span className="text-muted-foreground text-sm">Not provided</span>}
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
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onViewDetails(user.id)}>
                        <Eye size={16} className="mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.status === "ACTIVE" || !user.blocked ? (
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedUser(user);
                            setShowBlockDialog(true);
                          }}
                          className="text-amber-600"
                        >
                          <Lock size={16} className="mr-2" /> Block User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUnblockDialog(true);
                          }}
                          className="text-green-600"
                        >
                          <LockOpen size={16} className="mr-2" /> Unblock User
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => {
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
