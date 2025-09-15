import { useMemo } from "react";
import { CompanySearchConfig, SearchField } from "@/lib/api/types/company-config";
import { useCompanyUserConfig } from "./use-company-user-config";
import { userService } from "@/lib/api/user-service";
import { useQuery } from "@tanstack/react-query";

// Field mapping for search configuration
const FIELD_MAPPING: Record<string, Omit<SearchField, 'id' | 'key'>> = {
  name: {
    label: "Name",
    type: "text",
    placeholder: "Enter name..."
  },
  surname: {
    label: "Surname", 
    type: "text",
    placeholder: "Enter surname..."
  },
  email: {
    label: "Email",
    type: "text",
    placeholder: "Enter email..."
  },
  username: {
    label: "Username",
    type: "text", 
    placeholder: "Enter username..."
  },
  government_identification: {
    label: "Government ID",
    type: "text",
    placeholder: "Enter government ID..."
  },
  cellPhone: {
    label: "Cell Phone",
    type: "text",
    placeholder: "Enter cell phone..."
  },
  client_uri: {
    label: "Client URI",
    type: "text",
    placeholder: "Enter client URI..."
  },
  onboarding_status: {
    label: "Onboarding Status",
    type: "select",
    options: [
      { label: "All", value: "" },
      { label: "Pending", value: "pending" },
      { label: "Completed", value: "completed" },
      { label: "Failed", value: "failed" }
    ]
  },
  last_login: {
    label: "Last Login",
    type: "date",
    placeholder: "Select date..."
  },
  registration_source: {
    label: "Registration Source",
    type: "select",
    options: [
      { label: "All", value: "" },
      { label: "Mobile App", value: "mobile" },
      { label: "Web", value: "web" },
      { label: "In Store", value: "store" }
    ]
  }
};

export function useCompanySearchConfigDynamic() {
  const { config, isLoading: isLoadingConfig } = useCompanyUserConfig();
  
  // Fetch identification types for dynamic labels
  const { data: identificationTypes, isLoading: isLoadingTypes } = useQuery({
    queryKey: ['identification-types'],
    queryFn: () => userService.getIdentificationTypes(),
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  const searchConfig = useMemo((): CompanySearchConfig => {
    if (!config) {
      return {
        fields: []
      };
    }

    const searchableFields = [
      ...config.user.searcheable_fields,
      ...config.additional_properties.searcheable_fields
    ];
    const fields: SearchField[] = [];

    searchableFields.forEach((fieldName, index) => {
      const baseConfig = FIELD_MAPPING[fieldName];
      if (baseConfig) {
        let label = baseConfig.label;
        
        // Update labels based on identification types
        if (fieldName === 'government_identification' && identificationTypes?.governmentIdentificationType) {
          label = identificationTypes.governmentIdentificationType;
        }
        
        fields.push({
          id: fieldName,
          key: fieldName,
          label,
          type: baseConfig.type,
          placeholder: baseConfig.placeholder,
          options: baseConfig.options
        });
      }
    });

    return {
      fields
    };
  }, [config, identificationTypes]);

  const updateSearchConfig = (newConfig: CompanySearchConfig) => {
    // For dynamic configuration, we don't persist changes
    // The configuration is always derived from the backend
    console.warn('Dynamic search config cannot be updated directly');
  };

  return {
    searchConfig,
    updateSearchConfig,
    isLoading: isLoadingConfig || isLoadingTypes
  };
}