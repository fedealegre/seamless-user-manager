
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface WalletBehaviorChartProps {
  walletBalanceHistory: Array<{ date: string; balance: number }>;
  transactionHistory: Array<{ 
    date: string; 
    type: string; 
    amount: number;
    count: number;
  }>;
  isLoading: boolean;
}

const WalletBehaviorChart: React.FC<WalletBehaviorChartProps> = ({
  walletBalanceHistory,
  transactionHistory,
  isLoading
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  // Process data for the chart
  const processedData = React.useMemo(() => {
    // Create a date-to-balance map
    const dateMap = new Map<string, any>();
    
    // Add wallet balance data
    walletBalanceHistory.forEach(item => {
      dateMap.set(item.date, { 
        ...dateMap.get(item.date) || {}, 
        date: item.date,
        balance: item.balance 
      });
    });
    
    // Group transaction data by date and type
    const transactionsByDate = transactionHistory.reduce((acc, transaction) => {
      const { date, type, amount } = transaction;
      
      if (!acc[date]) acc[date] = {};
      if (!acc[date][type]) acc[date][type] = 0;
      
      acc[date][type] += amount;
      return acc;
    }, {} as Record<string, Record<string, number>>);
    
    // Add transaction data to our map
    Object.entries(transactionsByDate).forEach(([date, types]) => {
      dateMap.set(date, { 
        ...dateMap.get(date) || {}, 
        date,
        ...types
      });
    });
    
    // Convert map to array and sort by date
    const result = Array.from(dateMap.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    return result;
  }, [walletBalanceHistory, transactionHistory]);

  // Get unique transaction types for rendering lines
  const transactionTypes = React.useMemo(() => {
    const types = new Set<string>();
    transactionHistory.forEach(item => {
      types.add(item.type);
    });
    return Array.from(types);
  }, [transactionHistory]);

  // Generate colors for different transaction types
  const getColorForTransactionType = (type: string): string => {
    const colors = {
      deposit: "#10b981",
      withdrawal: "#ef4444",
      transfer: "#3b82f6",
      payment: "#f59e0b",
      refund: "#8b5cf6"
    };
    
    return colors[type as keyof typeof colors] || "#6b7280";
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{t("wallet-daily-behavior")}</CardTitle>
        <CardDescription>{t("balance-transaction-evolution")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[350px] w-full flex items-center justify-center">
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={processedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280" 
                fontSize={12}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
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
                  if (name === "balance") {
                    return [`$${Number(value).toLocaleString()}`, t("wallet-balance")];
                  }
                  return [`$${Number(value).toLocaleString()}`, t(name)];
                }}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString();
                }}
              />
              <Legend />
              
              {/* Wallet Balance Line */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="balance"
                name={t("wallet-balance")}
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 8 }}
              />
              
              {/* Transaction Type Lines */}
              {transactionTypes.map(type => (
                <Line
                  key={type}
                  yAxisId="right"
                  type="monotone"
                  dataKey={type}
                  name={t(type)}
                  stroke={getColorForTransactionType(type)}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletBehaviorChart;
