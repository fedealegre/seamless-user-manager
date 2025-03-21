
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define form schema
const financialSchema = z.object({
  iva: z.coerce
    .number()
    .min(0, "IVA cannot be negative")
    .max(100, "IVA cannot exceed 100%"),
  commissions: z.object({
    transfer: z.coerce
      .number()
      .min(0, "Commission cannot be negative")
      .max(100, "Commission cannot exceed 100%"),
    payment: z.coerce
      .number()
      .min(0, "Commission cannot be negative")
      .max(100, "Commission cannot exceed 100%"),
    withdrawal: z.coerce
      .number()
      .min(0, "Commission cannot be negative")
      .max(100, "Commission cannot exceed 100%"),
  }),
});

type FinancialSettingsFormProps = {
  defaultValues: {
    iva: number;
    commissions: {
      transfer: number;
      payment: number;
      withdrawal: number;
    };
  };
  onSubmit: (data: any) => void;
  isLoading: boolean;
};

export const FinancialSettingsForm = ({ 
  defaultValues, 
  onSubmit, 
  isLoading 
}: FinancialSettingsFormProps) => {
  const form = useForm<z.infer<typeof financialSchema>>({
    resolver: zodResolver(financialSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="iva"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IVA (Value Added Tax) %</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    max="100" 
                    {...field} 
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-muted-foreground">%</span>
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                Standard tax rate applied to transactions
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Commission Rates</h3>
          
          <FormField
            control={form.control}
            name="commissions.transfer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transfer Commission %</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      max="100" 
                      {...field} 
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-muted-foreground">%</span>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Commission percentage for transfers between accounts
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="commissions.payment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Commission %</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      max="100" 
                      {...field} 
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-muted-foreground">%</span>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Commission percentage for payment transactions
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="commissions.withdrawal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Withdrawal Commission %</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      max="100" 
                      {...field} 
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-muted-foreground">%</span>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Commission percentage for withdrawal transactions
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
