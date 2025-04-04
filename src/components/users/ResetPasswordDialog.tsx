
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormField, Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { userService } from "@/lib/api/user-service";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Check, Copy, Key } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ResetPasswordRequest } from "@/lib/api/types";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { Input } from "@/components/ui/input";

interface ResetPasswordDialogProps {
  open: boolean;
  userId: string;
  userName: string;
  onClose: () => void;
}

interface ResetPasswordFormValues {
  reason: string;
}

export const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({
  open,
  userId,
  userName,
  onClose
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  const form = useForm<ResetPasswordFormValues>({
    defaultValues: {
      reason: ""
    }
  });

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    setIsSubmitting(true);
    
    try {
      const request: ResetPasswordRequest = {
        userId,
        reason: values.reason
      };
      
      const response = await userService.resetPassword(request);
      
      if (response.success) {
        setResetSuccess(true);
        setTemporaryPassword(response.temporaryPassword || "");
        
        toast({
          title: t("password-reset-success"),
          description: t("password-reset-success-description"),
          variant: "default"
        });
      } else {
        toast({
          title: t("password-reset-error"),
          description: response.message,
          variant: "destructive"
        });
        onClose();
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        title: t("password-reset-error"),
        description: error instanceof Error ? error.message : t("password-reset-unknown-error"),
        variant: "destructive"
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(temporaryPassword);
    setCopySuccess(true);
    
    toast({
      title: t("password-copied"),
      description: t("password-copied-description"),
      variant: "default"
    });
    
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };

  const handleClose = () => {
    form.reset();
    setResetSuccess(false);
    setTemporaryPassword("");
    setCopySuccess(false);
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        {!resetSuccess ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  {t("reset-password")}
                </div>
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("reset-password-for-user")} <strong>{userName}</strong>. {t("reset-password-warning")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 my-4">
                <FormField
                  control={form.control}
                  name="reason"
                  rules={{ required: t("reason-required") }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("reason-for-reset")}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={t("reason-placeholder")} 
                          {...field} 
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            
            <Alert className="mt-2 border-amber-500/50 text-amber-800 bg-amber-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t("important")}</AlertTitle>
              <AlertDescription>
                {t("reset-password-audit-notice")}
              </AlertDescription>
            </Alert>
            
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction
                disabled={isSubmitting}
                onClick={form.handleSubmit(handleSubmit)}
              >
                {isSubmitting ? t("resetting") : t("reset-password")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-5 w-5" />
                  {t("password-reset-complete")}
                </div>
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("password-reset-complete-description")}
              </AlertDescription>
            </AlertDialogHeader>
            
            <div className="my-4 space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">{t("temporary-password")}</p>
                <div className="flex">
                  <Input 
                    value={temporaryPassword}
                    readOnly
                    className="pr-10 font-mono"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className="ml-[-40px]"
                    onClick={handleCopyPassword}
                  >
                    {copySuccess ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Alert className="mt-4 border-blue-500/50 text-blue-800 bg-blue-50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t("important")}</AlertTitle>
                <AlertDescription>
                  {t("password-share-securely")}
                </AlertDescription>
              </Alert>
            </div>
            
            <AlertDialogFooter>
              <Button onClick={handleClose}>
                {t("close")}
              </Button>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
