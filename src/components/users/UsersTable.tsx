import React from "react";
import { User } from "@/lib/api/types";
import { 
  Eye, 
  Lock, 
  LockOpen, 
  Wallet, 
  CreditCard
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

interface UsersTableProps {
  users: User[];
  setSelectedUser: (user: User) => void;
  setShowBlockDialog: (show: boolean) => void;
  setShowUnblockDialog: (show: boolean) => void;
  onViewDetails: (userId: number) => void;
  onViewWallets?: (userId: number) => void;
  onViewTransactions?: (userId: number) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  setSelectedUser,
  setShowBlockDialog,
  setShowUnblockDialog,
  onViewDetails,
  onViewWallets,
  onViewTransactions
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

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
                      {user.blocked && user.blockReason && (
                        <div className="text-xs text-muted-foreground">
                          {t('block-reason')}: {user.blockReason}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {user.cellPhone || <span className="text-muted-foreground text-sm">Not provided</span>}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={!user.blocked ? "outline" : "destructive"}
                    className={!user.blocked ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                  >
                    {user.blocked ? "BLOCKED" : "ACTIVE"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <span className="sr-only">Open menu</span>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onViewDetails(user.id)}>
                        <Eye size={16} className="mr-2" /> {t('view-details')}
                      </DropdownMenuItem>
                      
                      {!user.blocked ? (
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedUser(user);
                            setShowBlockDialog(true);
                          }}
                          className="text-amber-600"
                        >
                          <Lock size={16} className="mr-2" /> {t('block-user')}
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUnblockDialog(true);
                          }}
                          className="text-green-600"
                        >
                          <LockOpen size={16} className="mr-2" /> {t('unblock-user')}
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
