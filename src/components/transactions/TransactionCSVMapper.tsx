
import { Transaction, Wallet } from "@/lib/api/types";

interface TransactionCSVMapperProps {
  wallets: Wallet[];
  formatDateTime: (date: Date) => string;
  t: (key: string) => string;
  userId: string;
}

export const useTransactionCSVMapper = ({
  wallets,
  formatDateTime,
  t,
  userId,
}: TransactionCSVMapperProps) => {
  
  const findWallet = (walletId: string) => {
    return wallets.find(wallet => wallet.id.toString() === walletId);
  };

  const mapTransactionToCSV = (transaction: Transaction) => {
    const wallet = findWallet(transaction.walletId);
    return [
      transaction.transactionId || transaction.id.toString(),
      transaction.reference || '',
      transaction.date ? formatDateTime(new Date(transaction.date)) : '',
      t(transaction.movementType?.toLowerCase() || 'unknown'),
      t(transaction.transactionType?.toLowerCase() || 'unknown'),
      transaction.amount?.toString() || '',
      transaction.currency || wallet?.currency || '',
      t(transaction.status?.toLowerCase() || 'unknown'),
      userId,
      wallet?.id.toString() || '',
    ];
  };

  return { mapTransactionToCSV };
};
