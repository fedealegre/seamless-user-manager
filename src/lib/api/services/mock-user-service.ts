import { UserService, ChangeTransactionStatusRequest } from "../user-service-interface";
import { User, Wallet, Transaction, CompensationRequest, ResetPasswordRequest, ResetPasswordResponse } from "../types";
import { mockUsers, mockWallets } from "../mock/mock-users-data";

export class MockUserService implements UserService {
  async searchUsers(params: any): Promise<User[]> {
    console.log('MockUserService searchUsers called with params:', params);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredUsers = mockUsers;

    if (params.name) {
      filteredUsers = filteredUsers.filter(user =>
        user.name && user.name.toLowerCase().includes(params.name.toLowerCase())
      );
    }

    if (params.surname) {
      filteredUsers = filteredUsers.filter(user =>
        user.surname && user.surname.toLowerCase().includes(params.surname.toLowerCase())
      );
    }

    if (params.identifier) {
      filteredUsers = filteredUsers.filter(user =>
        user.governmentIdentification && user.governmentIdentification.includes(params.identifier)
      );
    }

    return filteredUsers;
  }

  async getUserData(userId: string): Promise<User> {
    console.log('MockUserService getUserData called with userId:', userId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = mockUsers.find(user => user.id.toString() === userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    console.log(`MockUserService updateUser called for userId: ${userId} with data:`, userData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userIndex = mockUsers.findIndex(user => user.id.toString() === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Update the user with the provided data
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
    return mockUsers[userIndex];
  }

  async deleteUser(userId: string): Promise<void> {
    console.log('MockUserService deleteUser called with userId:', userId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userIndex = mockUsers.findIndex(user => user.id.toString() === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Remove the user from the mock data
    mockUsers.splice(userIndex, 1);
  }

  async blockUser(userId: string): Promise<void> {
    console.log('MockUserService blockUser called with userId:', userId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userIndex = mockUsers.findIndex(user => user.id.toString() === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Update the user's status to blocked
    mockUsers[userIndex].blocked = true;
    mockUsers[userIndex].status = 'blocked';
  }

  async unblockUser(userId: string): Promise<void> {
    console.log('MockUserService unblockUser called with userId:', userId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userIndex = mockUsers.findIndex(user => user.id.toString() === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Update the user's status to unblocked
    mockUsers[userIndex].blocked = false;
    mockUsers[userIndex].status = 'active';
  }

  async resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    console.log('MockUserService resetPassword called with request:', request);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real implementation, you would reset the password here
    // and possibly send a temporary password to the user's email.

    // For the mock, we'll just return a successful response with a temporary password.
    return {
      success: true,
      message: 'Password reset successfully. A temporary password has been sent to the user\'s email.',
      temporaryPassword: 'TEMP-PASSWORD-123'
    };
  }

  async getUserWallets(userId: string): Promise<Wallet[]> {
    console.log('MockUserService getUserWallets called with userId:', userId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = mockUsers.find(user => user.id.toString() === userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Find the wallets associated with the user
    const userWallets = mockWallets.find(w => w.userId.toString() === userId)?.wallets || [];
    return userWallets;
  }

  async getWalletTransactions(userId: string, walletId: string): Promise<Transaction[]> {
    console.log(`MockUserService getWalletTransactions called for userId: ${userId}, walletId: ${walletId}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock transaction data
    const mockTransactions: Transaction[] = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      transactionId: `TXN-${i + 1}`,
      customerId: userId,
      walletId: walletId,
      initDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      reference: `REF-${i + 1}`,
      originTransactionId: `OTXN-${i + 1}`,
      destinationTransactionId: `DTXN-${i + 1}`,
      status: i % 2 === 0 ? 'completed' : 'pending',
      currency: 'USD',
      type: i % 3 === 0 ? 'deposit' : 'withdrawal',
      removed: false,
      lastIdTransaction: `LID-${i + 1}`,
      length: 10,
      transactionType: 'Generic',
      amount: (i + 1) * 10,
      date: new Date().toISOString(),
      additionalInfo: {
        description: `Mock transaction ${i + 1}`
      }
    }));

    return mockTransactions;
  }

  async compensateCustomer(
    companyId: number,
    userId: string,
    walletId: number,
    originWalletId: number,
    request: CompensationRequest
  ): Promise<any> {
    console.log(`Compensating customer ${userId} in wallet ${walletId}`);
    console.log('Compensation details:', request);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return a successful response
    return {
      message: "Compensation processed successfully",
      transactionId: `COMP-${Date.now()}`
    };
  }

  async changeTransactionStatus(
    walletId: string,
    transactionId: string,
    request: ChangeTransactionStatusRequest
  ): Promise<Transaction> {
    console.log(`Changing transaction ${transactionId} status to ${request.newStatus}`);
    console.log('Reason:', request.reason);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return the updated transaction (a mock response)
    const updatedTransaction: Transaction = {
      id: parseInt(transactionId) || Math.floor(Math.random() * 10000),
      transactionId: transactionId,
      customerId: "mock-customer-id",
      walletId: walletId,
      status: request.newStatus,
      date: new Date().toISOString(),
      amount: 100,
      type: "payment",
      currency: "USD"
    };
    
    return updatedTransaction;
  }

  async getAllWallets(): Promise<{ wallet: Wallet; userId: string }[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create an array of wallets with associated user IDs
    const allWallets = mockWallets.flatMap(userWallets => 
      userWallets.wallets.map(wallet => ({
        wallet,
        userId: userWallets.userId
      }))
    );
    
    return allWallets;
  }

  async generateRandomTransaction(): Promise<Transaction> {
    // Generate a random transaction for testing/demonstration purposes
    const types = ["deposit", "withdrawal", "transfer", "payment", "refund"];
    const statuses = ["completed", "pending", "failed", "cancelled"];
    
    const randomTransaction: Transaction = {
      id: Math.floor(Math.random() * 10000),
      transactionId: `TX-${Date.now().toString()}`,
      customerId: `CU-${Math.floor(Math.random() * 1000)}`,
      walletId: `W-${Math.floor(Math.random() * 100)}`,
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date: new Date().toISOString(),
      amount: Math.floor(Math.random() * 1000) + 10,
      currency: "USD"
    };
    
    return randomTransaction;
  }
}
