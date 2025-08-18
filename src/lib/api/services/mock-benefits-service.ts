import { Benefit } from '@/types/benefits';

export interface ListBenefitsParams {
  page?: number;
  size?: number;
  title?: string;
  status?: string;
}

// Mock data aligned with backend structure
let mockBenefits: Benefit[] = [
  {
    id: '1',
    code: 'BEN001',
    version: 1,
    tipo: 'Cashback',
    titulo: 'Cashback en Supermercados',
    descripcion: 'Obtén 5% de cashback en todas tus compras en supermercados',
    descripcionExtendida: 'Disfruta de un 5% de cashback en todas tus compras realizadas en supermercados participantes. El cashback se acreditará automáticamente en tu cuenta dentro de 24 horas.',
    legales: 'Válido para compras realizadas con tarjeta de débito o crédito. Máximo $50.000 por transacción. Promoción válida hasta agotar stock.',
    valorPorcentaje: 5,
    topePorCompra: 50000,
    imagen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    orden: 1,
    categoria: 'Alimentación',
    mcc: ['5411', '5499'],
    fechaInicio: new Date('2024-01-01'),
    fechaFin: new Date('2024-12-31'),
    estado: 'activo',
    fechaCreacion: new Date('2024-01-01T10:00:00Z'),
    fechaActualizacion: new Date('2024-01-01T10:00:00Z'),
  },
  {
    id: '2',
    code: 'BEN002',
    version: 1,
    tipo: 'Cashback',
    titulo: 'Cashback en Gasolineras',
    descripcion: 'Recibe 3% de cashback en todas tus cargas de combustible',
    descripcionExtendida: 'Obtén un 3% de cashback en todas tus cargas de combustible en estaciones de servicio participantes. Ideal para tus viajes y uso diario.',
    legales: 'Válido para compras de combustible únicamente. No incluye compras en tienda de conveniencia. Máximo $30.000 por transacción.',
    valorPorcentaje: 3,
    topePorCompra: 30000,
    imagen: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400',
    orden: 2,
    categoria: 'Transporte',
    mcc: ['5542', '5541'],
    fechaInicio: new Date('2024-01-01'),
    fechaFin: new Date('2024-12-31'),
    estado: 'activo',
    fechaCreacion: new Date('2024-01-01T11:00:00Z'),
    fechaActualizacion: new Date('2024-01-01T11:00:00Z'),
  },
  {
    id: '3',
    code: 'BEN003',
    version: 1,
    tipo: 'Cashback',
    titulo: 'Cashback en Restaurantes',
    descripcion: 'Disfruta 8% de cashback en restaurantes y delivery',
    descripcionExtendida: 'Recibe un 8% de cashback en todas tus comidas en restaurantes y pedidos de delivery. Perfecto para disfrutar de tus comidas favoritas.',
    legales: 'Válido en restaurantes y servicios de delivery participantes. No incluye compras de alcohol. Máximo $40.000 por transacción.',
    valorPorcentaje: 8,
    topePorCompra: 40000,
    imagen: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    orden: 3,
    categoria: 'Gastronomía',
    mcc: ['5812', '5814'],
    fechaInicio: new Date('2024-01-01'),
    fechaFin: new Date('2024-12-31'),
    estado: 'activo',
    fechaCreacion: new Date('2024-01-01T12:00:00Z'),
    fechaActualizacion: new Date('2024-01-01T12:00:00Z'),
  },
  {
    id: '4',
    code: 'BEN004',
    version: 1,
    tipo: 'Cashback',
    titulo: 'Cashback en Farmacias',
    descripcion: 'Obtén 4% de cashback en farmacias y salud',
    descripcionExtendida: 'Recibe un 4% de cashback en todas tus compras en farmacias y productos de salud. Cuida tu bienestar mientras ahorras.',
    legales: 'Válido para medicamentos de venta libre y productos de salud. No incluye medicamentos con receta médica. Máximo $25.000 por transacción.',
    valorPorcentaje: 4,
    topePorCompra: 25000,
    imagen: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
    orden: 4,
    categoria: 'Salud',
    mcc: ['5912', '5122'],
    fechaInicio: new Date('2024-01-01'),
    fechaFin: new Date('2024-12-31'),
    estado: 'inactivo',
    fechaCreacion: new Date('2024-01-01T13:00:00Z'),
    fechaActualizacion: new Date('2024-01-01T13:00:00Z'),
  },
  {
    id: '5',
    code: 'BEN005',
    version: 1,
    tipo: 'Cashback',
    titulo: 'Cashback en Entretenimiento',
    descripcion: 'Recibe 10% de cashback en cines y entretenimiento',
    descripcionExtendida: 'Disfruta de un 10% de cashback en cines, teatros y actividades de entretenimiento. Perfecto para tus momentos de ocio.',
    legales: 'Válido en cines, teatros y centros de entretenimiento participantes. No incluye compras de comida en el establecimiento. Máximo $60.000 por transacción.',
    valorPorcentaje: 10,
    topePorCompra: 60000,
    imagen: 'https://images.unsplash.com/photo-1489599187457-d6a075f75f3c?w=400',
    orden: 5,
    categoria: 'Entretenimiento',
    mcc: ['7832', '7922'],
    fechaInicio: new Date('2024-01-01'),
    fechaFin: new Date('2024-12-31'),
    estado: 'activo',
    fechaCreacion: new Date('2024-01-01T14:00:00Z'),
    fechaActualizacion: new Date('2024-01-01T14:00:00Z'),
  },
];

export class MockBenefitsService {
  // List benefits with pagination and filters
  static async listBenefits(params: ListBenefitsParams = {}): Promise<{
    benefits: Benefit[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredBenefits = [...mockBenefits];

    // Apply filters
    if (params.title) {
      filteredBenefits = filteredBenefits.filter(benefit =>
        benefit.titulo.toLowerCase().includes(params.title!.toLowerCase())
      );
    }

    if (params.status) {
      filteredBenefits = filteredBenefits.filter(benefit =>
        benefit.estado === params.status
      );
    }

    // Sort by order
    filteredBenefits.sort((a, b) => a.orden - b.orden);

    // Apply pagination
    const page = params.page || 1;
    const size = params.size || 25;
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginatedBenefits = filteredBenefits.slice(startIndex, endIndex);

    const totalElements = filteredBenefits.length;
    const totalPages = Math.ceil(totalElements / size);

    return {
      benefits: paginatedBenefits,
      totalElements,
      totalPages,
      currentPage: page,
      pageSize: size
    };
  }

  // Get a single benefit by ID
  static async getBenefit(id: string): Promise<Benefit> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const benefit = mockBenefits.find(b => b.id === id);
    if (!benefit) {
      throw new Error('Benefit not found');
    }
    return benefit;
  }

  // Create a new benefit
  static async createBenefit(benefit: Benefit): Promise<Benefit> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newBenefit: Benefit = {
      ...benefit,
      id: (mockBenefits.length + 1).toString(),
      code: `BEN${String(mockBenefits.length + 1).padStart(3, '0')}`,
      version: 1,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };

    mockBenefits.push(newBenefit);
    return newBenefit;
  }

  // Update an existing benefit
  static async updateBenefit(benefit: Benefit): Promise<Benefit> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const index = mockBenefits.findIndex(b => b.id === benefit.id);
    if (index === -1) {
      throw new Error('Benefit not found');
    }

    const updatedBenefit: Benefit = {
      ...benefit,
      fechaActualizacion: new Date(),
    };

    mockBenefits[index] = updatedBenefit;
    return updatedBenefit;
  }

  // Delete a benefit
  static async deleteBenefit(id: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const index = mockBenefits.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error('Benefit not found');
    }

    mockBenefits.splice(index, 1);
  }

  // Reorder benefits
  static async reorderBenefits(reorderData: { id: string; order: number }[]): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Update the order of each benefit
    reorderData.forEach(({ id, order }) => {
      const benefit = mockBenefits.find(b => b.id === id);
      if (benefit) {
        benefit.orden = order;
        benefit.fechaActualizacion = new Date();
      }
    });

    // Sort the array by the new order
    mockBenefits.sort((a, b) => a.orden - b.orden);
  }

  // Bulk upload benefits
  static async bulkUploadBenefits(csvData: string): Promise<{
    success: boolean;
    errors?: Array<{ linea: number; datoConError: string; descripcionError: string }>;
  }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation - in real implementation, this would parse CSV and validate each row
    const lines = csvData.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return {
        success: false,
        errors: [
          {
            linea: 1,
            datoConError: 'CSV',
            descripcionError: 'El archivo CSV debe contener al menos una fila de datos además del encabezado'
          }
        ]
      };
    }

    // Simulate some success
    return {
      success: true
    };
  }
}