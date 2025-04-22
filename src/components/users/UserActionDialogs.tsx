
import React, { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface UserActionDialogsProps {
  selectedUser: User | null;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  showBlockDialog: boolean;
  setShowBlockDialog: (show: boolean) => void;
  showUnblockDialog: boolean;
  setShowUnblockDialog: (show: boolean) => void;
  handleDeleteUser: () => Promise<void>;
  handleBlockUser: (reason: string) => Promise<void>;
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
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const [blockReason, setBlockReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleBlockSubmit = async () => {
    if (!blockReason.trim()) {
      setError(t('block-reason-required'));
      return;
    }
    setError("");
    setIsSubmitting(true);
    await handleBlockUser(blockReason.trim());
    setIsSubmitting(false);
    setBlockReason("");
    setShowBlockDialog(false);
  };

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
      <Dialog 
        open={showBlockDialog} 
        onOpenChange={(open) => {
          setShowBlockDialog(open);
          if (!open) {
            setBlockReason("");
            setError("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('block-user-title')}</DialogTitle>
            <DialogDescription>
              {t('block-user-description')}
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
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="blockReason">{t('block-reason')}</Label>
                  <Textarea
                    id="blockReason"
                    placeholder={t('enter-block-reason')}
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    className={error ? "border-destructive" : ""}
                  />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlockDialog(false)} disabled={isSubmitting}>
              {t('cancel')}
            </Button>
            <Button variant="default" onClick={handleBlockSubmit} disabled={isSubmitting}>
              {isSubmitting ? t('blocking') : t('confirm')}
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

