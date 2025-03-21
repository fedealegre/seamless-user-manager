import axios, { AxiosInstance } from "axios";

export class WaasabiOAuthClient {
  private clientId: string;
  private clientSecret: string;
  private tokenUrl: string;
  private accessToken: string | null = null;
  private expiresAt: number = 0;
  private axiosInstance: AxiosInstance;

  constructor(
    clientId: string,
    clientSecret: string,
    tokenUrl: string
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.tokenUrl = tokenUrl;
    this.axiosInstance = axios.create({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Check for stored token (for persistence across page reloads)
    const storedToken = localStorage.getItem('waasabi_access_token');
    const storedExpiry = localStorage.getItem('waasabi_token_expires_at');
    
    if (storedToken && storedExpiry) {
      this.accessToken = storedToken;
      this.expiresAt = parseInt(storedExpiry, 10);
    }
  }

  private setTokenFromResponse(data: any): void {
    this.accessToken = data.access_token;
    // Convert expires_in (seconds) to an absolute timestamp (milliseconds)
    this.expiresAt = Date.now() + (data.expires_in * 1000);
    
    // Store token in localStorage
    localStorage.setItem('waasabi_access_token', this.accessToken as string);
    localStorage.setItem('waasabi_token_expires_at', this.expiresAt.toString());
    
    console.log(`OAuth token obtained, expires in ${data.expires_in} seconds`);
  }

  /**
   * Get a valid access token, fetching a new one if necessary
   */
  async getAccessToken(): Promise<string> {
    // If we have a valid token that's not about to expire (buffer of 5 minutes), return it
    if (this.accessToken && this.expiresAt > Date.now() + 5 * 60 * 1000) {
      return this.accessToken;
    }

    // Otherwise, fetch a new token
    console.log('Fetching new OAuth token...');
    
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', this.clientId);
      params.append('scope', 'waasabi/api');

      // Create authorization header from client ID and secret
      const auth = `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`;
      
      const response = await this.axiosInstance.post(this.tokenUrl, params, {
        headers: {
          'Authorization': auth
        }
      });

      this.setTokenFromResponse(response.data);
      return this.accessToken as string;
    } catch (error: any) {
      console.error('Failed to obtain OAuth token:', error);
      throw new Error(`OAuth token request failed: ${error.message}`);
    }
  }

  /**
   * Clear stored tokens (useful for logout or error cases)
   */
  clearTokens(): void {
    this.accessToken = null;
    this.expiresAt = 0;
    
    localStorage.removeItem('waasabi_access_token');
    localStorage.removeItem('waasabi_token_expires_at');
  }

  /**
   * Check if we currently have what appears to be a valid token
   */
  hasValidToken(): boolean {
    return !!this.accessToken && this.expiresAt > Date.now();
  }
}
