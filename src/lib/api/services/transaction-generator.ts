
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

// Add the TransactionGenerator class that was missing
export class TransactionGenerator {
  generateTransactions(count: number, options?: { userId?: string; walletId?: string }): Transaction[] {
    const transactions: Transaction[] = [];
    
    for (let i = 0; i < count; i++) {
      const transaction = this.generateTransaction(options);
      transactions.push(transaction);
    }
    
    return transactions;
  }
  
  generateTransaction(options?: { userId?: string; walletId?: string }): Transaction {
    // Get user ID (either from options or random)
    const userIds = Object.keys(mockWallets).map(id => parseInt(id));
    const userId = options?.userId ? parseInt(options.userId) : userIds[Math.floor(Math.random() * userIds.length)];
    
    // Get wallet ID (either from options or random for the user)
    const userWallets = mockWallets[userId];
    const wallet = options?.walletId 
      ? userWallets.find(w => w.id.toString() === options.walletId) || userWallets[0]
      : userWallets[Math.floor(Math.random() * userWallets.length)];
    
    // Generate other transaction properties
    const movementTypes = ["INCOME", "OUTCOME"];
    const transactionTypes = ["CASH_IN", "TRANSFER_CASH_IN", "CASH_OUT", "TK_PAY_REQ", "TK_PAY_REQ_CASH_OUT", "TRANSFER_CASH_OUT", "COMPENSATE"];
    const transactionStatuses = ["completed", "pending", "failed", "cancelled"];
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days
    
    const randomMovementType = movementTypes[Math.floor(Math.random() * movementTypes.length)];
    const randomType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    const randomStatus = transactionStatuses[Math.floor(Math.random() * transactionStatuses.length)];
    const randomAmount = parseFloat((Math.random() * 1000 + 1).toFixed(2));
    
    return {
      id: Math.floor(Math.random() * 10000),
      transactionId: `tx_${Date.now().toString()}_${Math.floor(Math.random() * 1000)}`,
      customerId: userId.toString(),
      walletId: wallet.id.toString(),
      date: randomDate.toISOString(),
      status: randomStatus,
      movementType: randomMovementType,
      transactionType: randomType,
      amount: randomAmount,
      currency: wallet.currency || "USD",
      reference: `Transaction ${randomType} ${randomDate.toLocaleDateString()}`
    };
  }
}
