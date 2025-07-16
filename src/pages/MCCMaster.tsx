
import React, { useState } from "react";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { MCC } from "@/types/benefits";
import { BulkUploadMCCDialog } from "@/components/benefits/BulkUploadMCCDialog";

const mockMCCs: MCC[] = [
  { id: "1", codigo: "1520", descripcion: "Servicio de construcción de viviendas y comercial", fechaCreacion: new Date("2024-01-01") },
  { id: "2", codigo: "1740", descripcion: "Albañilería, mampostería, colocación de azulejos, trabajos en yeso y aislamientos", fechaCreacion: new Date("2024-01-02") },
  { id: "3", codigo: "1750", descripcion: "Carpinteros y otros servicios de carpintería", fechaCreacion: new Date("2024-01-03") },
  { id: "4", codigo: "1771", descripcion: "Trabajos de hormigón y concreto", fechaCreacion: new Date("2024-01-04") },
  { id: "5", codigo: "1799", descripcion: "Otros contratistas (no clasificados en otros rubros)", fechaCreacion: new Date("2024-01-05") },
  { id: "6", codigo: "2741", descripcion: "Servicios editoriales, de publicación y de impresión varios", fechaCreacion: new Date("2024-01-06") },
  { id: "7", codigo: "2842", descripcion: "Fabricantes de productos especiales de limpieza, pulido y saneamiento", fechaCreacion: new Date("2024-01-07") },
  { id: "8", codigo: "4011", descripcion: "Servicio de fletes por vías ferroviarias", fechaCreacion: new Date("2024-01-08") },
  { id: "9", codigo: "4111", descripcion: "Transporte de pasajeros local y suburbano", fechaCreacion: new Date("2024-01-09") },
  { id: "10", codigo: "4112", descripcion: "Trenes y ferrocarriles de pasajeros", fechaCreacion: new Date("2024-01-10") },
  { id: "11", codigo: "4121", descripcion: "Taxis, limosinas y servcio de transporte particular de pasajeros", fechaCreacion: new Date("2024-01-11") },
  { id: "12", codigo: "4214", descripcion: "Mudanzas, deliveries, servicos de mensajería o flete de corta y larga distancia", fechaCreacion: new Date("2024-01-12") },
  { id: "13", codigo: "4215", descripcion: "Servicios de despachos postales aéreos y terrestres", fechaCreacion: new Date("2024-01-13") },
  { id: "14", codigo: "4225", descripcion: "Proveedores de almacenamiento o depósito", fechaCreacion: new Date("2024-01-14") },
  { id: "15", codigo: "4457", descripcion: "Alquiler y leasing de barcos y botes", fechaCreacion: new Date("2024-01-15") },
  { id: "16", codigo: "4468", descripcion: "Marinas, guarderías y clubes náuticos", fechaCreacion: new Date("2024-01-16") },
  { id: "17", codigo: "4511", descripcion: "Aerolíneas y compañías aéreas (no clasificados en otros rubros)", fechaCreacion: new Date("2024-01-17") },
  { id: "18", codigo: "4582", descripcion: "Terminales aéreas: aeropuertos, aeródromos y pistas de aterrizaje", fechaCreacion: new Date("2024-01-18") },
  { id: "19", codigo: "4722", descripcion: "Agencias de viaje y operadores turísticos", fechaCreacion: new Date("2024-01-19") },
  { id: "20", codigo: "4784", descripcion: "Peajes y cánones de tránsito", fechaCreacion: new Date("2024-01-20") },
  { id: "21", codigo: "4789", descripcion: "Servicios de transporte (no clasificados en otros rubros)", fechaCreacion: new Date("2024-01-21") },
  { id: "22", codigo: "4812", descripcion: "Venta de equipos telefónicos y de telecomunicaciones", fechaCreacion: new Date("2024-01-22") },
  { id: "23", codigo: "4814", descripcion: "Servicios de telecomunicaciones: locales, larga distancia y servicios de fax", fechaCreacion: new Date("2024-01-23") },
  { id: "24", codigo: "4816", descripcion: "Proveedores de redes de computación e informatica", fechaCreacion: new Date("2024-01-24") },
  { id: "25", codigo: "4829", descripcion: "Transferencia de dinero", fechaCreacion: new Date("2024-01-25") },
  { id: "26", codigo: "4899", descripcion: "Servicios pagos de televisión, radio y streaming", fechaCreacion: new Date("2024-01-26") },
  { id: "27", codigo: "4900", descripcion: "Servicios de electricidad, gas y agua", fechaCreacion: new Date("2024-01-27") },
  { id: "28", codigo: "5013", descripcion: "Distribuidores y mayoristas de autopartes", fechaCreacion: new Date("2024-01-28") },
  { id: "29", codigo: "5021", descripcion: "Distribuidores de amoblamiento comercial y de oficina", fechaCreacion: new Date("2024-01-29") },
  { id: "30", codigo: "5039", descripcion: "Distribuidores de materiales de construcción (no clasificados en otros rubros)", fechaCreacion: new Date("2024-01-30") },
  { id: "31", codigo: "5044", descripcion: "Distribuidores de suministros fotográficos y de fotocopiado", fechaCreacion: new Date("2024-01-31") },
  { id: "32", codigo: "5045", descripcion: "Distribuidores de equipamiento de computación (software y hardware)", fechaCreacion: new Date("2024-02-01") },
  { id: "33", codigo: "5046", descripcion: "Distribuidores de equipamiento comercial y suministros (no clasificados en otros rubros)", fechaCreacion: new Date("2024-02-02") },
  { id: "34", codigo: "5047", descripcion: "Distribuidores de equipamiento medico, dental, oftálmico y suministros hospitalarios", fechaCreacion: new Date("2024-02-03") },
  { id: "35", codigo: "5051", descripcion: "Metalúrgicas y distribuidores de productos metálicos", fechaCreacion: new Date("2024-02-04") },
  { id: "36", codigo: "5065", descripcion: "Distribuidores de equipamiento y suministros eléctricos", fechaCreacion: new Date("2024-02-05") },
  { id: "37", codigo: "5072", descripcion: "Distribuidores de artículos de ferretería", fechaCreacion: new Date("2024-02-06") },
  { id: "38", codigo: "5074", descripcion: "Distribuidores de equipamiento y suministros de plomería y calefacción", fechaCreacion: new Date("2024-02-07") },
  { id: "39", codigo: "5085", descripcion: "Distribuidores de suministros industriales (no clasificados en otros rubros)", fechaCreacion: new Date("2024-02-08") },
  { id: "40", codigo: "5094", descripcion: "Distribuidores de relojes, joyas, piedras y metales preciosos", fechaCreacion: new Date("2024-02-09") },
  { id: "41", codigo: "5111", descripcion: "Distribuidores de artículos de papelería, material de oficina, impresión y escritura", fechaCreacion: new Date("2024-02-10") },
  { id: "42", codigo: "5122", descripcion: "Distribuidores de productos y suministros farmaceuticos", fechaCreacion: new Date("2024-02-11") },
  { id: "43", codigo: "5131", descripcion: "Distribuidores de telas, mercerías y otros artículos por pieza", fechaCreacion: new Date("2024-02-12") },
  { id: "44", codigo: "5137", descripcion: "Distribuidores de uniformes y ropa comercial", fechaCreacion: new Date("2024-02-13") },
  { id: "45", codigo: "5139", descripcion: "Distribuidores de calzado comercial", fechaCreacion: new Date("2024-02-14") },
  { id: "46", codigo: "5169", descripcion: "Distribuidores de insumos químicos y productos afines (no clasificados en otros rubros)", fechaCreacion: new Date("2024-02-15") },
  { id: "47", codigo: "5172", descripcion: "Distribuidores de petróleo y productos derivados", fechaCreacion: new Date("2024-02-16") },
  { id: "48", codigo: "5192", descripcion: "Distribuidores de libros, revistas y periódicos", fechaCreacion: new Date("2024-02-17") },
  { id: "49", codigo: "5193", descripcion: "Distribuidores de suministros para floristerías y viveros", fechaCreacion: new Date("2024-02-18") },
  { id: "50", codigo: "5198", descripcion: "Distribuidores de pinturas, barnices y suministros de pinturería", fechaCreacion: new Date("2024-02-19") }
];

const ITEMS_PER_PAGE = 10;

const MCCMaster: React.FC = () => {
  const [mccs, setMccs] = useState<MCC[]>(mockMCCs);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [editingMCC, setEditingMCC] = useState<MCC | null>(null);
  const [formData, setFormData] = useState({ codigo: "", descripcion: "" });
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(mccs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMccs = mccs.slice(startIndex, endIndex);

  const handleAdd = () => {
    setEditingMCC(null);
    setFormData({ codigo: "", descripcion: "" });
    setDialogOpen(true);
  };

  const handleEdit = (mcc: MCC) => {
    setEditingMCC(mcc);
    setFormData({ codigo: mcc.codigo, descripcion: mcc.descripcion });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este MCC?")) {
      setMccs(mccs.filter(mcc => mcc.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.codigo.trim() || !formData.descripcion.trim()) return;

    if (editingMCC) {
      setMccs(mccs.map(mcc =>
        mcc.id === editingMCC.id
          ? { ...mcc, codigo: formData.codigo, descripcion: formData.descripcion }
          : mcc
      ));
    } else {
      const newMCC: MCC = {
        id: Date.now().toString(),
        codigo: formData.codigo,
        descripcion: formData.descripcion,
        fechaCreacion: new Date(),
      };
      setMccs([...mccs, newMCC]);
    }

    setDialogOpen(false);
    setFormData({ codigo: "", descripcion: "" });
  };

  const handleBulkUpload = (newMccs: MCC[]) => {
    setMccs([...mccs, ...newMccs]);
    setBulkUploadOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestionar Rubros (MCC)</h1>
        <div className="flex gap-2">
          <Button onClick={() => setBulkUploadOpen(true)} variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Carga Masiva
          </Button>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Añadir Nuevo
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="w-32">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentMccs.map((mcc) => (
              <TableRow key={mcc.id}>
                <TableCell className="font-medium">{mcc.codigo}</TableCell>
                <TableCell>{mcc.descripcion}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(mcc)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(mcc.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="p-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMCC ? "Editar MCC" : "Nuevo MCC"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                placeholder="Código MCC (ej: 5411)"
              />
            </div>
            <div>
              <Label htmlFor="descripcion">Descripción *</Label>
              <Input
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción del MCC"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!formData.codigo.trim() || !formData.descripcion.trim()}
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BulkUploadMCCDialog
        open={bulkUploadOpen}
        onOpenChange={setBulkUploadOpen}
        onUploadSuccess={handleBulkUpload}
      />
    </div>
  );
};

export default MCCMaster;
