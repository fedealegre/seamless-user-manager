
import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { type Locale } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext"

interface DatePickerProps {
  date: Date | undefined
  onSelect: (date: Date | undefined) => void
  className?: string
  id?: string
}

export function DatePicker({ date, onSelect, className, id }: DatePickerProps) {
  const { formatDate } = useBackofficeSettings();
  // Create a locale object or use null
  const getLocale = (): Locale | undefined => {
    try {
      return require('date-fns/locale/es');
    } catch (e) {
      console.error("Could not load ES locale:", e);
      return undefined;
    }
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDate(date) : <span>Seleccionar fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          initialFocus
          className="p-3 pointer-events-auto"
          locale={getLocale()}
          formatters={{
            formatDay: (date) => date.getDate().toString(),
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
