
import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext"
import { es } from 'date-fns/locale'

interface DatePickerProps {
  date: Date | undefined
  onSelect: (date: Date | undefined) => void
  className?: string
  id?: string
}

export function DatePicker({ date, onSelect, className, id }: DatePickerProps) {
  const { formatDate, settings } = useBackofficeSettings();
  
  const getLocale = () => {
    return settings.language.startsWith('es') ? es : undefined;
  };

  // Abrir calendario en la fecha seleccionada si existe, o en la fecha actual si no
  // Usamos `month={date || undefined}` para asegurar que el mes inicial sea el indicado
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
          {date ? formatDate(date) : <span>{settings.language.startsWith('es') ? 'Seleccionar fecha' : 'Select date'}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          initialFocus
          month={date}
          showOutsideDays={true}
          className="p-3 pointer-events-auto min-w-[300px] max-w-[320px]"
          locale={getLocale()}
          formatters={{
            formatDay: (date) => date.getDate().toString(),
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

