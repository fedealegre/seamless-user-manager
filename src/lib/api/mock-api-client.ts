import {
  AntiFraudRule,
  AuditLog,
  BackofficeUser,
  CancelTransactionRequest,
  CompensationRequest,
  LoginRequest,
  LoginResponse,
  Transaction,
  TransactionListParams,
  User,
  Wallet
} from "./types";

export class MockApiClient {
  private mockUsers: User[] = [
    { id: 1, companyId: 1, username: 'john.doe', name: 'John', surname: 'Doe', email: 'john.doe@example.com', phoneNumber: '+1234567890', status: 'ACTIVE' },
    { id: 2, companyId: 1, username: 'jane.smith', name: 'Jane', surname: 'Smith', email: 'jane.smith@example.com', phoneNumber: '+1987654321', status: 'ACTIVE' },
    { id: 3, companyId: 1, username: 'robert.johnson', name: 'Robert', surname: 'Johnson', email: 'robert.johnson@example.com', phoneNumber: '+1122334455', status: 'BLOCKED' },
    { id: 4, companyId: 1, username: 'carlos.lillo', name: 'Carlos', surname: 'Lillo', email: 'robert.johnson@example.com', phoneNumber: '+1122334455', status: 'ACTIVE' }

  ];

  private mockWallets: Record<string, Wallet[]> = {
    '1': [
      { id: 101, companyId: 1, status: 'active', currency: 'USD', balance: 1500.25, availableBalance: 1500.25 },
      { id: 102, companyId: 1, status: 'active', currency: 'EUR', balance: 950.50, availableBalance: 950.50 }
    ],
    '2': [
      { id: 201, companyId: 1, status: 'active', currency: 'USD', balance: 2350.75, availableBalance: 2350.75 }
    ],
    '3': [
      { id: 301, companyId: 1, status: 'frozen', currency: 'USD', balance: 500, availableBalance: 0 }
    ]
  };

  private mockTransactions: Record<string, Transaction[]> = {
    '101': [
      { customerId: '1', walletId: '101', transactionId: 'tx001', status: 'completed', currency: 'USD', type: 'deposit', amount: 500, date: '2023-05-15T14:23:45Z' },
      { customerId: '1', walletId: '101', transactionId: 'tx002', status: 'completed', currency: 'USD', type: 'withdrawal', amount: 200, date: '2023-05-17T10:15:30Z' },
      { customerId: '1', walletId: '101', transactionId: 'tx003', status: 'completed', currency: 'USD', type: 'transfer', amount: 300, date: '2023-05-20T16:45:12Z' }
    ],
    '102': [
      { customerId: '1', walletId: '102', transactionId: 'tx101', status: 'completed', currency: 'EUR', type: 'deposit', amount: 950.50, date: '2023-05-10T09:30:00Z' }
    ],
    '201': [
      { customerId: '2', walletId: '201', transactionId: 'tx201', status: 'completed', currency: 'USD', type: 'deposit', amount: 2000, date: '2023-05-05T11:20:15Z' },
      { customerId: '2', walletId: '201', transactionId: 'tx202', status: 'completed', currency: 'USD', type: 'deposit', amount: 350.75, date: '2023-05-18T13:40:22Z' }
    ],
    '301': [
      { customerId: '3', walletId: '301', transactionId: 'tx301', status: 'completed', currency: 'USD', type: 'deposit', amount: 500, date: '2023-05-02T08:15:45Z' },
      { customerId: '3', walletId: '301', transactionId: 'tx302', status: 'pending', currency: 'USD', type: 'withdrawal', amount: 500, date: '2023-05-22T17:10:30Z' }
    ]
  };

  private mockBackofficeUsers: BackofficeUser[] = [
    { id: 'admin1', name: 'Admin', surname: 'User', roles: ['admin', 'support'], state: 'active', last_login: '2023-05-22T08:30:45Z' },
    { id: 'support1', name: 'Support', surname: 'User', roles: ['support'], state: 'active', last_login: '2023-05-21T14:15:22Z' },
    { id: 'finance1', name: 'Finance', surname: 'User', roles: ['finance'], state: 'active', last_login: '2023-05-20T11:45:10Z' },
    { id: 'inactive1', name: 'Inactive', surname: 'User', roles: ['support'], state: 'blocked', last_login: '2023-04-15T09:20:33Z' },
    { id: 'fede', name: 'Federico', surname: 'Alegre', roles: ['admin', 'support', 'finance'], state: 'active', last_login: '2023-10-01T09:00:00Z' }
  ];

  private mockAuditLogs: AuditLog[] = [
    { id: 'log1', dateTime: '2023-05-22T10:15:30Z', user: 'Admin User', operationType: 'USER_BLOCK', entity: 'User', previousValue: 'active', newValue: 'blocked' },
    { id: 'log2', dateTime: '2023-05-21T16:45:12Z', user: 'Admin User', operationType: 'TRANSACTION_CANCEL', entity: 'Transaction', previousValue: 'pending', newValue: 'cancelled' },
    { id: 'log3', dateTime: '2023-05-20T14:30:45Z', user: 'Finance User', operationType: 'CUSTOMER_COMPENSATE', entity: 'Wallet', previousValue: '1000.00', newValue: '1500.00' },
    { id: 'log4', dateTime: '2023-05-19T11:20:33Z', user: 'Support User', operationType: 'USER_UPDATE', entity: 'User', previousValue: 'old data', newValue: 'new data' },
    { id: 'log5', dateTime: '2023-05-18T09:10:25Z', user: 'Admin User', operationType: 'RULE_CREATE', entity: 'Anti-Fraud Rule', previousValue: '', newValue: 'new rule data' }
  ];

  private mockAntiFraudRules: AntiFraudRule[] = [
    { id: 'rule1', applicationTime: 'daily', transactionTypes: ['withdrawal'], limit: 1000 },
    { id: 'rule2', applicationTime: 'monthly', transactionTypes: ['transfer', 'withdrawal'], limit: 10000 },
    { id: 'rule3', applicationTime: 'yearly', transactionTypes: ['all'], limit: 100000 }
  ];

  private userCredentials: Record<string, string> = {
    'admin': 'password123',
    'support': 'support123',
    'finance': 'finance123',
    'fede.alegre': 'backoffice'
  };

  async listAntiFraudRules(): Promise<AntiFraudRule[]> {
    return [...this.mockAntiFraudRules];
  }

  async addAntiFraudRule(rule: AntiFraudRule): Promise<void> {
    const newRule = { ...rule, id: `rule${this.mockAntiFraudRules.length + 1}` };
    this.mockAntiFraudRules.push(newRule);
  }

  async modifyAntiFraudRule(ruleId: string, rule: AntiFraudRule): Promise<void> {
    const index = this.mockAntiFraudRules.findIndex(r => r.id === ruleId);
    if (index !== -1) {
      this.mockAntiFraudRules[index] = { ...rule, id: ruleId };
    }
  }

  async deleteAntiFraudRule(ruleId: string): Promise<void> {
    const index = this.mockAntiFraudRules.findIndex(r => r.id === ruleId);
    if (index !== -1) {
      this.mockAntiFraudRules.splice(index, 1);
    }
  }

  async getAuditLogs(
    startDate?: string,
    endDate?: string,
    user?: string,
    operationType?: string
  ): Promise<AuditLog[]> {
    let filteredLogs = [...this.mockAuditLogs];
    
    if (startDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.dateTime) >= new Date(startDate));
    }
    
    if (endDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.dateTime) <= new Date(endDate));
    }
    
    if (user) {
      filteredLogs = filteredLogs.filter(log => log.user.toLowerCase().includes(user.toLowerCase()));
    }
    
    if (operationType && operationType !== "all") {
      filteredLogs = filteredLogs.filter(log => log.operationType === operationType);
    }
    
    return filteredLogs;
  }
  
  async listBackofficeUsers(): Promise<BackofficeUser[]> {
    await this.delay(500);
    return [...this.mockBackofficeUsers];
  }

  async createBackofficeUser(user: BackofficeUser): Promise<void> {
    await this.delay(500);
    
    if (!user.name || !user.surname || !user.roles || user.roles.length === 0) {
      throw new Error("Bad Request: Missing required fields");
    }
    
    const newUser = { 
      ...user, 
      id: `user${Date.now()}`,
      state: user.state || 'active',
      last_login: null
    };
    
    this.mockBackofficeUsers.push(newUser);
  }

  async blockBackofficeUser(userId: string): Promise<void> {
    await this.delay(500);
    
    const user = this.mockBackofficeUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error("Not Found: User with the specified ID does not exist");
    }
    
    user.state = 'blocked';
  }

  async unblockBackofficeUser(userId: string): Promise<void> {
    await this.delay(500);
    
    const user = this.mockBackofficeUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error("Not Found: User with the specified ID does not exist");
    }
    
    user.state = 'active';
  }

  async deleteBackofficeUser(userId: string): Promise<void> {
    await this.delay(500);
    
    const index = this.mockBackofficeUsers.findIndex(u => u.id === userId);
    if (index === -1) {
      throw new Error("Not Found: User with the specified ID does not exist");
    }
    
    this.mockBackofficeUsers.splice(index, 1);
  }

  async modifyUserRoles(userId: string, roles: string[]): Promise<void> {
    await this.delay(500);
    
    if (!roles || roles.length === 0) {
      throw new Error("Bad Request: At least one role must be specified");
    }
    
    const user = this.mockBackofficeUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error("Not Found: User with the specified ID does not exist");
    }
    
    user.roles = [...roles];
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const { userName, password } = loginRequest;
    
    if (this.userCredentials[userName] === password) {
      let user: BackofficeUser | undefined;
      
      if (userName === 'fede.alegre') {
        user = this.mockBackofficeUsers.find(u => u.id === 'fede');
      } else {
        user = this.mockBackofficeUsers.find(u => 
          u.name.toLowerCase().includes(userName.split('@')[0]) || 
          u.id?.toLowerCase().includes(userName.toLowerCase())
        );
      }
      
      if (user && user.state === 'active') {
        user.last_login = new Date().toISOString();
        
        return {
          accessToken: "mock-access-token-" + userName,
          refreshToken: "mock-refresh-token-" + userName,
          expiresIn: 3600,
          user: { ...user }
        };
      }
    }
    
    throw new Error("Invalid credentials");
  }

  async searchUsers(params: { userId?: string; publicId?: string; name?: string; surname?: string; identifier?: string }): Promise<User[]> {
    let filteredUsers = [...this.mockUsers];
    
    if (params.userId) {
      filteredUsers = filteredUsers.filter(user => user.id.toString() === params.userId);
    }
    
    if (params.publicId) {
      filteredUsers = filteredUsers.filter(user => user.publicId === params.publicId);
    }
    
    if (params.name) {
      filteredUsers = filteredUsers.filter(user => user.name.toLowerCase().includes(params.name!.toLowerCase()));
    }
    
    if (params.surname) {
      filteredUsers = filteredUsers.filter(user => user.surname.toLowerCase().includes(params.surname!.toLowerCase()));
    }
    
    if (params.identifier) {
      filteredUsers = filteredUsers.filter(user => 
        user.username.toLowerCase().includes(params.identifier!.toLowerCase()) ||
        user.email?.toLowerCase().includes(params.identifier!.toLowerCase()) ||
        user.phoneNumber?.includes(params.identifier!)
      );
    }
    
    return filteredUsers;
  }

  async getUserWallets(userId: string): Promise<Wallet[]> {
    return this.mockWallets[userId] || [];
  }

  async getWalletTransactions(userId: string, walletId: string): Promise<Transaction[]> {
    return this.mockTransactions[walletId] || [];
  }

  async getUserData(userId: string): Promise<User> {
    const user = this.mockUsers.find(u => u.id.toString() === userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    return { ...user };
  }

  async deleteUser(userId: string): Promise<void> {
    const index = this.mockUsers.findIndex(u => u.id.toString() === userId);
    if (index !== -1) {
      this.mockUsers[index].deleted = true;
    }
  }

  async blockUser(userId: string): Promise<void> {
    const user = this.mockUsers.find(u => u.id.toString() === userId);
    if (user) {
      user.blocked = true;
      user.status = 'BLOCKED';
    }
  }

  async unblockUser(userId: string): Promise<void> {
    const user = this.mockUsers.find(u => u.id.toString() === userId);
    if (user) {
      user.blocked = false;
      user.status = 'ACTIVE';
    }
  }

  async compensateCustomer(
    companyId: number,
    userId: string,
    walletId: number,
    originWalletId: number,
    compensationRequest: CompensationRequest
  ): Promise<{ message: string; transactionId: string }> {
    const wallet = this.mockWallets[userId]?.find(w => w.id === walletId);
    if (wallet) {
      const amount = parseFloat(compensationRequest.amount);
      wallet.balance = (wallet.balance || 0) + amount;
      wallet.availableBalance = (wallet.availableBalance || 0) + amount;
      
      const newTransaction: Transaction = {
        customerId: userId,
        walletId: walletId.toString(),
        transactionId: `comp${Date.now()}`,
        status: 'completed',
        currency: wallet.currency,
        type: 'compensation',
        amount: amount,
        date: new Date().toISOString()
      };
      
      if (!this.mockTransactions[walletId.toString()]) {
        this.mockTransactions[walletId.toString()] = [];
      }
      
      this.mockTransactions[walletId.toString()].push(newTransaction);
      
      return {
        message: `Successfully compensated user ${userId} with ${amount} ${wallet.currency}`,
        transactionId: newTransaction.transactionId
      };
    }
    
    throw new Error(`Wallet with ID ${walletId} not found for user ${userId}`);
  }

  async listTransactions(walletId: string, params?: TransactionListParams): Promise<Transaction[]> {
    const transactions = this.mockTransactions[walletId] || [];
    
    if (!params) return [...transactions];
    
    return this.filterTransactions(transactions, params);
  }
  
  async getTransactionDetails(transactionId: string): Promise<Transaction> {
    for (const walletId in this.mockTransactions) {
      const transaction = this.mockTransactions[walletId].find(t => t.transactionId === transactionId);
      if (transaction) {
        return { ...transaction };
      }
    }
    
    throw new Error(`Transaction with ID ${transactionId} not found`);
  }

  async cancelTransaction(transactionId: string, cancelRequest: CancelTransactionRequest): Promise<{ message: string }>;
  async cancelTransaction(transactionId: string, reason: string): Promise<{ message: string }>;
  async cancelTransaction(transactionId: string, reasonOrRequest: string | CancelTransactionRequest): Promise<{ message: string }> {
    let reason: string;
    
    if (typeof reasonOrRequest === 'string') {
      reason = reasonOrRequest;
    } else {
      reason = reasonOrRequest.reason;
    }
    
    for (const walletId in this.mockTransactions) {
      const transactions = this.mockTransactions[walletId];
      const transactionIndex = transactions.findIndex(t => t.transactionId === transactionId);
      
      if (transactionIndex !== -1) {
        if (transactions[transactionIndex].status === 'pending') {
          transactions[transactionIndex].status = 'cancelled';
          return { message: `Transaction ${transactionId} has been cancelled` };
        } else {
          throw new Error(`Transaction ${transactionId} cannot be cancelled because it is not in a pending state`);
        }
      }
    }
    
    throw new Error(`Transaction with ID ${transactionId} not found`);
  }

  private filterTransactions(transactions: Transaction[], params: TransactionListParams): Transaction[] {
    let filteredTxns = [...transactions];
    
    if (params.status) {
      filteredTxns = filteredTxns.filter(t => t.status === params.status);
    }
    
    if (params.type) {
      filteredTxns = filteredTxns.filter(t => t.type === params.type);
    }
    
    if (params.currency) {
      filteredTxns = filteredTxns.filter(t => t.currency === params.currency);
    }
    
    if (params.startDate && params.startDate !== '') {
      filteredTxns = filteredTxns.filter(t => t.date && new Date(t.date) >= new Date(params.startDate!));
    }
    
    if (params.endDate && params.endDate !== '') {
      filteredTxns = filteredTxns.filter(t => t.date && new Date(t.date) <= new Date(params.endDate!));
    }
    
    // Basic pagination if requested
    if (params.page !== undefined && params.pageSize !== undefined) {
      const start = (params.page - 1) * params.pageSize;
      return filteredTxns.slice(start, start + params.pageSize);
    }
    
    return filteredTxns;
  }
}
