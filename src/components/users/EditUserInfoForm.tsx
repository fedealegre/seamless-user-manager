
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User } from "@/lib/api/types";
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
import { useToast } from "@/hooks/use-toast";
import { formatFieldName, formatDateForInput, parseDate } from "@/lib/utils";
import { X, PlusCircle } from 'lucide-react';
import { useUserFieldSettings } from "@/hooks/use-user-field-settings";

// Dynamic schema builder based on field settings
const createUserFormSchema = (isFieldEditable: (fieldName: string) => boolean) => {
  const schemaObj: Record<string, any> = {};
  
  // Only add fields to the schema that are editable
  if (isFieldEditable("name")) {
    schemaObj.name = z.string().optional().nullable();
  }
  
  if (isFieldEditable("surname")) {
    schemaObj.surname = z.string().optional().nullable();
  }
  
  if (isFieldEditable("username")) {
    schemaObj.username = z.string().optional().nullable();
  }
  
  if (isFieldEditable("email")) {
    schemaObj.email = z.string().refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      { message: "Please enter a valid email address or leave it empty" }
    ).optional().nullable();
  }
  
  if (isFieldEditable("phoneNumber")) {
    schemaObj.phoneNumber = z.string().optional().nullable();
  }
  
  if (isFieldEditable("birthDate")) {
    schemaObj.birthDate = z.string().optional().nullable();
  }
  
  if (isFieldEditable("nationality")) {
    schemaObj.nationality = z.string().optional().nullable();
  }
  
  if (isFieldEditable("gender")) {
    schemaObj.gender = z.enum(["M", "F", "Other"]).optional().nullable();
  }
  
  if (isFieldEditable("language")) {
    schemaObj.language = z.string().optional().nullable();
  }
  
  if (isFieldEditable("region")) {
    schemaObj.region = z.string().optional().nullable();
  }
  
  // Status is a special case
  if (isFieldEditable("status")) {
    schemaObj.status = z.enum(["ACTIVE", "BLOCKED"]).optional();
  }
  
  return z.object(schemaObj);
};

interface AdditionalInfoField {
  key: string;
  value: string;
}

interface EditUserInfoFormProps {
  user: User;
  onUpdate: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const EditUserInfoForm: React.FC<EditUserInfoFormProps> = ({
  user,
  onUpdate,
  onCancel,
}) => {
  const { toast } = useToast();
  const { isFieldEditable, isLoaded } = useUserFieldSettings();
  const [additionalFields, setAdditionalFields] = useState<AdditionalInfoField[]>(
    user.additionalInfo 
      ? Object.entries(user.additionalInfo).map(([key, value]) => ({ 
          key, 
          value: value as string 
        }))
      : []
  );
  
  // Generate schema based on editable fields
  const userFormSchema = createUserFormSchema(isFieldEditable);
  
  // Format birth date correctly for the form
  const birthDateValue = user.birthDate ? formatDateForInput(parseDate(user.birthDate)) : "";
  
  // Create a default values object based on editable fields
  const createDefaultValues = () => {
    const defaultValues: Record<string, any> = {};
    
    if (isFieldEditable("name")) defaultValues.name = user.name;
    if (isFieldEditable("surname")) defaultValues.surname = user.surname;
    if (isFieldEditable("username")) defaultValues.username = user.username;
    if (isFieldEditable("email")) defaultValues.email = user.email || "";
    if (isFieldEditable("phoneNumber")) defaultValues.phoneNumber = user.phoneNumber || "";
    if (isFieldEditable("birthDate")) defaultValues.birthDate = birthDateValue;
    if (isFieldEditable("nationality")) defaultValues.nationality = user.nationality || "";
    if (isFieldEditable("gender")) defaultValues.gender = (user.gender as "M" | "F" | "Other") || undefined;
    if (isFieldEditable("language")) defaultValues.language = user.language || "";
    if (isFieldEditable("region")) defaultValues.region = user.region || "";
    if (isFieldEditable("status")) defaultValues.status = user.status as "ACTIVE" | "BLOCKED" || "ACTIVE";
    
    return defaultValues;
  };
  
  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: createDefaultValues(),
  });
  
  // Update form values when field settings change
  useEffect(() => {
    if (isLoaded) {
      form.reset(createDefaultValues());
    }
  }, [isLoaded]);

  const isAdditionalInfoEditable = isFieldEditable("additionalInfo");

  const handleAddAdditionalField = () => {
    if (isAdditionalInfoEditable) {
      setAdditionalFields([...additionalFields, { key: "", value: "" }]);
    }
  };

  const handleRemoveAdditionalField = (index: number) => {
    if (isAdditionalInfoEditable) {
      const newFields = [...additionalFields];
      newFields.splice(index, 1);
      setAdditionalFields(newFields);
    }
  };

  const handleAdditionalFieldChange = (index: number, field: 'key' | 'value', value: string) => {
    if (isAdditionalInfoEditable) {
      const newFields = [...additionalFields];
      newFields[index][field] = value;
      setAdditionalFields(newFields);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      // Format additional info fields into an object
      const additionalInfo = isAdditionalInfoEditable ? additionalFields.reduce((acc, field) => {
        if (field.key && field.key.trim() !== "") {
          acc[field.key] = field.value;
        }
        return acc;
      }, {} as Record<string, string>) : user.additionalInfo;

      // Combine form data with additional info
      const userData = {
        ...data,
        additionalInfo
      };

      await onUpdate(userData);
      toast({
        title: "User updated",
        description: "User information has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user information.",
      });
    }
  };

  if (!isLoaded) {
    return <div>Loading form settings...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isFieldEditable("name") && (
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
          )}
          
          {isFieldEditable("surname") && (
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
          )}
          
          {isFieldEditable("username") && (
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {isFieldEditable("email") && (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {isFieldEditable("phoneNumber") && (
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {isFieldEditable("birthDate") && (
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      value={field.value || ""} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {isFieldEditable("nationality") && (
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {isFieldEditable("gender") && (
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  >
                    <option value="">Select gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {isFieldEditable("language") && (
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {isFieldEditable("region") && (
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        
        {/* Additional Information Section */}
        {isFieldEditable("additionalInfo") && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Additional Information</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddAdditionalField}
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Add Field
              </Button>
            </div>
            
            {additionalFields.length === 0 ? (
              <p className="text-muted-foreground">No additional fields</p>
            ) : (
              <div className="space-y-4">
                {additionalFields.map((field, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <FormLabel htmlFor={`field-key-${index}`}>Field Name</FormLabel>
                      <Input
                        id={`field-key-${index}`}
                        value={field.key}
                        onChange={(e) => handleAdditionalFieldChange(index, 'key', e.target.value)}
                        placeholder="Field name"
                      />
                    </div>
                    <div className="flex-1">
                      <FormLabel htmlFor={`field-value-${index}`}>Value</FormLabel>
                      <Input
                        id={`field-value-${index}`}
                        value={field.value}
                        onChange={(e) => handleAdditionalFieldChange(index, 'value', e.target.value)}
                        placeholder="Field value"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-8"
                      onClick={() => handleRemoveAdditionalField(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
};
