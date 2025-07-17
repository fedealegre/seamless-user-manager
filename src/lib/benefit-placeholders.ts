
import { Benefit } from "@/types/benefits";

export const processPlaceholders = (description: string, benefit: Benefit): string => {
  return description
    .replace(/\$\{valorPorcentaje\}/g, benefit.valorPorcentaje.toString())
    .replace(/\$\{topePorCompra\}/g, benefit.topePorCompra.toLocaleString('es-ES'))
    .replace(/\$\{titulo\}/g, benefit.titulo)
    .replace(/\$\{categoria\}/g, benefit.categoria)
    .replace(/\$\{orden\}/g, benefit.orden.toString());
};

export const getAvailablePlaceholders = (): string[] => {
  return [
    '${valorPorcentaje}',
    '${topePorCompra}',
    '${titulo}',
    '${categoria}',
    '${orden}'
  ];
};
