import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { companyUserConfigService } from "@/lib/api/services/company-user-config-service";
import { CompanyUserConfig } from "@/lib/api/types/company-user-config";

export function useCompanyUserConfig() {
  const {
    data: configResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["company-user-config"],
    queryFn: () => companyUserConfigService.getCompanyUserConfiguration(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });

  const config = useMemo((): CompanyUserConfig => {
    if (!configResponse) {
      return {
        visibleFields: [],
        mutableFields: [],
        searcheableFields: [],
      };
    }

    // Combine user and additional_properties fields
    const visibleFields = [
      ...configResponse.user.visible_fields,
      ...configResponse.additional_properties.visible_fields,
    ];

    const mutableFields = [
      ...configResponse.user.mutable_fields,
      ...configResponse.additional_properties.mutable_fields,
    ];

    const searcheableFields = [
      ...configResponse.user.searcheable_fields,
      ...configResponse.additional_properties.searcheable_fields,
    ];

    return {
      visibleFields,
      mutableFields,
      searcheableFields,
    };
  }, [configResponse]);

  // Helper function to check if a field is visible
  const isFieldVisible = (fieldName: string): boolean => {
    if (!configResponse) return true; // Default to visible if config not loaded
    return config.visibleFields.includes(fieldName);
  };

  // Helper function to check if a field is editable
  const isFieldEditable = (fieldName: string): boolean => {
    if (!configResponse) return true; // Default to editable if config not loaded
    return config.mutableFields.includes(fieldName) && isFieldVisible(fieldName);
  };

  // Helper function to get searcheable fields
  const getSearcheableFields = (): string[] => {
    return config.searcheableFields;
  };

  return {
    config,
    isFieldVisible,
    isFieldEditable,
    getSearcheableFields,
    isLoaded: !isLoading && !error,
    isLoading,
    error,
  };
}