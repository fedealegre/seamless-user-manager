
import React, { useState } from "react";
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
import { Eye, EyeOff, Check } from "lucide-react";

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
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // Password validation checks
  const hasMinLength = newPasswordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPasswordValue);
  const hasLowercase = /[a-z]/.test(newPasswordValue);
  const hasNumber = /[0-9]/.test(newPasswordValue);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPasswordValue);

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

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    if (field === 'current') {
      setShowCurrentPassword(!showCurrentPassword);
    } else if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
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
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type={showCurrentPassword ? "text" : "password"}
                        autoComplete="current-password"
                        className="pr-10"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-10 w-10"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span className="sr-only">
                        {showCurrentPassword
                          ? t("hide-password")
                          : t("show-password")}
                      </span>
                    </Button>
                  </div>
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
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type={showNewPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="pr-10"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-10 w-10"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span className="sr-only">
                        {showNewPassword
                          ? t("hide-password")
                          : t("show-password")}
                      </span>
                    </Button>
                  </div>
                  {/* FormMessage removed from here as requested */}
                </FormItem>
              )}
            />
            <div className="rounded-md border p-4">
              <p className="mb-2 text-sm font-medium">{t("password-requirements")}</p>
              <ul className="space-y-1">
                <li className="flex items-center text-sm">
                  <span className={`mr-2 ${hasMinLength ? "text-green-500" : "text-muted-foreground"}`}>
                    {hasMinLength ? <Check className="h-4 w-4" /> : "•"}
                  </span>
                  {t("password-min-length")}
                </li>
                <li className="flex items-center text-sm">
                  <span className={`mr-2 ${hasUppercase ? "text-green-500" : "text-muted-foreground"}`}>
                    {hasUppercase ? <Check className="h-4 w-4" /> : "•"}
                  </span>
                  {t("password-uppercase")}
                </li>
                <li className="flex items-center text-sm">
                  <span className={`mr-2 ${hasLowercase ? "text-green-500" : "text-muted-foreground"}`}>
                    {hasLowercase ? <Check className="h-4 w-4" /> : "•"}
                  </span>
                  {t("password-lowercase")}
                </li>
                <li className="flex items-center text-sm">
                  <span className={`mr-2 ${hasNumber ? "text-green-500" : "text-muted-foreground"}`}>
                    {hasNumber ? <Check className="h-4 w-4" /> : "•"}
                  </span>
                  {t("password-number")}
                </li>
                <li className="flex items-center text-sm">
                  <span className={`mr-2 ${hasSpecial ? "text-green-500" : "text-muted-foreground"}`}>
                    {hasSpecial ? <Check className="h-4 w-4" /> : "•"}
                  </span>
                  {t("password-special")}
                </li>
              </ul>
            </div>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("confirm-password")}</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="pr-10"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-10 w-10"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span className="sr-only">
                        {showConfirmPassword
                          ? t("hide-password")
                          : t("show-password")}
                      </span>
                    </Button>
                  </div>
                  <FormMessage>
                    {form.formState.errors.confirmPassword?.message
                      ? t(form.formState.errors.confirmPassword.message)
                      : ""}
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
