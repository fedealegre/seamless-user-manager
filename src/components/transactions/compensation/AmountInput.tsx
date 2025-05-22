
import React from "react";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  currency: string;
  error?: string;
  disabled?: boolean;
}

const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  currency,
  error,
  disabled = false
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="amount">{t("compensation-amount")}</Label>
      <div className="relative">
        <span className="absolute left-3 top-2.5">
          {currency || 'USD'}
        </span>
        <Input
          id="amount"
          type="number"
          placeholder="0.00"
          className={`pl-12 ${error ? "border-destructive" : ""}`}
          value={value}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
      
      {error && (
        <div className="flex items-center text-sm text-destructive gap-1">
          <AlertCircle size={12} /> {t(error)}
        </div>
      )}
    </div>
  );
};

export default AmountInput;
