
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService as api } from "@/lib/api";
import { BackofficeUser } from "@/lib/api/types";
import { useToast } from "@/hooks/use-toast";
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

interface BlockBackofficeUserDialogProps {
  open: boolean;
  user: BackofficeUser;
  onClose: () => void;
}

const BlockBackofficeUserDialog: React.FC<BlockBackofficeUserDialogProps> = ({
  open,
  user,
  onClose,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  const blockUserMutation = useMutation({
    mutationFn: (userId: string) => api.blockBackofficeUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backofficeUsers"] });
      toast({
        title: t("success"),
        description: t("user-blocked-success"),
      });
      onClose();
    },
    onError: (error) => {
      let errorMessage = t("failed-block-user");
      
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

  const handleBlock = () => {
    if (user.id) {
      blockUserMutation.mutate(user.id);
    } else {
      toast({
        title: t("error"),
        description: t("cannot-block-without-id"),
        variant: "destructive",
      });
      onClose();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("block-backoffice-user")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("block-confirmation")} {user.name} {user.surname}? 
            {t("block-warning")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={blockUserMutation.isPending}
          >
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleBlock} 
            disabled={blockUserMutation.isPending}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {blockUserMutation.isPending ? t("blocking") : t("block-user")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BlockBackofficeUserDialog;

