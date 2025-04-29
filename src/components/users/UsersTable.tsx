
import React from "react";
import { User } from "@/lib/api/types";
import { 
  MoreVertical, 
  Eye, 
  Wallet, 
  Receipt, 
  Lock, 
  LockOpen 
} from "lucide-react";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
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
  setShowBlockDialog: (show: boolean) => void;
  setShowUnblockDialog: (show: boolean) => void;
  onViewDetails: (userId: number) => void;
  onViewWallets: (userId: number) => void;
  onViewTransactions: (userId: number) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  setSelectedUser,
  setShowBlockDialog,
  setShowUnblockDialog,
  onViewDetails,
  onViewWallets,
  onViewTransactions,
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  const handleBlockUser = (user: User) => {
    setSelectedUser(user);
    setShowBlockDialog(true);
  };

  const handleUnblockUser = (user: User) => {
    setSelectedUser(user);
    setShowUnblockDialog(true);
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("user-column")}</TableHead>
            <TableHead>{t("email-column")}</TableHead>
            <TableHead>{t("phone-column")}</TableHead>
            <TableHead>{t("status-column")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
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
                      <div className="text-xs text-muted-foreground">{user.username}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email || "—"}</TableCell>
                <TableCell>{user.cellPhone || "—"}</TableCell>
                <TableCell>
                  {user.blocked || user.status === "BLOCKED" ? (
                    <Badge variant="destructive">{t("blocked")}</Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t("active")}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onViewDetails(user.id)}>
                        <Eye size={16} className="mr-2" /> {t("view-details")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewWallets(user.id)}>
                        <Wallet size={16} className="mr-2" /> {t("view-wallets")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewTransactions(user.id)}>
                        <Receipt size={16} className="mr-2" /> {t("view-transactions")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.blocked || user.status === "BLOCKED" ? (
                        <DropdownMenuItem onClick={() => handleUnblockUser(user)}>
                          <LockOpen size={16} className="mr-2" /> {t("unblock-user")}
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleBlockUser(user)}>
                          <Lock size={16} className="mr-2" /> {t("block-user")}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                {t("no-users-found")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
