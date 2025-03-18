
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/api-service";
import { AuditLog } from "@/lib/api-types";
import { format, parseISO, subDays } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, Clock, FileText, Filter, FileCog, Trash, UserRoundCog, LucideIcon, RefreshCw, Search, UserRoundCheck, UserRoundX, LockOpen, Lock, Plus, Pencil } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const operationTypes = [
  { id: "USER_CREATE", label: "User Create", icon: Plus },
  { id: "USER_UPDATE", label: "User Update", icon: Pencil },
  { id: "USER_DELETE", label: "User Delete", icon: Trash },
  { id: "USER_BLOCK", label: "User Block", icon: Lock },
  { id: "USER_UNBLOCK", label: "User Unblock", icon: LockOpen },
  { id: "TRANSACTION_CANCEL", label: "Transaction Cancel", icon: RefreshCw },
  { id: "CUSTOMER_COMPENSATE", label: "Customer Compensate", icon: FileCog },
  { id: "RULE_CREATE", label: "Rule Create", icon: Plus },
  { id: "RULE_UPDATE", label: "Rule Update", icon: Pencil },
  { id: "RULE_DELETE", label: "Rule Delete", icon: Trash },
];

interface FilterParams {
  startDate: Date | undefined;
  endDate: Date | undefined;
  user: string;
  operationType: string;
}

const AuditLogs = () => {
  const [filters, setFilters] = useState<FilterParams>({
    startDate: subDays(new Date(), 7),
    endDate: new Date(),
    user: "",
    operationType: "",
  });
  
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const { data: logs, isLoading } = useQuery({
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
      icon: FileCog as LucideIcon,
    };
  };

  const viewLogDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setShowDetailDialog(true);
  };

  const getBadgeColor = (type: string) => {
    if (type.includes("CREATE") || type.includes("COMPENSATE")) {
      return "bg-green-100 text-green-800 hover:bg-green-100";
    }
    if (type.includes("UPDATE")) {
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    }
    if (type.includes("DELETE") || type.includes("CANCEL")) {
      return "bg-red-100 text-red-800 hover:bg-red-100";
    }
    if (type.includes("BLOCK")) {
      return "bg-amber-100 text-amber-800 hover:bg-amber-100";
    }
    if (type.includes("UNBLOCK")) {
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
    }
    return "";
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
        
        <Button variant="outline" onClick={() => location.reload()} className="w-full md:w-auto">
          <RefreshCw size={16} className="mr-2" /> Refresh
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Narrow down logs by time period, user, or operation type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date From */}
            <div className="space-y-2">
              <label className="text-sm font-medium">From Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.startDate ? format(filters.startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.startDate}
                    onSelect={(date) => handleFilterChange("startDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Date To */}
            <div className="space-y-2">
              <label className="text-sm font-medium">To Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.endDate ? format(filters.endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.endDate}
                    onSelect={(date) => handleFilterChange("endDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* User Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">User</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user..."
                  className="pl-8"
                  value={filters.user}
                  onChange={(e) => handleFilterChange("user", e.target.value)}
                />
              </div>
            </div>
            
            {/* Operation Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Operation Type</label>
              <Select
                value={filters.operationType}
                onValueChange={(value) => handleFilterChange("operationType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All operation types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All operation types</SelectItem>
                  {operationTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setFilters({
                startDate: subDays(new Date(), 7),
                endDate: new Date(),
                user: "",
                operationType: "",
              })}
            >
              Reset Filters
            </Button>
            <Button>
              <Filter size={16} className="mr-2" /> Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      
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
          {isLoading ? (
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
          ) : (
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
                      const operationDetails = getOperationTypeDetails(log.operationType);
                      const OpIcon = operationDetails.icon;
                      
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
                              <OpIcon size={12} />
                              <span>{operationDetails.label}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {log.entity || "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => viewLogDetails(log)}
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
          )}
        </CardContent>
      </Card>
      
      {/* Log Details Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected audit log entry.
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                  <p className="font-medium">{formatDateTime(selectedLog.dateTime)}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">User</p>
                  <p className="font-medium">{selectedLog.user}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Operation Type</p>
                  <div>
                    <Badge 
                      variant="outline" 
                      className={cn("flex w-fit items-center gap-1", 
                        getBadgeColor(selectedLog.operationType)
                      )}
                    >
                      {(() => {
                        const { icon: OpIcon, label } = getOperationTypeDetails(selectedLog.operationType);
                        return (
                          <>
                            <OpIcon size={12} />
                            <span>{label}</span>
                          </>
                        );
                      })()}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Entity</p>
                  <p className="font-medium">{selectedLog.entity || "N/A"}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="space-y-1 mb-3">
                  <p className="text-sm font-medium text-muted-foreground">Previous Value</p>
                  <div className="border rounded-md p-3 bg-muted/30">
                    <pre className="text-xs overflow-auto whitespace-pre-wrap">
                      {selectedLog.previousValue || "N/A"}
                    </pre>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">New Value</p>
                  <div className="border rounded-md p-3 bg-muted/30">
                    <pre className="text-xs overflow-auto whitespace-pre-wrap">
                      {selectedLog.newValue || "N/A"}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditLogs;
