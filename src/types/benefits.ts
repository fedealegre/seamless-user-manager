
export interface Benefit {
  id: string;
  code?: string; // Backend field - not editable
  version?: number; // Backend field - not editable
  tipo: 'Cashback';
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

import { Category } from "@/types/category";

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

// Backend DTO interfaces
export interface BenefitDTO {
  id: number;
  code: string;
  version: number;
  order: number;
  type: string;
  title: string;
  description: string;
  extended_description: string;
  image: string;
  legal_description: string;
  category: string;
  init_date: string; // dd-MM-yyyy format
  end_date: string; // dd-MM-yyyy format
  modification_date: string; // ISO format
  user: string;
  mcc_list: string[];
  top_amount: number;
  cashback_fee: number;
}

export interface BenefitsListResponse {
  content: BenefitDTO[];
  total_elements: number;
  size: number;
  number: number;
  total_pages: number;
}

export interface CreateBenefitRequest {
  tipo: 'Cashback';
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
