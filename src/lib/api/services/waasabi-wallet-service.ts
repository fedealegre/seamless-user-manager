
import { Wallet, Transaction, CompensationRequest } from "../types";
import { WaasabiHttpClient } from "../http/waasabi-http-client";

export class WaasabiWalletService extends WaasabiHttpClient {
  async getUserWallets(userId: string): Promise<Wallet[]> {
    try {
      const response = await this.client.get(`/customers/${userId}/wallets`);
      return response.data;
    } catch (error: any) {
      console.error("Error getting user wallets:", error);
      this.handleApiError(error);
      throw error;
    }
  }

  async getWalletTransactions(userId: string, walletId: string): Promise<Transaction[]> {
    try {
      const response = await this.client.get(`/customers/${userId}/wallets/${walletId}/transactions`);
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
      const response = await this.client.post(
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
}
