
import React, { createContext, useContext } from "react";
import { useTransactionGenerator } from "@/hooks/use-transaction-generator";
import { Transaction } from "@/lib/api/types";

interface TransactionGeneratorContextType {
  isGenerating: boolean;
  toggleGeneration: () => void;
  latestTransaction: Transaction | null;
}

const TransactionGeneratorContext = createContext<TransactionGeneratorContextType | undefined>(undefined);

export const TransactionGeneratorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isGenerating, toggleGeneration, latestTransaction } = useTransactionGenerator();

  return (
    <TransactionGeneratorContext.Provider value={{ isGenerating, toggleGeneration, latestTransaction }}>
      {children}
    </TransactionGeneratorContext.Provider>
  );
};

export const useTransactionGeneratorContext = () => {
  const context = useContext(TransactionGeneratorContext);
  if (context === undefined) {
    throw new Error("useTransactionGeneratorContext must be used within a TransactionGeneratorProvider");
  }
  return context;
};
