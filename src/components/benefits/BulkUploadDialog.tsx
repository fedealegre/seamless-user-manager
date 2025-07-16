
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
import { CSVValidationError } from "@/types/benefits";

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BulkUploadDialog: React.FC<BulkUploadDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<CSVValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleFile = async (selectedFile: File) => {
    if (selectedFile.type !== "text/csv") {
      alert("Por favor selecciona un archivo CSV válido");
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);

    // Simulate file processing and validation
    setTimeout(() => {
      // Mock validation errors
      const mockErrors: CSVValidationError[] = [
        {
          linea: 3,
          datoConError: "Valor (%)",
          descripcionError: "El valor debe ser mayor a 0",
        },
        {
          linea: 5,
          datoConError: "Fecha de Inicio",
          descripcionError: "Formato de fecha inválido",
        },
      ];
      setValidationErrors(mockErrors);
      setIsProcessing(false);
    }, 2000);
  };

  const downloadTemplate = () => {
    // Create CSV template
    const csvContent = "titulo,descripcion,legales,valorPorcentaje,topePorCompra,orden,categoria,mcc,fechaInicio,fechaFin\n" +
      "Descuento Ejemplo,5% de descuento,Válido hasta agotar stock,5,50000,1,Alimentación,5411,2024-01-01 00:00,2024-12-31 23:59";
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla_beneficios.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      console.log("Uploading file:", file.name);
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (validationErrors.length === 0) {
        onOpenChange(false);
        setFile(null);
        setValidationErrors([]);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setValidationErrors([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Carga Masiva de Beneficios</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!file ? (
            <>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Sube un archivo CSV para crear múltiples beneficios.
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

              {!isProcessing && validationErrors.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-green-600 mb-4">
                    ✓ Archivo validado correctamente
                  </div>
                  <Button onClick={handleUpload}>
                    Procesar Carga Masiva
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
