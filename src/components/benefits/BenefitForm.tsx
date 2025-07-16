
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { ImageUpload } from "./ImageUpload";
import { MCCSelector } from "./MCCSelector";
import { Benefit } from "@/types/benefits";

const benefitSchema = z.object({
  titulo: z.string().min(1, "El título es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  descripcionExtendida: z.string().optional(),
  legales: z.string().min(1, "Los legales son requeridos"),
  valorPorcentaje: z.number().min(0.01, "El valor debe ser mayor a 0"),
  topePorCompra: z.number().min(1, "El tope por compra es requerido"),
  imagen: z.string().optional(),
  orden: z.number().min(1, "El orden es requerido"),
  categoria: z.string().min(1, "La categoría es requerida"),
  mcc: z.array(z.string()).min(1, "Debe seleccionar al menos un MCC"),
  fechaInicio: z.date({ required_error: "La fecha de inicio es requerida" }),
  fechaFin: z.date({ required_error: "La fecha de fin es requerida" }),
}).refine((data) => data.fechaFin > data.fechaInicio, {
  message: "La fecha de fin debe ser posterior a la fecha de inicio",
  path: ["fechaFin"],
});

type BenefitFormData = z.infer<typeof benefitSchema>;

interface BenefitFormProps {
  benefit?: Benefit;
  onSuccess: () => void;
  onCancel: () => void;
}

const mockCategories = [
  { id: "1", nombre: "Alimentación" },
  { id: "2", nombre: "Combustibles" },
  { id: "3", nombre: "Entretenimiento" },
  { id: "4", nombre: "Transporte" },
];

export const BenefitForm: React.FC<BenefitFormProps> = ({
  benefit,
  onSuccess,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BenefitFormData>({
    resolver: zodResolver(benefitSchema),
    defaultValues: benefit ? {
      titulo: benefit.titulo,
      descripcion: benefit.descripcion,
      descripcionExtendida: benefit.descripcionExtendida || "",
      legales: benefit.legales,
      valorPorcentaje: benefit.valorPorcentaje,
      topePorCompra: benefit.topePorCompra,
      imagen: benefit.imagen || "",
      orden: benefit.orden,
      categoria: benefit.categoria,
      mcc: benefit.mcc,
      fechaInicio: benefit.fechaInicio,
      fechaFin: benefit.fechaFin,
    } : {
      titulo: "",
      descripcion: "",
      descripcionExtendida: "",
      legales: "",
      valorPorcentaje: 0,
      topePorCompra: 0,
      imagen: "",
      orden: 1,
      categoria: "",
      mcc: [],
      fechaInicio: new Date(),
      fechaFin: new Date(),
    },
  });

  const onSubmit = async (data: BenefitFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting benefit:", data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess();
    } catch (error) {
      console.error("Error submitting benefit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descripcionExtendida"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción Extendida</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="legales"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legales *</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="valorPorcentaje"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (%) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="topePorCompra"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tope por Compra *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="imagen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="orden"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orden *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockCategories.map((category) => (
                          <SelectItem key={category.id} value={category.nombre}>
                            {category.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="mcc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rubro (MCC) *</FormLabel>
                  <FormControl>
                    <MCCSelector
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fechaInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Inicio *</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        onSelect={field.onChange}
                        displayTime={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaFin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Fin *</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        onSelect={field.onChange}
                        displayTime={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
