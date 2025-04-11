
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService as api } from "@/lib/api";
import { BackofficeUser } from "@/lib/api/types";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface AddBackofficeUserDialogProps {
  open: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  surname: z.string().min(2, { message: "Surname must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
  roles: z.array(z.string()).min(1, { message: "At least one role must be selected" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const roleOptions = [
  { id: "configurador", label: "Configurador" },
  { id: "compensador", label: "Compensador" },
  { id: "operador", label: "Operador" },
  { id: "analista", label: "Analista" },
];

const AddBackofficeUserDialog: React.FC<AddBackofficeUserDialogProps> = ({
  open,
  onClose,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
      roles: [],
    },
  });

  const createUserMutation = useMutation({
    mutationFn: (user: BackofficeUser) => api.createBackofficeUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backofficeUsers"] });
      toast({
        title: t("success"),
        description: t("user-created-successfully"),
      });
      onClose();
    },
    onError: (error) => {
      let errorMessage = t("failed-create-user");
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: t("error"),
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newUser: BackofficeUser = {
      name: values.name,
      surname: values.surname,
      email: values.email,
      password: values.password, // Include password
      roles: values.roles,
      state: "active",
    };

    createUserMutation.mutate(newUser);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{t("add-new-operator")}</DialogTitle>
          <DialogDescription>
            {t("create-backoffice-user-with-roles")}
          </DialogDescription>
        </DialogHeader>

        {createUserMutation.isError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t("error")}</AlertTitle>
            <AlertDescription>
              {createUserMutation.error instanceof Error 
                ? createUserMutation.error.message 
                : t("failed-create-user")
              }
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("first-name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("enter-first-name")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("last-name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("enter-last-name")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t("enter-email")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("password")}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t("enter-password")} {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Input type="password" placeholder={t("confirm-your-password")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>{t("roles")}</FormLabel>
                  </div>
                  <div className="space-y-2">
                    {roleOptions.map((role) => (
                      <FormField
                        key={role.id}
                        control={form.control}
                        name="roles"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={role.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(role.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...field.value, role.id]
                                      : field.value.filter((value) => value !== role.id);
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {t(role.id)}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={createUserMutation.isPending}
              >
                {t("cancel")}
              </Button>
              <Button 
                type="submit" 
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending ? t("creating") : t("create-user")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBackofficeUserDialog;
