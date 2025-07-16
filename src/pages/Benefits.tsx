
import React, { useState } from "react";
import { Plus, Upload, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BenefitsTable } from "@/components/benefits/BenefitsTable";
import { BenefitsFilters } from "@/components/benefits/BenefitsFilters";
import { CreateBenefitDialog } from "@/components/benefits/CreateBenefitDialog";
import { BulkUploadDialog } from "@/components/benefits/BulkUploadDialog";
import { ReorderBenefitsDialog } from "@/components/benefits/ReorderBenefitsDialog";
import { BenefitFilters, Benefit } from "@/types/benefits";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

// Mock data with 20 benefits and images
const mockBenefits: Benefit[] = [
  {
    id: "1",
    titulo: "Descuento en Supermercados",
    descripcion: "5% de descuento en todas las compras en supermercados",
    legales: "Válido solo para compras mayores a $10.000",
    valorPorcentaje: 5,
    topePorCompra: 50000,
    orden: 1,
    categoria: "Alimentación",
    mcc: ["5411", "5499"],
    fechaInicio: new Date("2024-01-01"),
    fechaFin: new Date("2024-12-31"),
    estado: "activo",
    fechaCreacion: new Date("2024-01-01"),
    fechaActualizacion: new Date("2024-01-01"),
    imagen: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=680&h=352&fit=crop"
  },
  {
    id: "2",
    titulo: "Cashback en Combustibles",
    descripcion: "3% de cashback en estaciones de servicio",
    legales: "Máximo $20.000 por mes",
    valorPorcentaje: 3,
    topePorCompra: 20000,
    orden: 2,
    categoria: "Combustibles",
    mcc: ["5541", "5542"],
    fechaInicio: new Date("2024-02-01"),
    fechaFin: new Date("2024-11-30"),
    estado: "programado",
    fechaCreacion: new Date("2024-01-15"),
    fechaActualizacion: new Date("2024-01-15"),
    imagen: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=680&h=352&fit=crop"
  },
  {
    id: "3",
    titulo: "Descuento en Restaurantes",
    descripcion: "10% de descuento en restaurantes y cafeterías",
    legales: "No acumulable con otras promociones",
    valorPorcentaje: 10,
    topePorCompra: 30000,
    orden: 3,
    categoria: "Alimentación",
    mcc: ["5812", "5814"],
    fechaInicio: new Date("2024-01-15"),
    fechaFin: new Date("2024-12-15"),
    estado: "activo",
    fechaCreacion: new Date("2024-01-10"),
    fechaActualizacion: new Date("2024-01-10"),
    imagen: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=680&h=352&fit=crop"
  },
  {
    id: "4",
    titulo: "Reembolso en Farmacia",
    descripcion: "8% de reembolso en farmacias y medicamentos",
    legales: "Válido para medicamentos con receta médica",
    valorPorcentaje: 8,
    topePorCompra: 15000,
    orden: 4,
    categoria: "Salud",
    mcc: ["5912"],
    fechaInicio: new Date("2024-03-01"),
    fechaFin: new Date("2024-12-31"),
    estado: "activo",
    fechaCreacion: new Date("2024-02-20"),
    fechaActualizacion: new Date("2024-02-20"),
    imagen: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=680&h=352&fit=crop"
  },
  {
    id: "5",
    titulo: "Descuento en Tecnología",
    descripcion: "15% de descuento en productos tecnológicos",
    legales: "Válido en tiendas de electrónicos participantes",
    valorPorcentaje: 15,
    topePorCompra: 100000,
    orden: 5,
    categoria: "Tecnología",
    mcc: ["5732", "5734"],
    fechaInicio: new Date("2024-04-01"),
    fechaFin: new Date("2024-10-31"),
    estado: "programado",
    fechaCreacion: new Date("2024-03-15"),
    fechaActualizacion: new Date("2024-03-15"),
    imagen: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=680&h=352&fit=crop"
  },
  {
    id: "6",
    titulo: "Cashback en Transporte",
    descripcion: "7% de cashback en transporte público y taxis",
    legales: "Incluye buses, metros y aplicaciones de transporte",
    valorPorcentaje: 7,
    topePorCompra: 25000,
    orden: 6,
    categoria: "Transporte",
    mcc: ["4111", "4121"],
    fechaInicio: new Date("2024-01-01"),
    fechaFin: new Date("2024-12-31"),
    estado: "activo",
    fechaCreacion: new Date("2024-01-01"),
    fechaActualizacion: new Date("2024-01-01"),
    imagen: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=680&h=352&fit=crop"
  },
  {
    id: "7",
    titulo: "Descuento en Ropa",
    descripcion: "12% de descuento en tiendas de ropa y calzado",
    legales: "Válido en marcas participantes",
    valorPorcentaje: 12,
    topePorCompra: 75000,
    orden: 7,
    categoria: "Moda",
    mcc: ["5651", "5661"],
    fechaInicio: new Date("2024-05-01"),
    fechaFin: new Date("2024-11-30"),
    estado: "programado",
    fechaCreacion: new Date("2024-04-10"),
    fechaActualizacion: new Date("2024-04-10"),
    imagen: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=680&h=352&fit=crop"
  },
  {
    id: "8",
    titulo: "Reembolso en Entretenimiento",
    descripcion: "20% de reembolso en cines y entretenimiento",
    legales: "Válido fines de semana y feriados",
    valorPorcentaje: 20,
    topePorCompra: 40000,
    orden: 8,
    categoria: "Entretenimiento",
    mcc: ["7832", "7841"],
    fechaInicio: new Date("2024-06-01"),
    fechaFin: new Date("2024-12-31"),
    estado: "programado",
    fechaCreacion: new Date("2024-05-15"),
    fechaActualizacion: new Date("2024-05-15"),
    imagen: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=680&h=352&fit=crop"
  },
  {
    id: "9",
    titulo: "Descuento en Hogar",
    descripcion: "6% de descuento en artículos para el hogar",
    legales: "Incluye muebles, decoración y electrodomésticos",
    valorPorcentaje: 6,
    topePorCompra: 80000,
    orden: 9,
    categoria: "Hogar",
    mcc: ["5712", "5722"],
    fechaInicio: new Date("2024-02-01"),
    fechaFin: new Date("2024-12-31"),
    estado: "activo",
    fechaCreacion: new Date("2024-01-25"),
    fechaActualizacion: new Date("2024-01-25"),
    imagen: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=680&h=352&fit=crop"
  },
  {
    id: "10",
    titulo: "Cashback en Belleza",
    descripcion: "18% de cashback en productos de belleza",
    legales: "Válido en perfumerías y salones de belleza",
    valorPorcentaje: 18,
    topePorCompra: 35000,
    orden: 10,
    categoria: "Belleza",
    mcc: ["5977", "7230"],
    fechaInicio: new Date("2024-03-01"),
    fechaFin: new Date("2024-09-30"),
    estado: "activo",
    fechaCreacion: new Date("2024-02-15"),
    fechaActualizacion: new Date("2024-02-15"),
    imagen: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=680&h=352&fit=crop"
  },
  {
    id: "11",
    titulo: "Descuento en Deportes",
    descripcion: "14% de descuento en artículos deportivos",
    legales: "Incluye ropa deportiva y equipamiento",
    valorPorcentaje: 14,
    topePorCompra: 60000,
    orden: 11,
    categoria: "Deportes",
    mcc: ["5940", "5941"],
    fechaInicio: new Date("2024-07-01"),
    fechaFin: new Date("2024-12-31"),
    estado: "programado",
    fechaCreacion: new Date("2024-06-10"),
    fechaActualizacion: new Date("2024-06-10"),
    imagen: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=680&h=352&fit=crop"
  },
  {
    id: "12",
    titulo: "Reembolso en Mascotas",
    descripcion: "25% de reembolso en veterinarias y pet shops",
    legales: "Incluye alimentos y accesorios para mascotas",
    valorPorcentaje: 25,
    topePorCompra: 45000,
    orden: 12,
    categoria: "Mascotas",
    mcc: ["0742", "5995"],
    fechaInicio: new Date("2024-01-01"),
    fechaFin: new Date("2024-12-31"),
    estado: "activo",
    fechaCreacion: new Date("2024-01-01"),
    fechaActualizacion: new Date("2024-01-01"),
    imagen: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=680&h=352&fit=crop"
  },
  {
    id: "13",
    titulo: "Descuento en Libros",
    descripcion: "9% de descuento en librerías y material educativo",
    legales: "Válido en librerías físicas y digitales",
    valorPorcentaje: 9,
    topePorCompra: 20000,
    orden: 13,
    categoria: "Educación",
    mcc: ["5942"],
    fechaInicio: new Date("2024-08-01"),
    fechaFin: new Date("2024-12-31"),
    estado: "programado",
    fechaCreacion: new Date("2024-07-15"),
    fechaActualizacion: new Date("2024-07-15"),
    imagen: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=680&h=352&fit=crop"
  },
  {
    id: "14",
    titulo: "Cashback en Viajes",
    descripcion: "5% de cashback en agencias de viajes",
    legales: "Incluye hoteles, vuelos y paquetes turísticos",
    valorPorcentaje: 5,
    topePorCompra: 200000,
    orden: 14,
    categoria: "Viajes",
    mcc: ["4722", "3501"],
    fechaInicio: new Date("2024-09-01"),
    fechaFin: new Date("2024-12-31"),
    estado: "programado",
    fechaCreacion: new Date("2024-08-10"),
    fechaActualizacion: new Date("2024-08-10"),
    imagen: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=680&h=352&fit=crop"
  },
  {
    id: "15",
    titulo: "Descuento en Jardinería",
    descripcion: "11% de descuento en plantas y jardinería",
    legales: "Válido en viveros y tiendas de jardinería",
    valorPorcentaje: 11,
    topePorCompra: 30000,
    orden: 15,
    categoria: "Hogar",
    mcc: ["5261"],
    fechaInicio: new Date("2024-04-01"),
    fechaFin: new Date("2024-10-31"),
    estado: "activo",
    fechaCreacion: new Date("2024-03-20"),
    fechaActualizacion: new Date("2024-03-20"),
    imagen: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=680&h=352&fit=crop"
  },
  {
    id: "16",
    titulo: "Reembolso en Seguros",
    descripcion: "4% de reembolso en pólizas de seguros",
    legales: "Aplicable a seguros de vida, auto y hogar",
    valorPorcentaje: 4,
    topePorCompra: 150000,
    orden: 16,
    categoria: "Seguros",
    mcc: ["6300"],
    fechaInicio: new Date("2024-01-01"),
    fechaFin: new Date("2024-12-31"),
    estado: "activo",
    fechaCreacion: new Date("2024-01-01"),
    fechaActualizacion: new Date("2024-01-01"),
    imagen: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=680&h=352&fit=crop"
  },
  {
    id: "17",
    titulo: "Descuento en Música",
    descripcion: "30% de descuento en instrumentos musicales",
    legales: "Incluye clases de música y partituras",
    valorPorcentaje: 30,
    topePorCompra: 90000,
    orden: 17,
    categoria: "Entretenimiento",
    mcc: ["5733"],
    fechaInicio: new Date("2024-10-01"),
    fechaFin: new Date("2024-12-31"),
    estado: "programado",
    fechaCreacion: new Date("2024-09-15"),
    fechaActualizacion: new Date("2024-09-15"),
    imagen: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=680&h=352&fit=crop"
  },
  {
    id: "18",
    titulo: "Cashback en Joyería",
    descripcion: "22% de cashback en joyerías y relojerías",
    legales: "Válido en compras superiores a $50.000",
    valorPorcentaje: 22,
    topePorCompra: 120000,
    orden: 18,
    categoria: "Joyería",
    mcc: ["5944"],
    fechaInicio: new Date("2024-11-01"),
    fechaFin: new Date("2024-12-31"),
    estado: "programado",
    fechaCreacion: new Date("2024-10-10"),
    fechaActualizacion: new Date("2024-10-10"),
    imagen: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=680&h=352&fit=crop"
  },
  {
    id: "19",
    titulo: "Descuento en Fotografía",
    descripcion: "16% de descuento en servicios fotográficos",
    legales: "Incluye estudios fotográficos y equipos",
    valorPorcentaje: 16,
    topePorCompra: 70000,
    orden: 19,
    categoria: "Servicios",
    mcc: ["7221"],
    fechaInicio: new Date("2024-05-01"),
    fechaFin: new Date("2024-11-30"),
    estado: "finalizado",
    fechaCreacion: new Date("2024-04-15"),
    fechaActualizacion: new Date("2024-04-15"),
    imagen: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=680&h=352&fit=crop"
  },
  {
    id: "20",
    titulo: "Reembolso en Educación",
    descripcion: "13% de reembolso en cursos y capacitaciones",
    legales: "Válido en instituciones educativas certificadas",
    valorPorcentaje: 13,
    topePorCompra: 100000,
    orden: 20,
    categoria: "Educación",
    mcc: ["8220", "8299"],
    fechaInicio: new Date("2024-01-01"),
    fechaFin: new Date("2024-12-31"),
    estado: "inactivo",
    fechaCreacion: new Date("2024-01-01"),
    fechaActualizacion: new Date("2024-01-01"),
    imagen: "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?w=680&h=352&fit=crop"
  }
];

const Benefits: React.FC = () => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [bulkUploadDialogOpen, setBulkUploadDialogOpen] = useState(false);
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
  const [filters, setFilters] = useState<BenefitFilters>({});
  const [benefits, setBenefits] = useState<Benefit[]>(mockBenefits);

  const handleFiltersChange = (newFilters: BenefitFilters) => {
    setFilters(newFilters);
  };

  const handleReorderSuccess = (reorderedBenefits: Benefit[]) => {
    setBenefits(reorderedBenefits);
    setReorderDialogOpen(false);
  };

  // Filter benefits based on filters for the table
  const filteredBenefits = benefits.filter((benefit) => {
    if (filters.titulo && !benefit.titulo.toLowerCase().includes(filters.titulo.toLowerCase())) {
      return false;
    }
    if (filters.estado && benefit.estado !== filters.estado) {
      return false;
    }
    return true;
  }).sort((a, b) => a.orden - b.orden);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('benefits')}</h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setReorderDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            {t('reorder-benefits') || 'Reordenar'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setBulkUploadDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {t('bulk-upload') || 'Carga Masiva'}
          </Button>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('create-benefit')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <BenefitsFilters onFiltersChange={handleFiltersChange} />

      {/* Table */}
      <BenefitsTable 
        filters={filters} 
        benefits={filteredBenefits}
        onReorderRequest={() => setReorderDialogOpen(true)} 
      />

      {/* Dialogs */}
      <CreateBenefitDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <BulkUploadDialog
        open={bulkUploadDialogOpen}
        onOpenChange={setBulkUploadDialogOpen}
      />

      <ReorderBenefitsDialog
        open={reorderDialogOpen}
        onOpenChange={setReorderDialogOpen}
        benefits={benefits}
        onReorderSuccess={handleReorderSuccess}
      />
    </div>
  );
};

export default Benefits;
