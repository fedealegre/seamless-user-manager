import { User, Wallet, Transaction, CompensationRequest, TransactionListParams } from './types';
import { WaasabiApiClient } from './waasabi-api-client';
import { MockUserService } from './services/mock-user-service';

class UserService {
  private mockService: MockUserService;
  private waasabiClient?: WaasabiApiClient;

  constructor() {
    this.mockService = new MockUserService();
  }

  setWaasabiClient(client: WaasabiApiClient) {
    this.waasabiClient = client;
  }

  async searchUsers(params: any): Promise<User[]> {
    console.info('Using mock data for searchUsers', params);
    return this.mockService.searchUsers(params);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    console.info('Using mock data for getAllTransactions');
    return this.mockService.getAllTransactions();
  }

  async getUserWallets(userId: string): Promise<Wallet[]> {
    console.info('Using mock data for getUserWallets', userId);
    return this.mockService.getUserWallets(userId);
  }

  async getWalletTransactions(userId: string, walletId: string, params?: TransactionListParams): Promise<Transaction[]> {
     console.info(`Fetching transactions for user ${userId}, wallet ${walletId} with params:`, params);
    return this.mockService.getWalletTransactions(userId, walletId, params);
  }

  async getUserData(userId: string): Promise<User> {
    console.info('Using mock data for getUserData', userId);
    return this.mockService.getUserData(userId);
  }

  async deleteUser(userId: string): Promise<void> {
    console.info('Using mock data for deleteUser', userId);
    return this.mockService.deleteUser(userId);
  }

  async blockUser(userId: string): Promise<void> {
    console.info('Using mock data for blockUser', userId);
    return this.mockService.blockUser(userId);
  }

  async unblockUser(userId: string): Promise<void> {
    console.info('Using mock data for unblockUser', userId);
    return this.mockService.unblockUser(userId);
  }

  async compensateCustomer(
    companyId: number,
    userId: string,
    walletId: number,
    originWalletId: number,
    compensationRequest: CompensationRequest
  ): Promise<any> {
    console.info('Using mock data for compensateCustomer', { companyId, userId, walletId, originWalletId, compensationRequest });
    return this.mockService.compensateCustomer(companyId, userId, walletId, originWalletId, compensationRequest);
  }

  async changeTransactionStatus(walletId: string, transactionId: string, statusUpdate: { newStatus: 'cancelled' | 'rejected' | 'confirmed' | 'approved'; reason: string; }): Promise<any> {
    console.info(`Changing transaction ${transactionId} status for wallet ${walletId} to ${statusUpdate.newStatus} with reason: ${statusUpdate.reason}`);
    return this.mockService.changeTransactionStatus(walletId, transactionId, statusUpdate);
  }

  async removeSecurityFactor(userId: string, factorId: string): Promise<void> {
    console.info(`Removing security factor ${factorId} for user ${userId}`);
    return this.mockService.removeSecurityFactor(userId, factorId);
  }
}

export const userService = new UserService();
