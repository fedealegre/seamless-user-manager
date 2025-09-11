
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
    phoneNumber: "123-456-7890",
    cellPhone: "987-654-3210",
    companyId: 1,
    blocked: false,
    status: "ACTIVE",
    blockReason: undefined,
    government_identification: "25141556",
    government_identification_type: "DNI",
    government_identification2: "20251415561",
    government_identification_type2: "CUIL",
    additionalInfo: {
      "Device1": "{'deviceId':'e1864a5c-c4ef-4c83-96c9-c5510b170eaa','firebaseToken':'fHFW09QYSli-jmN9ori7X5:APA91bFyJOMiH5hT-PD9VajzySutOvRJKeg89fKylAjMxXS4VLV8zNj3-N9ymILko1EntQAX2dMHG7dPQwoxONrhb_9oQYWmk4wABezXARcBWlmXhodMZxs','platform':'ANDROID','appVersion':1,'lastLogin':1753809368731}"
    }
  },
  {
    id: 2,
    name: "Jane",
    surname: "Smith",
    username: "janesmith",
    email: "jane.smith@example.com",
    phoneNumber: "456-789-0123",
    cellPhone: "654-321-0987",
    companyId: 1,
    blocked: true,
    status: "BLOCKED",
    blockReason: "Suspicious activity",
    government_identification: "87654321",
    government_identification_type: "DNI",
    government_identification2: "27876543210",
    government_identification_type2: "CUIL",
  },
  {
    id: 3,
    name: "Alice",
    surname: "Johnson",
    username: "alicej",
    email: "alice.johnson@example.com",
    phoneNumber: "789-012-3456",
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
    phoneNumber: "012-345-6789",
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
    phoneNumber: "345-678-9012",
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
    phoneNumber: "678-901-2345",
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
    phoneNumber: "901-234-5678",
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
    phoneNumber: "901-234-5678",
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
    phoneNumber: "901-234-5678",
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
  { walletId: 1, userId: "1", associationDate: "2024-01-01", isOwner: true },
  { walletId: 2, userId: "1", associationDate: "2024-01-02", isOwner: false },
  { walletId: 4, userId: "4", associationDate: "2024-01-03", isOwner: true },
  { walletId: 5, userId: "4", associationDate: "2024-01-04", isOwner: false },
];

const mockTransactions: Transaction[] = [
  // John Doe's pending transactions for testing
  {
    id: 16001,
    transactionId: "16001",
    customerId: "1",
    walletId: "1",
    amount: -25.50,
    currency: "USD",
    status: "pending",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    movementType: "OUTCOME",
    transactionType: "CASH_OUT",
    additionalInfo: {
      payment_type: "TRANSFER_P2P",
      address: "0001",
      receipt_concept: "Payment",
      receipt_description: "Pending payment verification",
      internal_transaction_id: "PEND001",
      entity: "ARGENTINE_VAULT"
    },
    statusHistory: [
      {
        oldStatus: "confirmed",
        newStatus: "pending",
        reason: "Reversión temporal por verificación de seguridad adicional",
        changedBy: "admin@company.com",
        changedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
      }
    ]
  },
  {
    id: 16002,
    transactionId: "16002",
    customerId: "1",
    walletId: "1",
    amount: 100.00,
    currency: "USD",
    status: "pending",
    date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    movementType: "INCOME",
    transactionType: "CASH_IN",
    additionalInfo: {
      payment_type: "BANK_TRANSFER",
      address: "0001",
      receipt_concept: "Deposit",
      receipt_description: "Awaiting bank confirmation",
      internal_transaction_id: "PEND002",
      entity: "ARGENTINE_VAULT"
    }
  },
  {
    id: 16003,
    transactionId: "16003",
    customerId: "1",
    walletId: "1",
    amount: -75.25,
    currency: "USD",
    status: "pending",
    date: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    movementType: "OUTCOME",
    transactionType: "PURCHASE",
    additionalInfo: {
      payment_type: "QR_PAYMENT",
      address: "0001",
      receipt_concept: "Purchase",
      receipt_description: "Merchant verification pending",
      internal_transaction_id: "PEND003",
      entity: "ARGENTINE_VAULT"
    },
    statusHistory: [
      {
        oldStatus: "cancelled",
        newStatus: "pending",
        reason: "Solicitud del cliente - transacción válida, revertir cancelación",
        changedBy: "configurador@company.com",
        changedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString() // 20 minutes ago
      },
      {
        oldStatus: "confirmed",
        newStatus: "cancelled",
        reason: "Detección automática de actividad sospechosa",
        changedBy: "sistema-antifraude",
        changedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString() // 45 minutes ago
      }
    ]
  },
  {
    id: 16004,
    transactionId: "16004",
    customerId: "1",
    walletId: "1",
    amount: 50.00,
    currency: "USD",
    status: "pending",
    date: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    movementType: "INCOME",
    transactionType: "REFUND",
    additionalInfo: {
      payment_type: "REFUND",
      address: "0001",
      receipt_concept: "Refund",
      receipt_description: "Refund processing",
      internal_transaction_id: "PEND004",
      entity: "ARGENTINE_VAULT"
    }
  },
  {
    id: 16005,
    transactionId: "16005",
    customerId: "1",
    walletId: "1",
    amount: -15.75,
    currency: "USD",
    status: "pending",
    date: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    movementType: "OUTCOME",
    transactionType: "FEE",
    additionalInfo: {
      payment_type: "COMMISSION",
      address: "0001",
      receipt_concept: "Service Fee",
      receipt_description: "Processing fee verification",
      internal_transaction_id: "PEND005",
      entity: "ARGENTINE_VAULT"
    }
  },
  // John Doe's existing confirmed transactions
  {
    id: 15134,
    transactionId: "15134",
    customerId: "1",
    walletId: "1",
    amount: -10.0,
    currency: "ARS",
    status: "CONFIRMED",
    date: new Date(1754531073000).toISOString(),
    movementType: "OUTCOME",
    transactionType: "CASH_OUT",
    additionalInfo: {
      payment_type: "TRANSFER_P2P",
      address: "0001",
      receipt_concept: "Seguro",
      receipt_description: "otro",
      receipt_destiny_cuit: "destinyCUIT",
      accountType: "dummyAddress",
      internal_transaction_id: "33tMvpbKO0LaypRtW4",
      accountNumber: "N/A",
      receipt_destiny_cbu: "destinyCBU",
      receipt_origin_entity: "originEntity",
      receipt_destiny_entity: "destinyEntity",
      receipt_origin_account: "0029941603",
      receipt_origin_cbu: "0200900511000029941630",
      receipt_origin_full_name: "Juan Perez",
      receipt_destiny_full_name: "destinyFullName",
      receipt_origin_cuit: "27302090713",
      entity: "ARGENTINE_VAULT"
    }
  },
  {
    id: 15085,
    transactionId: "15085",
    customerId: "1",
    walletId: "1",
    amount: -3604.45,
    currency: "ARS",
    status: "CONFIRMED",
    date: new Date(1754406837000).toISOString(),
    movementType: "OUTCOME",
    transactionType: "CASH_OUT",
    additionalInfo: {
      payment_type: "QR_PAYMENT",
      address: "0001",
      accountType: "dummyAddress",
      internal_transaction_id: "HbmgNpUj73dAOSZ8RG",
      mcc: "5411",
      accountNumber: "N/A",
      entity: "ARGENTINE_VAULT"
    }
  },
  {
    id: 15083,
    transactionId: "15083",
    customerId: "1",
    walletId: "1",
    amount: 5000.0,
    currency: "ARS",
    status: "CONFIRMED",
    date: new Date(1754335332000).toISOString(),
    movementType: "INCOME",
    transactionType: "CASH_IN"
  },
  {
    id: 15082,
    transactionId: "15082",
    customerId: "1",
    walletId: "1",
    amount: 5000.0,
    currency: "ARS",
    status: "CONFIRMED",
    date: new Date(1754335331000).toISOString(),
    movementType: "INCOME",
    transactionType: "CASH_IN"
  },
  {
    id: 15081,
    transactionId: "15081",
    customerId: "1",
    walletId: "1",
    amount: 5000.0,
    currency: "ARS",
    status: "CONFIRMED",
    date: new Date(1754335329000).toISOString(),
    movementType: "INCOME",
    transactionType: "CASH_IN"
  },
  {
    id: 15080,
    transactionId: "15080",
    customerId: "1",
    walletId: "1",
    amount: 5000.0,
    currency: "ARS",
    status: "CONFIRMED",
    date: new Date(1754335316000).toISOString(),
    movementType: "INCOME",
    transactionType: "CASH_IN"
  },
  {
    id: 15079,
    transactionId: "15079",
    customerId: "1",
    walletId: "1",
    amount: 5000.0,
    currency: "ARS",
    status: "CONFIRMED",
    date: new Date(1754335315000).toISOString(),
    movementType: "INCOME",
    transactionType: "CASH_IN"
  },
  {
    id: 15078,
    transactionId: "15078",
    customerId: "1",
    walletId: "1",
    amount: 5000.0,
    currency: "ARS",
    status: "CONFIRMED",
    date: new Date(1754335313000).toISOString(),
    movementType: "INCOME",
    transactionType: "CASH_IN"
  },
  {
    id: 15077,
    transactionId: "15077",
    customerId: "1",
    walletId: "1",
    amount: 5000.0,
    currency: "ARS",
    status: "CONFIRMED",
    date: new Date(1754335312000).toISOString(),
    movementType: "INCOME",
    transactionType: "CASH_IN"
  },
  {
    id: 15076,
    transactionId: "15076",
    customerId: "1",
    walletId: "1",
    amount: 5000.0,
    currency: "ARS",
    status: "CONFIRMED",
    date: new Date(1754335310000).toISOString(),
    movementType: "INCOME",
    transactionType: "CASH_IN"
  },
  {
    id: 15075,
    transactionId: "15075",
    customerId: "1",
    walletId: "1",
    amount: 5000.0,
    currency: "ARS",
    status: "CONFIRMED",
    date: new Date(1754335308000).toISOString(),
    movementType: "INCOME",
    transactionType: "CASH_IN"
  },
  {
    id: 15074,
    transactionId: "15074",
    customerId: "1",
    walletId: "1",
    amount: 5000.0,
    currency: "ARS",
    status: "CONFIRMED",
    date: new Date(1754335289000).toISOString(),
    movementType: "INCOME",
    transactionType: "CASH_IN"
  },
  // Original transactions for other users
  { id: 1, customerId: "1", walletId: "1", amount: 100, type: "deposit", date: "2024-01-01", additionalInfo: { description: "Initial deposit" }, status: "confirmed" },
  { id: 2, customerId: "1", walletId: "1", amount: -50, type: "withdrawal", date: "2024-01-01", additionalInfo: { description: "Grocery shopping" }, status: "confirmed" },
  { id: 3, customerId: "1", walletId: "2", amount: 200, type: "deposit", date: "2024-01-01", additionalInfo: { description: "Bonus payment" }, status: "pending" },
  { id: 4, customerId: "4", walletId: "4", amount: 50, type: "deposit", date: "2024-01-01", additionalInfo: { description: "Initial deposit" }, status: "confirmed" },
  { id: 5, customerId: "4", walletId: "5", amount: -10, type: "withdrawal", date: "2024-01-01", additionalInfo: { description: "Coffee" }, status: "confirmed" },
];

export class MockUserService implements UserService {
  private users: User[] = mockUsers;
  private wallets: Wallet[] = mockWallets;
  private transactions: Transaction[] = mockTransactions;
  private walletUserAssociations: WalletUserAssociation[] = mockWalletUserAssociations;

  async searchUsers(params: Record<string, string>, companyId?: string): Promise<User[]> {
    console.log("Searching users with params:", params, "for company:", companyId);
    
    if (!params || Object.keys(params).length === 0) {
      return [];
    }

    // Filter by company first if companyId is provided
    let filteredUsers = companyId 
      ? this.users.filter(user => user.companyId?.toString() === companyId)
      : this.users;

    return filteredUsers.filter(user => {
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
            if (!user.phoneNumber || !user.phoneNumber.includes(trimmedValue)) {
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
          case 'government_identification':
            if (!user.government_identification || user.government_identification !== trimmedValue) {
              return false;
            }
            break;
          case 'government_identification2':
            if (!user.government_identification2 || user.government_identification2 !== trimmedValue) {
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
    console.log("Resetting password for user:", request.userId);
    return Promise.resolve({ success: true, message: "Password reset successfully." });
  }

  async getUserWallets(userId: string): Promise<Wallet[]> {
    return Promise.resolve(this.wallets.filter(wallet => this.walletUserAssociations.some(association => association.walletId === wallet.id && association.userId === userId)));
  }

  async getCompanyWallets(): Promise<Wallet[]> {
    return Promise.resolve(this.wallets);
  }

  async getAllWallets(): Promise<{ wallet: Wallet; userId: string }[]> {
    return Promise.resolve(this.wallets.map(wallet => ({ wallet, userId: '1' })));
  }

  async getWalletTransactions(walletId: string, userId: string): Promise<Transaction[]> {
    return Promise.resolve(this.transactions.filter(t => t.walletId === walletId));
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
    const movementTypes = ["INCOME", "OUTCOME"];
    const paymentTypes = ["TRANSFER_P2P", "QR_PAYMENT"];
    const currencies = ["ARS", "USD"];
    const statuses = ["CONFIRMED", "PENDING"];
    
    const randomMovementType = movementTypes[Math.floor(Math.random() * movementTypes.length)];
    const randomAmount = randomMovementType === "INCOME" ? 
      Math.floor(Math.random() * 5000) + 100 : 
      -(Math.floor(Math.random() * 1000) + 10);
    
    const randomTransaction: Transaction = {
      id: Math.floor(Math.random() * 100000) + 20000,
      transactionId: `TXN_${Date.now()}`,
      customerId: "1",
      walletId: "1",
      amount: randomAmount,
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date: new Date().toISOString(),
      movementType: randomMovementType,
      transactionType: randomMovementType === "INCOME" ? "CASH_IN" : "CASH_OUT",
      additionalInfo: {
        payment_type: paymentTypes[Math.floor(Math.random() * paymentTypes.length)],
        internal_transaction_id: `INT_${Math.random().toString(36).substr(2, 9)}`,
        entity: "ARGENTINE_VAULT"
      }
    };
    
    this.transactions.push(randomTransaction);
    return Promise.resolve(randomTransaction);
  }

  async changeTransactionStatus(
    walletId: string,
    transactionId: string,
    request: ChangeTransactionStatusRequest
  ): Promise<Transaction> {
    const transactionIndex = this.transactions.findIndex((t) => t.id === parseInt(transactionId) && t.walletId === walletId);
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
    return Promise.resolve(this.users.filter(user => userIds.includes(user.id.toString())));
  }

  async addUserToWallet(walletId: string, userId: string, isOwner?: boolean): Promise<WalletUserAssociation> {
    const newAssociation: WalletUserAssociation = {
      walletId: parseInt(walletId),
      userId: userId,
      associationDate: new Date().toISOString(),
      isOwner: isOwner || false,
    };
    this.walletUserAssociations.push(newAssociation);
    return Promise.resolve(newAssociation);
  }

  async removeUserFromWallet(walletId: string, userId: string): Promise<void> {
    this.walletUserAssociations = this.walletUserAssociations.filter(
      association => !(association.walletId === parseInt(walletId) && association.userId === userId)
    );
    return Promise.resolve();
  }

  async getWalletUserAssociations(): Promise<WalletUserAssociation[]> {
    return Promise.resolve(this.walletUserAssociations);
  }

  async getIdentificationTypes(): Promise<{ 
    governmentIdentificationType: string | null; 
    governmentIdentificationType2: string | null; 
  }> {
    // Get the most common identification types from mock data
    const users = this.users.filter(user => !user.deleted);
    
    const type1 = users.find(user => user.government_identification_type)?.government_identification_type || null;
    const type2 = users.find(user => user.government_identification_type2)?.government_identification_type2 || null;
    
    return Promise.resolve({
      governmentIdentificationType: type1,
      governmentIdentificationType2: type2
    });
  }
}
