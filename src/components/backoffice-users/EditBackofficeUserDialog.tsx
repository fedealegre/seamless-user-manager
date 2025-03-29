
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
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/api/query-client";

interface EditBackofficeUserDialogProps {
  user: BackofficeUser;
  open: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "First name must be at least 2 characters." }),
  surname: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

const EditBackofficeUserDialog: React.FC<EditBackofficeUserDialogProps> = ({
  user,
  open,
  onClose,
}) => {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      surname: user.surname,
      email: user.email || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // In a real app, this would be an API call
      console.log("Updating backoffice user:", { ...user, ...data });
      
      // Update the local cache directly for the demo
      const updatedUser = { ...user, ...data };
      
      // Simulate API response and update local cache
      setTimeout(() => {
        // Update the user in the cached data
        const cachedUsers = queryClient.getQueryData<BackofficeUser[]>(["backofficeUsers"]);
        if (cachedUsers) {
          const updatedUsers = cachedUsers.map(u => (
            u.id === user.id ? updatedUser : u
          ));
          queryClient.setQueryData(["backofficeUsers"], updatedUsers);
        }
        
        toast({
          title: "User updated",
          description: "The operator information has been updated successfully.",
        });
        
        onClose();
      }, 500);
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
                  <p className="text-xs text-muted-foreground">
                    This email will be used for login credentials
                  </p>
                </FormItem>
              )}
            />

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
