import { User, Wallet, Transaction, CompensationRequest, ResetPasswordRequest, ResetPasswordResponse, WalletUserAssociation } from "../types";
import { UserService, ChangeTransactionStatusRequest } from "./user-service-interface";
import { mockUsers, mockWallets, mockTransactions } from "../mock/mock-users-data";
import { generateRandomTransaction } from "./transaction-generator";

// Mock wallet-user associations data
const mockWalletUserAssociations: WalletUserAssociation[] = [];

// Mock company wallets data
const mockCompanyWallets: Wallet[] = [
  { 
    id: 999, 
    currency: "USD", 
    name: "Company Main USD Wallet", 
    balance: 10000, 
    availableBalance: 10000,
    status: "ACTIVE"
  },
  { 
    id: 998, 
    currency: "EUR", 
    name: "Company Main EUR Wallet", 
    balance: 8000, 
    availableBalance: 8000,
    status: "ACTIVE" 
  }
];

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

  async resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    console.log("Using mock data for resetPassword", request);
    
    // Check if user exists
    const user = mockUsers.find(u => u.id.toString() === request.userId);
    if (!user) {
      return {
        success: false,
        message: `User with ID ${request.userId} not found`
      };
    }
    
    // Generate a temporary password (in a real implementation, this would be more secure)
    const temporaryPassword = Math.random().toString(36).slice(-8);
    
    // In a real implementation, we would hash the password and update it in the database
    // For mock purposes, we'll just return the temporary password
    
    return {
      success: true,
      message: "Password has been reset successfully",
      temporaryPassword: temporaryPassword
    };
  }

  async getUserWallets(userId: string): Promise<Wallet[]> {
    console.log("Using mock data for getUserWallets", userId);
    // Return wallets for the specified user or empty array if none exist
    return mockWallets[parseInt(userId)] || [];
  }

  async getCompanyWallets(): Promise<Wallet[]> {
    console.log("Using mock data for getCompanyWallets");
    return mockCompanyWallets;
  }

  async getAllWallets(): Promise<{ wallet: Wallet; userId: string }[]> {
    console.log("Using mock data for getAllWallets");
    const allWallets: { wallet: Wallet; userId: string }[] = [];
    
    // Iterate through all users and their wallets
    Object.entries(mockWallets).forEach(([userId, wallets]) => {
      wallets.forEach(wallet => {
        allWallets.push({
          wallet,
          userId
        });
      });
    });
    
    return allWallets;
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
    
    // Check if the amount is valid based on compensation type
    const amount = parseFloat(request.amount);
    if (request.compensation_type === 'credit' && amount <= 0) {
      throw new Error("Credit compensation must have a positive amount");
    }
    
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
      movementType: amount >= 0 ? "INCOME" : "OUTCOME",
      amount: amount,
      currency: mockWallets[parseInt(userId)]?.find(w => w.id === walletId)?.currency || "USD",
      reference: `${request.compensation_type}: ${request.reason}`,
      additionalInfo: {
        compensationType: request.compensation_type
      }
    };
    
    // Add the transaction to the mock data
    if (!mockTransactions[walletId]) {
      mockTransactions[walletId] = [];
    }
    mockTransactions[walletId].unshift(newTransaction);
    
    // Update the wallet balance
    const wallet = mockWallets[parseInt(userId)]?.find(w => w.id === walletId);
    if (wallet) {
      wallet.balance = (wallet.balance || 0) + amount;
      wallet.availableBalance = (wallet.availableBalance || 0) + amount;
    }
    
    return { 
      message: `Compensated user ${userId} with ${request.amount} (${request.compensation_type})`,
      transactionId: newTransaction.transactionId
    };
  }

  async generateRandomTransaction(): Promise<Transaction> {
    console.log("Generating random transaction");
    return generateRandomTransaction();
  }

  async changeTransactionStatus(
    walletId: string,
    transactionId: string,
    request: ChangeTransactionStatusRequest
  ): Promise<Transaction> {
    console.log("Using mock data for changeTransactionStatus", walletId, transactionId, request);
    
    if (!mockTransactions[parseInt(walletId)]) {
      throw new Error(`Wallet with ID ${walletId} not found`);
    }
    
    const transactionIndex = mockTransactions[parseInt(walletId)].findIndex(
      t => (t.transactionId === transactionId || t.id.toString() === transactionId)
    );
    
    if (transactionIndex === -1) {
      throw new Error(`Transaction with ID ${transactionId} not found`);
    }
    
    const transaction = mockTransactions[parseInt(walletId)][transactionIndex];
    
    if (transaction.status !== 'pending') {
      throw new Error(`Transaction with ID ${transactionId} is not in pending status`);
    }
    
    // Update the transaction status
    transaction.status = request.newStatus;
    
    // Add reason to additional info
    if (!transaction.additionalInfo) {
      transaction.additionalInfo = {};
    }
    transaction.additionalInfo.statusChangeReason = request.reason;
    transaction.additionalInfo.statusChangeDate = new Date().toISOString();
    
    // Save the updated transaction back to the mock data
    mockTransactions[parseInt(walletId)][transactionIndex] = transaction;
    
    return transaction;
  }

  async getAllTransactions(): Promise<Transaction[]> {
    console.log("Using mock data for getAllTransactions");
    
    // Collect all transactions from all wallets
    const allTransactions: Transaction[] = [];
    
    // Iterate through all wallets and collect their transactions
    Object.entries(mockTransactions).forEach(([walletId, transactions]) => {
      // Add wallet ID to each transaction if not already present
      const transactionsWithWalletId = transactions.map(transaction => ({
        ...transaction,
        walletId: transaction.walletId || walletId.toString()
      }));
      
      allTransactions.push(...transactionsWithWalletId);
    });
    
    // Sort transactions by date (newest first)
    return allTransactions.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
  }

  async getWalletUsers(walletId: string): Promise<User[]> {
    console.log("Using mock data for getWalletUsers", walletId);
    
    // Get all associations for this wallet
    const associations = mockWalletUserAssociations.filter(
      assoc => assoc.walletId.toString() === walletId
    );
    
    // Get the user IDs from the associations
    const userIds = associations.map(assoc => assoc.userId);
    
    // Return the users
    return mockUsers.filter(user => userIds.includes(user.id.toString()));
  }

  async addUserToWallet(walletId: string, userId: string, isOwner: boolean = false): Promise<WalletUserAssociation> {
    console.log("Using mock data for addUserToWallet", walletId, userId, isOwner);
    
    // Check if the association already exists
    const existingAssociation = mockWalletUserAssociations.find(
      assoc => assoc.walletId.toString() === walletId && assoc.userId === userId
    );
    
    if (existingAssociation) {
      // Update the existing association if the owner status changed
      if (existingAssociation.isOwner !== isOwner) {
        existingAssociation.isOwner = isOwner;
      }
      return existingAssociation;
    }
    
    // Create a new association
    const newAssociation: WalletUserAssociation = {
      walletId: parseInt(walletId),
      userId,
      associationDate: new Date().toISOString(),
      isOwner
    };
    
    // Add to the mock data
    mockWalletUserAssociations.push(newAssociation);
    
    // Add role information to the user's additionalInfo for display purposes
    const user = mockUsers.find(u => u.id.toString() === userId);
    if (user) {
      if (!user.additionalInfo) {
        user.additionalInfo = {};
      }
      user.additionalInfo.walletRole = isOwner ? "owner" : "authorized";
    }
    
    return newAssociation;
  }

  async removeUserFromWallet(walletId: string, userId: string): Promise<void> {
    console.log("Using mock data for removeUserFromWallet", walletId, userId);
    
    // Find the index of the association
    const index = mockWalletUserAssociations.findIndex(
      assoc => assoc.walletId.toString() === walletId && assoc.userId === userId
    );
    
    // Check if the association exists
    if (index !== -1) {
      // Check if the user is the owner - cannot remove the owner
      if (mockWalletUserAssociations[index].isOwner) {
        throw new Error("Cannot remove wallet owner");
      }
      
      // Remove the association
      mockWalletUserAssociations.splice(index, 1);
      
      // Clean up user's additionalInfo
      const user = mockUsers.find(u => u.id.toString() === userId);
      if (user && user.additionalInfo && user.additionalInfo.walletRole) {
        delete user.additionalInfo.walletRole;
      }
    }
  }

  async getWalletUserAssociations(): Promise<WalletUserAssociation[]> {
    console.log("Using mock data for getWalletUserAssociations");
    
    // Initialize with default owner associations for all wallets
    if (mockWalletUserAssociations.length === 0) {
      // For each wallet, find its original owner and create an association
      Object.entries(mockWallets).forEach(([userId, wallets]) => {
        wallets.forEach(wallet => {
          mockWalletUserAssociations.push({
            walletId: wallet.id,
            userId,
            associationDate: new Date().toISOString(),
            isOwner: true
          });
        });
      });
    }
    
    return [...mockWalletUserAssociations];
  }
}
