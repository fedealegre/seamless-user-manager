
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

  constructor(client: OAuth2Client, baseUrl: string) {
    this.client = client;
    this.baseUrl = baseUrl;
  }

  private async get<T>(endpoint: string, queryStringParams?: any): Promise<T> {
    try {
      const axiosInstance = await this.client.getAxiosInstance();
      const response = await axiosInstance.get(`${this.baseUrl}${endpoint}`, { params: queryStringParams });
      return response.data;
    } catch (error: any) {
      this.handleApiError(error);
      throw error;
    }
  }

  private async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const axiosInstance = await this.client.getAxiosInstance();
      const response = await axiosInstance.post(`${this.baseUrl}${endpoint}`, data);
      return response.data;
    } catch (error: any) {
      this.handleApiError(error);
      throw error;
    }
  }

  private async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const axiosInstance = await this.client.getAxiosInstance();
      const response = await axiosInstance.put(`${this.baseUrl}${endpoint}`, data);
      return response.data;
    } catch (error: any) {
      this.handleApiError(error);
      throw error;
    }
  }

  private async delete<T = void>(endpoint: string): Promise<T> {
    try {
      const axiosInstance = await this.client.getAxiosInstance();
      const response = await axiosInstance.delete(`${this.baseUrl}${endpoint}`);
      return response.data;
    } catch (error: any) {
      this.handleApiError(error);
      throw error;
    }
  }

  private async patch<T>(endpoint: string, data: any): Promise<T> {
    try {
      const axiosInstance = await this.client.getAxiosInstance();
      const response = await axiosInstance.patch(`${this.baseUrl}${endpoint}`, data);
      return response.data;
    } catch (error: any) {
      this.handleApiError(error);
      throw error;
    }
  }
  
  private handleApiError(error: any): void {
    if (error.response) {
      // Extract error message from response if available
      const message = error.response.data?.message || 'API request failed';
      const statusCode = error.response.status;
      
      // Create more specific error based on status code
      if (statusCode === 400) {
        throw new Error(`Bad Request: ${message}`);
      } else if (statusCode === 401) {
        throw new Error(`Unauthorized: ${message}`);
      } else if (statusCode === 403) {
        throw new Error(`Forbidden: ${message}`);
      } else if (statusCode === 404) {
        throw new Error(`Not Found: ${message}`);
      } else {
        throw new Error(`API Error (${statusCode}): ${message}`);
      }
    } else if (error.request) {
      throw new Error('No response received from API');
    } else {
      throw new Error(`Error setting up request: ${error.message}`);
    }
  }

  // Anti-Fraud Rules API
  async listAntiFraudRules(): Promise<AntiFraudRule[]> {
    return await this.get<AntiFraudRule[]>('/rules');
  }

  async addAntiFraudRule(rule: AntiFraudRule): Promise<void> {
    await this.post<void>('/rules', rule);
  }

  async modifyAntiFraudRule(ruleId: string, rule: AntiFraudRule): Promise<void> {
    await this.put<void>(`/rules/${ruleId}`, rule);
  }

  async deleteAntiFraudRule(ruleId: string): Promise<void> {
    await this.delete(`/rules/${ruleId}`);
  }

  // Audit Logs API
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

    return await this.get<AuditLog[]>('/audit-logs', params);
  }
  
  // Backoffice User Management API
  async listBackofficeUsers(): Promise<BackofficeUser[]> {
    return await this.get<BackofficeUser[]>('/backoffice_users');
  }

  async createBackofficeUser(user: BackofficeUser): Promise<void> {
    await this.post<void>('/backoffice_users', user);
  }

  async blockBackofficeUser(userId: string): Promise<void> {
    await this.post<void>(`/backoffice_users/${userId}/block`, {});
  }

  async unblockBackofficeUser(userId: string): Promise<void> {
    await this.post<void>(`/backoffice_users/${userId}/unblock`, {});
  }

  async deleteBackofficeUser(userId: string): Promise<void> {
    await this.delete(`/backoffice_users/${userId}`);
  }

  async modifyUserRoles(userId: string, roles: string[]): Promise<void> {
    await this.patch<void>(`/backoffice_users/${userId}`, { roles });
  }

  // User Login API
  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const response = await this.post<LoginResponse>('/login', loginRequest);
    return response;
  }

  // User Compensation (This seems to be an additional API not fully covered in the specs)
  async compensateCustomer(
    companyId: number,
    userId: string,
    walletId: number,
    originWalletId: number,
    compensationRequest: CompensationRequest
  ): Promise<{ message: string; transactionId: string }> {
    const response = await this.post<{ message: string; transactionId: string }>(
      `/companies/${companyId}/compensate/customer/${userId}/wallet/${walletId}/origin/${originWalletId}`,
      compensationRequest
    );
    return response;
  }

  // Transactions API
  async listTransactions(walletId: string, params?: TransactionListParams): Promise<Transaction[]> {
    const response = await this.get<Transaction[]>(`/wallets/${walletId}/transactions`, params);
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
    
    const response = await this.post<{ message: string }>(`/transactions/${transactionId}/cancel`, cancelRequest);
    return response;
  }

  async getTransactionDetails(transactionId: string): Promise<Transaction> {
    const response = await this.get<Transaction>(`/transactions/${transactionId}`);
    return response;
  }

  // User Management API
  async searchUsers(params: { userId?: string; publicId?: string; name?: string; surname?: string; identifier?: string }): Promise<User[]> {
    const response = await this.get<User[]>('/customers', params);
    return response;
  }

  async getUserWallets(userId: string): Promise<Wallet[]> {
    const response = await this.get<Wallet[]>(`/customers/${userId}/wallets`);
    return response;
  }

  async getWalletTransactions(userId: string, walletId: string, params?: TransactionListParams): Promise<Transaction[]> {
    const response = await this.get<Transaction[]>(`/customers/${userId}/wallets/${walletId}/transactions`, params);
    return response;
  }

  async getUserData(userId: string): Promise<User> {
    const response = await this.get<User>(`/customers/${userId}`);
    return response;
  }

  async deleteUser(userId: string): Promise<void> {
    await this.delete(`/customers/${userId}`);
  }

  async blockUser(userId: string): Promise<void> {
    await this.post<void>(`/customers/${userId}/block`, {});
  }

  async unblockUser(userId: string): Promise<void> {
    await this.post<void>(`/customers/${userId}/unblock`, {});
  }

  async removeSecurityFactor(userId: string, factorId: string): Promise<void> {
    await this.delete(`/customers/${userId}/auth/security_factor/${factorId}`);
  }
}
