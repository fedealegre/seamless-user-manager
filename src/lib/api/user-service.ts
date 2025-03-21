
import { apiService } from "./index";
import { WaasabiApiClient } from "./waasabi-api-client";
import { User, Wallet, Transaction, CompensationRequest } from "./types";

// Check if we should use Waasabi API - FORCE to true to always use Waasabi API
const useWaasabiApi = true; // Force to true instead of checking environment variable
const waasabiBaseUrl = import.meta.env.VITE_WAASABI_API_URL || 'https://qa-aws.waasabi.io/admin/v1';
const waasabiCustomerId = import.meta.env.VITE_WAASABI_CUSTOMER_ID || '1234';

// Create the Waasabi API client
let waasabiClient: WaasabiApiClient | null = null;
waasabiClient = new WaasabiApiClient(waasabiBaseUrl, waasabiCustomerId);
console.log('Using Waasabi API for user management');

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

// The actual service implementation that always uses Waasabi client
class UserServiceImpl implements UserService {
  async searchUsers(params: any): Promise<User[]> {
    if (waasabiClient) {
      return waasabiClient.searchUsers(params);
    }
    // Fallback to apiService if waasabiClient is not available (shouldn't happen)
    console.warn("Waasabi client not available, falling back to default API");
    return apiService.searchUsers(params);
  }

  async getUserData(userId: string): Promise<User> {
    if (waasabiClient) {
      return waasabiClient.getUserData(userId);
    }
    console.warn("Waasabi client not available, falling back to default API");
    return apiService.getUserData(userId);
  }

  async deleteUser(userId: string): Promise<void> {
    if (waasabiClient) {
      return waasabiClient.deleteUser(userId);
    }
    console.warn("Waasabi client not available, falling back to default API");
    return apiService.deleteUser(userId);
  }

  async blockUser(userId: string): Promise<void> {
    if (waasabiClient) {
      return waasabiClient.blockUser(userId);
    }
    console.warn("Waasabi client not available, falling back to default API");
    return apiService.blockUser(userId);
  }

  async unblockUser(userId: string): Promise<void> {
    if (waasabiClient) {
      return waasabiClient.unblockUser(userId);
    }
    console.warn("Waasabi client not available, falling back to default API");
    return apiService.unblockUser(userId);
  }

  async getUserWallets(userId: string): Promise<Wallet[]> {
    if (waasabiClient) {
      return waasabiClient.getUserWallets(userId);
    }
    console.warn("Waasabi client not available, falling back to default API");
    return apiService.getUserWallets(userId);
  }

  async getWalletTransactions(userId: string, walletId: string): Promise<Transaction[]> {
    if (waasabiClient) {
      return waasabiClient.getWalletTransactions(userId, walletId);
    }
    console.warn("Waasabi client not available, falling back to default API");
    return apiService.getWalletTransactions(userId, walletId);
  }

  async compensateCustomer(
    companyId: number,
    userId: string,
    walletId: number,
    originWalletId: number,
    request: CompensationRequest
  ): Promise<any> {
    if (waasabiClient) {
      return waasabiClient.compensateCustomer(companyId, userId, walletId, originWalletId, request);
    }
    console.warn("Waasabi client not available, falling back to default API");
    return apiService.compensateCustomer(companyId, userId, walletId, originWalletId, request);
  }
}

// Export the singleton instance
export const userService = new UserServiceImpl();
