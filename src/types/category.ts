export interface Category {
  id: string;
  code: string;
  nombre: string;
  descripcion?: string;
  fechaCreacion: Date;
}

export interface CategoryDTO {
  code: string;
  name: string;
}

export interface CreateCategoryRequest {
  code: string;
  name: string;
}

export interface UpdateCategoryRequest {
  code: string;
  name: string;
}