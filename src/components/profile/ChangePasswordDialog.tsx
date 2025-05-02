
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Password validation schema
const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "current-password-required"),
    newPassword: z
      .string()
      .min(8, "password-min-length")
      .regex(/[A-Z]/, "password-uppercase")
      .regex(/[a-z]/, "password-lowercase")
      .regex(/[0-9]/, "password-number")
      .regex(/[^A-Za-z0-9]/, "password-special"),
    confirmPassword: z.string().min(1, "confirm-password-required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "passwords-dont-match",
    path: ["confirmPassword"],
  });

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const { user, updateUserPassword } = useAuth();
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  const form = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: PasswordChangeFormValues) => {
    if (!user) return;

    try {
      await updateUserPassword(values.currentPassword, values.newPassword);
      
      toast({
        title: t("password-changed"),
        description: t("password-changed-successfully"),
      });
      
      onClose();
      form.reset();
    } catch (error) {
      console.error("Failed to change password:", error);
      
      toast({
        title: t("password-change-failed"),
        description: t("invalid-current-password"),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("change-password")}</DialogTitle>
          <DialogDescription>
            {t("change-password-description")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("current-password")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage>
                    {t(form.formState.errors.currentPassword?.message || "")}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("new-password")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage>
                    {t(form.formState.errors.newPassword?.message || "")}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("confirm-password")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage>
                    {t(form.formState.errors.confirmPassword?.message || "")}
                  </FormMessage>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? t("changing-password")
                  : t("change-password")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
