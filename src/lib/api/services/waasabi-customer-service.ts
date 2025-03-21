
import { User } from "../types";
import { WaasabiHttpClient } from "../http/waasabi-http-client";

export class WaasabiCustomerService extends WaasabiHttpClient {
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
      
      const response = await this.client.get('/customers', { params });
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
      const response = await this.client.get(`/customers/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error getting user data:", error);
      this.handleApiError(error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.client.delete(`/customers/${userId}`);
    } catch (error: any) {
      console.error("Error deleting user:", error);
      this.handleApiError(error);
      throw error;
    }
  }

  async blockUser(userId: string): Promise<void> {
    try {
      await this.client.post(`/customers/${userId}/block`, {});
    } catch (error: any) {
      console.error("Error blocking user:", error);
      this.handleApiError(error);
      throw error;
    }
  }

  async unblockUser(userId: string): Promise<void> {
    try {
      await this.client.post(`/customers/${userId}/unblock`, {});
    } catch (error: any) {
      console.error("Error unblocking user:", error);
      this.handleApiError(error);
      throw error;
    }
  }
}
