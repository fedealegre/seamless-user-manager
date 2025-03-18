
import axios, { AxiosInstance } from "axios";
import { 
  AntiFraudRule, 
  AuditLog, 
  BackofficeUser, 
  CancelTransactionRequest, 
  CompensationRequest, 
  LoginRequest, 
  LoginResponse,

  Transaction, 
  User, 
  Wallet 
} from "./api-types";

class OAuth2Client {
  private clientId: string;
  private clientSecret: string;
  private tokenUrl: string;
  private accessToken: string | null = null;
  private axiosInstance: AxiosInstance;

  constructor(clientId: string, clientSecret: string, tokenUrl: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.tokenUrl = tokenUrl;
    this.axiosInstance = axios.create({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  async authenticate(): Promise<void> {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', this.clientId);
    params.append('client_secret', this.clientSecret);

    const response = await this.axiosInstance.post(this.tokenUrl, params);
    this.accessToken = response.data.access_token;
  }

  getAxiosInstance(): AxiosInstance {
    if (!this.accessToken) {
      throw new Error("Client is not authenticated. Call authenticate() method first.");
    }
    
    return axios.create({
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });
  }
}

export class ApiClient {
  private client: OAuth2Client;
  private baseUrl: string;

  constructor(client: OAuth2Client, baseUrl: string) {
    this.client = client;
    this.baseUrl = baseUrl;
  }

  // Helper methods for API requests
  private async get(endpoint: string, queryStringParams?: any): Promise<any> {
    const axiosInstance = this.client.getAxiosInstance();
    const response = await axiosInstance.get(`${this.baseUrl}${endpoint}`, { params: queryStringParams });
    return response.data;
  }

  private async post(endpoint: string, data: any): Promise<any> {
    const axiosInstance = this.client.getAxiosInstance();
    const response = await axiosInstance.post(`${this.baseUrl}${endpoint}`, data);
    return response.data;
  }

  private async put(endpoint: string, data: any): Promise<any> {
    const axiosInstance = this.client.getAxiosInstance();
    const response = await axiosInstance.put(`${this.baseUrl}${endpoint}`, data);
    return response.data;
  }

  private async delete(endpoint: string): Promise<void> {
    const axiosInstance = this.client.getAxiosInstance();
    await axiosInstance.delete(`${this.baseUrl}${endpoint}`);
  }

  private async patch(endpoint: string, data: any): Promise<any> {
    const axiosInstance = this.client.getAxiosInstance();
    const response = await axiosInstance.patch(`${this.baseUrl}${endpoint}`, data);
    return response.data;
  }

  // List all anti-fraud rules
  async listAntiFraudRules(): Promise<AntiFraudRule[]> {
    const response = await this.get('/rules');
    return response;
  }

  // Add a new anti-fraud rule
  async addAntiFraudRule(rule: AntiFraudRule): Promise<void> {
    await this.post('/rules', rule);
  }

  // Modify an existing anti-fraud rule
  async modifyAntiFraudRule(ruleId: string, rule: AntiFraudRule): Promise<void> {
    await this.put(`/rules/${ruleId}`, rule);
  }

  // Delete an anti-fraud rule
  async deleteAntiFraudRule(ruleId: string): Promise<void> {
    await this.delete(`/rules/${ruleId}`);
  }

  // Method to retrieve audit logs
  async getAuditLogs(
    startDate?: string,
    endDate?: string,
    user?: string,
    operationType?: string
  ): Promise<AuditLog[]> {
    const params: Record<string, string> = {};
    
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (user) params.user = user;
    if (operationType) params.operationType = operationType;

    return await this.get('/audit-logs', params);
  }
  
  // List all backoffice users
  async listBackofficeUsers(): Promise<BackofficeUser[]> {
    const response = await this.get('/backoffice_users');
    return response;
  }

  // Create a new backoffice user
  async createBackofficeUser(user: BackofficeUser): Promise<void> {
    await this.post('/backoffice_users', user);
  }

  // Block a backoffice user
  async blockBackofficeUser(userId: string): Promise<void> {
    await this.post(`/backoffice_users/${userId}/block`, {});
  }

  // Unblock a backoffice user
  async unblockBackofficeUser(userId: string): Promise<void> {
    await this.post(`/backoffice_users/${userId}/unblock`, {});
  }

  // Delete a backoffice user
  async deleteBackofficeUser(userId: string): Promise<void> {
    await this.delete(`/backoffice_users/${userId}`);
  }

  // Modify the roles of a backoffice user
  async modifyUserRoles(userId: string, roles: string[]): Promise<void> {
    await this.patch(`/backoffice_users/${userId}`, { roles });
  }

  // User login
  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const response = await this.post('/login', loginRequest);
    return response;
  }

  // Compensate a customer by transferring funds to their wallet
  async compensateCustomer(
    companyId: number,
    userId: string,
    walletId: number,
    originWalletId: number,
    compensationRequest: CompensationRequest
  ): Promise<{ message: string; transactionId: string }> {
    const response = await this.post(
      `/companies/${companyId}/compensate/customer/${userId}/wallet/${walletId}/origin/${originWalletId}`,
      compensationRequest
    );
    return response;
  }

  // Cancel a pending transaction
  async cancelTransaction(transactionId: string, cancelRequest: CancelTransactionRequest): Promise<{ message: string }> {
    const response = await this.post(`/transactions/${transactionId}/cancel`, cancelRequest);
    return response;
  }

  // Search for users based on various criteria
  async searchUsers(params: { userId?: string; publicId?: string; name?: string; surname?: string; identifier?: string }): Promise<User[]> {
    const response = await this.get('/customers', params);
    return response;
  }

  // Retrieve wallets for a user
  async getUserWallets(userId: string): Promise<Wallet[]> {
    const response = await this.get(`/customers/${userId}/wallets`);
    return response;
  }

  // Retrieve transactions for a specific wallet
  async getWalletTransactions(userId: string, walletId: string): Promise<Transaction[]> {
    const response = await this.get(`/customers/${userId}/wallets/${walletId}/transactions`);
    return response;
  }

  // Retrieve user data
  async getUserData(userId: string): Promise<User> {
    const response = await this.get(`/customers/${userId}`);
    return response;
  }

  // Delete a user
  async deleteUser(userId: string): Promise<void> {
    await this.delete(`/customers/${userId}`);
  }

  // Block a user
  async blockUser(userId: string): Promise<void> {
    await this.post(`/customers/${userId}/block`, {});
  }

  // Unblock a user
  async unblockUser(userId: string): Promise<void> {
    await this.post(`/customers/${userId}/unblock`, {});
  }

  // Remove a security factor from a user
  async removeSecurityFactor(userId: string, factorId: string): Promise<void> {
    await this.delete(`/customers/${userId}/auth/security_factor/${factorId}`);
  }
}

// Mock API service for development
export class MockApiClient {
  private mockUsers: User[] = [
    { id: 1, companyId: 1, username: 'john.doe', name: 'John', surname: 'Doe', email: 'john.doe@example.com', phoneNumber: '+1234567890', status: 'ACTIVE' },
    { id: 2, companyId: 1, username: 'jane.smith', name: 'Jane', surname: 'Smith', email: 'jane.smith@example.com', phoneNumber: '+1987654321', status: 'ACTIVE' },
    { id: 3, companyId: 1, username: 'robert.johnson', name: 'Robert', surname: 'Johnson', email: 'robert.johnson@example.com', phoneNumber: '+1122334455', status: 'BLOCKED' }
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
    { id: 'inactive1', name: 'Inactive', surname: 'User', roles: ['support'], state: 'blocked', last_login: '2023-04-15T09:20:33Z' }
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

  // List all anti-fraud rules
  async listAntiFraudRules(): Promise<AntiFraudRule[]> {
    return [...this.mockAntiFraudRules];
  }

  // Add a new anti-fraud rule
  async addAntiFraudRule(rule: AntiFraudRule): Promise<void> {
    const newRule = { ...rule, id: `rule${this.mockAntiFraudRules.length + 1}` };
    this.mockAntiFraudRules.push(newRule);
  }

  // Modify an existing anti-fraud rule
  async modifyAntiFraudRule(ruleId: string, rule: AntiFraudRule): Promise<void> {
    const index = this.mockAntiFraudRules.findIndex(r => r.id === ruleId);
    if (index !== -1) {
      this.mockAntiFraudRules[index] = { ...rule, id: ruleId };
    }
  }

  // Delete an anti-fraud rule
  async deleteAntiFraudRule(ruleId: string): Promise<void> {
    const index = this.mockAntiFraudRules.findIndex(r => r.id === ruleId);
    if (index !== -1) {
      this.mockAntiFraudRules.splice(index, 1);
    }
  }

  // Method to retrieve audit logs
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
      filteredLogs = filteredLogs.filter(log => log.user.includes(user));
    }
    
    if (operationType) {
      filteredLogs = filteredLogs.filter(log => log.operationType === operationType);
    }
    
    return filteredLogs;
  }
  
  // List all backoffice users
  async listBackofficeUsers(): Promise<BackofficeUser[]> {
    return [...this.mockBackofficeUsers];
  }

  // Create a new backoffice user
  async createBackofficeUser(user: BackofficeUser): Promise<void> {
    const newUser = { ...user, id: `user${this.mockBackofficeUsers.length + 1}` };
    this.mockBackofficeUsers.push(newUser);
  }

  // Block a backoffice user
  async blockBackofficeUser(userId: string): Promise<void> {
    const user = this.mockBackofficeUsers.find(u => u.id === userId);
    if (user) {
      user.state = 'blocked';
    }
  }

  // Unblock a backoffice user
  async unblockBackofficeUser(userId: string): Promise<void> {
    const user = this.mockBackofficeUsers.find(u => u.id === userId);
    if (user) {
      user.state = 'active';
    }
  }

  // Delete a backoffice user
  async deleteBackofficeUser(userId: string): Promise<void> {
    const index = this.mockBackofficeUsers.findIndex(u => u.id === userId);
    if (index !== -1) {
      this.mockBackofficeUsers.splice(index, 1);
    }
  }

  // Modify the roles of a backoffice user
  async modifyUserRoles(userId: string, roles: string[]): Promise<void> {
    const user = this.mockBackofficeUsers.find(u => u.id === userId);
    if (user) {
      user.roles = [...roles];
    }
  }

  // User login - Mock implementation for development
  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    // Simplified mock login that always succeeds with the same token
    return {
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      expiresIn: 3600,
      user: {
        id: "admin1",
        name: "Admin",
        surname: "User",
        roles: ["admin", "support"],
        state: "active",
        last_login: new Date().toISOString()
      }
    };
  }

  // Search for users based on various criteria
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

  // Retrieve wallets for a user
  async getUserWallets(userId: string): Promise<Wallet[]> {
    return this.mockWallets[userId] || [];
  }

  // Retrieve transactions for a specific wallet
  async getWalletTransactions(userId: string, walletId: string): Promise<Transaction[]> {
    return this.mockTransactions[walletId] || [];
  }

  // Retrieve user data
  async getUserData(userId: string): Promise<User> {
    const user = this.mockUsers.find(u => u.id.toString() === userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    return { ...user };
  }

  // Delete a user
  async deleteUser(userId: string): Promise<void> {
    const index = this.mockUsers.findIndex(u => u.id.toString() === userId);
    if (index !== -1) {
      this.mockUsers[index].deleted = true;
    }
  }

  // Block a user
  async blockUser(userId: string): Promise<void> {
    const user = this.mockUsers.find(u => u.id.toString() === userId);
    if (user) {
      user.blocked = true;
      user.status = 'BLOCKED';
    }
  }

  // Unblock a user
  async unblockUser(userId: string): Promise<void> {
    const user = this.mockUsers.find(u => u.id.toString() === userId);
    if (user) {
      user.blocked = false;
      user.status = 'ACTIVE';
    }
  }

  // Mock implementation of removeSecurityFactor
  async removeSecurityFactor(userId: string, factorId: string): Promise<void> {
    // In a real implementation, this would remove a security factor from the user
    console.log(`Mock removal of security factor ${factorId} for user ${userId}`);
  }

  // Mock implementation of compensateCustomer
  async compensateCustomer(
    companyId: number,
    userId: string,
    walletId: number,
    originWalletId: number,
    compensationRequest: CompensationRequest
  ): Promise<{ message: string; transactionId: string }> {
    // Find the wallet and update its balance
    const wallet = this.mockWallets[userId]?.find(w => w.id === walletId);
    if (wallet) {
      const amount = parseFloat(compensationRequest.amount);
      wallet.balance = (wallet.balance || 0) + amount;
      wallet.availableBalance = (wallet.availableBalance || 0) + amount;
      
      // Create a new transaction record
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

  // Mock implementation of cancelTransaction
  async cancelTransaction(transactionId: string, cancelRequest: CancelTransactionRequest): Promise<{ message: string }> {
    // Find the transaction in all wallets
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
}

// Export a singleton instance for use throughout the app
export const apiService = new MockApiClient();
