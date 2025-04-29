
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
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface BackofficeUsersTableProps {
  users: BackofficeUser[];
  onUserAction: (user: BackofficeUser, action: string) => void;
}

const BackofficeUsersTable: React.FC<BackofficeUsersTableProps> = ({
  users,
  onUserAction,
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("user-column")}</TableHead>
            <TableHead>{t("email-column")}</TableHead>
            <TableHead>{t("roles-column")}</TableHead>
            <TableHead>{t("status-column")}</TableHead>
            <TableHead>{t("last-login-column")}</TableHead>
            <TableHead className="text-right">{t("actions-column")}</TableHead>
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
                        {t(role.toLowerCase())}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.state === "active" ? "outline" : "destructive"}
                    className={user.state === "active" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                  >
                    {t(user.state)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.last_login ? formatDate(new Date(user.last_login)) : t("never")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t("action-options")}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onUserAction(user, "edit")}>
                        <Pencil size={16} className="mr-2" /> {t("edit-user")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUserAction(user, "editRoles")}>
                        <Shield size={16} className="mr-2" /> {t("edit-roles")}
                      </DropdownMenuItem>
                      {user.state === "active" ? (
                        <DropdownMenuItem 
                          onClick={() => onUserAction(user, "block")}
                          className="text-red-600"
                        >
                          <Lock size={16} className="mr-2" /> {t("block-user")}
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          onClick={() => onUserAction(user, "unblock")}
                          className="text-green-600"
                        >
                          <LockOpen size={16} className="mr-2" /> {t("unblock-user")}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => onUserAction(user, "delete")}
                        className="text-destructive"
                      >
                        <X size={16} className="mr-2" /> {t("delete-user")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                {t("no-users-found")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BackofficeUsersTable;

