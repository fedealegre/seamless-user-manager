
import React from "react";
import { AuditLog } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash, Lock, LockOpen, RefreshCw, FileCog } from "lucide-react";

interface AuditLogDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: AuditLog | null;
  formatDateTime: (dateTime: string) => string;
  getBadgeColor: (type: string) => string;
  getOperationTypeDetails: (type: string) => { label: string; icon: string };
}

const iconMap: Record<string, React.ElementType> = {
  "Plus": Plus,
  "Pencil": Pencil,
  "Trash": Trash,
  "Lock": Lock,
  "LockOpen": LockOpen,
  "RefreshCw": RefreshCw,
  "FileCog": FileCog
};

const AuditLogDetailsDialog: React.FC<AuditLogDetailsDialogProps> = ({
  open,
  onOpenChange,
  log,
  formatDateTime,
  getBadgeColor,
  getOperationTypeDetails,
}) => {
  if (!log) return null;

  const { icon: iconName, label } = getOperationTypeDetails(log.operationType);
  const OpIcon = iconMap[iconName];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Audit Log Details</DialogTitle>
          <DialogDescription>
            Detailed information about the selected audit log entry.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
              <p className="font-medium">{formatDateTime(log.dateTime)}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">User</p>
              <p className="font-medium">{log.user}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Operation Type</p>
              <div>
                <Badge 
                  variant="outline" 
                  className={cn("flex w-fit items-center gap-1", 
                    getBadgeColor(log.operationType)
                  )}
                >
                  {OpIcon && <OpIcon size={12} />}
                  <span>{label}</span>
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Entity</p>
              <p className="font-medium">{log.entity || "N/A"}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="space-y-1 mb-3">
              <p className="text-sm font-medium text-muted-foreground">Previous Value</p>
              <div className="border rounded-md p-3 bg-muted/30">
                <pre className="text-xs overflow-auto whitespace-pre-wrap">
                  {log.previousValue || "N/A"}
                </pre>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">New Value</p>
              <div className="border rounded-md p-3 bg-muted/30">
                <pre className="text-xs overflow-auto whitespace-pre-wrap">
                  {log.newValue || "N/A"}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuditLogDetailsDialog;
