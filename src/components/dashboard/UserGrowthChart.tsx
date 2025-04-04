
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface UserGrowthChartProps {
  userGrowth: Array<{
    date: string;
    active: number;
    blocked: number;
    pending: number;
    total: number;
  }>;
  isLoading: boolean;
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({
  userGrowth,
  isLoading
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("accumulated-user-management")}</CardTitle>
        <CardDescription>{t("user-growth-by-status")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <Skeleton className="h-[250px] w-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={userGrowth}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280" 
                fontSize={12}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getFullYear().toString().substr(2, 2)}`;
                }}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.8)", 
                  borderRadius: "0.5rem",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
                formatter={(value) => [`${Number(value).toLocaleString()}`, ""]}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString();
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                name={t("total-users")}
                stroke="#3b82f6"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="active"
                name={t("active-users")}
                stroke="#10b981"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="blocked"
                name={t("blocked-users")}
                stroke="#ef4444"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="pending"
                name={t("pending-users")}
                stroke="#f59e0b"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default UserGrowthChart;
