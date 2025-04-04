
import React from "react";
import BackofficeLayout from "@/components/BackofficeLayout";
import WalletBalanceReport from "@/components/reports/WalletBalanceReport";

const WalletBalancesPage = () => {
  return (
    <BackofficeLayout>
      <WalletBalanceReport />
    </BackofficeLayout>
  );
};

export default WalletBalancesPage;
