
import React from "react";
import { Wallet } from "@/lib/api/types";
import { AlertCircle, ArrowRightLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface OriginWalletSelectorProps {
  wallets: Wallet[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const OriginWalletSelector: React.FC<OriginWalletSelectorProps> = ({
  wallets,
  value,
  onChange,
  error,
  disabled = false
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  const hasWallets = wallets.length > 0;
  const hasSingleWallet = wallets.length === 1;

  return (
    <div className="space-y-2">
      <Label htmlFor="originWallet">{t("company-wallet")}</Label>
      {hasWallets && hasSingleWallet ? (
        <div className="flex items-center gap-3 p-3 rounded-md border">
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <ArrowRightLeft size={14} className="text-green-600" />
          </div>
          <div>
            <div className="font-medium">{wallets[0].name || `${wallets[0].currency} Wallet`}</div>
            <div className="text-sm text-muted-foreground">
              ID: {wallets[0].id} | {wallets[0].currency}
            </div>
          </div>
        </div>
      ) : hasWallets ? (
        <>
          <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger className={error ? "border-destructive" : ""}>
              <SelectValue placeholder={t("select-company-wallet")} />
            </SelectTrigger>
            <SelectContent>
              {wallets.map((wallet) => (
                <SelectItem key={wallet.id} value={wallet.id.toString()}>
                  {wallet.name || `${wallet.currency} Wallet`} - ID: {wallet.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && (
            <div className="flex items-center text-sm text-destructive gap-1">
              <AlertCircle size={12} /> {t(error)}
            </div>
          )}
        </>
      ) : (
        <div className="text-sm text-muted-foreground italic">
          {t("no-matching-currency-wallets-available", "No company wallets with matching currency available.")}
        </div>
      )}
    </div>
  );
};

export default OriginWalletSelector;
