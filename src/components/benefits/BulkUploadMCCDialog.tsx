
import React, { useState } from "react";
import { Download, Upload, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CSVValidationError, MCC } from "@/types/benefits";

interface BulkUploadMCCDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: (mccs: MCC[]) => void;
}

export const BulkUploadMCCDialog: React.FC<BulkUploadMCCDialogProps> = ({
  open,
  onOpenChange,
  onUploadSuccess,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<CSVValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedMccs, setParsedMccs] = useState<MCC[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const parseCSV = (csvText: string): { mccs: MCC[], errors: CSVValidationError[] } => {
    const lines = csvText.split('\n').map(line => line.trim()).filter(line => line);
    const errors: CSVValidationError[] = [];
    const mccs: MCC[] = [];

    // Skip header line
    const dataLines = lines.slice(1);

    dataLines.forEach((line, index) => {
      const lineNumber = index + 2; // +2 because we skipped header and arrays are 0-indexed
      const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));

      if (columns.length < 2) {
        errors.push({
          linea: lineNumber,
          datoConError: "Estructura",
          descripcionError: "La línea debe tener al menos 2 columnas (MCC, Descripción)"
        });
        return;
      }

      const [codigo, descripcion] = columns;

      // Validate MCC code
      if (!codigo || !/^\d{4}$/.test(codigo)) {
        errors.push({
          linea: lineNumber,
          datoConError: "MCC",
          descripcionError: "El código MCC debe ser un número de 4 dígitos"
        });
      }

      // Validate description
      if (!descripcion || descripcion.length < 3) {
        errors.push({
          linea: lineNumber,
          datoConError: "Descripción",
          descripcionError: "La descripción debe tener al menos 3 caracteres"
        });
      }

      if (codigo && descripcion && /^\d{4}$/.test(codigo) && descripcion.length >= 3) {
        mccs.push({
          id: `csv-${Date.now()}-${index}`,
          codigo,
          descripcion,
          fechaCreacion: new Date()
        });
      }
    });

    return { mccs, errors };
  };

  const handleFile = async (selectedFile: File) => {
    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
      alert("Por favor selecciona un archivo CSV válido");
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);

    try {
      const text = await selectedFile.text();
      const { mccs, errors } = parseCSV(text);
      
      setValidationErrors(errors);
      setParsedMccs(mccs);
    } catch (error) {
      console.error("Error parsing CSV:", error);
      setValidationErrors([{
        linea: 1,
        datoConError: "Archivo",
        descripcionError: "Error al procesar el archivo CSV"
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "MCC,Descripción\n" +
      "1520,Servicio de construcción de viviendas y comercial\n" +
      "1740,\"Albañilería, mampostería, colocación de azulejos, trabajos en yeso y aislamientos\"\n" +
      "1750,Carpinteros y otros servicios de carpintería\n" +
      "1771,Trabajos de hormigón y concreto\n" +
      "1799,Otros contratistas (no clasificados en otros rubros)\n" +
      "2741,\"Servicios editoriales, de publicación y de impresión varios\"\n" +
      "2842,\"Fabricantes de productos especiales de limpieza, pulido y saneamiento\"\n" +
      "4011,Servicio de fletes por vías ferroviarias\n" +
      "4111,Transporte de pasajeros local y suburbano\n" +
      "4112,Trenes y ferrocarriles de pasajeros\n" +
      "4121,\"Taxis, limosinas y servcio de transporte particular de pasajeros\"\n" +
      "4214,\"Mudanzas, deliveries, servicos de mensajería o flete de corta y larga distancia\"\n" +
      "4215,Servicios de despachos postales aéreos y terrestres\n" +
      "4225,Proveedores de almacenamiento o depósito\n" +
      "4457,Alquiler y leasing de barcos y botes\n" +
      "4468,\"Marinas, guarderías y clubes náuticos\"\n" +
      "4511,Aerolíneas y compañías aéreas (no clasificados en otros rubros)\n" +
      "4582,\"Terminales aéreas: aeropuertos, aeródromos y pistas de aterrizaje\"\n" +
      "4722,Agencias de viaje y operadores turísticos\n" +
      "4784,Peajes y cánones de tránsito\n" +
      "4789,Servicios de transporte (no clasificados en otros rubros)\n" +
      "4812,Venta de equipos telefónicos y de telecomunicaciones\n" +
      "4814,\"Servicios de telecomunicaciones: locales, larga distancia y servicios de fax\"\n" +
      "4816,Proveedores de redes de computación e informatica\n" +
      "4829,Transferencia de dinero\n" +
      "4899,\"Servicios pagos de televisión, radio y streaming\"\n" +
      "4900,\"Servicios de electricidad, gas y agua\"\n" +
      "5013,Distribuidores y mayoristas de autopartes\n" +
      "5021,Distribuidores de amoblamiento comercial y de oficina\n" +
      "5039,Distribuidores de materiales de construcción (no clasificados en otros rubros)\n" +
      "5044,Distribuidores de suministros fotográficos y de fotocopiado\n" +
      "5045,Distribuidores de equipamiento de computación (software y hardware)\n" +
      "5046,Distribuidores de equipamiento comercial y suministros (no clasificados en otros rubros)\n" +
      "5047,\"Distribuidores de equipamiento medico, dental, oftálmico y suministros hospitalarios\"\n" +
      "5051,Metalúrgicas y distribuidores de productos metálicos\n" +
      "5065,Distribuidores de equipamiento y suministros eléctricos\n" +
      "5072,Distribuidores de artículos de ferretería\n" +
      "5074,Distribuidores de equipamiento y suministros de plomería y calefacción\n" +
      "5085,Distribuidores de suministros industriales (no clasificados en otros rubros)\n" +
      "5094,\"Distribuidores de relojes, joyas, piedras y metales preciosos\"\n" +
      "5111,\"Distribuidores de artículos de papelería, material de oficina, impresión y escritura\"\n" +
      "5122,Distribuidores de productos y suministros farmaceuticos\n" +
      "5131,\"Distribuidores de telas, mercerías y otros artículos por pieza\"\n" +
      "5137,Distribuidores de uniformes y ropa comercial\n" +
      "5139,Distribuidores de calzado comercial\n" +
      "5169,Distribuidores de insumos químicos y productos afines (no clasificados en otros rubros)\n" +
      "5172,Distribuidores de petróleo y productos derivados\n" +
      "5192,\"Distribuidores de libros, revistas y periódicos\"\n" +
      "5193,Distribuidores de suministros para floristerías y viveros\n" +
      "5198,\"Distribuidores de pinturas, barnices y suministros de pinturería\"\n" +
      "5199,Distribuidores de otros bienes no duraderos (no clasificados en otros rubros)\n" +
      "5200,Tiendas de artículos para el equipamiento del hogar\n" +
      "5211,Tiendas de madera y materiales de construcción\n" +
      "5231,Pinturerías y vidrierías\n" +
      "5251,Ferreterías\n" +
      "5261,Viveros y tiendas de jardín\n" +
      "5411,Supermercados y almacenes\n" +
      "5422,\"Frigoríficos, pescaderías, pollerías y otros alimentos congelados\"\n" +
      "5441,Supermercados y almacenes\n" +
      "5451,Tiendas de productos lácteos\n" +
      "5462,Panaderías\n" +
      "5499,Tiendas de alimentos preparados (no clasificados en otros rubros)\n" +
      "5511,Venta y reparacion de vehiculos\n" +
      "5521,Venta y reparación de vehículos usados\n" +
      "5532,Tiendas de neumáticos\n" +
      "5533,Tiendas de accesorios y repuestos para vehículos\n" +
      "5541,Venta de combustible en estaciones de servicio\n" +
      "5571,Venta de motocicletas\n" +
      "5599,\"Venta de equipamiento de automotores, aeronáuticos y agrícolas (no clasificados en otros rubros)\"\n" +
      "5611,Tiendas de indumentaria y accesorios para hombres y niños\n" +
      "5641,Tiendas de indumentaria infantil\n" +
      "5651,Tiendas de indumentaria general\n" +
      "5655,Tiendas de indumentaria deportiva\n" +
      "5661,Tiendas de calzado\n" +
      "5681,Tiendas de pieles y artículos de pieles\n" +
      "5699,Tiendas de indumentaria (no clasificados en otros rubros)\n" +
      "5712,Mueblerías y tiendas de equipamiento para el hogar\n" +
      "5713,\"Venta e instalación de pisos, baldosas y alfombras\"\n" +
      "5714,Tapicerías y tiendas de cortinas\n" +
      "5718,Tienda de chimeneas y accesorios para chimeneas\n" +
      "5719,Tiendas para el amoblamiento del hogar (no clasificados en otros rubros)\n" +
      "5732,Tiendas de electrónica y artículos para el hogar\n" +
      "5733,Tiendas de instrumentos musicales\n" +
      "5734,Tiendas de software de computación\n" +
      "5735,Disquerías\n" +
      "5811,Catering y preparación de alimentos para eventos\n" +
      "5812,Restaurantes\n" +
      "5813,\"Bares, boliches y discotecas\"\n" +
      "5814,Restaurantes de comida rápida y fast food\n" +
      "5818,Distribuidor de bienes digitales\n" +
      "5912,Farmacias y perfumerías\n" +
      "5921,\"Vinotecas, licorerías y tiendas de bebida alcohólicas\"\n" +
      "5931,Venta de mercadería usada general\n" +
      "5932,Tiendas de antigüedades\n" +
      "5940,Venta y reparación de bicicletas\n" +
      "5941,Tiendas de artículos deportivos\n" +
      "5942,Librerías (tiendas de libros)\n" +
      "5943,\"Tiendas de artículos de papelería, material de oficina y útiles escolares\"\n" +
      "5944,Relojerías y joyerías\n" +
      "5945,Jugueterías y tiendas de juegos\n" +
      "5946,Tiendas de cámaras y artículos fotográficos\n" +
      "5948,Tiendas de equipaje y artículos de cuero\n" +
      "5949,Tiendas textiles y artículos de confección de indumentaria\n" +
      "5963,Ventas puerta a puerta\n" +
      "5964,Marketing directo - Ventas por catálogo\n" +
      "5966,Marketing directo - Telemarketing vía llamada saliente\n" +
      "5969,Marketing directo - Otras ventas (no clasificados en otros rubos)\n" +
      "5971,Galerías y venta de arte\n" +
      "5972,Filatelia y venta de monedas de colección\n" +
      "5977,Tiendas de cosméticos\n" +
      "5983,Venta de combustibles (no clasificados en otros rubos)\n" +
      "5992,Floristerías y viveros\n" +
      "5993,Tabaquerías\n" +
      "5994,Venta de díarios y revistas\n" +
      "5995,\"Tiendas de mascotas, alimentos y artículos para mascotas\"\n" +
      "5999,Tiendas de artículos especializados (no clasificados en otros rubos)\n" +
      "6010,Desembolso de efectivo - Bancos e instituciones financieras\n" +
      "6012,Proveedores financieros de servicio financieros (solo entidades financieras)\n" +
      "6051,Casas de cambio y otros servicios financieros por entidades no financieras\n" +
      "6211,Corredores de títulos financieros\n" +
      "6300,Compañias de seguros\n" +
      "6513,Agentes de bienes raíces y gestores inmobiliarios\n" +
      "7011,\"Hoteles, y otros servicios de alojamiento (no clasificados en otros rubros)\"\n" +
      "7032,Instalaciones deportivas y recreativas\n" +
      "7216,Tintorerías\n" +
      "7221,Servicios de fotografía\n" +
      "7230,Peluquerías y barberías\n" +
      "7251,Reparación de calzado y zapaterías\n" +
      "7261,Servicios funebres y crematorios\n" +
      "7277,Servicios de asesoramiento financiero\n" +
      "7296,Alquiler de indumentaria\n" +
      "7298,Spas y centros de belleza\n" +
      "7299,Otros servicios personales (no clasificados en otros rubros)\n" +
      "7311,Agencias y servicios publicitarios\n" +
      "7321,Servicios de calificación crediticia\n" +
      "7333,\"Directores de arte, fotografía y diseñadores gráficos\"\n" +
      "7338,\"Servicios de copiado, planos y reproducciones\"\n" +
      "7342,Servicios de exterminio y desinfección\n" +
      "7349,Servicios de limpieza y mantenimiento\n" +
      "7361,Agencias de empleo y servicios temporales\n" +
      "7372,\"Servicios de programación, procesamiento y diseño de sistemas\"\n" +
      "7375,Servicios de recuperación de información\n" +
      "7379,Servicios de mantenimiento y reparación de computadoras (no clasificados en otros rubros)\n" +
      "7392,\"Servicios de gestión, consultoría y relacionistas públicos\"\n" +
      "7393,\"Servicios de protección, seguridad e investigación\"\n" +
      "7394,\"Alquiler y leasing de equipamientos, herramientas y muebles\"\n" +
      "7399,Otros servicios generales (no clasificados en otros rubros)\n" +
      "742,Servicios veterinarios\n" +
      "7512,Alquiler de automóviles\n" +
      "7513,\"Alquiler de trailers, camiones y utilitarios\"\n" +
      "7523,\"Estacionamientos, parquímetros y garajes\"\n" +
      "7534,Servicios de gomerías y reparación de neumáticos\n" +
      "7538,Otros talleres automotrices (no clasificados en otros rubros)\n" +
      "7542,Lavaderos de autos\n" +
      "7629,Talleres de reparaciónes eléctricas y de pequeños electrodomésticos\n" +
      "763,Cooperativas agrícolas\n" +
      "7631,Reparación de relojes y joyería\n" +
      "7641,\"Restauración de muebles, reparación y repintado\"\n" +
      "7699,Otros servicios de reparación (no clasificados en otros rubros)\n" +
      "780,Paisajismo y horticultura\n" +
      "7821,Producción y distribución de cine y video\n" +
      "7829,Producción y distribución de cine y video\n" +
      "7841,Videoclubes\n" +
      "7911,Estudios y escuelas de danza\n" +
      "7922,Productores teatrales y ticketeras\n" +
      "7932,Billares y pool\n" +
      "7941,Clubes y campos deportivos\n" +
      "7991,Atracciones turísticas y exhibiciones\n" +
      "7995,\"Casinos, loterías y juegos de azar\"\n" +
      "7996,Parques de diversiones y circos\n" +
      "7997,\"Memebresias de clubes sociales, recreacionales y deportivos\"\n" +
      "7998,Acuarios y zoológicos\n" +
      "7999,Servicios de recreación (no clasificados en otros rubros)\n" +
      "8011,Médicos (no clasificados en otros rubros)\n" +
      "8021,Dentistas y ortodoncistas\n" +
      "8031,Osteópatas\n" +
      "8043,Opticas\n" +
      "8050,\"Servicios de cuidado personal, geriátricos\"\n" +
      "8071,Laboratorios médicos y dentales\n" +
      "8099,Otros servicios médicos y de salud (no clasificados en otros rubros)\n" +
      "8211,Escuelas primarias y secundarias\n" +
      "8220,Universidades y colegios profesionales\n" +
      "8249,Escuelas de oficios y servicios vocacionales\n" +
      "8299,Otros servicios educativos (no clasificados en otros rubros)\n" +
      "8351,Servicios de cuidado infantil\n" +
      "8398,Organizaciones de caridad y servicio social\n" +
      "8641,Asociaciones sociales civiles\n" +
      "8651,Organizaciones políticas\n" +
      "8661,Organizaciones religiosas\n" +
      "8699,Otras organizaciones de membresía (no clasificados en otros rubros)\n" +
      "8734,Laboratorios de pruebas no médicas\n" +
      "8911,\"Servicios de arquitectura, ingeniería y agrimensura\"\n" +
      "8931,Servicios de contabilidad y auditoría\n" +
      "8999,Otros servicios profesionales (no clasificados en otros rubros)\n" +
      "9311,\"Pago de impuestos, rentas y tasas\"\n" +
      "9399,Otros servicios gubernamentales (no clasificados en otros rubros)";
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla_mcc.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    if (!file || parsedMccs.length === 0) return;

    setIsProcessing(true);
    try {
      console.log("Uploading MCCs:", parsedMccs);
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onUploadSuccess(parsedMccs);
      reset();
    } catch (error) {
      console.error("Error uploading MCCs:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setValidationErrors([]);
    setParsedMccs([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Carga Masiva de MCCs</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!file ? (
            <>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Sube un archivo CSV para cargar múltiples códigos MCC y sus descripciones.
                </p>

                <Button
                  variant="outline"
                  onClick={downloadTemplate}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Descargar Plantilla CSV
                </Button>

                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">
                      Arrastra y suelta tu archivo CSV aquí
                    </p>
                    <p className="text-muted-foreground">o</p>
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <Button variant="outline" asChild>
                        <span>Seleccionar archivo</span>
                      </Button>
                      <input
                        id="csv-upload"
                        type="file"
                        accept=".csv"
                        className="sr-only"
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Archivo seleccionado:</h3>
                  <p className="text-sm text-muted-foreground">{file.name}</p>
                </div>
                <Button variant="outline" onClick={reset}>
                  Cambiar archivo
                </Button>
              </div>

              {isProcessing && (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Procesando archivo...</p>
                </div>
              )}

              {!isProcessing && validationErrors.length > 0 && (
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Se encontraron {validationErrors.length} errores en el archivo.
                      Por favor corrígelos antes de continuar.
                    </AlertDescription>
                  </Alert>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Línea</TableHead>
                        <TableHead>Dato con Error</TableHead>
                        <TableHead>Descripción del Error</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {validationErrors.map((error, index) => (
                        <TableRow key={index}>
                          <TableCell>{error.linea}</TableCell>
                          <TableCell>{error.datoConError}</TableCell>
                          <TableCell>{error.descripcionError}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {!isProcessing && validationErrors.length === 0 && parsedMccs.length > 0 && (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className="text-green-600 mb-4">
                      ✓ Archivo validado correctamente - {parsedMccs.length} MCCs encontrados
                    </div>
                    <Button onClick={handleUpload} disabled={isProcessing}>
                      Procesar Carga Masiva
                    </Button>
                  </div>

                  <div className="max-h-60 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código MCC</TableHead>
                          <TableHead>Descripción</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedMccs.slice(0, 10).map((mcc, index) => (
                          <TableRow key={index}>
                            <TableCell>{mcc.codigo}</TableCell>
                            <TableCell>{mcc.descripcion}</TableCell>
                          </TableRow>
                        ))}
                        {parsedMccs.length > 10 && (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center text-muted-foreground">
                              ... y {parsedMccs.length - 10} MCCs más
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
