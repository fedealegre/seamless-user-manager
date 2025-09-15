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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { formatFieldName, formatDateForInput, parseDate } from "@/lib/utils";
import { X } from 'lucide-react';
import { useCompanyUserConfig } from "@/hooks/use-company-user-config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

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
  
  if (isFieldEditable("cellPhone")) {
    schemaObj.cellPhone = z.string().optional().nullable();
  }
  
  if (isFieldEditable("birthDate")) {
    schemaObj.birthDate = z.string().optional().nullable();
  }
  
  if (isFieldEditable("nationality")) {
    schemaObj.nationality = z.string().optional().nullable();
  }
  
  if (isFieldEditable("gender")) {
    schemaObj.gender = z.enum(["M", "F", "Other", "unspecified"]).optional().nullable();
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
  const { isFieldEditable } = useCompanyUserConfig();
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
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
    if (isFieldEditable("cellPhone")) defaultValues.cellPhone = user.cellPhone || "";
    if (isFieldEditable("birthDate")) defaultValues.birthDate = birthDateValue;
    if (isFieldEditable("nationality")) defaultValues.nationality = user.nationality || "";
    if (isFieldEditable("gender")) defaultValues.gender = (user.gender as "M" | "F" | "Other") || "unspecified";
    if (isFieldEditable("language")) defaultValues.language = user.language || "";
    if (isFieldEditable("region")) defaultValues.region = user.region || "";
    if (isFieldEditable("status")) defaultValues.status = user.status as "ACTIVE" | "BLOCKED" || "ACTIVE";
    
    return defaultValues;
  };
  
  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: createDefaultValues(),
  });

  const isAdditionalInfoEditable = isFieldEditable("additionalInfo");

  const handleRemoveAdditionalField = (index: number) => {
    if (isAdditionalInfoEditable) {
      const newFields = [...additionalFields];
      newFields.splice(index, 1);
      setAdditionalFields(newFields);
    }
  };

  const handleAdditionalFieldChange = (index: number, field: 'value', value: string) => {
    if (isAdditionalInfoEditable) {
      const newFields = [...additionalFields];
      newFields[index][field] = value;
      setAdditionalFields(newFields);
    }
  };

  // Helper function to check if value is JSON and format it
  const formatJSONIfValid = (value: string): string => {
    try {
      const parsed = JSON.parse(value);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return value;
    }
  };

  // Helper function to detect if value should use textarea
  const shouldUseTextarea = (value: string): boolean => {
    return value.length > 100 || value.includes('\n') || value.includes('{') || value.includes('[');
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
        title: t("user-updated"),
        description: t("user-info-updated-success"),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("failed-update-user"),
      });
    }
  };

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
                  <FormLabel>{t("first-name")}</FormLabel>
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
                  <FormLabel>{t("last-name")}</FormLabel>
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
                  <FormLabel>{t("username")}</FormLabel>
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
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {isFieldEditable("cellPhone") && (
            <FormField
              control={form.control}
              name="cellPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("cell-phone")}</FormLabel>
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
                  <FormLabel>{t("birth-date")}</FormLabel>
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
                  <FormLabel>{t("nationality")}</FormLabel>
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
                  <FormLabel>{t("gender")}</FormLabel>
                  <Select
                    value={field.value || "unspecified"}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("select-gender")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="unspecified">{t("select-gender")}</SelectItem>
                      <SelectItem value="M">{t("male")}</SelectItem>
                      <SelectItem value="F">{t("female")}</SelectItem>
                      <SelectItem value="Other">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <FormLabel>{t("language")}</FormLabel>
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
                  <FormLabel>{t("region")}</FormLabel>
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
            <div className="mb-4">
              <h3 className="text-lg font-medium">{t("additional-information")}</h3>
            </div>
            
            {additionalFields.length === 0 ? (
              <p className="text-muted-foreground">{t("no-additional-fields")}</p>
            ) : (
              <div className="space-y-4">
                {additionalFields.map((field, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <FormLabel htmlFor={`field-value-${index}`}>{field.key}</FormLabel>
                      {shouldUseTextarea(field.value) ? (
                        <Textarea
                          id={`field-value-${index}`}
                          value={field.value}
                          onChange={(e) => handleAdditionalFieldChange(index, 'value', e.target.value)}
                          placeholder={t("value")}
                          className="min-h-[100px] max-h-[300px] resize-y font-mono text-sm"
                          rows={4}
                        />
                      ) : (
                        <Input
                          id={`field-value-${index}`}
                          value={field.value}
                          onChange={(e) => handleAdditionalFieldChange(index, 'value', e.target.value)}
                          placeholder={t("value")}
                        />
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-6"
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
            {t("cancel")}
          </Button>
          <Button type="submit">{t("save-changes")}</Button>
        </div>
      </form>
    </Form>
  );
};
