
import React, { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const mockMCCs = [
  { codigo: "5411", descripcion: "Supermercados" },
  { codigo: "5499", descripcion: "Tiendas de conveniencia" },
  { codigo: "5541", descripcion: "Estaciones de servicio" },
  { codigo: "5542", descripcion: "Combustibles automatizados" },
  { codigo: "5812", descripcion: "Restaurantes" },
  { codigo: "5814", descripcion: "Comida rápida" },
  { codigo: "7011", descripcion: "Hoteles" },
  { codigo: "7922", descripcion: "Entretenimiento" },
];

interface MCCSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const MCCSelector: React.FC<MCCSelectorProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (mccCode: string) => {
    const newValue = value.includes(mccCode)
      ? value.filter((v) => v !== mccCode)
      : [...value, mccCode];
    onChange(newValue);
  };

  const handleRemove = (mccCode: string) => {
    onChange(value.filter((v) => v !== mccCode));
  };

  const getSelectedMCCs = () => {
    return mockMCCs.filter((mcc) => value.includes(mcc.codigo));
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value.length > 0
              ? `${value.length} MCC(s) seleccionado(s)`
              : "Seleccionar MCCs..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar MCC..." />
            <CommandList>
              <CommandEmpty>No se encontraron MCCs.</CommandEmpty>
              <CommandGroup>
                {mockMCCs.map((mcc) => (
                  <CommandItem
                    key={mcc.codigo}
                    value={`${mcc.codigo} ${mcc.descripcion}`}
                    onSelect={() => handleSelect(mcc.codigo)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(mcc.codigo) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div>
                      <div className="font-medium">{mcc.codigo}</div>
                      <div className="text-sm text-muted-foreground">
                        {mcc.descripcion}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {getSelectedMCCs().map((mcc) => (
            <Badge key={mcc.codigo} variant="secondary" className="gap-1">
              {mcc.codigo} - {mcc.descripcion}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemove(mcc.codigo)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
