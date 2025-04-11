
import { User, Wallet, Transaction, CompensationRequest, ResetPasswordRequest, ResetPasswordResponse, WalletUserAssociation } from "../types";

export interface ChangeTransactionStatusRequest {
  newStatus: 'cancelled' | 'rejected' | 'confirmed' | 'approved';
  reason: string;
}

export interface UserService {
  searchUsers(params: any): Promise<User[]>;
  getUserData(userId: string): Promise<User>;
  updateUser(userId: string, userData: Partial<User>): Promise<User>;
  deleteUser(userId: string): Promise<void>;
  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
  resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse>;
  getUserWallets(userId: string): Promise<Wallet[]>;
  getAllWallets(): Promise<{ wallet: Wallet; userId: string }[]>;
  getWalletTransactions(userId: string, walletId: string): Promise<Transaction[]>;
  getAllTransactions(): Promise<Transaction[]>;
  compensateCustomer(
    companyId: number,
    userId: string,
    walletId: number,
    originWalletId: number,
    request: CompensationRequest
  ): Promise<any>;
  generateRandomTransaction(): Promise<Transaction>;
  changeTransactionStatus(
    walletId: string,
    transactionId: string,
    request: ChangeTransactionStatusRequest
  ): Promise<Transaction>;
  
  // Methods for wallet-user associations
  getWalletUsers(walletId: string): Promise<User[]>;
  addUserToWallet(walletId: string, userId: string, isOwner?: boolean): Promise<WalletUserAssociation>;
  removeUserFromWallet(walletId: string, userId: string): Promise<void>;
  getWalletUserAssociations(): Promise<WalletUserAssociation[]>;
}
