
import { apiService } from "./index";
import { WaasabiApiClient } from "./waasabi-api-client";
import { User, Wallet, Transaction, CompensationRequest } from "./types";

// Check if we should use Waasabi API
const useWaasabiApi = import.meta.env.VITE_USE_WAASABI_API === 'true';
const waasabiBaseUrl = import.meta.env.VITE_WAASABI_API_URL || 'https://qa-aws.waasabi.io/admin/v1';
const waasabiCustomerId = import.meta.env.VITE_WAASABI_CUSTOMER_ID || '1234';

// Create the Waasabi API client (only if enabled)
let waasabiClient: WaasabiApiClient | null = null;
if (useWaasabiApi) {
  waasabiClient = new WaasabiApiClient(waasabiBaseUrl, waasabiCustomerId);
  console.log('Using Waasabi API for user management');
} else {
  console.log('Using default API for user management');
}

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

// The actual service implementation that delegates to the appropriate client
class UserServiceImpl implements UserService {
  async searchUsers(params: any): Promise<User[]> {
    if (useWaasabiApi && waasabiClient) {
      return waasabiClient.searchUsers(params);
    }
    return apiService.searchUsers(params);
  }

  async getUserData(userId: string): Promise<User> {
    if (useWaasabiApi && waasabiClient) {
      return waasabiClient.getUserData(userId);
    }
    return apiService.getUserData(userId);
  }

  async deleteUser(userId: string): Promise<void> {
    if (useWaasabiApi && waasabiClient) {
      return waasabiClient.deleteUser(userId);
    }
    return apiService.deleteUser(userId);
  }

  async blockUser(userId: string): Promise<void> {
    if (useWaasabiApi && waasabiClient) {
      return waasabiClient.blockUser(userId);
    }
    return apiService.blockUser(userId);
  }

  async unblockUser(userId: string): Promise<void> {
    if (useWaasabiApi && waasabiClient) {
      return waasabiClient.unblockUser(userId);
    }
    return apiService.unblockUser(userId);
  }

  async getUserWallets(userId: string): Promise<Wallet[]> {
    if (useWaasabiApi && waasabiClient) {
      return waasabiClient.getUserWallets(userId);
    }
    return apiService.getUserWallets(userId);
  }

  async getWalletTransactions(userId: string, walletId: string): Promise<Transaction[]> {
    if (useWaasabiApi && waasabiClient) {
      return waasabiClient.getWalletTransactions(userId, walletId);
    }
    return apiService.getWalletTransactions(userId, walletId);
  }

  async compensateCustomer(
    companyId: number,
    userId: string,
    walletId: number,
    originWalletId: number,
    request: CompensationRequest
  ): Promise<any> {
    if (useWaasabiApi && waasabiClient) {
      return waasabiClient.compensateCustomer(companyId, userId, walletId, originWalletId, request);
    }
    return apiService.compensateCustomer(companyId, userId, walletId, originWalletId, request);
  }
}

// Export the singleton instance
export const userService = new UserServiceImpl();
