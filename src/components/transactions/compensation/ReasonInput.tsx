
import React from "react";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface ReasonInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const ReasonInput: React.FC<ReasonInputProps> = ({
  value,
  onChange,
  error,
  disabled = false
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    
    // Clear error if value is not empty
    if (e.target.value.trim()) {
      // This assumes the parent component will handle error state
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="reason">{t("reason-for-compensation")}</Label>
      <Textarea
        id="reason"
        placeholder={t("explain-compensation-reason")}
        className={error ? "border-destructive" : ""}
        value={value}
        onChange={handleChange}
        disabled={disabled}
      />
      
      {error && (
        <div className="flex items-center text-sm text-destructive gap-1">
          <AlertCircle size={12} /> {t(error)}
        </div>
      )}
    </div>
  );
};

export default ReasonInput;
