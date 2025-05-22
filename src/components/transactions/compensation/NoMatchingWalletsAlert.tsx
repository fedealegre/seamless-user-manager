
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface NoMatchingWalletsAlertProps {
  currency?: string;
}

const NoMatchingWalletsAlert: React.FC<NoMatchingWalletsAlertProps> = ({ currency }) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {currency 
          ? `${t("no-matching-currency-wallets")} (${currency})`
          : t("no-matching-currency-wallets")}
      </AlertDescription>
    </Alert>
  );
};

export default NoMatchingWalletsAlert;
