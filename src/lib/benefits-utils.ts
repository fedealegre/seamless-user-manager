
import { Benefit } from "@/types/benefits";

export const calculateBenefitStatus = (benefit: Benefit): 'activo' | 'expirado' => {
  const now = new Date();
  const endDate = new Date(benefit.fechaFin);
  
  // Si la fecha de fin ya pasó, está expirado
  if (endDate < now) {
    return 'expirado';
  }
  
  // Si está en el rango de fechas válido, está activo
  return 'activo';
};

export const getBenefitStatusLabel = (status: string, t: (key: string) => string) => {
  const statusLabels = {
    activo: t('active'),
    expirado: t('expired'),
  };
  
  return statusLabels[status as keyof typeof statusLabels] || status;
};

export const getBenefitStatusVariant = (status: string) => {
  const statusConfig = {
    activo: { variant: "default" as const, className: "bg-green-100 text-green-800" },
    expirado: { variant: "destructive" as const, className: "bg-red-100 text-red-800" },
  };

  return statusConfig[status as keyof typeof statusConfig] || statusConfig.activo;
};

// Función para formatear fecha para API móvil (dd-MM-yyyy)
export const formatDateForMobileAPI = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${day}-${month}-${year}`;
};

// Función para transformar beneficio al formato de API móvil
export const transformBenefitForMobileAPI = (benefit: Benefit) => {
  return {
    id: parseInt(benefit.id),
    order: benefit.orden,
    type: benefit.tipo,
    title: benefit.titulo,
    description: benefit.descripcion,
    extended_description: benefit.descripcionExtendida || '',
    image: benefit.imagen || '',
    legal_description: benefit.legales,
    category: benefit.categoria,
    init_date: formatDateForMobileAPI(benefit.fechaInicio),
    end_date: formatDateForMobileAPI(benefit.fechaFin)
  };
};
