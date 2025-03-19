
import axios, { AxiosInstance } from "axios";

export class OAuth2Client {
  private clientId: string;
  private clientSecret: string;
  private tokenUrl: string;
  private authUrl: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number = 0;
  private axiosInstance: AxiosInstance;
  private scopes: string[] = ["read:users", "write:users"];

  constructor(
    clientId: string, 
    clientSecret: string, 
    tokenUrl: string,
    authUrl: string
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.tokenUrl = tokenUrl;
    this.authUrl = authUrl;
    this.axiosInstance = axios.create({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Check for stored tokens
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
    const expiresAt = localStorage.getItem('expires_at');
    if (expiresAt) {
      this.expiresAt = parseInt(expiresAt, 10);
    }
  }

  getAuthorizationUrl(redirectUri: string): string {
    const params = new URLSearchParams();
    params.append('client_id', this.clientId);
    params.append('redirect_uri', redirectUri);
    params.append('response_type', 'code');
    params.append('scope', this.scopes.join(' '));
    
    return `${this.authUrl}?${params.toString()}`;
  }

  async handleAuthorizationCode(code: string, redirectUri: string): Promise<void> {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', this.clientId);
    params.append('client_secret', this.clientSecret);
    params.append('code', code);
    params.append('redirect_uri', redirectUri);

    const response = await this.axiosInstance.post(this.tokenUrl, params);
    this.setTokensFromResponse(response.data);
  }

  private setTokensFromResponse(data: any): void {
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    this.expiresAt = Date.now() + (data.expires_in * 1000);
    
    // Store tokens in localStorage
    localStorage.setItem('access_token', this.accessToken as string);
    localStorage.setItem('refresh_token', this.refreshToken as string);
    localStorage.setItem('expires_at', this.expiresAt.toString());
  }

  async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error("No refresh token available. User must authenticate again.");
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('client_id', this.clientId);
    params.append('client_secret', this.clientSecret);
    params.append('refresh_token', this.refreshToken);

    try {
      const response = await this.axiosInstance.post(this.tokenUrl, params);
      this.setTokensFromResponse(response.data);
    } catch (error) {
      // If refresh fails, clear tokens and require re-authentication
      this.clearTokens();
      throw new Error("Failed to refresh access token. User must authenticate again.");
    }
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = 0;
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
  }

  async getValidAccessToken(): Promise<string> {
    if (!this.accessToken) {
      throw new Error("No access token available. User must authenticate.");
    }

    // If token is expired or will expire soon (within 5 minutes), refresh it
    if (this.expiresAt - Date.now() < 5 * 60 * 1000) {
      await this.refreshAccessToken();
    }

    return this.accessToken;
  }

  async getAxiosInstance(): Promise<AxiosInstance> {
    try {
      const token = await this.getValidAccessToken();
      return axios.create({
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      throw new Error("Failed to get authenticated Axios instance: " + (error as Error).message);
    }
  }

  isAuthenticated(): boolean {
    return !!this.accessToken && this.expiresAt > Date.now();
  }
}
