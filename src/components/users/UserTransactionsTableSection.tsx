
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from "@/components/ui/select";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import TransactionsPagination from "@/components/transactions/TransactionsPagination";
import { Transaction } from "@/lib/api/types";

interface UserTransactionsTableSectionProps {
  transactions: Transaction[];
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  totalPages: number;
  totalTransactions: number;
  handlePageSizeChange: (value: string) => void;
  t: (key: string) => string;
  handleViewDetails: (transaction: Transaction) => void;
  handleCancelTransaction: (transaction: Transaction) => void;
  handleCompensateCustomer: (transaction: Transaction) => void;
  handleChangeStatus: (transaction: Transaction) => void;
}

const UserTransactionsTableSection: React.FC<UserTransactionsTableSectionProps> = ({
  transactions,
  page,
  setPage,
  pageSize,
  totalPages,
  totalTransactions,
  handlePageSizeChange,
  t,
  handleViewDetails,
  handleCancelTransaction,
  handleCompensateCustomer,
  handleChangeStatus,
}) => (
  transactions && transactions.length > 0 ? (
    <>
      <div className="flex items-center justify-end mb-2">
        <Label htmlFor="page-size-select" className="mr-2">{t("transactions-per-page")}</Label>
        <Select
          value={pageSize.toString()}
          onValueChange={handlePageSizeChange}
        >
          <SelectTrigger id="page-size-select" className="w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        <TransactionsTable
          transactions={transactions}
          page={page}
          pageSize={pageSize}
          handleViewDetails={handleViewDetails}
          handleCancelTransaction={handleCancelTransaction}
          handleCompensateCustomer={handleCompensateCustomer}
          handleChangeStatus={handleChangeStatus}
        />
        <TransactionsPagination
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          totalTransactions={totalTransactions}
          pageSize={pageSize}
        />
      </div>
    </>
  ) : (
    <p className="text-center py-6 text-muted-foreground">{t("no-transactions-found")}</p>
  )
);

export default UserTransactionsTableSection;
