
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface DashboardHeaderProps {
  totalBalance: number;
  totalUsers: number;
  usersByType: Record<string, number>;
  isLoading: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  totalBalance,
  totalUsers,
  usersByType,
  isLoading
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const locale = settings.language === "en" ? "en-US" : "es-ES";

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-base font-medium">{t("available-balance")}</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <>
              <Skeleton className="h-10 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </>
          ) : (
            <>
              <div className="text-3xl font-bold">
                {new Intl.NumberFormat(locale, {
                  style: 'currency',
                  currency: 'USD'
                }).format(totalBalance)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t("total-balances-all-wallets")}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-base font-medium">{t("registered-users")}</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <>
              <Skeleton className="h-10 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </>
          ) : (
            <>
              <div className="text-3xl font-bold">
                {totalUsers.toLocaleString(locale)}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {Object.entries(usersByType).map(([type, count]) => (
                  <div key={type} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ 
                      backgroundColor: getColorForUserType(type)
                    }} />
                    <span className="text-xs">
                      {type}: <span className="font-medium">{count.toLocaleString(locale)}</span>
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to get a color for each user type
function getColorForUserType(type: string): string {
  const colors = {
    Standard: "#3b82f6",
    Premium: "#8b5cf6",
    Business: "#10b981",
    Merchant: "#f59e0b",
    personal: "#3b82f6",
    business: "#10b981",
    merchant: "#f59e0b"
  };
  
  return colors[type as keyof typeof colors] || "#6b7280";
}

export default DashboardHeader;
