import { useQuery } from "@tanstack/react-query";
import { companyUserConfigService } from "@/lib/api/services/company-user-config-service";
import { CompanyUserConfiguration } from "@/lib/api/types/company-user-config";

export function useCompanyUserConfig() {
  const { 
    data: config,
    isLoading,
    error,
    isSuccess 
  } = useQuery({
    queryKey: ['company-user-configuration'],
    queryFn: () => companyUserConfigService.getCompanyUserConfiguration(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2
  });

  // Helper function to check if a field is editable
  const isFieldEditable = (fieldName: string): boolean => {
    if (!config) return false;
    
    // Check both user and additional_properties mutable fields
    const userMutable = config.user.mutable_fields.includes(fieldName);
    const additionalMutable = config.additional_properties.mutable_fields.includes(fieldName);
    
    return userMutable || additionalMutable;
  };

  // Helper function to get all searchable fields
  const getSearchableFields = (): string[] => {
    if (!config) return [];
    
    // Combine both user and additional_properties searchable fields
    return [
      ...config.user.searcheable_fields,
      ...config.additional_properties.searcheable_fields
    ];
  };

  // Helper function to check if user has any mutable fields (for showing edit button)
  const hasEditableFields = (): boolean => {
    if (!config) return false;
    
    return config.user.mutable_fields.length > 0 || 
           config.additional_properties.mutable_fields.length > 0;
  };

  return {
    config,
    isLoading,
    error,
    isLoaded: isSuccess,
    isFieldEditable,
    getSearchableFields,
    hasEditableFields
  };
}