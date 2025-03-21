
/**
 * Manages OAuth token storage and retrieval
 */
export class WaasabiTokenManager {
  private accessToken: string | null = null;
  private expiresAt: number = 0;
  private storagePrefix: string = 'waasabi_';

  constructor() {
    this.loadStoredToken();
  }

  /**
   * Load any previously stored token from localStorage
   */
  private loadStoredToken(): void {
    const storedToken = localStorage.getItem(`${this.storagePrefix}access_token`);
    const storedExpiry = localStorage.getItem(`${this.storagePrefix}token_expires_at`);
    
    if (storedToken && storedExpiry) {
      this.accessToken = storedToken;
      this.expiresAt = parseInt(storedExpiry, 10);
    }
  }

  /**
   * Store a new token in memory and localStorage
   */
  public setToken(accessToken: string, expiresIn: number): void {
    this.accessToken = accessToken;
    // Convert expires_in (seconds) to an absolute timestamp (milliseconds)
    this.expiresAt = Date.now() + (expiresIn * 1000);
    
    // Store token in localStorage
    localStorage.setItem(`${this.storagePrefix}access_token`, this.accessToken);
    localStorage.setItem(`${this.storagePrefix}token_expires_at`, this.expiresAt.toString());
    
    console.log(`OAuth token obtained, expires in ${expiresIn} seconds`);
  }

  /**
   * Get the current token if it's valid
   */
  public getToken(): string | null {
    if (this.isTokenValid()) {
      return this.accessToken;
    }
    return null;
  }

  /**
   * Check if the current token is valid and not expired
   * @param bufferSeconds - Buffer time in seconds before expiration to consider token invalid
   */
  public isTokenValid(bufferSeconds: number = 300): boolean {
    return !!this.accessToken && this.expiresAt > Date.now() + (bufferSeconds * 1000);
  }

  /**
   * Clear stored tokens
   */
  public clearToken(): void {
    this.accessToken = null;
    this.expiresAt = 0;
    
    localStorage.removeItem(`${this.storagePrefix}access_token`);
    localStorage.removeItem(`${this.storagePrefix}token_expires_at`);
  }
}
