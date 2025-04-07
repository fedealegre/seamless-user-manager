
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

  const handleChange = (name: keyof FiltersType, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleReset = () => {
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
            <Input
              id="startDate"
              type="date"
              value={localFilters.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">{t("end-date")}</Label>
            <Input
              id="endDate"
              type="date"
              value={localFilters.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
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
