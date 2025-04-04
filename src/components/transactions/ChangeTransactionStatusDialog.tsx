
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Transaction } from "@/lib/api/types";
import { ChangeTransactionStatusRequest } from "@/lib/api/services/user-service-interface";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChangeTransactionStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
  onSubmit: (status: string, reason: string) => void;
}

// Define the form validation schema
const formSchema = z.object({
  status: z.enum(["cancelled", "rejected", "confirmed", "approved"]),
  reason: z.string().min(3, { message: "Reason must be at least 3 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const ChangeTransactionStatusDialog: React.FC<ChangeTransactionStatusDialogProps> = ({
  open,
  onOpenChange,
  transaction,
  onSubmit,
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "confirmed",
      reason: "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values.status, values.reason);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("change-transaction-status")}</DialogTitle>
          <DialogDescription>
            {t("change-status-description")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("new-status")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("select-new-status")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="confirmed">{t("confirmed")}</SelectItem>
                      <SelectItem value="approved">{t("approved")}</SelectItem>
                      <SelectItem value="rejected">{t("rejected")}</SelectItem>
                      <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("reason-for-status-change")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("status-change-reason-placeholder")}
                      className="h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit">{t("update-status")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeTransactionStatusDialog;
