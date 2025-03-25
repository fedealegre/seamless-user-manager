
import { apiService } from "./index";
import { User, Wallet, Transaction, CompensationRequest } from "./types";

// Mock data for users
const mockUsers: User[] = [
  { 
    id: 1, 
    companyId: 1, 
    username: 'john.doe', 
    name: 'John', 
    surname: 'Doe', 
    email: 'john.doe@example.com', 
    phoneNumber: '+1234567890', 
    status: 'ACTIVE',
    birthDate: '1985-05-15',
    nationality: 'USA',
    gender: 'M',
    language: 'English',
    region: 'North America',
    governmentIdentificationType: 'SSN',
    governmentIdentification: '123-45-6789'
  },
  { 
    id: 2, 
    companyId: 1, 
    username: 'jane.smith', 
    name: 'Jane', 
    surname: 'Smith', 
    email: 'jane.smith@example.com', 
    phoneNumber: '+1987654321', 
    status: 'ACTIVE',
    birthDate: '1990-08-20',
    nationality: 'Canada',
    gender: 'F',
    language: 'English',
    region: 'North America'
  },
  { 
    id: 3, 
    companyId: 1, 
    username: 'robert.johnson', 
    name: 'Robert', 
    surname: 'Johnson', 
    email: 'robert.johnson@example.com', 
    phoneNumber: '+1122334455', 
    status: 'BLOCKED',
    birthDate: '1978-12-03',
    nationality: 'UK',
    gender: 'M',
    language: 'English',
    region: 'Europe'
  }
];

// Mock wallets data
const mockWallets: { [userId: number]: Wallet[] } = {
  1: [
    {
      id: 101,
      companyId: 1,
      status: "ACTIVE",
      currency: "USD",
      balance: 1250.75,
      availableBalance: 1200.50,
      additionalInfo: { "walletType": "PRIMARY" }
    },
    {
      id: 102,
      companyId: 1,
      status: "ACTIVE",
      currency: "EUR",
      balance: 850.25,
      availableBalance: 850.25,
      additionalInfo: { "walletType": "SECONDARY" }
    }
  ],
  2: [
    {
      id: 201,
      companyId: 1,
      status: "ACTIVE",
      currency: "USD",
      balance: 520.30,
      availableBalance: 520.30,
      additionalInfo: { "walletType": "PRIMARY" }
    }
  ],
  3: [
    {
      id: 301,
      companyId: 1,
      status: "BLOCKED",
      currency: "GBP",
      balance: 0,
      availableBalance: 0,
      additionalInfo: { "walletType": "PRIMARY" }
    }
  ]
};

// Mock transactions data
const mockTransactions: { [walletId: number]: Transaction[] } = {
  101: [
    {
      transactionId: "tx_10001",
      customerId: "1",
      walletId: "101",
      date: new Date(Date.now() - 86400000).toISOString(), // yesterday
      status: "completed",
      type: "deposit",
      amount: 500,
      currency: "USD",
      reference: "Salary payment"
    },
    {
      transactionId: "tx_10002",
      customerId: "1",
      walletId: "101",
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      status: "completed",
      type: "withdrawal",
      amount: 150,
      currency: "USD",
      reference: "ATM withdrawal"
    },
    {
      transactionId: "tx_10003",
      customerId: "1",
      walletId: "101",
      date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      status: "completed",
      type: "transfer",
      amount: 200,
      currency: "USD",
      reference: "Transfer to savings"
    }
  ],
  102: [
    {
      transactionId: "tx_20001",
      customerId: "1",
      walletId: "102",
      date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      status: "completed",
      type: "deposit",
      amount: 600,
      currency: "EUR",
      reference: "Foreign income"
    },
    {
      transactionId: "tx_20002",
      customerId: "1",
      walletId: "102",
      date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
      status: "pending",
      type: "withdrawal",
      amount: 50,
      currency: "EUR",
      reference: "Online purchase"
    }
  ],
  201: [
    {
      transactionId: "tx_30001",
      customerId: "2",
      walletId: "201",
      date: new Date(Date.now() - 86400000).toISOString(), // yesterday
      status: "completed",
      type: "deposit",
      amount: 300,
      currency: "USD",
      reference: "Refund"
    }
  ],
  301: [
    {
      transactionId: "tx_40001",
      customerId: "3",
      walletId: "301",
      date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      status: "cancelled",
      type: "withdrawal",
      amount: 750,
      currency: "GBP",
      reference: "Suspicious activity"
    }
  ]
};

// User Service interface
interface UserService {
  searchUsers(params: any): Promise<User[]>;
  getUserData(userId: string): Promise<User>;
  updateUser(userId: string, userData: Partial<User>): Promise<User>;
  deleteUser(userId: string): Promise<void>;
  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
  getUserWallets(userId: string): Promise<Wallet[]>;
  getWalletTransactions(userId: string, walletId: string): Promise<Transaction[]>;
  compensateCustomer(
    companyId: number,
    userId: string,
    walletId: number,
    originWalletId: number,
    request: CompensationRequest
  ): Promise<any>;
  generateRandomTransaction(): Promise<Transaction>;
}

// Helper functions for transaction generation
const generateRandomTransaction = (): Transaction => {
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

// The actual service implementation that uses mock data
class UserServiceImpl implements UserService {
  async searchUsers(params: any): Promise<User[]> {
    console.log("Using mock data for searchUsers", params);
    
    // Filter logic for mock data
    return mockUsers.filter(user => {
      if (params.name && !user.name.toLowerCase().includes(params.name.toLowerCase())) {
        return false;
      }
      if (params.surname && !user.surname.toLowerCase().includes(params.surname.toLowerCase())) {
        return false;
      }
      if (params.identifier && 
          !user.username.toLowerCase().includes(params.identifier.toLowerCase()) &&
          !user.email?.toLowerCase().includes(params.identifier.toLowerCase()) &&
          !user.phoneNumber?.includes(params.identifier)) {
        return false;
      }
      return true;
    });
  }

  async getUserData(userId: string): Promise<User> {
    console.log("Using mock data for getUserData");
    const user = mockUsers.find(u => u.id.toString() === userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    return user;
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    console.log("Using mock data for updateUser", userData);
    const userIndex = mockUsers.findIndex(u => u.id.toString() === userId);
    
    if (userIndex === -1) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Update the user with new data
    const updatedUser = {
      ...mockUsers[userIndex],
      ...userData
    };
    
    mockUsers[userIndex] = updatedUser;
    
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    console.log("Using mock data for deleteUser");
    const index = mockUsers.findIndex(u => u.id.toString() === userId);
    if (index !== -1) {
      mockUsers.splice(index, 1);
    }
  }

  async blockUser(userId: string): Promise<void> {
    console.log("Using mock data for blockUser");
    const user = mockUsers.find(u => u.id.toString() === userId);
    if (user) {
      user.status = 'BLOCKED';
    }
  }

  async unblockUser(userId: string): Promise<void> {
    console.log("Using mock data for unblockUser");
    const user = mockUsers.find(u => u.id.toString() === userId);
    if (user) {
      user.status = 'ACTIVE';
    }
  }

  async getUserWallets(userId: string): Promise<Wallet[]> {
    console.log("Using mock data for getUserWallets", userId);
    // Return wallets for the specified user or empty array if none exist
    return mockWallets[parseInt(userId)] || [];
  }

  async getWalletTransactions(userId: string, walletId: string): Promise<Transaction[]> {
    console.log("Using mock data for getWalletTransactions", userId, walletId);
    // Return transactions for the specified wallet or empty array if none exist
    return mockTransactions[parseInt(walletId)] || [];
  }

  async compensateCustomer(
    companyId: number,
    userId: string,
    walletId: number,
    originWalletId: number,
    request: CompensationRequest
  ): Promise<any> {
    console.log("Using mock data for compensateCustomer");
    
    // Create a new transaction for the compensation
    const newTransaction: Transaction = {
      transactionId: `comp_${Date.now()}`,
      customerId: userId,
      walletId: walletId.toString(),
      date: new Date().toISOString(),
      status: "completed",
      type: "compensation",
      amount: parseFloat(request.amount),
      currency: mockWallets[parseInt(userId)]?.find(w => w.id === walletId)?.currency || "USD",
      reference: request.reason
    };
    
    // Add the transaction to the mock data
    if (!mockTransactions[walletId]) {
      mockTransactions[walletId] = [];
    }
    mockTransactions[walletId].unshift(newTransaction);
    
    // Update the wallet balance
    const wallet = mockWallets[parseInt(userId)]?.find(w => w.id === walletId);
    if (wallet) {
      wallet.balance = (wallet.balance || 0) + parseFloat(request.amount);
      wallet.availableBalance = (wallet.availableBalance || 0) + parseFloat(request.amount);
    }
    
    return { 
      message: `Compensated user ${userId} with ${request.amount}`,
      transactionId: newTransaction.transactionId
    };
  }

  async generateRandomTransaction(): Promise<Transaction> {
    console.log("Generating random transaction");
    return generateRandomTransaction();
  }
}

// Export the singleton instance
export const userService = new UserServiceImpl();
