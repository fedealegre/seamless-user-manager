
import { MockUserService } from "./services/mock-user-service";
import { User, Wallet, Transaction, CompensationRequest, ResetPasswordRequest, ResetPasswordResponse, WalletUserAssociation } from "./types";
import { ChangeTransactionStatusRequest, UserService } from "./services/user-service-interface";

// Create a wrapper service that adapts the MockUserService to the updated interface
class UserServiceWrapper implements UserService {
  private mockUserService: MockUserService;

  constructor() {
    this.mockUserService = new MockUserService();
  }

  async searchUsers(params: any, companyId?: string): Promise<User[]> {
    return this.mockUserService.searchUsers(params, companyId);
  }

  async getUserData(userId: string): Promise<User> {
    return this.mockUserService.getUserData(userId);
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    return this.mockUserService.updateUser(userId, userData);
  }

  async deleteUser(userId: string): Promise<void> {
    return this.mockUserService.deleteUser(userId);
  }

  async blockUser(userId: string, reason: string): Promise<void> {
    // Store the block reason in userData before calling the original method
    const user = await this.mockUserService.getUserData(userId);
    await this.mockUserService.updateUser(userId, { blockReason: reason });
    // Now call the original blockUser method with reason
    return this.mockUserService.blockUser(userId, reason);
  }

  async unblockUser(userId: string): Promise<void> {
    // Clear the block reason when unblocking
    const user = await this.mockUserService.getUserData(userId);
    await this.mockUserService.updateUser(userId, { blockReason: undefined });
    return this.mockUserService.unblockUser(userId);
  }

  async resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return this.mockUserService.resetPassword(request);
  }

  async getUserWallets(userId: string): Promise<Wallet[]> {
    return this.mockUserService.getUserWallets(userId);
  }

  async getCompanyWallets(): Promise<Wallet[]> {
    return this.mockUserService.getCompanyWallets();
  }

  async getAllWallets(): Promise<{ wallet: Wallet; userId: string }[]> {
    return this.mockUserService.getAllWallets();
  }

  async getWalletTransactions(userId: string, walletId: string): Promise<Transaction[]> {
    return this.mockUserService.getWalletTransactions(userId, walletId);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return this.mockUserService.getAllTransactions();
  }

  async compensateCustomer(
    companyId: number,
    userId: string,
    walletId: number,
    originWalletId: number,
    request: CompensationRequest
  ): Promise<any> {
    return this.mockUserService.compensateCustomer(
      companyId, userId, walletId, originWalletId, request
    );
  }

  async generateRandomTransaction(): Promise<Transaction> {
    return this.mockUserService.generateRandomTransaction();
  }

  async changeTransactionStatus(
    walletId: string,
    transactionId: string,
    request: ChangeTransactionStatusRequest
  ): Promise<Transaction> {
    return this.mockUserService.changeTransactionStatus(walletId, transactionId, request);
  }

  async getWalletUsers(walletId: string): Promise<User[]> {
    return this.mockUserService.getWalletUsers(walletId);
  }

  async addUserToWallet(walletId: string, userId: string, isOwner?: boolean): Promise<WalletUserAssociation> {
    return this.mockUserService.addUserToWallet(walletId, userId, isOwner);
  }

  async removeUserFromWallet(walletId: string, userId: string): Promise<void> {
    return this.mockUserService.removeUserFromWallet(walletId, userId);
  }

  async getWalletUserAssociations(): Promise<WalletUserAssociation[]> {
    return this.mockUserService.getWalletUserAssociations();
  }

  async getIdentificationTypes(): Promise<{ 
    governmentIdentificationType: string | null; 
    governmentIdentificationType2: string | null; 
  }> {
    return this.mockUserService.getIdentificationTypes();
  }
}

// Export the wrapped service instead of the original one
export const userService = new UserServiceWrapper();
