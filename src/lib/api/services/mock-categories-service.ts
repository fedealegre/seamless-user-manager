import { Category } from '@/types/category';

// Mock data aligned with backend structure
let mockCategories: Category[] = [
  {
    id: "001",
    code: "001",
    nombre: "librería",
    descripcion: "Librerías y material educativo",
    fechaCreacion: new Date("2024-01-01"),
  },
  {
    id: "002",
    code: "002",
    nombre: "carnicería",
    descripcion: "Carnicerías y productos cárnicos",
    fechaCreacion: new Date("2024-01-02"),
  },
  {
    id: "003",
    code: "003",
    nombre: "juguetería",
    descripcion: "Jugueterías y artículos para niños",
    fechaCreacion: new Date("2024-01-03"),
  },
  {
    id: "004",
    code: "004",
    nombre: "supermercado",
    descripcion: "Supermercados y tiendas de comestibles",
    fechaCreacion: new Date("2024-01-04"),
  },
  {
    id: "005",
    code: "005",
    nombre: "panadería",
    descripcion: "Panaderías y productos de panadería",
    fechaCreacion: new Date("2024-01-05"),
  },
  {
    id: "006",
    code: "006",
    nombre: "farmacia",
    descripcion: "Farmacias y productos farmacéuticos",
    fechaCreacion: new Date("2024-01-06"),
  },
  {
    id: "007",
    code: "007",
    nombre: "deportes",
    descripcion: "Tiendas de deportes y artículos deportivos",
    fechaCreacion: new Date("2024-01-07"),
  },
  {
    id: "008",
    code: "008",
    nombre: "verdulería",
    descripcion: "Verdulerías y productos frescos",
    fechaCreacion: new Date("2024-01-08"),
  },
  {
    id: "009",
    code: "009",
    nombre: "combustible",
    descripcion: "Estaciones de servicio y combustibles",
    fechaCreacion: new Date("2024-01-09"),
  },
  {
    id: "010",
    code: "010",
    nombre: "café",
    descripcion: "Cafeterías y tiendas de café",
    fechaCreacion: new Date("2024-01-10"),
  },
];

export class MockCategoriesService {
  // List all categories
  static async listCategories(): Promise<Category[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockCategories];
  }

  // Create a new category
  static async createCategory(category: Category): Promise<Category> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newCategory: Category = {
      ...category,
      id: category.code,
      fechaCreacion: new Date(),
    };

    mockCategories.push(newCategory);
    return newCategory;
  }

  // Update an existing category
  static async updateCategory(category: Category): Promise<Category> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const index = mockCategories.findIndex(c => c.code === category.code);
    if (index === -1) {
      throw new Error('Category not found');
    }

    const updatedCategory: Category = {
      ...category,
      id: category.code,
    };

    mockCategories[index] = updatedCategory;
    return updatedCategory;
  }

  // Delete a category
  static async deleteCategory(code: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const index = mockCategories.findIndex(c => c.code === code);
    if (index === -1) {
      throw new Error('Category not found');
    }

    mockCategories.splice(index, 1);
  }
}