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

  const unblockUserMutation = useMutation({
    mutationFn: (userId: string) => api.unblockBackofficeUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backofficeUsers"] });
      toast({
        title: "Success",
        description: "User unblocked successfully",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to unblock user: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    },
  });

  const handleUnblock = () => {
    if (user.id) {
      unblockUserMutation.mutate(user.id);
    } else {
      toast({
        title: "Error",
        description: "Cannot unblock user without an ID",
        variant: "destructive",
      });
      onClose();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unblock Backoffice User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to unblock {user.name} {user.surname}? 
            They will regain access to the backoffice system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={unblockUserMutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleUnblock} 
            disabled={unblockUserMutation.isPending}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {unblockUserMutation.isPending ? "Unblocking..." : "Unblock User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnblockBackofficeUserDialog;
