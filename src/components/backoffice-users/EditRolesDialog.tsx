
import React from "react";
import { BackofficeUser } from "@/lib/api/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RoleSelector from "./RoleSelector";
import { useRoleEditor } from "./useRoleEditor";

interface EditRolesDialogProps {
  open: boolean;
  user: BackofficeUser;
  onClose: () => void;
}

const EditRolesDialog: React.FC<EditRolesDialogProps> = ({
  open,
  user,
  onClose,
}) => {
  const {
    selectedRoles,
    errorMessage,
    isPending,
    handleRoleToggle,
    handleSubmit,
    resetErrors
  } = useRoleEditor(user, onClose);

  const handleClose = () => {
    if (!isPending) {
      resetErrors();
      onClose();
      // Ensure body pointer-events are reset
      document.body.style.pointerEvents = '';
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!isOpen && !isPending) {
          handleClose();
        } else if (!isOpen && isPending) {
          // If trying to close during pending operation, restore pointer-events
          document.body.style.pointerEvents = '';
        }
      }}
    >
      <DialogContent onCloseAutoFocus={(event) => {
        event.preventDefault();
        document.body.style.pointerEvents = '';
      }}>
        <DialogHeader>
          <DialogTitle>Edit User Roles</DialogTitle>
          <DialogDescription>
            Update roles for {user.name} {user.surname}
          </DialogDescription>
        </DialogHeader>

        <RoleSelector 
          selectedRoles={selectedRoles}
          onRoleToggle={handleRoleToggle}
          errorMessage={errorMessage}
        />

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isPending || selectedRoles.length === 0}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRolesDialog;
