
import { User, Wallet, Transaction, CompensationRequest } from "../types";
import { UserService } from "./user-service-interface";
import { mockUsers, mockWallets, mockTransactions } from "../mock/mock-users-data";
import { generateRandomTransaction } from "./transaction-generator";

// The actual service implementation that uses mock data
export class MockUserService implements UserService {
  async searchUsers(params: any): Promise<User[]> {
    console.log("Using mock data for searchUsers", params);
    
    // Filter logic for mock data
    return mockUsers.filter(user => {
      // Filter by ID (exact match)
      if (params.id && user.id.toString() !== params.id.toString()) {
        return false;
      }
      
      // Filter by name (partial match)
      if (params.name && !user.name.toLowerCase().includes(params.name.toLowerCase())) {
        return false;
      }
      
      // Filter by cell phone (partial match)
      if (params.cellPhone && !user.cellPhone?.includes(params.cellPhone)) {
        return false;
      }
      
      // Keep the existing filters for backward compatibility
      if (params.surname && !user.surname?.toLowerCase().includes(params.surname.toLowerCase())) {
        return false;
      }
      if (params.identifier && 
          !user.username?.toLowerCase().includes(params.identifier.toLowerCase()) &&
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
      id: Date.now(),
      transactionId: `comp_${Date.now()}`,
      customerId: userId,
      walletId: walletId.toString(),
      date: new Date().toISOString(),
      status: "completed",
      type: "compensation",
      transactionType: "COMPENSATE",
      movementType: "INCOME",
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
