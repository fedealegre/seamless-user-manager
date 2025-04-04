
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ExportCSVButton from "@/components/common/ExportCSVButton";
import DateRangeFilter from "@/components/dashboard/DateRangeFilter";
import { useTransactionReports } from "@/hooks/use-transaction-reports";

interface TransactionTypeReportProps {}

const TransactionTypeReport: React.FC<TransactionTypeReportProps> = () => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const locale = settings.language === "en" ? "en-US" : "es-ES";
  
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  
  const { 
    transactionsByType,
    monthlyTransactions,
    availableTransactionTypes,
    isLoading,
    error
  } = useTransactionReports(
    startDate,
    endDate,
    selectedTypes.length > 0 ? selectedTypes : undefined
  );

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedTypes([]);
  };

  // Prepare data for CSV export
  const exportData = Object.entries(transactionsByType).map(([type, data]) => ({
    type,
    count: data.count,
    amount: data.amount
  }));

  // Create monthly data for chart visualization
  const chartData = Object.entries(
    monthlyTransactions.reduce((acc, entry) => {
      if (!acc[entry.month]) {
        acc[entry.month] = { month: entry.month };
      }
      acc[entry.month][entry.type] = entry.amount;
      return acc;
    }, {} as Record<string, any>)
  ).map(([_, data]) => data);

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
        <h1 className="text-3xl font-bold tracking-tight">{t("transaction-type-report")}</h1>
        <ExportCSVButton
          filename={`transaction-types-report-${new Date().toISOString().slice(0, 10)}`}
          headers={[t('type'), t('count'), t('amount')]}
          data={exportData}
          mapRow={(row) => [
            t(row.type),
            row.count.toString(),
            row.amount.toString()
          ]}
        >
          {t("export-csv")}
        </ExportCSVButton>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                {t("filters")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Range Filter */}
              <DateRangeFilter
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onClearDates={clearFilters}
              />
              
              {/* Transaction Types Filter */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">{t("transaction-types")}</h3>
                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map(i => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {availableTransactionTypes.map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`type-${type}`} 
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => handleTypeToggle(type)}
                        />
                        <Label htmlFor={`type-${type}`}>{t(type)}</Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3 space-y-6">
          {/* Cash In Evolution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t("transaction-evolution")}</CardTitle>
              <CardDescription>{t("monthly-transaction-amounts-by-type")}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[350px] w-full flex items-center justify-center">
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={chartData}
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
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "rgba(255, 255, 255, 0.8)", 
                        borderRadius: "0.5rem",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                      }}
                      formatter={(value, name) => [
                        new Intl.NumberFormat(locale, {
                          style: 'currency',
                          currency: 'USD'
                        }).format(Number(value)),
                        t(name)
                      ]}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return `${date.toLocaleString(locale, { month: 'long' })} ${date.getFullYear()}`;
                      }}
                    />
                    <Legend />
                    {availableTransactionTypes.map((type, index) => (
                      <Bar 
                        key={type}
                        dataKey={type} 
                        name={t(type)} 
                        fill={getColorForType(type, index)}
                        radius={[4, 4, 0, 0]}
                        stackId="a"
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[350px]">
                  <p className="text-muted-foreground">{t("no-data-available")}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transaction Type Summary Table */}
          <Card>
            <CardHeader>
              <CardTitle>{t("transaction-summary-by-type")}</CardTitle>
              <CardDescription>{t("counts-and-amounts-by-transaction-type")}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("transaction-type")}</TableHead>
                      <TableHead className="text-right">{t("transaction-count")}</TableHead>
                      <TableHead className="text-right">{t("transaction-amount")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(transactionsByType).length > 0 ? (
                      Object.entries(transactionsByType).map(([type, data]) => (
                        <TableRow key={type}>
                          <TableCell className="font-medium">
                            {t(type)}
                          </TableCell>
                          <TableCell className="text-right">
                            {data.count.toLocaleString(locale)}
                          </TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat(locale, {
                              style: 'currency',
                              currency: 'USD'
                            }).format(data.amount)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          {t("no-transactions-found")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate colors for transaction types
function getColorForType(type: string, index: number): string {
  const colors = {
    deposit: "#10b981",
    withdrawal: "#ef4444",
    transfer: "#3b82f6",
    payment: "#f59e0b",
    refund: "#8b5cf6"
  };
  
  const fallbackColors = [
    "#3b82f6", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6", 
    "#6366f1", "#ec4899", "#14b8a6", "#f43f5e", "#0ea5e9"
  ];
  
  return colors[type as keyof typeof colors] || fallbackColors[index % fallbackColors.length];
}

export default TransactionTypeReport;
