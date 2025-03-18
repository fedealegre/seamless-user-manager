
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/api";
import { AuditLog } from "@/lib/api/types";
import { format, parseISO, subDays } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, FileCog, Plus, Pencil, Trash, Lock, LockOpen } from "lucide-react";
import { FilterParams } from "@/components/audit-logs/AuditLogFilters";
import AuditLogFilters from "@/components/audit-logs/AuditLogFilters";
import AuditLogTable from "@/components/audit-logs/AuditLogTable";
import AuditLogDetailsDialog from "@/components/audit-logs/AuditLogDetailsDialog";
import { getBadgeColor, operationTypes } from "@/components/audit-logs/utils";

const AuditLogs = () => {
  const [filters, setFilters] = useState<FilterParams>({
    startDate: subDays(new Date(), 7),
    endDate: new Date(),
    user: "",
    operationType: "",
  });
  
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const { data: logs, isLoading, refetch } = useQuery({
    queryKey: ["auditLogs", filters],
    queryFn: () => {
      return apiService.getAuditLogs(
        filters.startDate ? format(filters.startDate, "yyyy-MM-dd") : undefined,
        filters.endDate ? format(filters.endDate, "yyyy-MM-dd") : undefined,
        filters.user.trim() || undefined,
        filters.operationType || undefined
      );
    },
  });

  const handleFilterChange = (key: keyof FilterParams, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      startDate: subDays(new Date(), 7),
      endDate: new Date(),
      user: "",
      operationType: "",
    });
  };

  const getOperationTypeDetails = (type: string) => {
    const operation = operationTypes.find((op) => op.id === type);
    if (operation) {
      // Get the actual icon component from the icon name
      const iconName = operation.icon;
      let IconComponent;
      switch (iconName) {
        case "Plus":
          IconComponent = Plus;
          break;
        case "Pencil":
          IconComponent = Pencil;
          break;
        case "Trash":
          IconComponent = Trash;
          break;
        case "Lock":
          IconComponent = Lock;
          break;
        case "LockOpen":
          IconComponent = LockOpen;
          break;
        case "RefreshCw":
          IconComponent = RefreshCw;
          break;
        case "FileCog":
          IconComponent = FileCog;
          break;
        default:
          IconComponent = FileCog;
      }
      
      return {
        label: operation.label,
        icon: IconComponent,
      };
    }
    return {
      label: type,
      icon: FileCog,
    };
  };

  const viewLogDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setShowDetailDialog(true);
  };

  const formatDateTime = (dateTime: string) => {
    try {
      return format(parseISO(dateTime), "MMM d, yyyy h:mm a");
    } catch (e) {
      return dateTime;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">Review system activity and security events</p>
        </div>
        
        <Button variant="outline" onClick={() => refetch()} className="w-full md:w-auto">
          <RefreshCw size={16} className="mr-2" /> Refresh
        </Button>
      </div>
      
      <AuditLogFilters 
        filters={filters}
        operationTypes={operationTypes}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Audit Log Entries</CardTitle>
          <CardDescription>
            {isLoading ? "Loading audit logs..." : 
              logs && logs.length > 0 
                ? `${logs.length} log entries found` 
                : "No log entries match your filters"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuditLogTable
            logs={logs}
            isLoading={isLoading}
            formatDateTime={formatDateTime}
            getBadgeColor={getBadgeColor}
            getOperationTypeDetails={getOperationTypeDetails}
            onViewDetails={viewLogDetails}
          />
        </CardContent>
      </Card>
      
      <AuditLogDetailsDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        log={selectedLog}
        formatDateTime={formatDateTime}
        getBadgeColor={getBadgeColor}
        getOperationTypeDetails={getOperationTypeDetails}
      />
    </div>
  );
};

export default AuditLogs;
