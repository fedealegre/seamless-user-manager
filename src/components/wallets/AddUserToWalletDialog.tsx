
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/api/types";
import { userService } from "@/lib/api/user-service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface AddUserToWalletDialogProps {
  walletId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: () => void;
}

export const AddUserToWalletDialog: React.FC<AddUserToWalletDialogProps> = ({
  walletId,
  open,
  onOpenChange,
  onUserAdded,
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const { toast } = useToast();
  
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch all users that can be added to the wallet
  const { data: allUsers = [], isLoading } = useQuery({
    queryKey: ["all-users"],
    queryFn: () => userService.searchUsers({}),
    enabled: open,
  });

  // Fetch existing wallet users to filter them out
  const { data: walletUsers = [] } = useQuery({
    queryKey: ["wallet-users", walletId],
    queryFn: () => userService.getWalletUsers(walletId),
    enabled: open && !!walletId,
  });

  // Filter out users that are already associated with the wallet
  const walletUserIds = walletUsers.map(user => user.id.toString());
  const availableUsers = allUsers.filter(user => !walletUserIds.includes(user.id.toString()));

  // Filter users based on search term
  const filteredUsers = availableUsers.filter(user => {
    const fullName = `${user.name || ""} ${user.surname || ""}`.toLowerCase();
    const username = (user.username || "").toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchLower) || username.includes(searchLower);
  });

  const handleAddUser = async () => {
    if (!selectedUserId) {
      toast({
        title: t("error"),
        description: t("please-select-user"),
        variant: "destructive",
      });
      return;
    }

    try {
      await userService.addUserToWallet(walletId, selectedUserId, isOwner);
      toast({
        title: t("success"),
        description: t("user-added-to-wallet"),
      });
      onUserAdded();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message || t("failed-to-add-user"),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("add-user-to-wallet")}</DialogTitle>
          <DialogDescription>
            {t("add-user-to-wallet-description")} {walletId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("search-users")}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="user-select">{t("select-user")}</Label>
            <Select
              value={selectedUserId}
              onValueChange={setSelectedUserId}
              disabled={isLoading || filteredUsers.length === 0}
            >
              <SelectTrigger id="user-select">
                <SelectValue placeholder={t("select-user")} />
              </SelectTrigger>
              <SelectContent>
                {filteredUsers.length === 0 ? (
                  <SelectItem value="none" disabled>
                    {searchTerm 
                      ? t("no-matching-users-found")
                      : t("no-available-users")}
                  </SelectItem>
                ) : (
                  filteredUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name} {user.surname} ({user.username})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="owner"
              checked={isOwner}
              onCheckedChange={(checked) => setIsOwner(checked as boolean)}
            />
            <Label htmlFor="owner" className="text-sm font-normal">
              {t("make-wallet-owner")}
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleAddUser} disabled={!selectedUserId}>
            {t("add-user")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
