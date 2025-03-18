
import React from "react";
import { AuditLog } from "@/lib/api/types";
import { Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface AuditLogTableProps {
  logs: AuditLog[] | undefined;
  isLoading: boolean;
  formatDateTime: (dateTime: string) => string;
  getBadgeColor: (type: string) => string;
  getOperationTypeDetails: (type: string) => { label: string; icon: React.ElementType };
  onViewDetails: (log: AuditLog) => void;
}

const AuditLogTable: React.FC<AuditLogTableProps> = ({
  logs,
  isLoading,
  formatDateTime,
  getBadgeColor,
  getOperationTypeDetails,
  onViewDetails,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Operation</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs && logs.length > 0 ? (
            logs.map((log, index) => {
              const { icon: IconComponent, label } = getOperationTypeDetails(log.operationType);
              
              return (
                <TableRow key={log.id || index}>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-muted-foreground" />
                      <span>{formatDateTime(log.dateTime)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{log.user}</div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn("flex w-fit items-center gap-1", 
                        getBadgeColor(log.operationType)
                      )}
                    >
                      <IconComponent size={12} />
                      <span>{label}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {log.entity || "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onViewDetails(log)}
                    >
                      <FileText size={14} className="mr-1" /> View Details
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center">
                  <FileText size={24} className="text-muted-foreground mb-2" />
                  <p>No log entries found</p>
                  <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or checking back later</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AuditLogTable;
