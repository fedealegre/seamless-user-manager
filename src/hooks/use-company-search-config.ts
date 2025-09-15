import { useState, useEffect } from "react";
import { CompanySearchConfig, defaultSearchConfig } from "@/lib/api/types/company-config";
import { useCompanySettings } from "@/contexts/CompanySettingsContext";
import { useCompanyUserConfig } from "@/hooks/use-company-user-config";

export function useCompanySearchConfig() {
  const [searchConfig, setSearchConfig] = useState<CompanySearchConfig>(defaultSearchConfig);
  const { settings } = useCompanySettings();
  const { getSearcheableFields, isLoaded } = useCompanyUserConfig();

  // Update search configuration based on dynamic searcheable fields
  useEffect(() => {
    if (isLoaded) {
      const searcheableFields = getSearcheableFields();
      
      const dynamicFields = searcheableFields.map(fieldName => {
        const existingField = defaultSearchConfig.fields.find(f => f.key === fieldName);
        if (existingField) {
          return existingField;
        }
        
        // Create a default configuration for new fields
        return {
          id: fieldName,
          key: fieldName,
          label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
          type: "text" as const,
          placeholder: `Search by ${fieldName}`,
        };
      });

      setSearchConfig({
        ...defaultSearchConfig,
        fields: dynamicFields,
      });
    }
  }, [getSearcheableFields, isLoaded]);

  const updateSearchConfig = (newConfig: CompanySearchConfig) => {
    setSearchConfig(newConfig);
    
    // Save to localStorage
    try {
      localStorage.setItem(
        `company_search_config_${settings.name}`,
        JSON.stringify(newConfig)
      );
    } catch (error) {
      console.error("Failed to save search configuration:", error);
    }
  };

  return {
    searchConfig,
    updateSearchConfig,
  };
}