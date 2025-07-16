
import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
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
import { MCC } from "@/types/benefits";

const mockMCCs: MCC[] = [
  {
    id: "1",
    codigo: "5411",
    descripcion: "Supermercados",
    fechaCreacion: new Date("2024-01-01"),
  },
  {
    id: "2",
    codigo: "5499",
    descripcion: "Tiendas de conveniencia",
    fechaCreacion: new Date("2024-01-02"),
  },
  {
    id: "3",
    codigo: "5541",
    descripcion: "Estaciones de servicio",
    fechaCreacion: new Date("2024-01-03"),
  },
];

const MCCMaster: React.FC = () => {
  const [mccs, setMccs] = useState<MCC[]>(mockMCCs);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMCC, setEditingMCC] = useState<MCC | null>(null);
  const [formData, setFormData] = useState({ codigo: "", descripcion: "" });

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestionar Rubros (MCC)</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Añadir Nuevo
        </Button>
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
            {mccs.map((mcc) => (
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
    </div>
  );
};

export default MCCMaster;
