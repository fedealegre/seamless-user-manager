
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ExportCSVButton from "@/components/common/ExportCSVButton";
import DateRangeFilter from "@/components/dashboard/DateRangeFilter";
import { useTransactionReports } from "@/hooks/use-transaction-reports";
import { Transaction } from "@/lib/api/types";

interface TransactionDetailReportProps {}

const TransactionDetailReport: React.FC<TransactionDetailReportProps> = () => {
  const { settings, formatDateTime } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const locale = settings.language === "en" ? "en-US" : "es-ES";
  
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedUserType, setSelectedUserType] = useState<string>("");
  
  const { 
    transactionList,
    availableTransactionTypes,
    availableUserTypes,
    isLoading,
    error
  } = useTransactionReports(
    startDate,
    endDate,
    selectedType ? [selectedType] : undefined,
    selectedUserType || undefined
  );

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedType("");
    setSelectedUserType("");
  };

  // Map transaction data for CSV export
  const mapTransactionToCSV = (transaction: Transaction) => {
    return [
      transaction.date ? formatDateTime(new Date(transaction.date)) : '',
      transaction.additionalInfo?.userType || '',
      transaction.walletId || '',
      t(transaction.type?.toLowerCase() || transaction.movementType?.toLowerCase() || 'unknown'),
      transaction.amount?.toString() || '',
      transaction.currency || '',
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
        <h1 className="text-3xl font-bold tracking-tight">{t("transaction-detail-report")}</h1>
        <ExportCSVButton
          filename={`transaction-details-report-${new Date().toISOString().slice(0, 10)}`}
          headers={[
            t('date'), 
            t('user-type'), 
            t('wallet-id'), 
            t('transaction-type'), 
            t('amount'),
            t('currency')
          ]}
          data={transactionList}
          mapRow={mapTransactionToCSV}
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
              
              {/* Transaction Type Filter */}
              <div className="space-y-2">
                <Label htmlFor="transaction-type">{t("transaction-type")}</Label>
                <Select
                  value={selectedType}
                  onValueChange={setSelectedType}
                >
                  <SelectTrigger id="transaction-type">
                    <SelectValue placeholder={t("all-transaction-types")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t("all-transaction-types")}</SelectItem>
                    {availableTransactionTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {t(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
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
        </div>

        <div className="md:col-span-3">
          {/* Transaction Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>{t("transaction-details")}</CardTitle>
              <CardDescription>
                {isLoading 
                  ? t("loading") 
                  : t("showing-transactions-count", { count: transactionList.length.toString() })}
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
                        <TableHead>{t("date")}</TableHead>
                        <TableHead>{t("user-type")}</TableHead>
                        <TableHead>{t("wallet-id")}</TableHead>
                        <TableHead>{t("transaction-type")}</TableHead>
                        <TableHead className="text-right">{t("amount")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactionList.length > 0 ? (
                        transactionList.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              {transaction.date 
                                ? formatDateTime(new Date(transaction.date)) 
                                : '-'}
                            </TableCell>
                            <TableCell>
                              {transaction.additionalInfo?.userType || '-'}
                            </TableCell>
                            <TableCell>
                              {transaction.walletId}
                            </TableCell>
                            <TableCell>
                              {t(transaction.type?.toLowerCase() || transaction.movementType?.toLowerCase() || 'unknown')}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={
                                transaction.type === 'deposit' || transaction.movementType === 'deposit'
                                  ? 'text-green-600'
                                  : transaction.type === 'withdrawal' || transaction.movementType === 'withdrawal'
                                  ? 'text-red-600'
                                  : ''
                              }>
                                {new Intl.NumberFormat(locale, {
                                  style: 'currency',
                                  currency: transaction.currency || 'USD'
                                }).format(transaction.amount || 0)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            {t("no-transactions-found")}
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

export default TransactionDetailReport;
