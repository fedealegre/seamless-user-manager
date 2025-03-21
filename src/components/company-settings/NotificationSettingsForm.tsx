
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

// Define form schema
const notificationSchema = z.object({
  notifyUsersWhenBlocked: z.boolean(),
  notifyUsersWhenUnblocked: z.boolean(),
});

type NotificationSettingsFormProps = {
  defaultValues: {
    notifyUsersWhenBlocked: boolean;
    notifyUsersWhenUnblocked: boolean;
  };
  onSubmit: (data: any) => void;
  isLoading: boolean;
};

export const NotificationSettingsForm = ({ 
  defaultValues, 
  onSubmit, 
  isLoading 
}: NotificationSettingsFormProps) => {
  const form = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="notifyUsersWhenBlocked"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Notify Users When Blocked</FormLabel>
                  <FormDescription>
                    Send a notification to users when their account is blocked
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
          
          <FormField
            control={form.control}
            name="notifyUsersWhenUnblocked"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Notify Users When Unblocked</FormLabel>
                  <FormDescription>
                    Send a notification to users when their account is unblocked
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
