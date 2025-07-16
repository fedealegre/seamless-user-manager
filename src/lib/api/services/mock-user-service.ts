import { User, Wallet, Transaction, CompensationRequest, ResetPasswordRequest, ResetPasswordResponse, WalletUserAssociation } from "../types";
import { UserService, ChangeTransactionStatusRequest } from "./user-service-interface";

// Mock data - replace with your actual data source
const mockUsers: User[] = [
  {
    id: 1,
    name: "John",
    surname: "Doe",
    username: "johndoe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    cellPhone: "987-654-3210",
    companyId: 1,
    blocked: false,
    status: "ACTIVE",
    blockReason: undefined,
  },
  {
    id: 2,
    name: "Jane",
    surname: "Smith",
    username: "janesmith",
    email: "jane.smith@example.com",
    phone: "456-789-0123",
    cellPhone: "654-321-0987",
    companyId: 1,
    blocked: true,
    status: "BLOCKED",
    blockReason: "Suspicious activity",
  },
  {
    id: 3,
    name: "Alice",
    surname: "Johnson",
    username: "alicej",
    email: "alice.johnson@example.com",
    phone: "789-012-3456",
    cellPhone: "321-098-7654",
    companyId: 2,
    blocked: false,
    status: "ACTIVE",
    blockReason: undefined,
  },
  {
    id: 4,
    name: "Bob",
    surname: "Williams",
    username: "bobw",
    email: "bob.williams@example.com",
    phone: "012-345-6789",
    cellPhone: "098-765-4321",
    companyId: 2,
    blocked: false,
    status: "ACTIVE",
    blockReason: undefined,
  },
  {
    id: 5,
    name: "Charlie",
    surname: "Brown",
    username: "charlieb",
    email: "charlie.brown@example.com",
    phone: "345-678-9012",
    cellPhone: "765-432-1098",
    companyId: 1,
    blocked: false,
    status: "ACTIVE",
    blockReason: undefined,
  },
  {
    id: 6,
    name: "David",
    surname: "Jones",
    username: "davidj",
    email: "david.jones@example.com",
    phone: "678-901-2345",
    cellPhone: "432-109-8765",
    companyId: 2,
    blocked: true,
    status: "BLOCKED",
    blockReason: "Incomplete KYC",
  },
  {
    id: 7,
    name: "Eve",
    surname: "Davis",
    username: "eved",
    email: "eve.davis@example.com",
    phone: "901-234-5678",
    cellPhone: "109-876-5432",
    companyId: 1,
    blocked: false,
    status: "ACTIVE",
    blockReason: undefined,
  },
  {
    id: 8,
    name: "Wilson",
    surname: "Guarin",
    username: "wilsong",
    email: "wilson.guarin@globant.com",
    phone: "901-234-5678",
    cellPhone: "109-876-5432",
    companyId: 1,
    blocked: false,
    status: "ACTIVE",
    blockReason: undefined,
  },
  {
    id: 9,
    name: "Laura",
    surname: "Diaz",
    username: "laurad",
    email: "laura.diaz@globant.com",
    phone: "901-234-5678",
    cellPhone: "109-876-5432",
    companyId: 1,
    blocked: false,
    status: "ACTIVE",
    blockReason: undefined,
  },
];

const mockWallets: Wallet[] = [
  { id: 1, name: "Main Wallet", balance: 1000, currency: "USD", companyId: 1 },
  { id: 2, name: "Savings Wallet", balance: 500, currency: "USD", companyId: 1 },
  { id: 3, name: "Company Wallet", balance: 10000, currency: "USD", companyId: 1 },
  { id: 4, name: "Main Wallet", balance: 2000, currency: "USD", companyId: 2 },
  { id: 5, name: "Bonus Wallet", balance: 200, currency: "USD", companyId: 2 },
];

const mockWalletUserAssociations: WalletUserAssociation[] = [
  { walletId: 1, userId: 1, isOwner: true },
  { walletId: 2, userId: 1, isOwner: false },
  { walletId: 4, userId: 4, isOwner: true },
  { walletId: 5, userId: 4, isOwner: false },
];

const mockTransactions: Transaction[] = [
  { id: 1, walletId: 1, amount: 100, type: "deposit", date: new Date(), description: "Initial deposit", status: "confirmed" },
  { id: 2, walletId: 1, amount: -50, type: "withdrawal", date: new Date(), description: "Grocery shopping", status: "confirmed" },
  { id: 3, walletId: 2, amount: 200, type: "deposit", date: new Date(), description: "Bonus payment", status: "pending" },
  { id: 4, walletId: 4, amount: 50, type: "deposit", date: new Date(), description: "Initial deposit", status: "confirmed" },
  { id: 5, walletId: 5, amount: -10, type: "withdrawal", date: new Date(), description: "Coffee", status: "confirmed" },
];

export class MockUserService implements UserService {
  private users: User[] = mockUsers;
  private wallets: Wallet[] = mockWallets;
  private transactions: Transaction[] = mockTransactions;
  private walletUserAssociations: WalletUserAssociation[] = mockWalletUserAssociations;

  async searchUsers(params: Record<string, string>): Promise<User[]> {
    console.log("Searching users with params:", params);
    
    if (!params || Object.keys(params).length === 0) {
      return [];
    }

    return this.users.filter(user => {
      for (const [key, value] of Object.entries(params)) {
        if (!value || value.trim() === '') continue;
        
        const trimmedValue = value.trim();
        
        switch (key) {
          case 'name':
            if (!user.name || !user.name.toLowerCase().includes(trimmedValue.toLowerCase())) {
              return false;
            }
            break;
          case 'surname':
            if (!user.surname || !user.surname.toLowerCase().includes(trimmedValue.toLowerCase())) {
              return false;
            }
            break;
          case 'email':
            // Exact match for email - case insensitive
            if (!user.email || user.email.toLowerCase() !== trimmedValue.toLowerCase()) {
              return false;
            }
            break;
          case 'phone':
            if (!user.phone || !user.phone.includes(trimmedValue)) {
              return false;
            }
            break;
          case 'cellPhone':
            if (!user.cellPhone || !user.cellPhone.includes(trimmedValue)) {
              return false;
            }
            break;
          case 'id':
            if (user.id.toString() !== trimmedValue) {
              return false;
            }
            break;
          case 'status':
            const userStatus = user.blocked || user.status === "BLOCKED" ? "BLOCKED" : "ACTIVE";
            if (userStatus !== trimmedValue) {
              return false;
            }
            break;
          default:
            break;
        }
      }
      return true;
    });
  }

  async getUserData(userId: string): Promise<User> {
    const user = this.users.find((u) => u.id === parseInt(userId));
    if (!user) {
      throw new Error("User not found");
    }
    return Promise.resolve(user);
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    const userIndex = this.users.findIndex((u) => u.id === parseInt(userId));
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    this.users[userIndex] = { ...this.users[userIndex], ...userData };
    return Promise.resolve(this.users[userIndex]);
  }

  async deleteUser(userId: string): Promise<void> {
    this.users = this.users.filter((u) => u.id !== parseInt(userId));
    return Promise.resolve();
  }

  async blockUser(userId: string, reason: string): Promise<void> {
    const userIndex = this.users.findIndex((u) => u.id === parseInt(userId));
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    this.users[userIndex] = { ...this.users[userIndex], blocked: true, status: "BLOCKED", blockReason: reason };
    return Promise.resolve();
  }

  async unblockUser(userId: string): Promise<void> {
    const userIndex = this.users.findIndex((u) => u.id === parseInt(userId));
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    this.users[userIndex] = { ...this.users[userIndex], blocked: false, status: "ACTIVE", blockReason: undefined };
    return Promise.resolve();
  }

  async resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    console.log("Resetting password for user:", request.email);
    return Promise.resolve({ success: true, message: "Password reset successfully." });
  }

  async getUserWallets(userId: string): Promise<Wallet[]> {
    return Promise.resolve(this.wallets.filter(wallet => this.walletUserAssociations.some(association => association.walletId === wallet.id && association.userId === parseInt(userId))));
  }

  async getCompanyWallets(): Promise<Wallet[]> {
    return Promise.resolve(this.wallets);
  }

  async getAllWallets(): Promise<{ wallet: Wallet; userId: string }[]> {
    return Promise.resolve(this.wallets.map(wallet => ({ wallet, userId: '1' })));
  }

  async getWalletTransactions(walletId: string, userId: string): Promise<Transaction[]> {
    return Promise.resolve(this.transactions.filter(t => t.walletId === parseInt(walletId)));
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return Promise.resolve(this.transactions);
  }

  async compensateCustomer(
    companyId: number,
    userId: string,
    walletId: number,
    originWalletId: number,
    request: CompensationRequest
  ): Promise<any> {
    console.log(`Compensating customer ${userId} in wallet ${walletId} from origin wallet ${originWalletId} with amount ${request.amount}`);
    return Promise.resolve({ success: true, message: "Compensation request processed successfully." });
  }

  async generateRandomTransaction(): Promise<Transaction> {
    const randomTransaction: Transaction = {
      id: Math.floor(Math.random() * 1000),
      walletId: 1,
      amount: Math.floor(Math.random() * 100) - 50,
      type: "deposit",
      date: new Date(),
      description: "Random transaction",
      status: "confirmed",
    };
    return Promise.resolve(randomTransaction);
  }

  async changeTransactionStatus(
    walletId: string,
    transactionId: string,
    request: ChangeTransactionStatusRequest
  ): Promise<Transaction> {
    const transactionIndex = this.transactions.findIndex((t) => t.id === parseInt(transactionId) && t.walletId === parseInt(walletId));
    if (transactionIndex === -1) {
      throw new Error("Transaction not found");
    }

    this.transactions[transactionIndex] = { ...this.transactions[transactionIndex], status: request.newStatus };
    return Promise.resolve(this.transactions[transactionIndex]);
  }

  async getWalletUsers(walletId: string): Promise<User[]> {
    const userIds = this.walletUserAssociations
      .filter(association => association.walletId === parseInt(walletId))
      .map(association => association.userId);
    return Promise.resolve(this.users.filter(user => userIds.includes(user.id)));
  }

  async addUserToWallet(walletId: string, userId: string, isOwner?: boolean): Promise<WalletUserAssociation> {
    const newAssociation: WalletUserAssociation = {
      walletId: parseInt(walletId),
      userId: parseInt(userId),
      isOwner: isOwner || false,
    };
    this.walletUserAssociations.push(newAssociation);
    return Promise.resolve(newAssociation);
  }

  async removeUserFromWallet(walletId: string, userId: string): Promise<void> {
    this.walletUserAssociations = this.walletUserAssociations.filter(
      association => !(association.walletId === parseInt(walletId) && association.userId === parseInt(userId))
    );
    return Promise.resolve();
  }

  async getWalletUserAssociations(): Promise<WalletUserAssociation[]> {
    return Promise.resolve(this.walletUserAssociations);
  }
}
