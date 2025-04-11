
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BackofficeUser } from "@/lib/api/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiService as api } from "@/lib/api";
import { Switch } from "@/components/ui/switch";

interface EditBackofficeUserDialogProps {
  user: BackofficeUser;
  open: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "First name must be at least 2 characters." }),
  surname: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  changePassword: z.boolean().default(false),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine(data => !data.changePassword || (data.password && data.password.length >= 6), {
  message: "Password must be at least 6 characters",
  path: ["password"]
}).refine(data => !data.changePassword || data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type FormValues = z.infer<typeof formSchema>;

const EditBackofficeUserDialog: React.FC<EditBackofficeUserDialogProps> = ({
  user,
  open,
  onClose,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      surname: user.surname,
      email: user.email || "",
      changePassword: false,
      password: "",
      confirmPassword: "",
    },
  });

  const watchChangePassword = form.watch("changePassword");

  const onSubmit = async (data: FormValues) => {
    try {
      // Prepare the user update data
      const updatedUser: BackofficeUser = {
        ...user,
        name: data.name,
        surname: data.surname,
        email: data.email,
      };

      // Include password only if the user opted to change it
      if (data.changePassword && data.password) {
        updatedUser.password = data.password;
      }

      // In a real app, this would be an API call
      console.log("Updating backoffice user:", updatedUser);
      
      // Call the API to update the user
      await api.updateBackofficeUser(user.id || "", updatedUser);
      
      // Update the user in the cached data
      queryClient.invalidateQueries({ queryKey: ["backofficeUsers"] });
      
      toast({
        title: "User updated",
        description: "The operator information has been updated successfully.",
      });
      
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update the operator information. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Operator</DialogTitle>
          <DialogDescription>
            Update the information for this backoffice operator.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    This email will be used for login credentials
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="changePassword"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Change Password</FormLabel>
                    <FormDescription>
                      Enable to update this user's password
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {watchChangePassword && (
              <>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
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
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBackofficeUserDialog;
