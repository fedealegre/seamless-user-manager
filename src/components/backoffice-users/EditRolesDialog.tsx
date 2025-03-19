
import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { BackofficeUser } from "@/lib/api/types";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface EditRolesDialogProps {
  open: boolean;
  user: BackofficeUser;
  onClose: () => void;
}

const roleOptions = [
  { id: "admin", label: "Admin" },
  { id: "support", label: "Support" },
  { id: "finance", label: "Finance" },
];

const EditRolesDialog: React.FC<EditRolesDialogProps> = ({
  open,
  user,
  onClose,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize roles when dialog opens or user changes
  useEffect(() => {
    if (open && user.roles) {
      setSelectedRoles(user.roles || []);
    }
  }, [open, user]);

  // Clean up state when dialog closes
  useEffect(() => {
    if (!open) {
      // Reset state when dialog is closed
      setErrorMessage(null);
    }
  }, [open]);

  const updateRolesMutation = useMutation({
    mutationFn: ({ userId, roles }: { userId: string; roles: string[] }) => 
      api.modifyUserRoles(userId, roles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backofficeUsers"] });
      toast({
        title: "Success",
        description: "User roles updated successfully",
      });
      // Close dialog on success
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
    // Ensure mutation completes properly whether it succeeds or fails
    onSettled: () => {
      // Additional cleanup if needed
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

  const handleClose = () => {
    // Only allow closing if no mutation is in progress
    if (!updateRolesMutation.isPending) {
      // Reset error message before closing
      setErrorMessage(null);
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!isOpen && !updateRolesMutation.isPending) {
          handleClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Roles</DialogTitle>
          <DialogDescription>
            Update roles for {user.name} {user.surname}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            {roleOptions.map((role) => (
              <div key={role.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${role.id}`}
                  checked={selectedRoles.includes(role.id)}
                  onCheckedChange={(checked) => 
                    handleRoleToggle(role.id, checked as boolean)
                  }
                  disabled={selectedRoles.length === 1 && selectedRoles.includes(role.id)}
                />
                <label
                  htmlFor={`role-${role.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {role.label}
                </label>
              </div>
            ))}
          </div>
          
          {selectedRoles.length === 0 && (
            <p className="text-sm text-destructive mt-2">
              User must have at least one role
            </p>
          )}
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
            disabled={updateRolesMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={updateRolesMutation.isPending || selectedRoles.length === 0}
          >
            {updateRolesMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRolesDialog;
