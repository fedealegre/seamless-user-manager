import axios, { AxiosInstance } from "axios";
import { OAuth2Client } from "./oauth-client";
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

export class ApiClient {
  private client: OAuth2Client;
  private baseUrl: string;
  private userCredentials: Record<string, string> = {};
  private mockBackofficeUsers: BackofficeUser[] = [];

  constructor(client: OAuth2Client, baseUrl: string) {
    this.client = client;
    this.baseUrl = baseUrl;
    
    // Initialize mock data - this would typically come from the server
    this.userCredentials = {
      'admin': 'password123',
      'support': 'support123',
      'finance': 'finance123',
      'fede.alegre': 'backoffice'
    };
    
    this.mockBackofficeUsers = [
      { id: 'admin1', name: 'Admin', surname: 'User', roles: ['admin', 'support'], state: 'active', last_login: '2023-05-22T08:30:45Z' },
      { id: 'support1', name: 'Support', surname: 'User', roles: ['support'], state: 'active', last_login: '2023-05-21T14:15:22Z' },
      { id: 'finance1', name: 'Finance', surname: 'User', roles: ['finance'], state: 'active', last_login: '2023-05-20T11:45:10Z' },
      { id: 'inactive1', name: 'Inactive', surname: 'User', roles: ['support'], state: 'blocked', last_login: '2023-04-15T09:20:33Z' },
      { id: 'fede', name: 'Federico', surname: 'Alegre', roles: ['admin', 'support', 'finance'], state: 'active', last_login: '2023-10-01T09:00:00Z' }
    ];
  }

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

  async listAntiFraudRules(): Promise<AntiFraudRule[]> {
    const response = await this.get('/rules');
    return response;
  }

  async addAntiFraudRule(rule: AntiFraudRule): Promise<void> {
    await this.post('/rules', rule);
  }

  async modifyAntiFraudRule(ruleId: string, rule: AntiFraudRule): Promise<void> {
    await this.put(`/rules/${ruleId}`, rule);
  }

  async deleteAntiFraudRule(ruleId: string): Promise<void> {
    await this.delete(`/rules/${ruleId}`);
  }

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
  
  async listBackofficeUsers(): Promise<BackofficeUser[]> {
    const response = await this.get('/backoffice_users');
    return response;
  }

  async createBackofficeUser(user: BackofficeUser): Promise<void> {
    await this.post('/backoffice_users', user);
  }

  async blockBackofficeUser(userId: string): Promise<void> {
    await this.post(`/backoffice_users/${userId}/block`, {});
  }

  async unblockBackofficeUser(userId: string): Promise<void> {
    await this.post(`/backoffice_users/${userId}/unblock`, {});
  }

  async deleteBackofficeUser(userId: string): Promise<void> {
    await this.delete(`/backoffice_users/${userId}`);
  }

  async modifyUserRoles(userId: string, roles: string[]): Promise<void> {
    await this.patch(`/backoffice_users/${userId}`, { roles });
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

  async listTransactions(walletId: string, params?: TransactionListParams): Promise<Transaction[]> {
    const response = await this.get(`/wallets/${walletId}/transactions`, params);
    return response;
  }

  async cancelTransaction(transactionId: string, cancelRequest: CancelTransactionRequest): Promise<{ message: string }>;
  async cancelTransaction(transactionId: string, reason: string): Promise<{ message: string }>;
  async cancelTransaction(transactionId: string, reasonOrRequest: string | CancelTransactionRequest): Promise<{ message: string }> {
    let cancelRequest: CancelTransactionRequest;
    
    if (typeof reasonOrRequest === 'string') {
      cancelRequest = { reason: reasonOrRequest };
    } else {
      cancelRequest = reasonOrRequest;
    }
    
    const response = await this.post(`/transactions/${transactionId}/cancel`, cancelRequest);
    return response;
  }

  async getTransactionDetails(transactionId: string): Promise<Transaction> {
    const response = await this.get(`/transactions/${transactionId}`);
    return response;
  }

  async searchUsers(params: { userId?: string; publicId?: string; name?: string; surname?: string; identifier?: string }): Promise<User[]> {
    const response = await this.get('/customers', params);
    return response;
  }

  async getUserWallets(userId: string): Promise<Wallet[]> {
    const response = await this.get(`/customers/${userId}/wallets`);
    return response;
  }

  async getWalletTransactions(userId: string, walletId: string, params?: TransactionListParams): Promise<Transaction[]> {
    const response = await this.get(`/customers/${userId}/wallets/${walletId}/transactions`, params);
    return response;
  }

  async getUserData(userId: string): Promise<User> {
    const response = await this.get(`/customers/${userId}`);
    return response;
  }

  async deleteUser(userId: string): Promise<void> {
    await this.delete(`/customers/${userId}`);
  }

  async blockUser(userId: string): Promise<void> {
    await this.post(`/customers/${userId}/block`, {});
  }

  async unblockUser(userId: string): Promise<void> {
    await this.post(`/customers/${userId}/unblock`, {});
  }

  async removeSecurityFactor(userId: string, factorId: string): Promise<void> {
    await this.delete(`/customers/${userId}/auth/security_factor/${factorId}`);
  }
}
