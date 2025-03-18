
import React from "react";
import { format } from "date-fns";
import { Filter, Search, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export interface FilterParams {
  startDate: Date | undefined;
  endDate: Date | undefined;
  user: string;
  operationType: string;
}

interface AuditLogFiltersProps {
  filters: FilterParams;
  operationTypes: { id: string; label: string; icon: React.ElementType }[];
  onFilterChange: (key: keyof FilterParams, value: any) => void;
  onReset: () => void;
}

const AuditLogFilters: React.FC<AuditLogFiltersProps> = ({
  filters,
  operationTypes,
  onFilterChange,
  onReset,
}) => {
  return (
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
                  onSelect={(date) => onFilterChange("startDate", date)}
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
                  onSelect={(date) => onFilterChange("endDate", date)}
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
                onChange={(e) => onFilterChange("user", e.target.value)}
              />
            </div>
          </div>
          
          {/* Operation Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Operation Type</label>
            <Select
              value={filters.operationType}
              onValueChange={(value) => onFilterChange("operationType", value)}
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
            onClick={onReset}
          >
            Reset Filters
          </Button>
          <Button>
            <Filter size={16} className="mr-2" /> Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLogFilters;
