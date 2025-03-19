
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService as api } from "@/lib/api";
import { BackofficeUser } from "@/lib/api/types";
import { useToast } from "@/components/ui/use-toast";
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

  const blockUserMutation = useMutation({
    mutationFn: (userId: string) => api.blockBackofficeUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backofficeUsers"] });
      toast({
        title: "Success",
        description: "User blocked successfully",
      });
      onClose();
    },
    onError: (error) => {
      let errorMessage = "Failed to block user";
      
      if (error instanceof Error) {
        // Extract specific error message
        if (error.message.includes("Not Found")) {
          errorMessage = "User not found. The user may have been deleted.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
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
        title: "Error",
        description: "Cannot block user without an ID",
        variant: "destructive",
      });
      onClose();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Block Backoffice User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to block {user.name} {user.surname}? 
            They will no longer be able to access the backoffice system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={blockUserMutation.isPending}
            onClick={() => onClose()}
            type="button"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleBlock} 
            disabled={blockUserMutation.isPending}
            className="bg-amber-600 text-white hover:bg-amber-700"
            type="button"
          >
            {blockUserMutation.isPending ? "Blocking..." : "Block User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BlockBackofficeUserDialog;
