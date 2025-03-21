
import axios, { AxiosInstance } from "axios";
import { User, Wallet, Transaction } from "./types";

export class WaasabiApiClient {
  private baseUrl: string;
  private customerId: string;
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string, customerId: string) {
    this.baseUrl = baseUrl;
    this.customerId = customerId;
    
    // Create the axios instance with default headers
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'x-consumer-custom-id': this.customerId,
        'Content-Type': 'application/json'
      }
    });
  }

  async searchUsers(params: { 
    name?: string;
    surname?: string;
    identifier?: string;
    phoneNumber?: string;
    walletId?: string;
  }): Promise<User[]> {
    try {
      const response = await this.axiosInstance.get('/customers', { params });
      return response.data;
    } catch (error: any) {
      console.error("Error searching users:", error);
      this.handleApiError(error);
      throw error;
    }
  }

  async getUserData(userId: string): Promise<User> {
    try {
      const response = await this.axiosInstance.get(`/customers/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error getting user data:", error);
      this.handleApiError(error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/customers/${userId}`);
    } catch (error: any) {
      console.error("Error deleting user:", error);
      this.handleApiError(error);
      throw error;
    }
  }

  async blockUser(userId: string): Promise<void> {
    try {
      await this.axiosInstance.post(`/customers/${userId}/block`, {});
    } catch (error: any) {
      console.error("Error blocking user:", error);
      this.handleApiError(error);
      throw error;
    }
  }

  async unblockUser(userId: string): Promise<void> {
    try {
      await this.axiosInstance.post(`/customers/${userId}/unblock`, {});
    } catch (error: any) {
      console.error("Error unblocking user:", error);
      this.handleApiError(error);
      throw error;
    }
  }

  async getUserWallets(userId: string): Promise<Wallet[]> {
    try {
      const response = await this.axiosInstance.get(`/customers/${userId}/wallets`);
      return response.data;
    } catch (error: any) {
      console.error("Error getting user wallets:", error);
      this.handleApiError(error);
      throw error;
    }
  }

  async getWalletTransactions(userId: string, walletId: string): Promise<Transaction[]> {
    try {
      const response = await this.axiosInstance.get(`/customers/${userId}/wallets/${walletId}/transactions`);
      return response.data;
    } catch (error: any) {
      console.error("Error getting wallet transactions:", error);
      this.handleApiError(error);
      throw error;
    }
  }

  async compensateCustomer(
    companyId: number,
    userId: string,
    walletId: number,
    originWalletId: number,
    request: {
      amount: string;
      reason: string;
      transaction_code: string;
      admin_user: string;
      transaction_type: string;
    }
  ): Promise<any> {
    try {
      const response = await this.axiosInstance.post(
        `/customers/${userId}/wallets/${walletId}/compensate`,
        request
      );
      return response.data;
    } catch (error: any) {
      console.error("Error compensating customer:", error);
      this.handleApiError(error);
      throw error;
    }
  }

  private handleApiError(error: any): void {
    if (error.response) {
      const message = error.response.data?.message || 'API request failed';
      const statusCode = error.response.status;
      
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
}
