
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService as api } from "@/lib/api";
import { BackofficeUser } from "@/lib/api/types";
import { useToast } from "@/components/ui/use-toast";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UnblockBackofficeUserDialogProps {
  open: boolean;
  user: BackofficeUser;
  onClose: () => void;
}

const UnblockBackofficeUserDialog: React.FC<UnblockBackofficeUserDialogProps> = ({
  open,
  user,
  onClose,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  const unblockUserMutation = useMutation({
    mutationFn: (userId: string) => api.unblockBackofficeUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backofficeUsers"] });
      toast({
        title: t("success"),
        description: t("user-unblocked-success"),
      });
      onClose();
    },
    onError: (error) => {
      let errorMessage = t("failed-unblock-user");
      
      if (error instanceof Error) {
        // Extract specific error message
        if (error.message.includes("Not Found")) {
          errorMessage = t("user-not-found");
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: t("error"),
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleUnblock = () => {
    if (user.id) {
      unblockUserMutation.mutate(user.id);
    } else {
      toast({
        title: t("error"),
        description: t("cannot-unblock-without-id"),
        variant: "destructive",
      });
      onClose();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("unblock-backoffice-user")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("unblock-confirmation")} {user.name} {user.surname}? 
            {t("unblock-warning")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={unblockUserMutation.isPending}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleUnblock} 
            disabled={unblockUserMutation.isPending}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {unblockUserMutation.isPending ? t("unblocking") : t("unblock-user")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnblockBackofficeUserDialog;
