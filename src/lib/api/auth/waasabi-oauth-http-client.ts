
import axios, { AxiosInstance } from "axios";

/**
 * HTTP client specifically for OAuth token requests
 */
export class WaasabiOAuthHttpClient {
  private axiosInstance: AxiosInstance;
  private clientId: string;
  private clientSecret: string;
  private tokenUrl: string;

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

  /**
   * Request a new access token using client credentials grant
   */
  public async requestToken(): Promise<{ access_token: string; expires_in: number }> {
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

      return {
        access_token: response.data.access_token,
        expires_in: response.data.expires_in
      };
    } catch (error: any) {
      console.error('Failed to obtain OAuth token:', error);
      throw new Error(`OAuth token request failed: ${error.message}`);
    }
  }
}
