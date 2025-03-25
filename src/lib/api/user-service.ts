
import { apiService } from "./index";
import { User, Wallet, Transaction, CompensationRequest } from "./types";

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

// The actual service implementation that uses the mock API service
class UserServiceImpl implements UserService {
  async searchUsers(params: any): Promise<User[]> {
    console.log("Using mock API for searchUsers");
    return apiService.searchUsers(params);
  }

  async getUserData(userId: string): Promise<User> {
    console.log("Using mock API for getUserData");
    return apiService.getUserData(userId);
  }

  async deleteUser(userId: string): Promise<void> {
    console.log("Using mock API for deleteUser");
    return apiService.deleteUser(userId);
  }

  async blockUser(userId: string): Promise<void> {
    console.log("Using mock API for blockUser");
    return apiService.blockUser(userId);
  }

  async unblockUser(userId: string): Promise<void> {
    console.log("Using mock API for unblockUser");
    return apiService.unblockUser(userId);
  }

  async getUserWallets(userId: string): Promise<Wallet[]> {
    console.log("Using mock API for getUserWallets");
    return apiService.getUserWallets(userId);
  }

  async getWalletTransactions(userId: string, walletId: string): Promise<Transaction[]> {
    console.log("Using mock API for getWalletTransactions");
    return apiService.getWalletTransactions(userId, walletId);
  }

  async compensateCustomer(
    companyId: number,
    userId: string,
    walletId: number,
    originWalletId: number,
    request: CompensationRequest
  ): Promise<any> {
    console.log("Using mock API for compensateCustomer");
    return apiService.compensateCustomer(companyId, userId, walletId, originWalletId, request);
  }
}

// Export the singleton instance
export const userService = new UserServiceImpl();
