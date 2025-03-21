import { WaasabiTokenManager } from "./auth/waasabi-token-manager";
import { WaasabiOAuthHttpClient } from "./auth/waasabi-oauth-http-client";

export class WaasabiOAuthClient {
  private tokenManager: WaasabiTokenManager;
  private httpClient: WaasabiOAuthHttpClient;

  constructor(
    clientId: string,
    clientSecret: string,
    tokenUrl: string
  ) {
    this.tokenManager = new WaasabiTokenManager();
    this.httpClient = new WaasabiOAuthHttpClient(clientId, clientSecret, tokenUrl);
  }

  /**
   * Get a valid access token, fetching a new one if necessary
   */
  async getAccessToken(): Promise<string> {
    // If we have a valid token that's not about to expire, return it
    const currentToken = this.tokenManager.getToken();
    if (currentToken) {
      return currentToken;
    }

    // Otherwise, fetch a new token
    console.log('Fetching new OAuth token...');
    
    try {
      const { access_token, expires_in } = await this.httpClient.requestToken();
      this.tokenManager.setToken(access_token, expires_in);
      return access_token;
    } catch (error: any) {
      console.error('Failed to obtain OAuth token:', error);
      throw new Error(`OAuth token request failed: ${error.message}`);
    }
  }

  /**
   * Clear stored tokens (useful for logout or error cases)
   */
  clearTokens(): void {
    this.tokenManager.clearToken();
  }

  /**
   * Check if we currently have what appears to be a valid token
   */
  hasValidToken(): boolean {
    return this.tokenManager.isTokenValid();
  }
}
