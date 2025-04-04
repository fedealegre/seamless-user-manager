
import React from "react";
import BackofficeLayout from "@/components/BackofficeLayout";
import TransactionTypeReport from "@/components/reports/TransactionTypeReport";

const TransactionTypesPage = () => {
  return (
    <BackofficeLayout>
      <TransactionTypeReport />
    </BackofficeLayout>
  );
};

export default TransactionTypesPage;
