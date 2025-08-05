import React, { useState, useMemo } from "react";
import { Plus, Upload, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BenefitsTable } from "@/components/benefits/BenefitsTable";
import { BenefitsFilters } from "@/components/benefits/BenefitsFilters";
import { CreateBenefitDialog } from "@/components/benefits/CreateBenefitDialog";
import { BulkUploadDialog } from "@/components/benefits/BulkUploadDialog";
import { OptimizedReorderDialog } from "@/components/benefits/OptimizedReorderDialog";
import BenefitsPagination from "@/components/benefits/BenefitsPagination";
import { BenefitFilters, Benefit } from "@/types/benefits";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { calculateBenefitStatus } from "@/lib/benefits-utils";

// Mock data with updated fechas for active and scheduled benefits
const baseMockBenefits = [
  // Beneficios existentes
  {
    id: "1",
    titulo: "Descuento en Supermercados",
    descripcion: "5% de descuento en todas las compras en supermercados",
    legales: "Válido solo para compras mayores a $10.000",
    valorPorcentaje: 5,
    topePorCompra: 50000,
    orden: 1,
    categoria: "Supermercado",
    mcc: ["5411", "5499"],
    fechaInicio: new Date("2025-01-01"),
    fechaFin: new Date("2025-12-31"),
    estado: "activo",
    fechaCreacion: new Date("2024-01-01"),
    fechaActualizacion: new Date("2024-01-01"),
    imagen: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=680&h=352&fit=crop"
  },
  {
    id: "2",
    tipo: 'Cashback' as const,
    titulo: "Cashback en Combustibles",
    descripcion: "3% de cashback en estaciones de servicio",
    legales: "Máximo $20.000 por mes",
    valorPorcentaje: 3,
    topePorCompra: 20000,
    orden: 2,
    categoria: "Combustible",
    mcc: ["5541", "5542"],
    fechaInicio: new Date("2025-01-01"),
    fechaFin: new Date("2025-12-31"),
    estado: "activo",
    fechaCreacion: new Date("2024-01-15"),
    fechaActualizacion: new Date("2024-01-15"),
    imagen: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=680&h=352&fit=crop"
  },
  // 80 nuevos beneficios de Cashback
  {
    id: "cb_001",
    titulo: "Cashback Restaurantes Premium",
    descripcion: "1.5% de cashback en restaurantes de alta gama",
    legales: "Válido para compras superiores a $5.000",
    valorPorcentaje: 1.5,
    topePorCompra: 15000,
    orden: 3,
    categoria: "Restaurantes",
    mcc: ["5812", "5813"],
    fechaInicio: new Date("2025-01-01"),
    fechaFin: new Date("2025-09-30"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=680&h=352&fit=crop"
  },
  {
    id: "cb_002",
    titulo: "Cashback Farmacias Express",
    descripcion: "2.8% de cashback en farmacias",
    legales: "Aplicable a medicamentos y productos de cuidado personal",
    valorPorcentaje: 2.8,
    topePorCompra: 25000,
    orden: 4,
    categoria: "Salud",
    mcc: ["5912", "5122"],
    fechaInicio: new Date("2025-01-15"),
    fechaFin: new Date("2025-10-15"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=680&h=352&fit=crop"
  },
  {
    id: "cb_003",
    titulo: "Cashback Tecnología Smart",
    descripcion: "4.2% de cashback en tiendas de electrónicos",
    legales: "Máximo $80.000 por transacción",
    valorPorcentaje: 4.2,
    topePorCompra: 80000,
    orden: 5,
    categoria: "Tecnología",
    mcc: ["5732", "5734"],
    fechaInicio: new Date("2025-02-01"),
    fechaFin: new Date("2025-11-30"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=680&h=352&fit=crop"
  },
  {
    id: "cb_004",
    titulo: "Cashback Moda Urbana",
    descripcion: "3.7% de cashback en tiendas de ropa",
    legales: "Válido para todas las marcas participantes",
    valorPorcentaje: 3.7,
    topePorCompra: 45000,
    orden: 6,
    categoria: "Moda",
    mcc: ["5651", "5691"],
    fechaInicio: new Date("2025-01-10"),
    fechaFin: new Date("2025-09-15"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=680&h=352&fit=crop"
  },
  {
    id: "cb_005",
    titulo: "Cashback Entretenimiento Plus",
    descripcion: "2.1% de cashback en cines y entretenimiento",
    legales: "Incluye entradas de cine, teatro y eventos",
    valorPorcentaje: 2.1,
    topePorCompra: 18000,
    orden: 7,
    categoria: "Entretenimiento",
    mcc: ["7832", "7922"],
    fechaInicio: new Date("2025-01-20"),
    fechaFin: new Date("2025-12-20"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1489599505537-92d6bb2f8319?w=680&h=352&fit=crop"
  },
  {
    id: "cb_006",
    titulo: "Cashback Hogar Inteligente",
    descripcion: "5.5% de cashback en muebles y decoración",
    legales: "Aplicable a compras superiores a $20.000",
    valorPorcentaje: 5.5,
    topePorCompra: 120000,
    orden: 8,
    categoria: "Hogar",
    mcc: ["5712", "5719"],
    fechaInicio: new Date("2025-02-15"),
    fechaFin: new Date("2025-10-31"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=680&h=352&fit=crop"
  },
  {
    id: "cb_007",
    titulo: "Cashback Belleza Elite",
    descripcion: "4.8% de cashback en productos de belleza",
    legales: "Válido en perfumerías y salones de belleza",
    valorPorcentaje: 4.8,
    topePorCompra: 60000,
    orden: 9,
    categoria: "Belleza",
    mcc: ["5977", "7230"],
    fechaInicio: new Date("2025-01-05"),
    fechaFin: new Date("2025-11-05"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=680&h=352&fit=crop"
  },
  {
    id: "cb_008",
    titulo: "Cashback Viajes Premium",
    descripcion: "3.3% de cashback en agencias de viaje",
    legales: "Incluye hoteles, vuelos y paquetes turísticos",
    valorPorcentaje: 3.3,
    topePorCompra: 200000,
    orden: 10,
    categoria: "Viajes",
    mcc: ["4511", "7011"],
    fechaInicio: new Date("2025-03-01"),
    fechaFin: new Date("2025-12-31"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=680&h=352&fit=crop"
  },
  {
    id: "cb_009",
    titulo: "Cashback Deportes Extremos",
    descripcion: "6.2% de cashback en artículos deportivos",
    legales: "Válido para equipamiento y ropa deportiva",
    valorPorcentaje: 6.2,
    topePorCompra: 95000,
    orden: 11,
    categoria: "Deportes",
    mcc: ["5941", "7991"],
    fechaInicio: new Date("2025-01-25"),
    fechaFin: new Date("2025-09-25"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=680&h=352&fit=crop"
  },
  {
    id: "cb_010",
    titulo: "Cashback Educación Digital",
    descripcion: "7.1% de cashback en libros y material educativo",
    legales: "Incluye libros físicos y digitales",
    valorPorcentaje: 7.1,
    topePorCompra: 55000,
    orden: 12,
    categoria: "Educación",
    mcc: ["5942", "8220"],
    fechaInicio: new Date("2025-02-10"),
    fechaFin: new Date("2025-12-10"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=680&h=352&fit=crop"
  },
  // Continúan los 70 beneficios restantes de Cashback
  {
    id: "cb_011",
    titulo: "Cashback Autos Premium",
    descripcion: "1.8% de cashback en talleres automotrices",
    legales: "Válido para servicios de mantenimiento y reparación",
    valorPorcentaje: 1.8,
    topePorCompra: 35000,
    orden: 13,
    categoria: "Automotriz",
    mcc: ["7538", "7549"],
    fechaInicio: new Date("2025-01-12"),
    fechaFin: new Date("2025-11-12"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=680&h=352&fit=crop"
  },
  {
    id: "cb_012",
    titulo: "Cashback Mascotas VIP",
    descripcion: "8.3% de cashback en veterinarias",
    legales: "Incluye consultas, vacunas y tratamientos",
    valorPorcentaje: 8.3,
    topePorCompra: 70000,
    orden: 14,
    categoria: "Mascotas",
    mcc: ["0742", "5995"],
    fechaInicio: new Date("2025-02-20"),
    fechaFin: new Date("2025-12-01"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=680&h=352&fit=crop"
  },
  {
    id: "cb_013",
    titulo: "Cashback Música Live",
    descripcion: "6.7% de cashback en tiendas de música",
    legales: "Válido para instrumentos y accesorios musicales",
    valorPorcentaje: 6.7,
    topePorCompra: 90000,
    orden: 15,
    categoria: "Música",
    mcc: ["5733", "7929"],
    fechaInicio: new Date("2025-01-08"),
    fechaFin: new Date("2025-10-08"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=680&h=352&fit=crop"
  },
  {
    id: "cb_014",
    titulo: "Cashback Joyería Exclusiva",
    descripcion: "9.1% de cashback en joyerías selectas",
    legales: "Mínimo de compra $30.000",
    valorPorcentaje: 9.1,
    topePorCompra: 150000,
    orden: 16,
    categoria: "Joyería",
    mcc: ["5944", "5945"],
    fechaInicio: new Date("2025-03-05"),
    fechaFin: new Date("2025-12-25"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=680&h=352&fit=crop"
  },
  {
    id: "cb_015",
    titulo: "Cashback Fotografía Pro",
    descripcion: "5.4% de cashback en estudios fotográficos",
    legales: "Incluye sesiones y revelado digital",
    valorPorcentaje: 5.4,
    topePorCompra: 40000,
    orden: 17,
    categoria: "Fotografía",
    mcc: ["7221", "7395"],
    fechaInicio: new Date("2025-01-18"),
    fechaFin: new Date("2025-11-18"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=680&h=352&fit=crop"
  },
  {
    id: "cb_016",
    titulo: "Cashback Jardín Verde",
    descripcion: "4.6% de cashback en viveros y plantas",
    legales: "Aplicable a plantas, macetas y herramientas",
    valorPorcentaje: 4.6,
    topePorCompra: 28000,
    orden: 18,
    categoria: "Jardinería",
    mcc: ["5261", "5193"],
    fechaInicio: new Date("2025-02-05"),
    fechaFin: new Date("2025-09-30"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=680&h=352&fit=crop"
  },
  {
    id: "cb_017",
    titulo: "Cashback Seguros Smart",
    descripcion: "2.3% de cashback en seguros digitales",
    legales: "Válido para renovaciones y nuevas pólizas",
    valorPorcentaje: 2.3,
    topePorCompra: 180000,
    orden: 19,
    categoria: "Seguros",
    mcc: ["6300", "6399"],
    fechaInicio: new Date("2025-01-25"),
    fechaFin: new Date("2025-12-15"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=680&h=352&fit=crop"
  },
  {
    id: "cb_018",
    titulo: "Cashback Oficina Digital",
    descripcion: "7.8% de cashback en artículos de oficina",
    legales: "Incluye papelería y equipos de oficina",
    valorPorcentaje: 7.8,
    topePorCompra: 45000,
    orden: 20,
    categoria: "Oficina",
    mcc: ["5943", "5111"],
    fechaInicio: new Date("2025-02-12"),
    fechaFin: new Date("2025-11-30"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=680&h=352&fit=crop"
  },
  {
    id: "cb_019",
    titulo: "Cashback Cuidado Personal",
    descripcion: "3.9% de cashback en productos de higiene",
    legales: "Válido en farmacias y supermercados",
    valorPorcentaje: 3.9,
    topePorCompra: 32000,
    orden: 21,
    categoria: "Cuidado Personal",
    mcc: ["5912", "5122"],
    fechaInicio: new Date("2025-01-30"),
    fechaFin: new Date("2025-10-30"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=680&h=352&fit=crop"
  },
  {
    id: "cb_020",
    titulo: "Cashback Artesanías Locales",
    descripcion: "11.2% de cashback en productos artesanales",
    legales: "Apoyo a emprendimientos locales",
    valorPorcentaje: 11.2,
    topePorCompra: 25000,
    orden: 22,
    categoria: "Artesanías",
    mcc: ["5970", "5999"],
    fechaInicio: new Date("2025-03-10"),
    fechaFin: new Date("2025-12-10"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=680&h=352&fit=crop"
  },
  {
    id: "cb_021",
    titulo: "Cashback Electrónicos Gaming",
    descripcion: "8.7% de cashback en videojuegos",
    legales: "Incluye consolas, juegos y accesorios",
    valorPorcentaje: 8.7,
    topePorCompra: 110000,
    orden: 23,
    categoria: "Gaming",
    mcc: ["5732", "5816"],
    fechaInicio: new Date("2025-01-15"),
    fechaFin: new Date("2025-09-15"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=680&h=352&fit=crop"
  },
  {
    id: "cb_022",
    titulo: "Cashback Nutrición Fitness",
    descripcion: "6.5% de cashback en suplementos",
    legales: "Válido en tiendas especializadas",
    valorPorcentaje: 6.5,
    topePorCompra: 38000,
    orden: 24,
    categoria: "Fitness",
    mcc: ["5499", "5912"],
    fechaInicio: new Date("2025-02-28"),
    fechaFin: new Date("2025-11-28"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=680&h=352&fit=crop"
  },
  {
    id: "cb_023",
    titulo: "Cashback Óptica Premium",
    descripcion: "12.4% de cashback en ópticas",
    legales: "Incluye anteojos y lentes de contacto",
    valorPorcentaje: 12.4,
    topePorCompra: 65000,
    orden: 25,
    categoria: "Salud Visual",
    mcc: ["8042", "5995"],
    fechaInicio: new Date("2025-01-22"),
    fechaFin: new Date("2025-10-22"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=680&h=352&fit=crop"
  },
  {
    id: "cb_024",
    titulo: "Cashback Cocina Gourmet",
    descripcion: "4.1% de cashback en utensilios de cocina",
    legales: "Válido en tiendas especializadas",
    valorPorcentaje: 4.1,
    topePorCompra: 52000,
    orden: 26,
    categoria: "Cocina",
    mcc: ["5719", "5722"],
    fechaInicio: new Date("2025-03-15"),
    fechaFin: new Date("2025-12-31"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=680&h=352&fit=crop"
  },
  {
    id: "cb_025",
    titulo: "Cashback Construcción Pro",
    descripcion: "3.6% de cashback en materiales de construcción",
    legales: "Para profesionales y particulares",
    valorPorcentaje: 3.6,
    topePorCompra: 250000,
    orden: 27,
    categoria: "Construcción",
    mcc: ["5211", "1799"],
    fechaInicio: new Date("2025-02-08"),
    fechaFin: new Date("2025-11-08"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=680&h=352&fit=crop"
  },
  {
    id: "cb_026",
    titulo: "Cashback Baby Care",
    descripcion: "9.8% de cashback en artículos para bebés",
    legales: "Incluye ropa, juguetes y accesorios",
    valorPorcentaje: 9.8,
    topePorCompra: 42000,
    orden: 28,
    categoria: "Bebés",
    mcc: ["5641", "5946"],
    fechaInicio: new Date("2025-01-28"),
    fechaFin: new Date("2025-10-28"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=680&h=352&fit=crop"
  },
  {
    id: "cb_027",
    titulo: "Cashback Floristería Elegante",
    descripcion: "14.7% de cashback en floristerías",
    legales: "Para eventos especiales y decoración",
    valorPorcentaje: 14.7,
    topePorCompra: 18000,
    orden: 29,
    categoria: "Flores",
    mcc: ["5992", "5193"],
    fechaInicio: new Date("2025-02-14"),
    fechaFin: new Date("2025-12-14"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=680&h=352&fit=crop"
  },
  {
    id: "cb_028",
    titulo: "Cashback Dental Care",
    descripcion: "7.3% de cashback en clínicas dentales",
    legales: "Incluye tratamientos y consultas",
    valorPorcentaje: 7.3,
    topePorCompra: 85000,
    orden: 30,
    categoria: "Odontología",
    mcc: ["8021", "8099"],
    fechaInicio: new Date("2025-01-11"),
    fechaFin: new Date("2025-09-11"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=680&h=352&fit=crop"
  },
  {
    id: "cb_029",
    titulo: "Cashback Lavandería Express",
    descripcion: "16.2% de cashback en lavanderías",
    legales: "Servicio de lavado en seco incluido",
    valorPorcentaje: 16.2,
    topePorCompra: 12000,
    orden: 31,
    categoria: "Servicios",
    mcc: ["7216", "7217"],
    fechaInicio: new Date("2025-03-01"),
    fechaFin: new Date("2025-11-01"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=680&h=352&fit=crop"
  },
  {
    id: "cb_030",
    titulo: "Cashback Taxi & Rideshare",
    descripcion: "5.9% de cashback en servicios de transporte",
    legales: "Incluye aplicaciones de transporte",
    valorPorcentaje: 5.9,
    topePorCompra: 22000,
    orden: 32,
    categoria: "Transporte",
    mcc: ["4121", "4131"],
    fechaInicio: new Date("2025-01-20"),
    fechaFin: new Date("2025-12-20"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=680&h=352&fit=crop"
  },
  {
    id: "cb_031",
    titulo: "Cashback Panadería Artesanal",
    descripcion: "13.5% de cashback en panaderías",
    legales: "Productos frescos y repostería incluida",
    valorPorcentaje: 13.5,
    topePorCompra: 8000,
    orden: 33,
    categoria: "Panadería",
    mcc: ["5462", "5441"],
    fechaInicio: new Date("2025-02-25"),
    fechaFin: new Date("2025-10-25"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=680&h=352&fit=crop"
  },
  {
    id: "cb_032",
    titulo: "Cashback Ferretería Total",
    descripcion: "4.4% de cashback en ferreterías",
    legales: "Herramientas y materiales de ferretería",
    valorPorcentaje: 4.4,
    topePorCompra: 75000,
    orden: 34,
    categoria: "Ferretería",
    mcc: ["5251", "5200"],
    fechaInicio: new Date("2025-01-17"),
    fechaFin: new Date("2025-11-17"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=680&h=352&fit=crop"
  },
  {
    id: "cb_033",
    titulo: "Cashback Spa & Wellness",
    descripcion: "10.6% de cashback en spa y bienestar",
    legales: "Tratamientos corporales y relajación",
    valorPorcentaje: 10.6,
    topePorCompra: 48000,
    orden: 35,
    categoria: "Bienestar",
    mcc: ["7298", "7230"],
    fechaInicio: new Date("2025-03-08"),
    fechaFin: new Date("2025-12-08"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=680&h=352&fit=crop"
  },
  {
    id: "cb_034",
    titulo: "Cashback Carnicería Premium",
    descripcion: "6.8% de cashback en carnicerías",
    legales: "Carnes frescas y productos cárnicos",
    valorPorcentaje: 6.8,
    topePorCompra: 30000,
    orden: 36,
    categoria: "Carnicería",
    mcc: ["5422", "5421"],
    fechaInicio: new Date("2025-01-14"),
    fechaFin: new Date("2025-09-14"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=680&h=352&fit=crop"
  },
  {
    id: "cb_035",
    titulo: "Cashback Licorería Select",
    descripcion: "8.1% de cashback en licorerías",
    legales: "Bebidas alcohólicas para mayores de edad",
    valorPorcentaje: 8.1,
    topePorCompra: 55000,
    orden: 37,
    categoria: "Licorería",
    mcc: ["5921", "5813"],
    fechaInicio: new Date("2025-02-18"),
    fechaFin: new Date("2025-11-18"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=680&h=352&fit=crop"
  },
  {
    id: "cb_036",
    titulo: "Cashback Textil Fashion",
    descripcion: "11.9% de cashback en telas y textiles",
    legales: "Para diseñadores y confección",
    valorPorcentaje: 11.9,
    topePorCompra: 40000,
    orden: 38,
    categoria: "Textiles",
    mcc: ["5949", "5131"],
    fechaInicio: new Date("2025-01-06"),
    fechaFin: new Date("2025-10-06"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=680&h=352&fit=crop"
  },
  {
    id: "cb_037",
    titulo: "Cashback Inmobiliaria Plus",
    descripcion: "1.2% de cashback en servicios inmobiliarios",
    legales: "Comisiones y servicios profesionales",
    valorPorcentaje: 1.2,
    topePorCompra: 500000,
    orden: 39,
    categoria: "Inmobiliaria",
    mcc: ["6513", "1520"],
    fechaInicio: new Date("2025-04-01"),
    fechaFin: new Date("2025-12-31"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=680&h=352&fit=crop"
  },
  {
    id: "cb_038",
    titulo: "Cashback Electrodomésticos Smart",
    descripcion: "7.6% de cashback en electrodomésticos",
    legales: "Línea blanca y pequeños electrodomésticos",
    valorPorcentaje: 7.6,
    topePorCompra: 120000,
    orden: 40,
    categoria: "Electrodomésticos",
    mcc: ["5722", "5732"],
    fechaInicio: new Date("2025-01-26"),
    fechaFin: new Date("2025-09-26"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1556185781-a47769abb7ee?w=680&h=352&fit=crop"
  },
  {
    id: "cb_039",
    titulo: "Cashback Cerrajería Segura",
    descripcion: "18.3% de cashback en servicios de cerrajería",
    legales: "Servicios de emergencia 24hs incluidos",
    valorPorcentaje: 18.3,
    topePorCompra: 15000,
    orden: 41,
    categoria: "Cerrajería",
    mcc: ["7699", "1799"],
    fechaInicio: new Date("2025-02-22"),
    fechaFin: new Date("2025-12-22"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=680&h=352&fit=crop"
  },
  {
    id: "cb_040",
    titulo: "Cashback Peluquería Estilo",
    descripcion: "12.8% de cashback en peluquerías",
    legales: "Cortes, coloración y tratamientos capilares",
    valorPorcentaje: 12.8,
    topePorCompra: 20000,
    orden: 42,
    categoria: "Belleza",
    mcc: ["7230", "7298"],
    fechaInicio: new Date("2025-01-13"),
    fechaFin: new Date("2025-11-13"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=680&h=352&fit=crop"
  },
  {
    id: "cb_041",
    titulo: "Cashback Helados & Postres",
    descripcion: "15.4% de cashback en heladerías",
    legales: "Helados artesanales y postres incluidos",
    valorPorcentaje: 15.4,
    topePorCompra: 6000,
    orden: 43,
    categoria: "Helados",
    mcc: ["5814", "5499"],
    fechaInicio: new Date("2025-03-20"),
    fechaFin: new Date("2025-10-20"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=680&h=352&fit=crop"
  },
  {
    id: "cb_042",
    titulo: "Cashback Veterinaria 24h",
    descripcion: "9.7% de cashback en veterinarias",
    legales: "Atención de emergencia y consultas rutinarias",
    valorPorcentaje: 9.7,
    topePorCompra: 65000,
    orden: 44,
    categoria: "Veterinaria",
    mcc: ["0742", "8734"],
    fechaInicio: new Date("2025-01-09"),
    fechaFin: new Date("2025-09-09"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=680&h=352&fit=crop"
  },
  {
    id: "cb_043",
    titulo: "Cashback Gimnasio Fitness",
    descripcion: "6.3% de cashback en gimnasios",
    legales: "Mensualidades y clases grupales incluidas",
    valorPorcentaje: 6.3,
    topePorCompra: 35000,
    orden: 45,
    categoria: "Fitness",
    mcc: ["7991", "7997"],
    fechaInicio: new Date("2025-02-11"),
    fechaFin: new Date("2025-12-11"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=680&h=352&fit=crop"
  },
  {
    id: "cb_044",
    titulo: "Cashback Pizza & Fast Food",
    descripcion: "8.9% de cashback en comida rápida",
    legales: "Delivery y take away incluido",
    valorPorcentaje: 8.9,
    topePorCompra: 15000,
    orden: 46,
    categoria: "Comida Rápida",
    mcc: ["5812", "5814"],
    fechaInicio: new Date("2025-01-31"),
    fechaFin: new Date("2025-10-31"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=680&h=352&fit=crop"
  },
  {
    id: "cb_045",
    titulo: "Cashback Mueblería Design",
    descripcion: "5.7% de cashback en mueblerías",
    legales: "Muebles de diseño y decoración",
    valorPorcentaje: 5.7,
    topePorCompra: 180000,
    orden: 47,
    categoria: "Muebles",
    mcc: ["5712", "5719"],
    fechaInicio: new Date("2025-03-25"),
    fechaFin: new Date("2025-11-25"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=680&h=352&fit=crop"
  },
  {
    id: "cb_046",
    titulo: "Cashback Zapatería Premium",
    descripcion: "10.1% de cashback en zapaterías",
    legales: "Calzado de todas las marcas y estilos",
    valorPorcentaje: 10.1,
    topePorCompra: 50000,
    orden: 48,
    categoria: "Calzado",
    mcc: ["5661", "5691"],
    fechaInicio: new Date("2025-01-19"),
    fechaFin: new Date("2025-09-19"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=680&h=352&fit=crop"
  },
  {
    id: "cb_047",
    titulo: "Cashback Librería Académica",
    descripcion: "13.1% de cashback en librerías",
    legales: "Material educativo y literatura general",
    valorPorcentaje: 13.1,
    topePorCompra: 28000,
    orden: 49,
    categoria: "Libros",
    mcc: ["5942", "5111"],
    fechaInicio: new Date("2025-02-06"),
    fechaFin: new Date("2025-12-06"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=680&h=352&fit=crop"
  },
  {
    id: "cb_048",
    titulo: "Cashback Café Specialty",
    descripcion: "17.2% de cashback en cafeterías",
    legales: "Café de especialidad y repostería artesanal",
    valorPorcentaje: 17.2,
    topePorCompra: 8500,
    orden: 50,
    categoria: "Café",
    mcc: ["5814", "5499"],
    fechaInicio: new Date("2025-01-16"),
    fechaFin: new Date("2025-11-16"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=680&h=352&fit=crop"
  },
  {
    id: "cb_049",
    titulo: "Cashback Electrónica Pro",
    descripcion: "4.9% de cashback en electrónicos profesionales",
    legales: "Equipos de audio, video y comunicaciones",
    valorPorcentaje: 4.9,
    topePorCompra: 200000,
    orden: 51,
    categoria: "Electrónicos",
    mcc: ["5732", "5065"],
    fechaInicio: new Date("2025-02-27"),
    fechaFin: new Date("2025-10-27"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=680&h=352&fit=crop"
  },
  {
    id: "cb_050",
    titulo: "Cashback Farmacia Natural",
    descripcion: "14.8% de cashback en productos naturales",
    legales: "Medicina alternativa y productos orgánicos",
    valorPorcentaje: 14.8,
    topePorCompra: 22000,
    orden: 52,
    categoria: "Salud Natural",
    mcc: ["5912", "5499"],
    fechaInicio: new Date("2025-01-07"),
    fechaFin: new Date("2025-09-07"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=680&h=352&fit=crop"
  },
  {
    id: "cb_051",
    titulo: "Cashback Hardware Tech",
    descripcion: "6.1% de cashback en ferreterías técnicas",
    legales: "Componentes electrónicos y herramientas especializadas",
    valorPorcentaje: 6.1,
    topePorCompra: 85000,
    orden: 53,
    categoria: "Hardware",
    mcc: ["5045", "5251"],
    fechaInicio: new Date("2025-03-12"),
    fechaFin: new Date("2025-12-12"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=680&h=352&fit=crop"
  },
  {
    id: "cb_052",
    titulo: "Cashback Turismo Aventura",
    descripcion: "3.8% de cashback en turismo aventura",
    legales: "Excursiones y actividades al aire libre",
    valorPorcentaje: 3.8,
    topePorCompra: 120000,
    orden: 54,
    categoria: "Turismo",
    mcc: ["7991", "4511"],
    fechaInicio: new Date("2025-01-23"),
    fechaFin: new Date("2025-11-23"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=680&h=352&fit=crop"
  },
  {
    id: "cb_053",
    titulo: "Cashback Decoración Hogar",
    descripcion: "11.6% de cashback en decoración",
    legales: "Artículos decorativos y accesorios para el hogar",
    valorPorcentaje: 11.6,
    topePorCompra: 60000,
    orden: 55,
    categoria: "Decoración",
    mcc: ["5719", "5970"],
    fechaInicio: new Date("2025-02-17"),
    fechaFin: new Date("2025-10-17"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=680&h=352&fit=crop"
  },
  {
    id: "cb_054",
    titulo: "Cashback Relojería Exclusiva",
    descripcion: "7.4% de cashback en relojerías",
    legales: "Relojes de marca y accesorios",
    valorPorcentaje: 7.4,
    topePorCompra: 160000,
    orden: 56,
    categoria: "Relojes",
    mcc: ["5944", "5094"],
    fechaInicio: new Date("2025-01-29"),
    fechaFin: new Date("2025-09-29"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=680&h=352&fit=crop"
  },
  {
    id: "cb_055",
    titulo: "Cashback Productos Ecológicos",
    descripcion: "19.5% de cashback en productos eco-friendly",
    legales: "Productos sustentables y biodegradables",
    valorPorcentaje: 19.5,
    topePorCompra: 15000,
    orden: 57,
    categoria: "Ecológico",
    mcc: ["5499", "5970"],
    fechaInicio: new Date("2025-04-22"),
    fechaFin: new Date("2025-12-22"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=680&h=352&fit=crop"
  },
  {
    id: "cb_056",
    titulo: "Cashback Camping & Outdoor",
    descripcion: "8.6% de cashback en artículos de camping",
    legales: "Equipamiento para actividades al aire libre",
    valorPorcentaje: 8.6,
    topePorCompra: 75000,
    orden: 58,
    categoria: "Outdoor",
    mcc: ["5941", "5999"],
    fechaInicio: new Date("2025-01-12"),
    fechaFin: new Date("2025-10-12"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=680&h=352&fit=crop"
  },
  {
    id: "cb_057",
    titulo: "Cashback Instrumentos Médicos",
    descripcion: "5.3% de cashback en instrumentos médicos",
    legales: "Equipos y suministros médicos profesionales",
    valorPorcentaje: 5.3,
    topePorCompra: 300000,
    orden: 59,
    categoria: "Medicina",
    mcc: ["5047", "8099"],
    fechaInicio: new Date("2025-03-18"),
    fechaFin: new Date("2025-11-18"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=680&h=352&fit=crop"
  },
  {
    id: "cb_058",
    titulo: "Cashback Arte & Manualidades",
    descripcion: "16.7% de cashback en materiales artísticos",
    legales: "Pinturas, pinceles y materiales para arte",
    valorPorcentaje: 16.7,
    topePorCompra: 18000,
    orden: 60,
    categoria: "Arte",
    mcc: ["5970", "5999"],
    fechaInicio: new Date("2025-01-21"),
    fechaFin: new Date("2025-09-21"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=680&h=352&fit=crop"
  },
  {
    id: "cb_059",
    titulo: "Cashback Software & Licencias",
    descripcion: "4.2% de cashback en software profesional",
    legales: "Licencias de software y aplicaciones",
    valorPorcentaje: 4.2,
    topePorCompra: 250000,
    orden: 61,
    categoria: "Software",
    mcc: ["5734", "7372"],
    fechaInicio: new Date("2025-02-09"),
    fechaFin: new Date("2025-12-09"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=680&h=352&fit=crop"
  },
  {
    id: "cb_060",
    titulo: "Cashback Masajes Terapéuticos",
    descripcion: "12.3% de cashback en masajes",
    legales: "Terapias corporales y relajación",
    valorPorcentaje: 12.3,
    topePorCompra: 25000,
    orden: 62,
    categoria: "Terapias",
    mcc: ["7298", "8099"],
    fechaInicio: new Date("2025-01-24"),
    fechaFin: new Date("2025-11-24"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=680&h=352&fit=crop"
  },
  {
    id: "cb_061",
    titulo: "Cashback Eventos & Catering",
    descripcion: "3.4% de cashback en servicios de catering",
    legales: "Organización de eventos y banquetes",
    valorPorcentaje: 3.4,
    topePorCompra: 180000,
    orden: 63,
    categoria: "Eventos",
    mcc: ["5812", "7299"],
    fechaInicio: new Date("2025-03-30"),
    fechaFin: new Date("2025-12-30"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=680&h=352&fit=crop"
  },
  {
    id: "cb_062",
    titulo: "Cashback Limpieza Industrial",
    descripcion: "9.2% de cashback en productos de limpieza",
    legales: "Productos de limpieza industrial y doméstica",
    valorPorcentaje: 9.2,
    topePorCompra: 35000,
    orden: 64,
    categoria: "Limpieza",
    mcc: ["5200", "5499"],
    fechaInicio: new Date("2025-01-15"),
    fechaFin: new Date("2025-10-15"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=680&h=352&fit=crop"
  },
  {
    id: "cb_063",
    titulo: "Cashback Juguetería Educativa",
    descripcion: "13.8% de cashback en juguetes educativos",
    legales: "Juguetes didácticos y material pedagógico",
    valorPorcentaje: 13.8,
    topePorCompra: 32000,
    orden: 65,
    categoria: "Juguetes",
    mcc: ["5946", "5942"],
    fechaInicio: new Date("2025-02-13"),
    fechaFin: new Date("2025-11-13"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=680&h=352&fit=crop"
  },
  {
    id: "cb_064",
    titulo: "Cashback Seguridad Hogar",
    descripcion: "6.6% de cashback en sistemas de seguridad",
    legales: "Alarmas, cámaras y sistemas de monitoreo",
    valorPorcentaje: 6.6,
    topePorCompra: 95000,
    orden: 66,
    categoria: "Seguridad",
    mcc: ["5732", "1799"],
    fechaInicio: new Date("2025-01-27"),
    fechaFin: new Date("2025-09-27"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=680&h=352&fit=crop"
  },
  {
    id: "cb_065",
    titulo: "Cashback Envíos & Courier",
    descripcion: "21.4% de cashback en servicios de envío",
    legales: "Envíos nacionales e internacionales",
    valorPorcentaje: 21.4,
    topePorCompra: 8000,
    orden: 67,
    categoria: "Logística",
    mcc: ["4215", "7311"],
    fechaInicio: new Date("2025-02-01"),
    fechaFin: new Date("2025-12-01"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=680&h=352&fit=crop"
  },
  {
    id: "cb_066",
    titulo: "Cashback Productos Importados",
    descripcion: "5.8% de cashback en productos importados",
    legales: "Artículos internacionales de calidad premium",
    valorPorcentaje: 5.8,
    topePorCompra: 110000,
    orden: 68,
    categoria: "Importados",
    mcc: ["5999", "5094"],
    fechaInicio: new Date("2025-03-07"),
    fechaFin: new Date("2025-11-07"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=680&h=352&fit=crop"
  },
  {
    id: "cb_067",
    titulo: "Cashback Clinicas Estéticas",
    descripcion: "8.4% de cashback en tratamientos estéticos",
    legales: "Procedimientos estéticos no invasivos",
    valorPorcentaje: 8.4,
    topePorCompra: 75000,
    orden: 69,
    categoria: "Estética",
    mcc: ["7298", "8011"],
    fechaInicio: new Date("2025-01-10"),
    fechaFin: new Date("2025-10-10"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=680&h=352&fit=crop"
  },
  {
    id: "cb_068",
    titulo: "Cashback Laboratorios Clínicos",
    descripcion: "7.9% de cashback en estudios médicos",
    legales: "Análisis clínicos y estudios de diagnóstico",
    valorPorcentaje: 7.9,
    topePorCompra: 55000,
    orden: 70,
    categoria: "Laboratorio",
    mcc: ["8071", "8099"],
    fechaInicio: new Date("2025-02-23"),
    fechaFin: new Date("2025-11-23"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=680&h=352&fit=crop"
  },
  {
    id: "cb_069",
    titulo: "Cashback Talleres Creativos",
    descripcion: "14.1% de cashback en talleres y cursos",
    legales: "Talleres de arte, cocina y manualidades",
    valorPorcentaje: 14.1,
    topePorCompra: 20000,
    orden: 71,
    categoria: "Talleres",
    mcc: ["8299", "7991"],
    fechaInicio: new Date("2025-01-03"),
    fechaFin: new Date("2025-09-03"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1541698444083-023c97d3f4b6?w=680&h=352&fit=crop"
  },
  {
    id: "cb_070",
    titulo: "Cashback Reparación Móviles",
    descripcion: "18.6% de cashback en reparación de celulares",
    legales: "Reparación y mantenimiento de dispositivos móviles",
    valorPorcentaje: 18.6,
    topePorCompra: 12000,
    orden: 72,
    categoria: "Reparaciones",
    mcc: ["7622", "5732"],
    fechaInicio: new Date("2025-02-16"),
    fechaFin: new Date("2025-12-16"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=680&h=352&fit=crop"
  },
  {
    id: "cb_071",
    titulo: "Cashback Distribuidora Mayorista",
    descripcion: "2.7% de cashback en compras mayoristas",
    legales: "Mínimo de compra para mayoristas",
    valorPorcentaje: 2.7,
    topePorCompra: 400000,
    orden: 73,
    categoria: "Mayorista",
    mcc: ["5039", "5199"],
    fechaInicio: new Date("2025-01-04"),
    fechaFin: new Date("2025-11-04"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=680&h=352&fit=crop"
  },
  {
    id: "cb_072",
    titulo: "Cashback Productos Orgánicos",
    descripcion: "15.3% de cashback en alimentos orgánicos",
    legales: "Productos certificados orgánicos y naturales",
    valorPorcentaje: 15.3,
    topePorCompra: 24000,
    orden: 74,
    categoria: "Orgánicos",
    mcc: ["5499", "5411"],
    fechaInicio: new Date("2025-03-14"),
    fechaFin: new Date("2025-12-14"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=680&h=352&fit=crop"
  },
  {
    id: "cb_073",
    titulo: "Cashback Centro de Copiado",
    descripcion: "22.8% de cashback en servicios de impresión",
    legales: "Fotocopias, impresiones y encuadernado",
    valorPorcentaje: 22.8,
    topePorCompra: 5000,
    orden: 75,
    categoria: "Impresión",
    mcc: ["7338", "5943"],
    fechaInicio: new Date("2025-01-08"),
    fechaFin: new Date("2025-10-08"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=680&h=352&fit=crop"
  },
  {
    id: "cb_074",
    titulo: "Cashback Accesorios Móviles",
    descripcion: "11.7% de cashback en accesorios para celulares",
    legales: "Fundas, cargadores y accesorios diversos",
    valorPorcentaje: 11.7,
    topePorCompra: 18000,
    orden: 76,
    categoria: "Accesorios",
    mcc: ["5732", "5999"],
    fechaInicio: new Date("2025-02-21"),
    fechaFin: new Date("2025-11-21"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=680&h=352&fit=crop"
  },
  {
    id: "cb_075",
    titulo: "Cashback Productos Gourmet",
    descripcion: "9.5% de cashback en delicatessen gourmet",
    legales: "Productos gourmet y delicatessen selectos",
    valorPorcentaje: 9.5,
    topePorCompra: 45000,
    orden: 77,
    categoria: "Gourmet",
    mcc: ["5499", "5411"],
    fechaInicio: new Date("2025-01-05"),
    fechaFin: new Date("2025-09-05"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=680&h=352&fit=crop"
  },
  {
    id: "cb_076",
    titulo: "Cashback Servicios Legales",
    descripcion: "4.3% de cashback en servicios jurídicos",
    legales: "Consultas y trámites legales",
    valorPorcentaje: 4.3,
    topePorCompra: 150000,
    orden: 78,
    categoria: "Legales",
    mcc: ["8111", "7299"],
    fechaInicio: new Date("2025-03-28"),
    fechaFin: new Date("2025-12-28"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=680&h=352&fit=crop"
  },
  {
    id: "cb_077",
    titulo: "Cashback Piscinas & Spa",
    descripcion: "6.9% de cashback en mantenimiento de piscinas",
    legales: "Productos químicos y servicios de mantenimiento",
    valorPorcentaje: 6.9,
    topePorCompra: 65000,
    orden: 79,
    categoria: "Piscinas",
    mcc: ["1799", "5999"],
    fechaInicio: new Date("2025-01-11"),
    fechaFin: new Date("2025-11-11"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=680&h=352&fit=crop"
  },
  {
    id: "cb_078",
    titulo: "Cashback Estacionamiento Premium",
    descripcion: "26.3% de cashback en estacionamientos",
    legales: "Estacionamientos cubiertos y al aire libre",
    valorPorcentaje: 26.3,
    topePorCompra: 3000,
    orden: 80,
    categoria: "Estacionamiento",
    mcc: ["7523", "7549"],
    fechaInicio: new Date("2025-02-04"),
    fechaFin: new Date("2025-12-04"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=680&h=352&fit=crop"
  },
  {
    id: "cb_079",
    titulo: "Cashback Consultoría Empresarial",
    descripcion: "2.1% de cashback en consultoría de negocios",
    legales: "Servicios profesionales de consultoría",
    valorPorcentaje: 2.1,
    topePorCompra: 500000,
    orden: 81,
    categoria: "Consultoría",
    mcc: ["7392", "8999"],
    fechaInicio: new Date("2025-04-15"),
    fechaFin: new Date("2025-12-31"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=680&h=352&fit=crop"
  },
  {
    id: "cb_080",
    titulo: "Cashback Internet & Telecomunicaciones",
    descripcion: "5.2% de cashback en servicios de internet",
    legales: "Planes de internet y telefonía",
    valorPorcentaje: 5.2,
    topePorCompra: 28000,
    orden: 82,
    categoria: "Telecomunicaciones",
    mcc: ["4814", "7372"],
    fechaInicio: new Date("2025-01-01"),
    fechaFin: new Date("2025-09-30"),
    estado: "activo",
    fechaCreacion: new Date("2025-01-01"),
    fechaActualizacion: new Date("2025-01-01"),
    imagen: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=680&h=352&fit=crop"
  },
  {
    id: "3",
    titulo: "Descuento en Restaurantes",
    descripcion: "10% de descuento en restaurantes y cafeterías",
    legales: "No acumulable con otras promociones",
    valorPorcentaje: 10,
    topePorCompra: 30000,
    orden: 3,
    categoria: "Café",
    mcc: ["5812", "5814"],
    fechaInicio: new Date("2024-07-10"), // Activo
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
    categoria: "Farmacia",
    mcc: ["5912"],
    fechaInicio: new Date("2024-07-05"), // Activo
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
    categoria: "Librería",
    mcc: ["5732", "5734"],
    fechaInicio: new Date("2024-08-15"), // Programado
    fechaFin: new Date("2024-10-31"),
    estado: "activo",
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
    categoria: "Combustible",
    mcc: ["4111", "4121"],
    fechaInicio: new Date("2024-07-01"), // Activo
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
    categoria: "Librería",
    mcc: ["5651", "5661"],
    fechaInicio: new Date("2024-09-01"), // Programado
    fechaFin: new Date("2024-11-30"),
    estado: "activo",
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
    categoria: "Café",
    mcc: ["7832", "7841"],
    fechaInicio: new Date("2024-07-15"), // Activo
    fechaFin: new Date("2024-12-31"),
    estado: "activo",
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
    categoria: "Supermercado",
    mcc: ["5712", "5722"],
    fechaInicio: new Date("2024-07-20"), // Activo
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
    categoria: "Farmacia",
    mcc: ["5977", "7230"],
    fechaInicio: new Date("2024-08-20"), // Programado
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
    categoria: "Juguetería",
    mcc: ["5940", "5941"],
    fechaInicio: new Date("2024-09-15"), // Programado
    fechaFin: new Date("2024-12-31"),
    estado: "activo",
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
    categoria: "Farmacia",
    mcc: ["0742", "5995"],
    fechaInicio: new Date("2024-07-01"), // Activo
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
    categoria: "Librería",
    mcc: ["5942"],
    fechaInicio: new Date("2024-08-01"), // Programado
    fechaFin: new Date("2024-12-31"),
    estado: "activo",
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
    categoria: "Café",
    mcc: ["4722", "3501"],
    fechaInicio: new Date("2024-10-01"), // Programado
    fechaFin: new Date("2024-12-31"),
    estado: "activo",
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
    categoria: "Verdulería",
    mcc: ["5261"],
    fechaInicio: new Date("2024-07-10"), // Activo
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
    categoria: "Supermercado",
    mcc: ["6300"],
    fechaInicio: new Date("2024-07-01"), // Activo
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
    categoria: "Librería",
    mcc: ["5733"],
    fechaInicio: new Date("2024-10-01"), // Programado
    fechaFin: new Date("2024-12-31"),
    estado: "activo",
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
    categoria: "Librería",
    mcc: ["5944"],
    fechaInicio: new Date("2024-11-01"), // Programado
    fechaFin: new Date("2024-12-31"),
    estado: "activo",
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
    categoria: "Librería",
    mcc: ["7221"],
    fechaInicio: new Date("2024-05-01"),
    fechaFin: new Date("2024-06-30"), // Vencido
    estado: "activo",
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
    categoria: "Librería",
    mcc: ["8220", "8299"],
    fechaInicio: new Date("2024-07-01"), // Activo pero manualmente inactivo
    fechaFin: new Date("2024-12-31"),
    estado: "inactivo",
    fechaCreacion: new Date("2024-01-01"),
    fechaActualizacion: new Date("2024-01-01"),
    imagen: "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?w=680&h=352&fit=crop"
  }
];

// Transform base data to include tipo field
const mockBenefits: Benefit[] = baseMockBenefits.map(benefit => ({
  ...benefit,
  tipo: 'Cashback' as const,
  estado: benefit.estado as 'activo' | 'inactivo'
}));

const Benefits: React.FC = () => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [bulkUploadDialogOpen, setBulkUploadDialogOpen] = useState(false);
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
  const [filters, setFilters] = useState<BenefitFilters>({});
  const [benefits, setBenefits] = useState<Benefit[]>(mockBenefits);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

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
    if (filters.estado) {
      const calculatedStatus = calculateBenefitStatus(benefit);
      if (calculatedStatus !== filters.estado) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => a.orden - b.orden);

  // Pagination calculations
  const totalBenefits = filteredBenefits.length;
  const totalPages = Math.ceil(totalBenefits / pageSize);
  const paginatedBenefits = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredBenefits.slice(startIndex, endIndex);
  }, [filteredBenefits, page, pageSize]);

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

      {/* Page Size Selector */}
      <div className="flex items-center justify-end mb-2">
        <label htmlFor="page-size-select" className="mr-2 text-sm text-muted-foreground">
          {t("items-per-page")}:
        </label>
        <select
          id="page-size-select"
          value={pageSize.toString()}
          onChange={(e) => {
            setPageSize(parseInt(e.target.value));
            setPage(1); // Reset to first page when changing page size
          }}
          className="w-20 px-2 py-1 border border-input bg-background text-sm rounded-md"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>

      {/* Table */}
        <BenefitsTable 
          filters={filters} 
          benefits={paginatedBenefits} 
          onReorderRequest={() => setReorderDialogOpen(true)}
        />
        
        <BenefitsPagination
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalPages={totalPages}
          totalBenefits={totalBenefits}
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

        <OptimizedReorderDialog
          open={reorderDialogOpen}
          onOpenChange={setReorderDialogOpen}
          benefits={benefits}
          onReorderSuccess={handleReorderSuccess}
        />
    </div>
  );
};

export default Benefits;
