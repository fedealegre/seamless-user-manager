
import React from "react";
import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAvailablePlaceholders } from "@/lib/benefit-placeholders";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface PlaceholderHelperProps {
  onPlaceholderClick?: (placeholder: string) => void;
}

export const PlaceholderHelper: React.FC<PlaceholderHelperProps> = ({ 
  onPlaceholderClick 
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  const placeholders = getAvailablePlaceholders();
  
  const placeholderDescriptions = {
    '${valorPorcentaje}': t('percentage-value') || 'Valor del porcentaje',
    '${topePorCompra}': t('purchase-limit') || 'Tope por compra',
    '${titulo}': t('benefit-title') || 'Título del beneficio',
    '${categoria}': t('category') || 'Categoría',
    '${orden}': t('order') || 'Orden'
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Info className="h-4 w-4" />
          {t('available-placeholders') || 'Variables disponibles'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            {t('placeholder-helper-text') || 'Haz clic en una variable para insertarla en la descripción:'}
          </p>
          <div className="flex flex-wrap gap-2">
            {placeholders.map((placeholder) => (
              <Badge
                key={placeholder}
                variant="outline"
                className="cursor-pointer hover:bg-muted"
                onClick={() => onPlaceholderClick?.(placeholder)}
              >
                {placeholder}
              </Badge>
            ))}
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            <p className="font-medium mb-1">{t('placeholder-descriptions') || 'Descripción de variables:'}:</p>
            <ul className="space-y-1">
              {placeholders.map((placeholder) => (
                <li key={placeholder}>
                  <code className="text-xs bg-muted px-1 rounded">{placeholder}</code>: {placeholderDescriptions[placeholder as keyof typeof placeholderDescriptions]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
