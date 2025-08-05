
export interface Benefit {
  id: string;
  titulo: string;
  descripcion: string;
  descripcionExtendida?: string;
  legales: string;
  valorPorcentaje: number;
  topePorCompra: number;
  imagen?: string;
  orden: number;
  categoria: string;
  mcc: string[];
  fechaInicio: Date;
  fechaFin: Date;
  estado: 'activo' | 'inactivo'; // Solo estados manuales: activo o inactivo
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface Category {
  id: string;
  code: string;
  nombre: string;
  descripcion?: string;
  fechaCreacion: Date;
}

export interface MCC {
  id: string;
  codigo: string;
  descripcion: string;
  fechaCreacion: Date;
}

export interface BenefitFilters {
  titulo?: string;
  estado?: string;
}

export interface CreateBenefitRequest {
  titulo: string;
  descripcion: string;
  descripcionExtendida?: string;
  legales: string;
  valorPorcentaje: number;
  topePorCompra: number;
  imagen?: string;
  orden: number;
  categoria: string;
  mcc: string[];
  fechaInicio: Date;
  fechaFin: Date;
}

export interface UpdateBenefitRequest extends Partial<CreateBenefitRequest> {
  id: string;
}

export interface CSVValidationError {
  linea: number;
  datoConError: string;
  descripcionError: string;
}
