
import React from "react";
import { BackofficeUser } from "@/lib/api/types";
import { formatDate } from "@/lib/utils";
import { 
  MoreVertical, 
  Eye, 
  Lock, 
  LockOpen, 
  X, 
  Pencil, 
  Shield 
} from "lucide-react";
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

interface BackofficeUsersTableProps {
  users: BackofficeUser[];
  onUserAction: (user: BackofficeUser, action: string) => void;
}

const BackofficeUsersTable: React.FC<BackofficeUsersTableProps> = ({
  users,
  onUserAction,
}) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.name.charAt(0)}{user.surname.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name} {user.surname}</div>
                      {user.id && <div className="text-xs text-muted-foreground">{user.id}</div>}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email || "—"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles && user.roles.map((role) => (
                      <Badge key={role} variant="outline" className="capitalize">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.state === "active" ? "outline" : "destructive"}
                    className={user.state === "active" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                  >
                    {user.state}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.last_login ? formatDate(new Date(user.last_login)) : "Never"}
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
                      <DropdownMenuItem onClick={() => onUserAction(user, "edit")}>
                        <Pencil size={16} className="mr-2" /> Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUserAction(user, "editRoles")}>
                        <Shield size={16} className="mr-2" /> Edit Roles
                      </DropdownMenuItem>
                      {user.state === "active" ? (
                        <DropdownMenuItem 
                          onClick={() => onUserAction(user, "block")}
                          className="text-red-600"
                        >
                          <Lock size={16} className="mr-2" /> Block User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          onClick={() => onUserAction(user, "unblock")}
                          className="text-green-600"
                        >
                          <LockOpen size={16} className="mr-2" /> Unblock User
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => onUserAction(user, "delete")}
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
              <TableCell colSpan={6} className="h-24 text-center">
                No backoffice users found. Try a different search or add a new user.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BackofficeUsersTable;
