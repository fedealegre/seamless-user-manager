
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
    status: 'ACTIVE' 
  },
  { 
    id: 2, 
    companyId: 1, 
    username: 'jane.smith', 
    name: 'Jane', 
    surname: 'Smith', 
    email: 'jane.smith@example.com', 
    phoneNumber: '+1987654321', 
    status: 'ACTIVE' 
  },
  { 
    id: 3, 
    companyId: 1, 
    username: 'robert.johnson', 
    name: 'Robert', 
    surname: 'Johnson', 
    email: 'robert.johnson@example.com', 
    phoneNumber: '+1122334455', 
    status: 'BLOCKED' 
  }
];

// User Service interface
interface UserService {
  searchUsers(params: any): Promise<User[]>;
  getUserData(userId: string): Promise<User>;
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
}

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
          !user.email.toLowerCase().includes(params.identifier.toLowerCase()) &&
          !user.phoneNumber.includes(params.identifier)) {
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
    console.log("Using mock data for getUserWallets");
    return []; // Mock wallets can be added if needed
  }

  async getWalletTransactions(userId: string, walletId: string): Promise<Transaction[]> {
    console.log("Using mock data for getWalletTransactions");
    return []; // Mock transactions can be added if needed
  }

  async compensateCustomer(
    companyId: number,
    userId: string,
    walletId: number,
    originWalletId: number,
    request: CompensationRequest
  ): Promise<any> {
    console.log("Using mock data for compensateCustomer");
    return { 
      message: `Compensated user ${userId} with ${request.amount}`,
      transactionId: `comp_${Date.now()}`
    };
  }
}

// Export the singleton instance
export const userService = new UserServiceImpl();
