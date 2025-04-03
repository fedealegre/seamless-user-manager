
import React from "react";
import { AuditLog } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileCog } from "lucide-react";

interface AuditLogDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: AuditLog | null;
  formatDateTime: (dateTime: string) => string;
  getBadgeColor: (type: string) => string;
  getOperationTypeDetails: (type: string) => { label: string; icon: React.ElementType };
}

const AuditLogDetailsDialog: React.FC<AuditLogDetailsDialogProps> = ({
  open,
  onOpenChange,
  log,
  formatDateTime,
  getBadgeColor,
  getOperationTypeDetails,
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  if (!log) return null;

  const { icon: IconComponent, label } = getOperationTypeDetails(log.operationType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("audit-log-details")}</DialogTitle>
          <DialogDescription>
            {t("detailed-info-audit-log")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{t("timestamp")}</p>
              <p className="font-medium">{formatDateTime(log.dateTime)}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{t("user")}</p>
              <p className="font-medium">{log.user}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{t("operation-type")}</p>
              <div>
                <Badge 
                  variant="outline" 
                  className={cn("flex w-fit items-center gap-1", 
                    getBadgeColor(log.operationType)
                  )}
                >
                  <IconComponent size={12} />
                  <span>{label}</span>
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{t("entity")}</p>
              <p className="font-medium">{log.entity || "N/A"}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="space-y-1 mb-3">
              <p className="text-sm font-medium text-muted-foreground">{t("previous-value")}</p>
              <div className="border rounded-md p-3 bg-muted/30">
                <pre className="text-xs overflow-auto whitespace-pre-wrap">
                  {log.previousValue || "N/A"}
                </pre>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{t("new-value")}</p>
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
