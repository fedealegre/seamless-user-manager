
import { User, Wallet, Transaction, CompensationRequest } from "../types";

export interface UserService {
  searchUsers(params: any): Promise<User[]>;
  getUserData(userId: string): Promise<User>;
  updateUser(userId: string, userData: Partial<User>): Promise<User>;
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
  generateRandomTransaction(): Promise<Transaction>;
}
