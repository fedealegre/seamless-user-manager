
import React from "react";
import { User } from "@/lib/api/types";
import { AlertTriangle, Lock, LockOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UserActionDialogsProps {
  selectedUser: User | null;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  showBlockDialog: boolean;
  setShowBlockDialog: (show: boolean) => void;
  showUnblockDialog: boolean;
  setShowUnblockDialog: (show: boolean) => void;
  handleDeleteUser: () => Promise<void>;
  handleBlockUser: () => Promise<void>;
  handleUnblockUser: () => Promise<void>;
}

const UserActionDialogs: React.FC<UserActionDialogsProps> = ({
  selectedUser,
  showDeleteDialog,
  setShowDeleteDialog,
  showBlockDialog,
  setShowBlockDialog,
  showUnblockDialog,
  setShowUnblockDialog,
  handleDeleteUser,
  handleBlockUser,
  handleUnblockUser,
}) => {
  return (
    <>
      {/* Delete User Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle size={16} className="text-destructive" />
                </div>
                <div>
                  <div className="font-medium">{selectedUser.name} {selectedUser.surname}</div>
                  <div className="text-sm text-muted-foreground">ID: {selectedUser.id}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Block User Dialog */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block User</DialogTitle>
            <DialogDescription>
              Are you sure you want to block this user? They will not be able to access their account.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Lock size={16} className="text-amber-600" />
                </div>
                <div>
                  <div className="font-medium">{selectedUser.name} {selectedUser.surname}</div>
                  <div className="text-sm text-muted-foreground">ID: {selectedUser.id}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlockDialog(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleBlockUser}>
              Block User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Unblock User Dialog */}
      <Dialog open={showUnblockDialog} onOpenChange={setShowUnblockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unblock User</DialogTitle>
            <DialogDescription>
              Are you sure you want to unblock this user? They will regain access to their account.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <LockOpen size={16} className="text-green-600" />
                </div>
                <div>
                  <div className="font-medium">{selectedUser.name} {selectedUser.surname}</div>
                  <div className="text-sm text-muted-foreground">ID: {selectedUser.id}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUnblockDialog(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleUnblockUser}>
              Unblock User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserActionDialogs;
