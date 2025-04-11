
import React, { useState, useEffect } from "react";
import { User } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/lib/api/user-service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Unlink, UserRoundX } from "lucide-react";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface WalletUsersDialogProps {
  walletId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WalletUsersDialog: React.FC<WalletUsersDialogProps> = ({
  walletId,
  open,
  onOpenChange,
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const { toast } = useToast();

  // Fetch users associated with the wallet
  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["wallet-users", walletId],
    queryFn: () => userService.getWalletUsers(walletId),
    enabled: open && !!walletId,
  });

  // Function to remove user from wallet
  const handleRemoveUser = async (userId: string) => {
    try {
      await userService.removeUserFromWallet(walletId, userId);
      toast({
        title: t("success"),
        description: t("user-removed-from-wallet"),
      });
      refetch();
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message || t("failed-to-remove-user"),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("wallet-users")}</DialogTitle>
          <DialogDescription>
            {t("users-with-access-to-wallet")} {walletId}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("username")}</TableHead>
                  <TableHead>{t("role")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      {t("no-users-found")}
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user.name} {user.surname}
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        {user.additionalInfo?.walletRole === "owner" ? (
                          <Badge className="bg-blue-500">
                            {t("wallet-owner")}
                          </Badge>
                        ) : (
                          <Badge variant="outline">{t("authorized-user")}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveUser(user.id.toString())}
                          disabled={user.additionalInfo?.walletRole === "owner"}
                          title={
                            user.additionalInfo?.walletRole === "owner"
                              ? t("cannot-remove-owner")
                              : t("remove-user")
                          }
                        >
                          <Unlink className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
