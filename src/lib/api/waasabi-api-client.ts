import axios, { AxiosInstance, AxiosRequestConfig, AxiosHeaders } from "axios";
import { User, Wallet, Transaction, CompensationRequest } from "./types";
import { WaasabiOAuthClient } from "./waasabi-oauth-client";

export class WaasabiApiClient {
  private baseUrl: string;
  private customerId: string;
  private axiosInstance: AxiosInstance;
  private oauthClient: WaasabiOAuthClient | null = null;

  constructor(
    baseUrl: string, 
    customerId: string, 
    oauthClient?: WaasabiOAuthClient
  ) {
    this.baseUrl = baseUrl;
    this.customerId = customerId;
    this.oauthClient = oauthClient || null;
    
    // Create the axios instance with default headers
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor to ensure headers are present on every request
    this.axiosInstance.interceptors.request.use(async (config) => {
      // Create a proper Axios headers object if it doesn't exist
      config.headers = config.headers || new AxiosHeaders();
      
      // Set the custom header
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('x-consumer-custom-id', this.customerId);
        
        // Add authorization header if OAuth client is available
        if (this.oauthClient) {
          try {
            const token = await this.oauthClient.getAccessToken();
            config.headers.set('Authorization', `Bearer ${token}`);
          } catch (error) {
            console.error('Failed to get access token for request:', error);
            // Continue with the request even without the token
            // The server will respond with 401 if the token is required
          }
        }
      } else {
        // Fallback for older Axios versions
        // If we can't use set() method, create a new AxiosHeaders instance
        const headers = new AxiosHeaders();
        if (config.headers) {
          // Copy existing headers
          Object.entries(config.headers).forEach(([key, value]) => {
            headers.set(key, value);
          });
        }
        // Add our custom header
        headers.set('x-consumer-custom-id', this.customerId);
        
        // Add authorization header if OAuth client is available
        if (this.oauthClient) {
          try {
            const token = await this.oauthClient.getAccessToken();
            headers.set('Authorization', `Bearer ${token}`);
          } catch (error) {
            console.error('Failed to get access token for request:', error);
          }
        }
        
        config.headers = headers;
      }
      
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, { 
        headers: config.headers,
        params: config.params
      });
      
      return config;
    });

    // Add response interceptor for better error logging
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`API Response for ${response.config.url}: Status ${response.status}`);
        return response;
      },
      (error) => {
        console.error('API Error Response:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
          headers: error.config?.headers
        });
        
        // If we get a 401 (Unauthorized) and we have an OAuth client,
        // clear the tokens to force a refresh on the next request
        if (error.response?.status === 401 && this.oauthClient) {
          console.warn('Received 401, clearing OAuth tokens');
          this.oauthClient.clearTokens();
        }
        
        return Promise.reject(error);
      }
    );
    
    console.log(`WaasabiApiClient initialized with baseURL: ${baseUrl}, customerId: ${customerId}, and OAuth: ${!!oauthClient}`);
  }

  async searchUsers(params: { 
    name?: string;
    surname?: string;
    identifier?: string;
    phoneNumber?: string;
    walletId?: string;
  }): Promise<User[]> {
    try {
      // Make sure we log the parameters and headers
      console.log('Sending searchUsers request with params:', params);
      
      const response = await this.axiosInstance.get('/customers', { params });
      console.log('SearchUsers response:', response.data);
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
    request: CompensationRequest
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
      const message = error.response.data?.message || 
                     error.response.data?.details?.[0]?.error_message || 
                     'API request failed';
      const statusCode = error.response.status;
      
      console.error(`API Error (${statusCode}): ${message}`, error.response.data);
      
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
      console.error('No response received from API', error.request);
      throw new Error('No response received from API');
    } else {
      console.error(`Error setting up request: ${error.message}`, error);
      throw new Error(`Error setting up request: ${error.message}`);
    }
  }
}
