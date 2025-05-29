
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CompanySearchConfig } from "@/lib/api/types/company-config";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface UserSearchBarProps {
  searchConfig: CompanySearchConfig;
  onSearch: (searchParams: Record<string, string>) => void;
}

const UserSearchBar: React.FC<UserSearchBarProps> = ({
  searchConfig,
  onSearch,
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  const form = useForm<Record<string, string>>({
    defaultValues: searchConfig.fields.reduce((acc, field) => {
      acc[field.id] = field.defaultValue || "";
      return acc;
    }, {} as Record<string, string>),
  });

  // Watch all form values to validate button state
  const watchedValues = form.watch();

  // Validation function to determine if search button should be enabled
  const isSearchButtonEnabled = () => {
    const values = watchedValues;
    
    // Check if any field has content
    const hasAnyContent = Object.keys(values).some(key => values[key] && values[key].trim() !== "");
    
    if (!hasAnyContent) {
      return false;
    }

    // Check specific field requirements
    for (const [fieldId, value] of Object.entries(values)) {
      if (value && value.trim() !== "") {
        // Name and surname require at least 3 characters
        if ((fieldId === 'name' || fieldId === 'surname') && value.trim().length < 3) {
          return false;
        }
        // Other fields (id, email, phone, cellPhone) require at least 1 character
        if (['id', 'email', 'phone', 'cellPhone'].includes(fieldId) && value.trim().length < 1) {
          return false;
        }
      }
    }

    return true;
  };

  // Helper function to show help text for name and surname fields
  const shouldShowHelpText = (fieldId: string, value: string) => {
    if (fieldId === 'name' || fieldId === 'surname') {
      return value && value.trim().length > 0 && value.trim().length < 3;
    }
    return false;
  };

  const handleSubmit = (data: Record<string, string>) => {
    // Filter out empty values
    const filteredParams = Object.keys(data).reduce((acc, key) => {
      if (data[key]) {
        acc[key] = data[key];
      }
      return acc;
    }, {} as Record<string, string>);
    
    onSearch(filteredParams);
  };

  // Helper function to get field translation key
  const getFieldTranslationKey = (fieldId: string) => {
    const fieldMappings: Record<string, string> = {
      'name': 'name-filter',
      'surname': 'surname-filter',
      'email': 'email-filter',
      'phone': 'phone-filter',
      'id': 'id-filter',
      'status': 'status-filter',
      'cellPhone': 'phone-filter',
    };
    
    return fieldMappings[fieldId] || fieldId;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchConfig.fields.map((field) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={field.id}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{t(getFieldTranslationKey(field.id))}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...formField}
                            type={field.type === "number" ? "number" : "text"}
                            placeholder={t(field.placeholder || "")}
                            className="pl-8 w-full"
                          />
                        </div>
                      </FormControl>
                      {shouldShowHelpText(field.id, formField.value) && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Debe incluir al menos 3 caracteres para realizar la búsqueda
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              ))}
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={!isSearchButtonEnabled()}
              >
                <Search className="mr-2 h-4 w-4" />
                {t("search-users-button")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserSearchBar;
