
import axios, { AxiosInstance, AxiosRequestConfig, AxiosHeaders } from "axios";
import { WaasabiOAuthClient } from "../waasabi-oauth-client";

export class WaasabiHttpClient {
  private baseUrl: string;
  private customerId: string;
  private axiosInstance: AxiosInstance;
  private oauthClient: WaasabiOAuthClient | null = null;
  private useCustomIdHeader: boolean;

  constructor(
    baseUrl: string, 
    customerId: string, 
    oauthClient?: WaasabiOAuthClient
  ) {
    this.baseUrl = baseUrl;
    this.customerId = customerId;
    this.oauthClient = oauthClient || null;
    
    // Determine if we should use the x-consumer-custom-id header
    // Don't use it for the sandbox/production environment
    this.useCustomIdHeader = !baseUrl.includes('api-sandbox.waasabi.io');
    
    // Create the axios instance with default headers
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Add request interceptor to ensure headers are present on every request
    this.axiosInstance.interceptors.request.use(async (config) => {
      // Create a proper Axios headers object if it doesn't exist
      config.headers = config.headers || new AxiosHeaders();
      
      // Set the custom header only for environments that need it
      if (this.useCustomIdHeader && config.headers && typeof config.headers.set === 'function') {
        config.headers.set('x-consumer-custom-id', this.customerId);
      }
      
      // Add authorization header if OAuth client is available
      if (this.oauthClient && config.headers && typeof config.headers.set === 'function') {
        try {
          const token = await this.oauthClient.getAccessToken();
          config.headers.set('Authorization', `Bearer ${token}`);
        } catch (error) {
          console.error('Failed to get access token for request:', error);
          // Continue with the request even without the token
          // The server will respond with 401 if the token is required
        }
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
  }

  // Expose the axios instance for API services to use
  protected get client(): AxiosInstance {
    return this.axiosInstance;
  }

  // Helper method to handle API errors
  protected handleApiError(error: any): void {
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
