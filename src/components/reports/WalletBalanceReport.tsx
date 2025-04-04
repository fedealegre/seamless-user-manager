
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ExportCSVButton from "@/components/common/ExportCSVButton";
import { useWalletBalanceReport } from "@/hooks/use-wallet-balance-report";

interface WalletBalanceReportProps {}

const WalletBalanceReport: React.FC<WalletBalanceReportProps> = () => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const locale = settings.language === "en" ? "en-US" : "es-ES";
  
  const [selectedUserType, setSelectedUserType] = useState<string>("");
  
  const { 
    walletBalances, 
    totalBalance,
    balanceByUserType,
    availableUserTypes,
    isLoading,
    error
  } = useWalletBalanceReport(
    selectedUserType || undefined
  );

  // Map wallet data for CSV export
  const mapWalletToCSV = (wallet: typeof walletBalances[0]) => {
    return [
      wallet.userType,
      wallet.walletId,
      wallet.balance.toString(),
      wallet.currency
    ];
  };

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <h2 className="text-xl font-bold text-red-800 mb-2">{t("error-loading-report")}</h2>
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("wallet-balance-report")}</h1>
        <ExportCSVButton
          filename={`wallet-balances-report-${new Date().toISOString().slice(0, 10)}`}
          headers={[
            t('user-type'), 
            t('wallet-id'), 
            t('balance'),
            t('currency')
          ]}
          data={walletBalances}
          mapRow={mapWalletToCSV}
        >
          {t("export-csv")}
        </ExportCSVButton>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-1 space-y-6">
          {/* Filter Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                {t("filters")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* User Type Filter */}
              <div className="space-y-2">
                <Label htmlFor="user-type">{t("user-type")}</Label>
                <Select
                  value={selectedUserType}
                  onValueChange={setSelectedUserType}
                >
                  <SelectTrigger id="user-type">
                    <SelectValue placeholder={t("all-user-types")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t("all-user-types")}</SelectItem>
                    {availableUserTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {t(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                {t("balance-summary")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">{t("total-balance")}</div>
                    <div className="text-2xl font-bold">
                      {new Intl.NumberFormat(locale, {
                        style: 'currency',
                        currency: 'USD'
                      }).format(totalBalance)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">{t("balance-by-user-type")}</div>
                    <div className="space-y-2 mt-2">
                      {Object.entries(balanceByUserType).map(([type, balance]) => (
                        <div key={type} className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full" style={{ 
                              backgroundColor: getColorForUserType(type)
                            }} />
                            <span className="text-sm">{t(type)}</span>
                          </div>
                          <span className="font-medium">
                            {new Intl.NumberFormat(locale, {
                              style: 'currency',
                              currency: 'USD'
                            }).format(balance)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          {/* Wallet Balances Table */}
          <Card>
            <CardHeader>
              <CardTitle>{t("wallet-balances")}</CardTitle>
              <CardDescription>
                {isLoading 
                  ? t("loading") 
                  : t("showing-wallets-count", { count: walletBalances.length.toString() })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("user-type")}</TableHead>
                        <TableHead>{t("wallet-id")}</TableHead>
                        <TableHead className="text-right">{t("balance")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {walletBalances.length > 0 ? (
                        walletBalances.map((wallet, index) => (
                          <TableRow key={`${wallet.walletId}-${index}`}>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-2 h-2 rounded-full" 
                                  style={{ backgroundColor: getColorForUserType(wallet.userType) }} 
                                />
                                <span>{t(wallet.userType)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {wallet.walletId}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {new Intl.NumberFormat(locale, {
                                style: 'currency',
                                currency: wallet.currency
                              }).format(wallet.balance)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4">
                            {t("no-wallets-found")}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper function to get a color for each user type
function getColorForUserType(type: string): string {
  const colors = {
    personal: "#3b82f6",
    business: "#10b981",
    merchant: "#f59e0b"
  };
  
  return colors[type as keyof typeof colors] || "#6b7280";
}

export default WalletBalanceReport;
