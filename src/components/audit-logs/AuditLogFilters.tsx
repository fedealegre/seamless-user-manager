
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { operationTypes } from "./utils";

export interface FilterParams {
  startDate: Date | undefined;
  endDate: Date | undefined;
  user: string;
  operationType: string;
}

const AuditLogFilters = ({
  filters,
  operationTypes,
  onFilterChange,
  onReset,
}: {
  filters: FilterParams;
  operationTypes: { id: string; label: string; icon: React.ElementType }[];
  onFilterChange: (key: keyof FilterParams, value: any) => void;
  onReset: () => void;
}) => {
  return (
    <Card>
      <CardContent className="p-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="start-date">
              Start Date
            </label>
            <DatePicker
              id="start-date"
              date={filters.startDate}
              onSelect={(date) => onFilterChange("startDate", date)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="end-date">
              End Date
            </label>
            <DatePicker
              id="end-date"
              date={filters.endDate}
              onSelect={(date) => onFilterChange("endDate", date)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="user">
              User
            </label>
            <Input
              id="user"
              placeholder="Search by user"
              value={filters.user}
              onChange={(e) => onFilterChange("user", e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="operation-type">
              Operation Type
            </label>
            <Select
              value={filters.operationType}
              onValueChange={(value) => onFilterChange("operationType", value)}
            >
              <SelectTrigger id="operation-type" className="w-full">
                <SelectValue placeholder="All operations" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Operation Types</SelectLabel>
                  {/* Add a non-empty value for the "all" option */}
                  <SelectItem value="all">All operations</SelectItem>
                  {operationTypes.map((op) => (
                    <SelectItem key={op.id} value={op.id}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onReset} className="ml-2">
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLogFilters;
