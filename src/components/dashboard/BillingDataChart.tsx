
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface BillingDataChartProps {
  monthlyBilling: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
  isLoading: boolean;
}

const BillingDataChart: React.FC<BillingDataChartProps> = ({
  monthlyBilling,
  isLoading
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const locale = settings.language === "en" ? "en-US" : "es-ES";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("billing-data")}</CardTitle>
        <CardDescription>{t("monthly-accumulated-transactions")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <Skeleton className="h-[250px] w-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={monthlyBilling}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280" 
                fontSize={12}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getFullYear().toString().substr(2, 2)}`;
                }}
              />
              <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.8)", 
                  borderRadius: "0.5rem",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
                formatter={(value, name) => {
                  if (name === "amount") {
                    return [
                      new Intl.NumberFormat(locale, {
                        style: 'currency',
                        currency: 'USD'
                      }).format(Number(value)), 
                      t("amount")
                    ];
                  }
                  return [`${Number(value).toLocaleString()}`, t("count")];
                }}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return `${date.toLocaleString(locale, { month: 'long' })} ${date.getFullYear()}`;
                }}
              />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="amount" 
                name={t("billing-amount")} 
                fill="#8b5cf6" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                yAxisId="right"
                dataKey="count" 
                name={t("transaction-count")} 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default BillingDataChart;
