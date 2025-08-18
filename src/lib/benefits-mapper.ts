import { Benefit, BenefitDTO } from "@/types/benefits";

// Parse date from dd-MM-yyyy format
export const parseDateFromAPI = (dateString: string): Date => {
  const [day, month, year] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Format date to dd-MM-yyyy format for API
export const formatDateForAPI = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${day}-${month}-${year}`;
};

// Map DTO from backend to domain model
export const mapDTOToBenefit = (dto: BenefitDTO): Benefit => {
  return {
    id: dto.id.toString(),
    code: dto.code,
    version: dto.version,
    tipo: 'Cashback' as const,
    titulo: dto.title,
    descripcion: dto.description,
    descripcionExtendida: dto.extended_description || undefined,
    legales: dto.legal_description,
    valorPorcentaje: dto.cashback_fee,
    topePorCompra: dto.top_amount,
    imagen: dto.image || undefined,
    orden: dto.order,
    categoria: dto.category,
    mcc: dto.mcc_list,
    fechaInicio: parseDateFromAPI(dto.init_date),
    fechaFin: parseDateFromAPI(dto.end_date),
    estado: 'activo', // Default status, can be calculated based on dates
    fechaCreacion: new Date(), // Not provided by backend in current format
    fechaActualizacion: new Date(dto.modification_date)
  };
};

// Map domain model to DTO for backend
export const mapBenefitToDTO = (benefit: Benefit, userId: string = "backoffice-user"): Partial<BenefitDTO> => {
  return {
    id: benefit.id ? parseInt(benefit.id) : undefined,
    code: benefit.code,
    version: benefit.version,
    order: benefit.orden,
    type: benefit.tipo,
    title: benefit.titulo,
    description: benefit.descripcion,
    extended_description: benefit.descripcionExtendida || '',
    image: benefit.imagen || '',
    legal_description: benefit.legales,
    category: benefit.categoria,
    init_date: formatDateForAPI(benefit.fechaInicio),
    end_date: formatDateForAPI(benefit.fechaFin),
    modification_date: new Date().toISOString(),
    user: userId,
    mcc_list: benefit.mcc,
    top_amount: benefit.topePorCompra,
    cashback_fee: benefit.valorPorcentaje
  };
};