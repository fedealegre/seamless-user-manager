
import { CompensationRequest, Transaction, User, Wallet } from "../types";

export interface ChangeTransactionStatusRequest {
  newStatus: 'cancelled' | 'rejected' | 'confirmed' | 'approved';
  reason: string;
}

export interface ResetPasswordRequest {
  userId: string;
  adminId?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  temporaryPassword?: string;
}

export interface UserService {
  searchUsers(params: any): Promise<User[]>;
  getUserData(userId: string): Promise<User>;
  getUserWallets(userId: string): Promise<Wallet[]>;
  getAllWallets(): Promise<{ wallet: Wallet; userId: string }[]>;
  getWalletTransactions(userId: string, walletId: string): Promise<Transaction[]>;
  getAllTransactions(): Promise<Transaction[]>;
  deleteUser(userId: string): Promise<void>;
  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
  updateUser(userId: string, userData: Partial<User>): Promise<User>;
  resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse>;
  compensateCustomer(
    companyId: number,
    userId: string,
    walletId: number,
    originWalletId: number,
    request: CompensationRequest
  ): Promise<any>;
  changeTransactionStatus(
    walletId: string,
    transactionId: string,
    request: ChangeTransactionStatusRequest
  ): Promise<Transaction>;
  removeSecurityFactor(userId: string, factorId: string): Promise<void>;
  generateRandomTransaction(): Promise<Transaction>;
}
