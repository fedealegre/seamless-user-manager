
import React from "react";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface CompensationTypeProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const CompensationType: React.FC<CompensationTypeProps> = ({ 
  value, 
  onChange, 
  error, 
  disabled = false 
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  return (
    <div className="space-y-2">
      <Label>{t("compensation-type")}</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className={`grid grid-cols-2 gap-2 ${error ? "border border-destructive rounded-md p-1" : ""}`}
        disabled={disabled}
      >
        <div className="flex items-center space-x-2 rounded-md border p-2">
          <RadioGroupItem value="credit" id="credit" disabled={disabled} />
          <Label htmlFor="credit" className="flex-1 cursor-pointer">{t("credit")}</Label>
        </div>
        <div className="flex items-center space-x-2 rounded-md border p-2">
          <RadioGroupItem value="adjustment" id="adjustment" disabled={disabled} />
          <Label htmlFor="adjustment" className="flex-1 cursor-pointer">{t("adjustment")}</Label>
        </div>
      </RadioGroup>
      
      {error && (
        <div className="flex items-center text-sm text-destructive gap-1">
          <AlertCircle size={12} /> {t(error)}
        </div>
      )}
      
      <div className="text-xs text-muted-foreground mt-1">
        {value === 'credit' && t("credit-description")}
        {value === 'adjustment' && t("adjustment-description")}
      </div>
    </div>
  );
};

export default CompensationType;
