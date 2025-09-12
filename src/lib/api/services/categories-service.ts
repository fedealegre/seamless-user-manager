import { Category, CategoryDTO } from '@/types/category';
import { apiClient, waasabiClient } from '@/lib/api/http-client';

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
      const response = await waasabiClient.post<CategoryDTO>('/benefits/category', dto);
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
      const response = await waasabiClient.patch<CategoryDTO>('/benefits/category', dto);
      return mapDTOToCategory(response.data, 0);
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('Failed to update category');
    }
  }

  // Delete a category
  static async deleteCategory(code: string): Promise<void> {
    try {
      const userId = import.meta.env.VITE_USER_ID || '231321321231';
      await waasabiClient.delete(`/benefits/category/${code}`, {
        headers: {
          'x-consumer-daxia-user-id': userId
        }
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category');
    }
  }
}