import axios from 'axios';
import { BenefitsListResponse, BenefitDTO, Benefit } from '@/types/benefits';
import { mapDTOToBenefit, mapBenefitToDTO } from '@/lib/benefits-mapper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-sandbox.daxiaplatform.com/backoffice/bo/v1';

// API client instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
  },
});

// Add interceptors
apiClient.interceptors.request.use((config) => {
  // Add authorization token
  const token = import.meta.env.VITE_AUTH_TOKEN || 'eyJhbGciO';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add custom headers for specific operations
  const customerId = import.meta.env.VITE_CUSTOMER_ID || '6752';
  const operatorId = import.meta.env.VITE_OPERATOR_ID || '122444';
  
  if (config.url?.includes('/benefits') && (config.method === 'get' || config.method === 'delete')) {
    config.headers['x-consumer-custom-id'] = customerId;
  }
  
  if (config.method === 'delete') {
    config.headers['operatorId'] = operatorId;
  }
  
  return config;
});

export interface ListBenefitsParams {
  page?: number;
  size?: number;
  title?: string;
  status?: string;
}

export class BenefitsService {
  // List benefits with pagination and filters
  static async listBenefits(params: ListBenefitsParams = {}): Promise<{
    benefits: Benefit[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.size) queryParams.append('size', params.size.toString());
      if (params.title) queryParams.append('title', params.title);
      if (params.status) queryParams.append('status', params.status);

      const response = await apiClient.get<BenefitsListResponse>(`/benefits?${queryParams}`);
      
      return {
        benefits: response.data.content.map(mapDTOToBenefit),
        totalElements: response.data.total_elements,
        totalPages: response.data.total_pages,
        currentPage: response.data.number,
        pageSize: response.data.size
      };
    } catch (error) {
      console.error('Error listing benefits:', error);
      throw new Error('Failed to fetch benefits');
    }
  }

  // Get a single benefit by ID
  static async getBenefit(id: string): Promise<Benefit> {
    try {
      const response = await apiClient.get<BenefitDTO>(`/benefits/${id}`);
      return mapDTOToBenefit(response.data);
    } catch (error) {
      console.error('Error getting benefit:', error);
      throw new Error('Failed to fetch benefit');
    }
  }

  // Create a new benefit
  static async createBenefit(benefit: Benefit): Promise<Benefit> {
    try {
      const dto = mapBenefitToDTO(benefit);
      const response = await apiClient.post<BenefitDTO>('/benefits', dto);
      return mapDTOToBenefit(response.data);
    } catch (error) {
      console.error('Error creating benefit:', error);
      throw new Error('Failed to create benefit');
    }
  }

  // Update an existing benefit
  static async updateBenefit(benefit: Benefit): Promise<Benefit> {
    try {
      const dto = mapBenefitToDTO(benefit);
      const response = await apiClient.patch<BenefitDTO>('/benefits', dto);
      return mapDTOToBenefit(response.data);
    } catch (error) {
      console.error('Error updating benefit:', error);
      throw new Error('Failed to update benefit');
    }
  }

  // Delete a benefit
  static async deleteBenefit(id: string): Promise<void> {
    try {
      await apiClient.delete(`/benefits/${id}`);
    } catch (error) {
      console.error('Error deleting benefit:', error);
      throw new Error('Failed to delete benefit');
    }
  }

  // Reorder benefits
  static async reorderBenefits(reorderData: { id: string; order: number }[]): Promise<void> {
    try {
      await apiClient.patch('/benefits/reorder', { benefits: reorderData });
    } catch (error) {
      console.error('Error reordering benefits:', error);
      throw new Error('Failed to reorder benefits');
    }
  }

  // Bulk upload benefits
  static async bulkUploadBenefits(csvData: string): Promise<{
    success: boolean;
    errors?: Array<{ linea: number; datoConError: string; descripcionError: string }>;
  }> {
    try {
      const response = await apiClient.post('/benefits/bulk-upload', { csvData });
      return response.data;
    } catch (error) {
      console.error('Error bulk uploading benefits:', error);
      throw new Error('Failed to bulk upload benefits');
    }
  }
}