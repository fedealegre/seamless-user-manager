
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/api";
import { AuditLog } from "@/lib/api/types";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, FileCog } from "lucide-react";
import { FilterParams } from "@/components/audit-logs/AuditLogFilters";
import AuditLogFilters from "@/components/audit-logs/AuditLogFilters";
import AuditLogTable from "@/components/audit-logs/AuditLogTable";
import AuditLogDetailsDialog from "@/components/audit-logs/AuditLogDetailsDialog";
import { getBadgeColor, operationTypes } from "@/components/audit-logs/utils";
import { CSVExportService } from "@/lib/csv/csv-export-service";
import { toast } from "@/components/ui/use-toast";
import ExportCSVButton from "@/components/common/ExportCSVButton";

const AuditLogs = () => {
  const [filters, setFilters] = useState<FilterParams>({
    startDate: undefined,
    endDate: undefined,
    user: "",
    operationType: "all",
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
        filters.operationType === "all" ? undefined : filters.operationType
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
      startDate: undefined,
      endDate: undefined,
      user: "",
      operationType: "all",
    });
  };

  const getOperationTypeDetails = (type: string) => {
    const operation = operationTypes.find((op) => op.id === type);
    if (operation) {
      return {
        label: operation.label,
        icon: operation.icon,
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

  const handleExportLogs = () => {
    if (!logs || logs.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no audit logs matching your filters to export.",
        variant: "destructive",
      });
      return;
    }

    const filename = `audit-logs-${format(new Date(), "yyyy-MM-dd")}`;

    const headers = ["Date & Time", "User", "Operation", "Entity", "Previous Value", "New Value"];

    CSVExportService.export({
      filename,
      headers,
      rows: logs,
      mapRow: (log: AuditLog) => {
        const { label } = getOperationTypeDetails(log.operationType);
        return [
          formatDateTime(log.dateTime),
          log.user,
          label,
          log.entity || "N/A",
          log.previousValue || "-",
          log.newValue || "-"
        ];
      }
    });

    toast({
      title: "Export Successful",
      description: "The audit logs have been exported to CSV successfully.",
    });
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
            onExport={handleExportLogs}
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
