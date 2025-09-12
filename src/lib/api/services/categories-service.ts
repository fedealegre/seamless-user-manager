import axios from 'axios';
import { Category, CategoryDTO } from '@/types/category';

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
  const userId = import.meta.env.VITE_USER_ID || '231321321231';
  
  if (config.url?.includes('/category') && config.method === 'get') {
    config.headers['x-consumer-custom-id'] = customerId;
  }
  
  if (config.method === 'delete') {
    config.headers['x-consumer-daxia-user-id'] = userId;
  }
  
  return config;
});

// Mapper functions
const mapDTOToCategory = (dto: CategoryDTO, index: number): Category => ({
  id: `${dto.code}`,
  code: dto.code,
  nombre: dto.name,
  descripcion: '', // Not provided by API
  fechaCreacion: new Date(),
});

const mapCategoryToDTO = (category: Category): { code: string; name: string } => ({
  code: category.code,
  name: category.nombre,
});

export class CategoriesService {
  // List all categories
  static async listCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<CategoryDTO[]>('/benefits/category');
      return response.data.map((dto, index) => mapDTOToCategory(dto, index));
    } catch (error) {
      console.error('Error listing categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  // Create a new category
  static async createCategory(category: Category): Promise<Category> {
    try {
      const dto = mapCategoryToDTO(category);
      // Note: Different base URL for create/update operations
      const createClient = axios.create({
        baseURL: 'https://api-sandbox.waasabi.io/bancorbff/api/v1/bo',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_AUTH_TOKEN || 'eyJhbGciO'}`,
        },
      });
      
      const response = await createClient.post<CategoryDTO>('/benefits/category', dto);
      return mapDTOToCategory(response.data, 0);
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category');
    }
  }

  // Update an existing category
  static async updateCategory(category: Category): Promise<Category> {
    try {
      const dto = mapCategoryToDTO(category);
      // Note: Different base URL for create/update operations
      const updateClient = axios.create({
        baseURL: 'https://api-sandbox.waasabi.io/bancorbff/api/v1/bo',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_AUTH_TOKEN || 'eyJhbGciO'}`,
        },
      });
      
      const response = await updateClient.patch<CategoryDTO>('/benefits/category', dto);
      return mapDTOToCategory(response.data, 0);
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('Failed to update category');
    }
  }

  // Delete a category
  static async deleteCategory(code: string): Promise<void> {
    try {
      // Note: Different base URL for delete operations
      const deleteClient = axios.create({
        baseURL: 'https://api-sandbox.waasabi.io/bancorbff/api/v1/bo',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_AUTH_TOKEN || 'eyJhbGciO'}`,
          'x-consumer-daxia-user-id': import.meta.env.VITE_USER_ID || '231321321231',
        },
      });
      
      await deleteClient.delete(`/benefits/category/${code}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category');
    }
  }
}