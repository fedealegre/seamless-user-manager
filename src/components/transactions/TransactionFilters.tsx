
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { DatePicker } from "@/components/ui/date-picker";
import { formatDateForInput } from "@/lib/utils";

interface FiltersType {
  status: string;
  transactionType: string;
  startDate: string;
  endDate: string;
  currency: string;
}

interface TransactionFiltersProps {
  filters: FiltersType;
  onApply: (filters: FiltersType) => void;
  onReset: () => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onApply,
  onReset,
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const [localFilters, setLocalFilters] = useState<FiltersType>(filters);
  
  // State for date objects to be used with the DatePicker component
  const [startDateObj, setStartDateObj] = useState<Date | undefined>(
    filters.startDate ? new Date(filters.startDate) : undefined
  );
  const [endDateObj, setEndDateObj] = useState<Date | undefined>(
    filters.endDate ? new Date(filters.endDate) : undefined
  );

  const handleChange = (name: keyof FiltersType, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handler for start date changes
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDateObj(date);
    if (date) {
      // Set time to start of day (00:00:00) for filtering from the beginning of the day
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      setLocalFilters(prev => ({
        ...prev,
        startDate: startOfDay.toISOString()
      }));
    } else {
      setLocalFilters(prev => ({
        ...prev,
        startDate: ''
      }));
    }
  };
  
  // Handler for end date changes
  const handleEndDateChange = (date: Date | undefined) => {
    setEndDateObj(date);
    if (date) {
      // Set time to end of day (23:59:59.999) for filtering until the end of the day
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      setLocalFilters(prev => ({
        ...prev,
        endDate: endOfDay.toISOString()
      }));
    } else {
      setLocalFilters(prev => ({
        ...prev,
        endDate: ''
      }));
    }
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleReset = () => {
    setStartDateObj(undefined);
    setEndDateObj(undefined);
    setLocalFilters({
      status: "",
      transactionType: "",
      startDate: "",
      endDate: "",
      currency: "",
    });
    onReset();
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">{t("transaction-filters")}</h3>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <X size={16} className="mr-2" />
            {t("clear-all")}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">{t("status")}</Label>
            <Select
              value={localFilters.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder={t("select-status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">{t("all-statuses")}</SelectItem>
                  <SelectItem value="CONFIRMED">{t("confirmed")}</SelectItem>
                  <SelectItem value="completed">{t("completed")}</SelectItem>
                  <SelectItem value="pending">{t("pending")}</SelectItem>
                  <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
                  <SelectItem value="failed">{t("failed")}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">{t("transaction-type")}</Label>
            <Select
              value={localFilters.transactionType}
              onValueChange={(value) => handleChange("transactionType", value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder={t("select-type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">{t("all-types")}</SelectItem>
                  <SelectItem value="CASH_IN">{t("cash_in")}</SelectItem>
                  <SelectItem value="CASH_OUT">{t("cash_out")}</SelectItem>
                  <SelectItem value="TRANSFER_CASH_IN">{t("transfer_cash_in")}</SelectItem>
                  <SelectItem value="TRANSFER_CASH_OUT">{t("transfer_cash_out")}</SelectItem>
                  <SelectItem value="TK_PAY_REQ">{t("tk_pay_req")}</SelectItem>
                  <SelectItem value="TK_PAY_REQ_CASH_OUT">{t("tk_pay_req_cash_out")}</SelectItem>
                  <SelectItem value="COMPENSATE">{t("compensate")}</SelectItem>
                  <SelectItem value="deposit">{t("deposit")}</SelectItem>
                  <SelectItem value="withdrawal">{t("withdrawal")}</SelectItem>
                  <SelectItem value="transfer">{t("transfer")}</SelectItem>
                  <SelectItem value="compensation">{t("compensation")}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">{t("currency")}</Label>
            <Select
              value={localFilters.currency}
              onValueChange={(value) => handleChange("currency", value)}
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder={t("select-currency")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">{t("all-currencies")}</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">{t("start-date")}</Label>
            <DatePicker 
              id="startDate"
              date={startDateObj}
              onSelect={handleStartDateChange}
              displayTime={false}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">{t("end-date")}</Label>
            <DatePicker 
              id="endDate"
              date={endDateObj}
              onSelect={handleEndDateChange}
              displayTime={false}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={handleApply} className="ml-2">
            {t("apply-filters")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionFilters;
