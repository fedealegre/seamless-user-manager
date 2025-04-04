
import React from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface DateRangeFilterProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onClearDates: () => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClearDates
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">{t("date-range")}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">{t("start-date")}</label>
          <DatePicker 
            date={startDate} 
            onSelect={onStartDateChange} 
            id="start-date"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">{t("end-date")}</label>
          <DatePicker 
            date={endDate} 
            onSelect={onEndDateChange}
            id="end-date"
          />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearDates}
            className="mt-2"
          >
            <CalendarX className="h-4 w-4 mr-2" />
            {t("clear-dates")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateRangeFilter;
