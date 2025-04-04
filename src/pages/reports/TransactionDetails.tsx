
import React from "react";
import BackofficeLayout from "@/components/BackofficeLayout";
import TransactionDetailReport from "@/components/reports/TransactionDetailReport";

const TransactionDetailsPage = () => {
  return (
    <BackofficeLayout>
      <TransactionDetailReport />
    </BackofficeLayout>
  );
};

export default TransactionDetailsPage;
