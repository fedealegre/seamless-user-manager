
import { Transaction } from "../types";
import { mockWallets, mockTransactions } from "../mock/mock-users-data";

// Helper functions for transaction generation
export const generateRandomTransaction = (): Transaction => {
  // Get a random user
  const userIds = Object.keys(mockWallets).map(id => parseInt(id));
  const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
  
  // Get a random wallet for that user
  const userWallets = mockWallets[randomUserId];
  const randomWallet = userWallets[Math.floor(Math.random() * userWallets.length)];
  
  // Generate transaction types and statuses
  const transactionTypes = ["deposit", "withdrawal", "transfer", "payment", "refund"];
  const transactionStatuses = ["completed", "pending", "failed", "processing"];
  
  const randomType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
  const randomStatus = transactionStatuses[Math.floor(Math.random() * transactionStatuses.length)];
  
  // Generate a random amount between 1 and 1000
  const randomAmount = parseFloat((Math.random() * 1000 + 1).toFixed(2));
  
  // Create the transaction
  const newTransaction: Transaction = {
    transactionId: `tx_${Date.now().toString()}`,
    customerId: randomUserId.toString(),
    walletId: randomWallet.id.toString(),
    date: new Date().toISOString(),
    status: randomStatus,
    type: randomType,
    amount: randomAmount,
    currency: randomWallet.currency || "USD",
    reference: `Auto-generated ${randomType}`
  };
  
  // Add the transaction to the mock data
  if (!mockTransactions[randomWallet.id]) {
    mockTransactions[randomWallet.id] = [];
  }
  mockTransactions[randomWallet.id].unshift(newTransaction);
  
  // Update wallet balance
  if (randomStatus === "completed") {
    if (randomType === "deposit" || randomType === "refund") {
      randomWallet.balance = (randomWallet.balance || 0) + randomAmount;
      randomWallet.availableBalance = (randomWallet.availableBalance || 0) + randomAmount;
    } else if (randomType === "withdrawal" || randomType === "payment") {
      randomWallet.balance = (randomWallet.balance || 0) - randomAmount;
      randomWallet.availableBalance = (randomWallet.availableBalance || 0) - randomAmount;
    }
  }
  
  return newTransaction;
};
