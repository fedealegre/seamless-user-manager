
import React, { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Using the same MCC data as in MCCMaster.tsx
const allMCCs = [
  { codigo: "1520", descripcion: "Servicio de construcción de viviendas y comercial" },
  { codigo: "1740", descripcion: "Albañilería, mampostería, colocación de azulejos, trabajos en yeso y aislamientos" },
  { codigo: "1750", descripcion: "Carpinteros y otros servicios de carpintería" },
  { codigo: "1771", descripcion: "Trabajos de hormigón y concreto" },
  { codigo: "1799", descripcion: "Otros contratistas (no clasificados en otros rubros)" },
  { codigo: "2741", descripcion: "Servicios editoriales, de publicación y de impresión varios" },
  { codigo: "2842", descripcion: "Fabricantes de productos especiales de limpieza, pulido y saneamiento" },
  { codigo: "4011", descripcion: "Servicio de fletes por vías ferroviarias" },
  { codigo: "4111", descripcion: "Transporte de pasajeros local y suburbano" },
  { codigo: "4112", descripcion: "Trenes y ferrocarriles de pasajeros" },
  { codigo: "4121", descripcion: "Taxis, limosinas y servcio de transporte particular de pasajeros" },
  { codigo: "4214", descripcion: "Mudanzas, deliveries, servicos de mensajería o flete de corta y larga distancia" },
  { codigo: "4215", descripcion: "Servicios de despachos postales aéreos y terrestres" },
  { codigo: "4225", descripcion: "Proveedores de almacenamiento o depósito" },
  { codigo: "4457", descripcion: "Alquiler y leasing de barcos y botes" },
  { codigo: "4468", descripcion: "Marinas, guarderías y clubes náuticos" },
  { codigo: "4511", descripcion: "Aerolíneas y compañías aéreas (no clasificados en otros rubros)" },
  { codigo: "4582", descripcion: "Terminales aéreas: aeropuertos, aeródromos y pistas de aterrizaje" },
  { codigo: "4722", descripcion: "Agencias de viaje y operadores turísticos" },
  { codigo: "4784", descripcion: "Peajes y cánones de tránsito" },
  { codigo: "4789", descripcion: "Servicios de transporte (no clasificados en otros rubros)" },
  { codigo: "4812", descripcion: "Venta de equipos telefónicos y de telecomunicaciones" },
  { codigo: "4814", descripcion: "Servicios de telecomunicaciones: locales, larga distancia y servicios de fax" },
  { codigo: "4816", descripcion: "Proveedores de redes de computación e informatica" },
  { codigo: "4829", descripcion: "Transferencia de dinero" },
  { codigo: "4899", descripcion: "Servicios pagos de televisión, radio y streaming" },
  { codigo: "4900", descripcion: "Servicios de electricidad, gas y agua" },
  { codigo: "5013", descripcion: "Distribuidores y mayoristas de autopartes" },
  { codigo: "5021", descripcion: "Distribuidores de amoblamiento comercial y de oficina" },
  { codigo: "5039", descripcion: "Distribuidores de materiales de construcción (no clasificados en otros rubros)" },
  { codigo: "5044", descripcion: "Distribuidores de suministros fotográficos y de fotocopiado" },
  { codigo: "5045", descripcion: "Distribuidores de equipamiento de computación (software y hardware)" },
  { codigo: "5046", descripcion: "Distribuidores de equipamiento comercial y suministros (no clasificados en otros rubros)" },
  { codigo: "5047", descripcion: "Distribuidores de equipamiento medico, dental, oftálmico y suministros hospitalarios" },
  { codigo: "5051", descripcion: "Metalúrgicas y distribuidores de productos metálicos" },
  { codigo: "5065", descripcion: "Distribuidores de equipamiento y suministros eléctricos" },
  { codigo: "5072", descripcion: "Distribuidores de artículos de ferretería" },
  { codigo: "5074", descripcion: "Distribuidores de equipamiento y suministros de plomería y calefacción" },
  { codigo: "5085", descripcion: "Distribuidores de suministros industriales (no clasificados en otros rubros)" },
  { codigo: "5094", descripcion: "Distribuidores de relojes, joyas, piedras y metales preciosos" },
  { codigo: "5111", descripcion: "Distribuidores de artículos de papelería, material de oficina, impresión y escritura" },
  { codigo: "5122", descripcion: "Distribuidores de productos y suministros farmaceuticos" },
  { codigo: "5131", descripcion: "Distribuidores de telas, mercerías y otros artículos por pieza" },
  { codigo: "5137", descripcion: "Distribuidores de uniformes y ropa comercial" },
  { codigo: "5139", descripcion: "Distribuidores de calzado comercial" },
  { codigo: "5169", descripcion: "Distribuidores de insumos químicos y productos afines (no clasificados en otros rubros)" },
  { codigo: "5172", descripcion: "Distribuidores de petróleo y productos derivados" },
  { codigo: "5192", descripcion: "Distribuidores de libros, revistas y periódicos" },
  { codigo: "5193", descripcion: "Distribuidores de suministros para floristerías y viveros" },
  { codigo: "5198", descripcion: "Distribuidores de pinturas, barnices y suministros de pinturería" },
  { codigo: "5199", descripcion: "Distribuidores de otros bienes no duraderos (no clasificados en otros rubros)" },
  { codigo: "5200", descripcion: "Tiendas de artículos para el equipamiento del hogar" },
  { codigo: "5211", descripcion: "Tiendas de madera y materiales de construcción" },
  { codigo: "5231", descripcion: "Pinturerías y vidrierías" },
  { codigo: "5251", descripcion: "Ferreterías" },
  { codigo: "5261", descripcion: "Viveros y tiendas de jardín" },
  { codigo: "5411", descripcion: "Supermercados y almacenes" },
  { codigo: "5422", descripcion: "Frigoríficos, pescaderías, pollerías y otros alimentos congelados" },
  { codigo: "5441", descripcion: "Supermercados y almacenes" },
  { codigo: "5451", descripcion: "Tiendas de productos lácteos" },
  { codigo: "5462", descripcion: "Panaderías" },
  { codigo: "5499", descripcion: "Tiendas de alimentos preparados (no clasificados en otros rubros)" },
  { codigo: "5511", descripcion: "Venta y reparacion de vehiculos" },
  { codigo: "5521", descripcion: "Venta y reparación de vehículos usados" },
  { codigo: "5532", descripcion: "Tiendas de neumáticos" },
  { codigo: "5533", descripcion: "Tiendas de accesorios y repuestos para vehículos" },
  { codigo: "5541", descripcion: "Venta de combustible en estaciones de servicio" },
  { codigo: "5571", descripcion: "Venta de motocicletas" },
  { codigo: "5599", descripcion: "Venta de equipamiento de automotores, aeronáuticos y agrícolas (no clasificados en otros rubros)" },
  { codigo: "5611", descripcion: "Tiendas de indumentaria y accesorios para hombres y niños" },
  { codigo: "5641", descripcion: "Tiendas de indumentaria infantil" },
  { codigo: "5651", descripcion: "Tiendas de indumentaria general" },
  { codigo: "5655", descripcion: "Tiendas de indumentaria deportiva" },
  { codigo: "5661", descripcion: "Tiendas de calzado" },
  { codigo: "5681", descripcion: "Tiendas de pieles y artículos de pieles" },
  { codigo: "5699", descripcion: "Tiendas de indumentaria (no clasificados en otros rubros)" },
  { codigo: "5712", descripcion: "Mueblerías y tiendas de equipamiento para el hogar" },
  { codigo: "5713", descripcion: "Venta e instalación de pisos, baldosas y alfombras" },
  { codigo: "5714", descripcion: "Tapicerías y tiendas de cortinas" },
  { codigo: "5718", descripcion: "Tienda de chimeneas y accesorios para chimeneas" },
  { codigo: "5719", descripcion: "Tiendas para el amoblamiento del hogar (no clasificados en otros rubros)" },
  { codigo: "5732", descripcion: "Tiendas de electrónica y artículos para el hogar" },
  { codigo: "5733", descripcion: "Tiendas de instrumentos musicales" },
  { codigo: "5734", descripcion: "Tiendas de software de computación" },
  { codigo: "5735", descripcion: "Disquerías" },
  { codigo: "5811", descripcion: "Catering y preparación de alimentos para eventos" },
  { codigo: "5812", descripcion: "Restaurantes" },
  { codigo: "5813", descripcion: "Bares, boliches y discotecas" },
  { codigo: "5814", descripcion: "Restaurantes de comida rápida y fast food" },
  { codigo: "5818", descripcion: "Distribuidor de bienes digitales" },
  { codigo: "5912", descripcion: "Farmacias y perfumerías" },
  { codigo: "5921", descripcion: "Vinotecas, licorerías y tiendas de bebida alcohólicas" },
  { codigo: "5931", descripcion: "Venta de mercadería usada general" },
  { codigo: "5932", descripcion: "Tiendas de antigüedades" },
  { codigo: "5940", descripcion: "Venta y reparación de bicicletas" },
  { codigo: "5941", descripcion: "Tiendas de artículos deportivos" },
  { codigo: "5942", descripcion: "Librerías (tiendas de libros)" },
  { codigo: "5943", descripcion: "Tiendas de artículos de papelería, material de oficina y útiles escolares" },
  { codigo: "5944", descripcion: "Relojerías y joyerías" },
  { codigo: "5945", descripcion: "Jugueterías y tiendas de juegos" },
  { codigo: "5946", descripcion: "Tiendas de cámaras y artículos fotográficos" },
  { codigo: "5948", descripcion: "Tiendas de equipaje y artículos de cuero" },
  { codigo: "5949", descripcion: "Tiendas textiles y artículos de confección de indumentaria" },
  { codigo: "5963", descripcion: "Ventas puerta a puerta" },
  { codigo: "5964", descripcion: "Marketing directo - Ventas por catálogo" },
  { codigo: "5966", descripcion: "Marketing directo - Telemarketing vía llamada saliente" },
  { codigo: "5969", descripcion: "Marketing directo - Otras ventas (no clasificados en otros rubos)" },
  { codigo: "5971", descripcion: "Galerías y venta de arte" },
  { codigo: "5972", descripcion: "Filatelia y venta de monedas de colección" },
  { codigo: "5977", descripcion: "Tiendas de cosméticos" },
  { codigo: "5983", descripcion: "Venta de combustibles (no clasificados en otros rubos)" },
  { codigo: "5992", descripcion: "Floristerías y viveros" },
  { codigo: "5993", descripcion: "Tabaquerías" },
  { codigo: "5994", descripcion: "Venta de díarios y revistas" },
  { codigo: "5995", descripcion: "Tiendas de mascotas, alimentos y artículos para mascotas" },
  { codigo: "5999", descripcion: "Tiendas de artículos especializados (no clasificados en otros rubos)" },
  { codigo: "6010", descripcion: "Desembolso de efectivo - Bancos e instituciones financieras" },
  { codigo: "6012", descripcion: "Proveedores financieros de servicio financieros (solo entidades financieras)" },
  { codigo: "6051", descripcion: "Casas de cambio y otros servicios financieros por entidades no financieras" },
  { codigo: "6211", descripcion: "Corredores de títulos financieros" },
  { codigo: "6300", descripcion: "Compañias de seguros" },
  { codigo: "6513", descripcion: "Agentes de bienes raíces y gestores inmobiliarios" },
  { codigo: "7011", descripcion: "Hoteles, y otros servicios de alojamiento (no clasificados en otros rubros)" },
  { codigo: "7032", descripcion: "Instalaciones deportivas y recreativas" },
  { codigo: "7216", descripcion: "Tintorerías" },
  { codigo: "7221", descripcion: "Servicios de fotografía" },
  { codigo: "7230", descripcion: "Peluquerías y barberías" },
  { codigo: "7251", descripcion: "Reparación de calzado y zapaterías" },
  { codigo: "7261", descripcion: "Servicios funebres y crematorios" },
  { codigo: "7277", descripcion: "Servicios de asesoramiento financiero" },
  { codigo: "7296", descripcion: "Alquiler de indumentaria" },
  { codigo: "7298", descripcion: "Spas y centros de belleza" },
  { codigo: "7299", descripcion: "Otros servicios personales (no clasificados en otros rubros)" },
  { codigo: "7311", descripcion: "Agencias y servicios publicitarios" },
  { codigo: "7321", descripcion: "Servicios de calificación crediticia" },
  { codigo: "7333", descripcion: "Directores de arte, fotografía y diseñadores gráficos" },
  { codigo: "7338", descripcion: "Servicios de copiado, planos y reproducciones" },
  { codigo: "7342", descripcion: "Servicios de exterminio y desinfección" },
  { codigo: "7349", descripcion: "Servicios de limpieza y mantenimiento" },
  { codigo: "7361", descripcion: "Agencias de empleo y servicios temporales" },
  { codigo: "7372", descripcion: "Servicios de programación, procesamiento y diseño de sistemas" },
  { codigo: "7375", descripcion: "Servicios de recuperación de información" },
  { codigo: "7379", descripcion: "Servicios de mantenimiento y reparación de computadoras (no clasificados en otros rubros)" },
  { codigo: "7392", descripcion: "Servicios de gestión, consultoría y relacionistas públicos" },
  { codigo: "7393", descripcion: "Servicios de protección, seguridad e investigación" },
  { codigo: "7394", descripcion: "Alquiler y leasing de equipamientos, herramientas y muebles" },
  { codigo: "7399", descripcion: "Otros servicios generales (no clasificados en otros rubros)" },
  { codigo: "742", descripcion: "Servicios veterinarios" },
  { codigo: "7512", descripcion: "Alquiler de automóviles" },
  { codigo: "7513", descripcion: "Alquiler de trailers, camiones y utilitarios" },
  { codigo: "7523", descripcion: "Estacionamientos, parquímetros y garajes" },
  { codigo: "7534", descripcion: "Servicios de gomerías y reparación de neumáticos" },
  { codigo: "7538", descripcion: "Otros talleres automotrices (no clasificados en otros rubros)" },
  { codigo: "7542", descripcion: "Lavaderos de autos" },
  { codigo: "7629", descripcion: "Talleres de reparaciónes eléctricas y de pequeños electrodomésticos" },
  { codigo: "763", descripcion: "Cooperativas agrícolas" },
  { codigo: "7631", descripcion: "Reparación de relojes y joyería" },
  { codigo: "7641", descripcion: "Restauración de muebles, reparación y repintado" },
  { codigo: "7699", descripcion: "Otros servicios de reparación (no clasificados en otros rubros)" },
  { codigo: "780", descripcion: "Paisajismo y horticultura" },
  { codigo: "7821", descripcion: "Producción y distribución de cine y video" },
  { codigo: "7829", descripcion: "Producción y distribución de cine y video" },
  { codigo: "7841", descripcion: "Videoclubes" },
  { codigo: "7911", descripcion: "Estudios y escuelas de danza" },
  { codigo: "7922", descripcion: "Productores teatrales y ticketeras" },
  { codigo: "7932", descripcion: "Billares y pool" },
  { codigo: "7941", descripcion: "Clubes y campos deportivos" },
  { codigo: "7991", descripcion: "Atracciones turísticas y exhibiciones" },
  { codigo: "7995", descripcion: "Casinos, loterías y juegos de azar" },
  { codigo: "7996", descripcion: "Parques de diversiones y circos" },
  { codigo: "7997", descripcion: "Memebresias de clubes sociales, recreacionales y deportivos" },
  { codigo: "7998", descripcion: "Acuarios y zoológicos" },
  { codigo: "7999", descripcion: "Servicios de recreación (no clasificados en otros rubros)" },
  { codigo: "8011", descripcion: "Médicos (no clasificados en otros rubros)" },
  { codigo: "8021", descripcion: "Dentistas y ortodoncistas" },
  { codigo: "8031", descripcion: "Osteópatas" },
  { codigo: "8043", descripcion: "Opticas" },
  { codigo: "8050", descripcion: "Servicios de cuidado personal, geriátricos" },
  { codigo: "8071", descripcion: "Laboratorios médicos y dentales" },
  { codigo: "8099", descripcion: "Otros servicios médicos y de salud (no clasificados en otros rubros)" },
  { codigo: "8211", descripcion: "Escuelas primarias y secundarias" },
  { codigo: "8220", descripcion: "Universidades y colegios profesionales" },
  { codigo: "8249", descripcion: "Escuelas de oficios y servicios vocacionales" },
  { codigo: "8299", descripcion: "Otros servicios educativos (no clasificados en otros rubros)" },
  { codigo: "8351", descripcion: "Servicios de cuidado infantil" },
  { codigo: "8398", descripcion: "Organizaciones de caridad y servicio social" },
  { codigo: "8641", descripcion: "Asociaciones sociales civiles" },
  { codigo: "8651", descripcion: "Organizaciones políticas" },
  { codigo: "8661", descripcion: "Organizaciones religiosas" },
  { codigo: "8699", descripcion: "Otras organizaciones de membresía (no clasificados en otros rubros)" },
  { codigo: "8734", descripcion: "Laboratorios de pruebas no médicas" },
  { codigo: "8911", descripcion: "Servicios de arquitectura, ingeniería y agrimensura" },
  { codigo: "8931", descripcion: "Servicios de contabilidad y auditoría" },
  { codigo: "8999", descripcion: "Otros servicios profesionales (no clasificados en otros rubros)" },
  { codigo: "9311", descripcion: "Pago de impuestos, rentas y tasas" },
  { codigo: "9399", descripcion: "Otros servicios gubernamentales (no clasificados en otros rubros)" }
];

interface MCCSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const MCCSelector: React.FC<MCCSelectorProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (mccCode: string) => {
    const newValue = value.includes(mccCode)
      ? value.filter((v) => v !== mccCode)
      : [...value, mccCode];
    onChange(newValue);
  };

  const handleRemove = (mccCode: string) => {
    onChange(value.filter((v) => v !== mccCode));
  };

  const getSelectedMCCs = () => {
    return allMCCs.filter((mcc) => value.includes(mcc.codigo));
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value.length > 0
              ? `${value.length} MCC(s) seleccionado(s)`
              : "Seleccionar MCCs..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar MCC..." />
            <CommandList>
              <CommandEmpty>No se encontraron MCCs.</CommandEmpty>
              <CommandGroup>
                {allMCCs.map((mcc) => (
                  <CommandItem
                    key={mcc.codigo}
                    value={`${mcc.codigo} ${mcc.descripcion}`}
                    onSelect={() => handleSelect(mcc.codigo)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(mcc.codigo) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div>
                      <div className="font-medium">{mcc.codigo}</div>
                      <div className="text-sm text-muted-foreground">
                        {mcc.descripcion}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {getSelectedMCCs().map((mcc) => (
            <Badge key={mcc.codigo} variant="secondary" className="gap-1">
              {mcc.codigo} - {mcc.descripcion}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemove(mcc.codigo)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
