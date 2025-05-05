
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

interface DeleteBackofficeUserDialogProps {
  open: boolean;
  user: BackofficeUser;
  onClose: () => void;
}

const DeleteBackofficeUserDialog: React.FC<DeleteBackofficeUserDialogProps> = ({
  open,
  user,
  onClose,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => api.deleteBackofficeUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backofficeUsers"] });
      toast({
        title: t("success"),
        description: t("backoffice-user-deleted-success"),
      });
      onClose();
    },
    onError: (error) => {
      let errorMessage = t("failed-delete-user");
      
      if (error instanceof Error) {
        // Extract specific error message
        if (error.message.includes("Not Found")) {
          errorMessage = t("user-not-found-already-deleted");
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

  const handleDelete = () => {
    if (user.id) {
      deleteUserMutation.mutate(user.id);
    } else {
      toast({
        title: t("error"),
        description: t("cannot-delete-without-id"),
        variant: "destructive",
      });
      onClose();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("delete-backoffice-user")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("delete-confirmation")} {user.name} {user.surname}? {t("delete-warning")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteUserMutation.isPending}>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={deleteUserMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteUserMutation.isPending ? t("deleting") : t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBackofficeUserDialog;
