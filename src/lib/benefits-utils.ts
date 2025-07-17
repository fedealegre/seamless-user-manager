
import { Benefit } from "@/types/benefits";

export const calculateBenefitStatus = (benefit: Benefit): 'activo' | 'programado' | 'vencido' | 'inactivo' => {
  const now = new Date();
  const startDate = new Date(benefit.fechaInicio);
  const endDate = new Date(benefit.fechaFin);
  
  // Si está manualmente inactivo, siempre es inactivo
  if (benefit.estado === 'inactivo') {
    return 'inactivo';
  }
  
  // Si la fecha de fin ya pasó, está vencido
  if (endDate < now) {
    return 'vencido';
  }
  
  // Si la fecha de inicio es futura, está programado
  if (startDate > now) {
    return 'programado';
  }
  
  // Si está en el rango de fechas y no está inactivo, está activo
  return 'activo';
};

export const getBenefitStatusLabel = (status: string, t: (key: string) => string) => {
  const statusLabels = {
    activo: t('active'),
    inactivo: t('inactive'),
    programado: t('scheduled'),
    vencido: t('expired'),
  };
  
  return statusLabels[status as keyof typeof statusLabels] || status;
};

export const getBenefitStatusVariant = (status: string) => {
  const statusConfig = {
    activo: { variant: "default" as const, className: "bg-green-100 text-green-800" },
    inactivo: { variant: "secondary" as const, className: "bg-gray-100 text-gray-800" },
    programado: { variant: "default" as const, className: "bg-blue-100 text-blue-800" },
    vencido: { variant: "destructive" as const, className: "bg-red-100 text-red-800" },
  };

  return statusConfig[status as keyof typeof statusConfig] || statusConfig.inactivo;
};
