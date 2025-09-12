import { BenefitsListResponse, BenefitDTO, Benefit } from '@/types/benefits';
import { mapDTOToBenefit, mapBenefitToDTO } from '@/lib/benefits-mapper';
import { apiClient } from '@/lib/api/http-client';

// Add specific headers for benefits operations
const addBenefitsHeaders = (config: any) => {
  const operatorId = import.meta.env.VITE_OPERATOR_ID || '122444';
  const method = (config.method || '').toLowerCase();
  
  if (config.url?.includes('/benefits')) {
    if (['delete', 'patch', 'post'].includes(method)) {
      config.headers['operatorId'] = operatorId;
    }
  }
  
  return config;
};

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
      
      // Add timestamp to bust cache
      queryParams.append('_t', Date.now().toString());

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
      const config = { url: `/benefits/${id}`, method: 'get', headers: {} };
      addBenefitsHeaders(config);
      const response = await apiClient.get<BenefitDTO>(`/benefits/${id}`, { headers: config.headers });
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
      const config = { url: '/benefits', method: 'post', headers: {} };
      addBenefitsHeaders(config);
      const response = await apiClient.post<BenefitDTO>('/benefits', dto, { headers: config.headers });
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
      const config = { url: '/benefits', method: 'patch', headers: {} };
      addBenefitsHeaders(config);
      const response = await apiClient.patch<BenefitDTO>('/benefits', dto, { headers: config.headers });
      return mapDTOToBenefit(response.data);
    } catch (error) {
      console.error('Error updating benefit:', error);
      throw new Error('Failed to update benefit');
    }
  }

  // Update specific fields of a benefit
  static async updateBenefitFields(id: string, fields: Record<string, any>): Promise<void> {
    try {
      const config = { url: `/benefits/${id}`, method: 'patch', headers: {} };
      addBenefitsHeaders(config);
      await apiClient.patch(`/benefits/${id}`, fields, { headers: config.headers });
    } catch (error) {
      console.error('Error updating benefit fields:', error);
      throw new Error('Failed to update benefit fields');
    }
  }

  // Delete a benefit
  static async deleteBenefit(id: string): Promise<void> {
    try {
      const config = { url: `/benefits/${id}`, method: 'delete', headers: {} };
      addBenefitsHeaders(config);
      await apiClient.delete(`/benefits/${id}`, { headers: config.headers });
    } catch (error) {
      console.error('Error deleting benefit:', error);
      throw new Error('Failed to delete benefit');
    }
  }

  // Bulk upload benefits
  static async bulkUploadBenefits(csvData: string): Promise<{
    success: boolean;
    errors?: Array<{ linea: number; datoConError: string; descripcionError: string }>;
  }> {
    try {
      const config = { url: '/benefits/bulk-upload', method: 'post', headers: {} };
      addBenefitsHeaders(config);
      const response = await apiClient.post('/benefits/bulk-upload', { csvData }, { headers: config.headers });
      return response.data;
    } catch (error) {
      console.error('Error bulk uploading benefits:', error);
      throw new Error('Failed to bulk upload benefits');
    }
  }
}