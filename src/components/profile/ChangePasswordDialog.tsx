
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
import { Form } from "@/components/ui/form";
import PasswordField from "./PasswordField";
import PasswordRequirements from "./PasswordRequirements";

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
    mode: "onChange",
  });

  const newPasswordValue = form.watch("newPassword");

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
            <PasswordField
              name="currentPassword"
              label={t("current-password")}
              form={form}
              autoComplete="current-password"
              t={t}
            />
            
            <PasswordField
              name="newPassword"
              label={t("new-password")}
              form={form}
              autoComplete="new-password"
              showMessage={false}
              t={t}
            />
            
            <PasswordRequirements value={newPasswordValue} t={t} />
            
            <PasswordField
              name="confirmPassword"
              label={t("confirm-password")}
              form={form}
              autoComplete="new-password"
              t={t}
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
