import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService as api } from "@/lib/api";
import { BackofficeUser } from "@/lib/api/types";
import { useToast } from "@/hooks/use-toast";
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
import { Button } from "@/components/ui/button";

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

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => api.deleteBackofficeUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backofficeUsers"] });
      toast({
        title: "Success",
        description: "Backoffice user deleted successfully",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete user: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (user.id) {
      deleteUserMutation.mutate(user.id);
    } else {
      toast({
        title: "Error",
        description: "Cannot delete user without an ID",
        variant: "destructive",
      });
      onClose();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Backoffice User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {user.name} {user.surname}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteUserMutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={deleteUserMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBackofficeUserDialog;
