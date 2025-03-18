
import axios, { AxiosInstance } from "axios";

export class OAuth2Client {
  private clientId: string;
  private clientSecret: string;
  private tokenUrl: string;
  private accessToken: string | null = null;
  private axiosInstance: AxiosInstance;

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

  async authenticate(): Promise<void> {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', this.clientId);
    params.append('client_secret', this.clientSecret);

    const response = await this.axiosInstance.post(this.tokenUrl, params);
    this.accessToken = response.data.access_token;
  }

  getAxiosInstance(): AxiosInstance {
    if (!this.accessToken) {
      throw new Error("Client is not authenticated. Call authenticate() method first.");
    }
    
    return axios.create({
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });
  }
}
