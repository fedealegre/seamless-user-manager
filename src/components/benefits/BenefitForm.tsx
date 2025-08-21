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
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { useCreateBenefit, useUpdateBenefit } from "@/hooks/use-benefits";

interface BenefitFormProps {
  benefit?: Benefit;
  onSuccess: () => void;
  onCancel: () => void;
}

const mockCategories = [
  { id: "1", nombre: "Librería" },
  { id: "2", nombre: "Carnicería" },
  { id: "3", nombre: "Juguetería" },
  { id: "4", nombre: "Supermercado" },
  { id: "5", nombre: "Panadería" },
  { id: "6", nombre: "Farmacia" },
  { id: "7", nombre: "Verdulería" },
  { id: "8", nombre: "Combustible" },
  { id: "9", nombre: "Café" },
];

export const BenefitForm: React.FC<BenefitFormProps> = ({
  benefit,
  onSuccess,
  onCancel,
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  const createBenefit = useCreateBenefit();
  const updateBenefit = useUpdateBenefit();
  
  const isSubmitting = benefit ? updateBenefit.isPending : createBenefit.isPending;

  const benefitSchema = z.object({
    tipo: z.literal('Cashback'),
    titulo: z.string().min(1, t('title-required')),
    descripcion: z.string().min(1, t('description-required')),
    descripcionExtendida: z.string().optional(),
    legales: z.string().min(1, t('legal-terms-required')),
    valorPorcentaje: z.number().min(0.01, t('value-required')),
    topePorCompra: z.number().min(1, t('limit-required')),
    imagen: z.string().optional(),
    orden: z.number().min(1, t('order-required')),
    categoria: z.string().min(1, t('category-required')),
    mcc: z.array(z.string()).min(1, t('mcc-required')),
    fechaInicio: z.date({ required_error: t('start-date-required') }),
    fechaFin: z.date({ required_error: t('end-date-required') }),
  }).refine((data) => data.fechaFin > data.fechaInicio, {
    message: t('end-date-after-start'),
    path: ["fechaFin"],
  });

  type BenefitFormData = z.infer<typeof benefitSchema>;

  const form = useForm<BenefitFormData>({
    resolver: zodResolver(benefitSchema),
    defaultValues: benefit ? {
      tipo: benefit.tipo,
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
      tipo: 'Cashback' as const,
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
    try {
      const benefitData: Benefit = {
        id: benefit?.id || '',
        code: benefit?.code,
        version: benefit?.version,
        tipo: data.tipo,
        titulo: data.titulo,
        descripcion: data.descripcion,
        descripcionExtendida: data.descripcionExtendida,
        legales: data.legales,
        valorPorcentaje: data.valorPorcentaje,
        topePorCompra: data.topePorCompra,
        imagen: data.imagen,
        orden: data.orden,
        categoria: data.categoria,
        mcc: data.mcc,
        fechaInicio: data.fechaInicio,
        fechaFin: data.fechaFin,
        estado: benefit?.estado || 'inactivo',
        fechaCreacion: benefit?.fechaCreacion || new Date(),
        fechaActualizacion: new Date(),
      };

      if (benefit) {
        await updateBenefit.mutateAsync(benefitData);
      } else {
        await createBenefit.mutateAsync(benefitData);
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error submitting benefit:", error);
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
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('type')} *</FormLabel>
                  <FormControl>
                    <Input {...field} disabled className="bg-muted" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('title')} *</FormLabel>
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
                  <FormLabel>{t('description')} *</FormLabel>
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
                  <FormLabel>{t('extended-description')}</FormLabel>
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
                  <FormLabel>{t('legal-terms')} *</FormLabel>
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
                    <FormLabel>{t('value-percentage')} *</FormLabel>
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
                    <FormLabel>{t('limit-per-purchase')} *</FormLabel>
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
                  <FormLabel>{t('image')}</FormLabel>
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
                    <FormLabel>{t('order')} *</FormLabel>
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
                    <FormLabel>{t('category')} *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('select-category')} />
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
                  <FormLabel>{t('industry-mcc')} *</FormLabel>
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
                    <FormLabel>{t('start-date')} *</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        onSelect={field.onChange}
                        displayTime={false}
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
                    <FormLabel>{t('end-date')} *</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        onSelect={field.onChange}
                        displayTime={false}
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
            {t('cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('saving') : t('save')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
