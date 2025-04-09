
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
  const movementTypes = ["income", "outcome"];
  const transactionTypes = ["cash_in", "transfer_cash_in", "cash_out", "tk_pay_req", "compensate"];
  const transactionStatuses = ["completed", "pending", "failed", "cancelled"];

  const randomMovementType = movementTypes[Math.floor(Math.random() * movementTypes.length)];
  const randomType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
  const randomStatus = transactionStatuses[Math.floor(Math.random() * transactionStatuses.length)];
  
  // Generate a random amount between 1 and 1000
  const randomAmount = parseFloat((Math.random() * 1000 + 1).toFixed(2));
  
  // Create the transaction
  const newTransaction: Transaction = {
    id: Math.floor(Math.random() * 10000), // Generate a random ID
    transactionId: `tx_${Date.now().toString()}`, // Use the required field from components
    customerId: randomUserId.toString(),
    walletId: randomWallet.id.toString(),
    date: new Date().toISOString(),
    status: randomStatus,
    movementType: randomMovementType, // Using movementType field as required by components
    transactionType: randomType, // Also setting transactionType for compatibility
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
