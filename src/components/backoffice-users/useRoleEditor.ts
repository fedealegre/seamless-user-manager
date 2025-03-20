
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { BackofficeUser } from "@/lib/api/types";
import { useToast } from "@/components/ui/use-toast";

export function useRoleEditor(user: BackofficeUser, onClose: () => void) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize roles when dialog opens or user changes
  useEffect(() => {
    if (user.roles) {
      setSelectedRoles(user.roles || []);
    }
  }, [user]);

  const updateRolesMutation = useMutation({
    mutationFn: ({ userId, roles }: { userId: string; roles: string[] }) => 
      api.modifyUserRoles(userId, roles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backofficeUsers"] });
      toast({
        title: "Success",
        description: "User roles updated successfully",
      });
      onClose();
    },
    onError: (error) => {
      let errorMessage = "Failed to update roles";
      
      if (error instanceof Error) {
        // Extract specific error message
        if (error.message.includes("Not Found")) {
          errorMessage = "User not found. The user may have been deleted.";
        } else if (error.message.includes("Bad Request")) {
          errorMessage = "Invalid roles. Please select at least one role.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setErrorMessage(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleRoleToggle = (roleId: string, checked: boolean) => {
    setErrorMessage(null);
    
    if (checked) {
      setSelectedRoles([...selectedRoles, roleId]);
    } else {
      // Prevent removing the last role
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter(id => id !== roleId));
      } else {
        setErrorMessage("User must have at least one role");
        toast({
          title: "Warning",
          description: "User must have at least one role",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = () => {
    if (user.id && selectedRoles.length > 0) {
      updateRolesMutation.mutate({ userId: user.id, roles: selectedRoles });
    } else {
      setErrorMessage("User must have at least one role");
      toast({
        title: "Error",
        description: "User must have at least one role",
        variant: "destructive",
      });
    }
  };

  const resetErrors = () => {
    setErrorMessage(null);
  };

  return {
    selectedRoles,
    errorMessage,
    isPending: updateRolesMutation.isPending,
    handleRoleToggle,
    handleSubmit,
    resetErrors
  };
}
