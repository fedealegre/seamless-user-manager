
import React from "react";
import { Transaction } from "@/lib/api/types";
import { CircleDollarSign } from "lucide-react";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface CustomerInfoProps {
  transaction: Transaction;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ transaction }) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  return (
    <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50 mb-4">
      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
        <CircleDollarSign size={16} className="text-blue-600" />
      </div>
      <div>
        <div className="font-medium">{t("customer-id")}: {transaction.customerId}</div>
        <div className="text-sm text-muted-foreground">
          {t("wallet-id")}: {transaction.walletId} - {t("currency")}: {transaction.currency || "USD"}
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
