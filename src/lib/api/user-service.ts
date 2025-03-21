
import { apiService } from "./index";
import { WaasabiApiClient } from "./waasabi-api-client";
import { WaasabiOAuthClient } from "./waasabi-oauth-client";
import { User, Wallet, Transaction, CompensationRequest } from "./types";

// Check if we should use Waasabi API - FORCE to true to always use Waasabi API
const useWaasabiApi = true; // Force to true instead of checking environment variable
const waasabiBaseUrl = import.meta.env.VITE_WAASABI_API_URL || 'https://api-sandbox.waasabi.io/sandbox/admin/v1';
const waasabiCustomerId = import.meta.env.VITE_WAASABI_CUSTOMER_ID || '1234';

// OAuth configuration
const waasabiOAuthClientId = import.meta.env.VITE_WAASABI_OAUTH_CLIENT_ID || '6akohc1kgth07qtipmoaq7et7l';
const waasabiOAuthClientSecret = import.meta.env.VITE_WAASABI_OAUTH_CLIENT_SECRET || '1bre8qgf8ss9objbsf7v2bqju0h535f6lc76n1j3sj4aohpui6nr';
const waasabiOAuthTokenUrl = import.meta.env.VITE_WAASABI_OAUTH_TOKEN_URL || 'https://waasabi-sandbox.auth.eu-west-3.amazoncognito.com/oauth2/token';

// Create the OAuth client
let waasabiOAuthClient: WaasabiOAuthClient | null = null;
if (useWaasabiApi) {
  waasabiOAuthClient = new WaasabiOAuthClient(
    waasabiOAuthClientId,
    waasabiOAuthClientSecret,
    waasabiOAuthTokenUrl
  );
  console.log('Created Waasabi OAuth client');
}

// Create the Waasabi API client with OAuth
let waasabiClient: WaasabiApiClient | null = null;
if (useWaasabiApi) {
  waasabiClient = new WaasabiApiClient(waasabiBaseUrl, waasabiCustomerId, waasabiOAuthClient);
  console.log('Using Waasabi API with OAuth for user management');
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
