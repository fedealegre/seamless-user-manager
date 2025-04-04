
import { Transaction } from "@/lib/api/types";

// Helper function to generate a random transaction (used in the MockUserService)
export function generateRandomTransaction(): Transaction {
  const transactionTypes = ["deposit", "withdrawal", "transfer", "payment", "refund"];
  const statuses = ["pending", "completed", "failed", "cancelled"];
  const currencies = ["USD", "EUR", "CAD", "MXN"];
  
  const randomType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const randomCurrency = currencies[Math.floor(Math.random() * currencies.length)];
  const randomAmount = +(Math.random() * 1000).toFixed(2);
  
  return {
    id: Math.floor(Math.random() * 10000),
    transactionId: `tx_${Date.now()}${Math.floor(Math.random() * 1000)}`,
    customerId: "random-customer",
    walletId: "random-wallet",
    date: new Date().toISOString(),
    status: randomStatus,
    type: randomType,
    transactionType: randomType.toUpperCase(),
    amount: randomAmount,
    currency: randomCurrency,
    reference: `Random ${randomType} transaction`,
    additionalInfo: {
      generated: "random",
      timestamp: Date.now()
    }
  };
}

// Mock transaction data for development
export const mockTransactions: Record<number, Transaction[]> = {
  1001: [
    {
      id: 10001,
      transactionId: "tx_10001",
      customerId: "827",
      walletId: "1001",
      date: "2023-03-15T14:30:00Z",
      status: "completed",
      type: "deposit",
      transactionType: "DEPOSIT",
      movementType: "INCOME",
      amount: 500.00,
      currency: "USD",
      reference: "Salary deposit",
    },
    {
      id: 10002,
      transactionId: "tx_10002",
      customerId: "827",
      walletId: "1001",
      date: "2023-03-20T09:15:00Z",
      status: "completed",
      type: "withdrawal",
      transactionType: "WITHDRAWAL",
      movementType: "OUTCOME",
      amount: 100.00,
      currency: "USD",
      reference: "ATM withdrawal",
    },
    {
      id: 10003,
      transactionId: "tx_10003",
      customerId: "827",
      walletId: "1001",
      date: "2023-03-25T18:45:00Z",
      status: "pending",
      type: "transfer",
      transactionType: "TRANSFER",
      movementType: "OUTCOME",
      amount: 200.00,
      currency: "USD",
      reference: "Transfer to savings",
    }
  ],
  1002: [
    {
      id: 20001,
      transactionId: "tx_20001",
      customerId: "827",
      walletId: "1002",
      date: "2023-03-25T18:50:00Z",
      status: "completed",
      type: "transfer",
      transactionType: "TRANSFER",
      movementType: "INCOME",
      amount: 200.00,
      currency: "EUR",
      reference: "Transfer from main account",
    }
  ],
  2001: [
    {
      id: 30001,
      transactionId: "tx_30001",
      customerId: "828",
      walletId: "2001",
      date: "2023-03-10T11:20:00Z",
      status: "completed",
      type: "deposit",
      transactionType: "DEPOSIT",
      movementType: "INCOME",
      amount: 1000.00,
      currency: "CAD",
      reference: "Initial deposit",
    },
    {
      id: 30002,
      transactionId: "tx_30002",
      customerId: "828",
      walletId: "2001",
      date: "2023-03-22T16:35:00Z",
      status: "pending",
      type: "payment",
      transactionType: "PAYMENT",
      movementType: "OUTCOME",
      amount: 75.50,
      currency: "CAD",
      reference: "Online purchase",
    }
  ],
  3001: [
    {
      id: 40001,
      transactionId: "tx_40001",
      customerId: "829",
      walletId: "3001",
      date: "2023-03-05T08:10:00Z",
      status: "completed",
      type: "deposit",
      transactionType: "DEPOSIT",
      movementType: "INCOME",
      amount: 5000.00,
      currency: "MXN",
      reference: "Initial deposit",
    },
    {
      id: 40002,
      transactionId: "tx_40002",
      customerId: "829",
      walletId: "3001",
      date: "2023-03-06T13:25:00Z",
      status: "cancelled",
      type: "withdrawal",
      transactionType: "WITHDRAWAL",
      movementType: "OUTCOME",
      amount: 1000.00,
      currency: "MXN",
      reference: "Cancelled withdrawal",
    }
  ]
};
