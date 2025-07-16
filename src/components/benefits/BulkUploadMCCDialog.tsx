
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
      "5411,Supermercados y almacenes\n" +
      "5812,Restaurantes\n" +
      "5541,Venta de combustible en estaciones de servicio";
    
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
