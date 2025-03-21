
import { WaasabiOAuthClient } from "./waasabi-oauth-client";
import { WaasabiCustomerService } from "./services/waasabi-customer-service";
import { WaasabiWalletService } from "./services/waasabi-wallet-service";
import { User, Wallet, Transaction, CompensationRequest } from "./types";

export class WaasabiApiClient {
  private customerService: WaasabiCustomerService;
  private walletService: WaasabiWalletService;

  constructor(
    baseUrl: string, 
    customerId: string, 
    oauthClient?: WaasabiOAuthClient
  ) {
    this.customerService = new WaasabiCustomerService(baseUrl, customerId, oauthClient);
    this.walletService = new WaasabiWalletService(baseUrl, customerId, oauthClient);
    
    console.log(`WaasabiApiClient initialized with baseURL: ${baseUrl}, customerId: ${customerId}, and OAuth: ${!!oauthClient}`);
  }

  // User-related operations
  async searchUsers(params: { 
    name?: string;
    surname?: string;
    identifier?: string;
    phoneNumber?: string;
    walletId?: string;
  }): Promise<User[]> {
    return this.customerService.searchUsers(params);
  }

  async getUserData(userId: string): Promise<User> {
    return this.customerService.getUserData(userId);
  }

  async deleteUser(userId: string): Promise<void> {
    return this.customerService.deleteUser(userId);
  }

  async blockUser(userId: string): Promise<void> {
    return this.customerService.blockUser(userId);
  }

  async unblockUser(userId: string): Promise<void> {
    return this.customerService.unblockUser(userId);
  }

  // Wallet-related operations
  async getUserWallets(userId: string): Promise<Wallet[]> {
    return this.walletService.getUserWallets(userId);
  }

  async getWalletTransactions(userId: string, walletId: string): Promise<Transaction[]> {
    return this.walletService.getWalletTransactions(userId, walletId);
  }

  async compensateCustomer(
    companyId: number,
    userId: string,
    walletId: number,
    originWalletId: number,
    request: CompensationRequest
  ): Promise<any> {
    return this.walletService.compensateCustomer(companyId, userId, walletId, originWalletId, request);
  }
}
