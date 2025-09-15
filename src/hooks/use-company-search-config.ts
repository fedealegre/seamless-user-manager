
import { useState, useEffect } from "react";
import { CompanySearchConfig, defaultSearchConfig } from "@/lib/api/types/company-config";
import { useCompanySettings } from "@/contexts/CompanySettingsContext";
import { userService } from "@/lib/api/user-service";

export function useCompanySearchConfig() {
  const [searchConfig, setSearchConfig] = useState<CompanySearchConfig>(defaultSearchConfig);
  const { settings } = useCompanySettings();

  // Load dynamic search configuration with identification types
  useEffect(() => {
    const loadSearchConfig = async () => {
      try {
        // Get dynamic identification types
        const identificationTypes = await userService.getIdentificationTypes();
        
        // Create config with dynamic labels
        const dynamicConfig = {
          ...defaultSearchConfig,
          fields: defaultSearchConfig.fields.map(field => {
            if (field.id === 'governmentIdentification') {
              return {
                ...field,
                label: identificationTypes.governmentIdentificationType || "DNI"
              };
            }
            if (field.id === 'governmentIdentification2') {
              return {
                ...field,
                label: identificationTypes.governmentIdentificationType2 || "CUIL"
              };
            }
            return field;
          })
        };

        // Try loading from localStorage
        const savedConfig = localStorage.getItem(`company_search_config_${settings.name}`);
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          // Apply dynamic labels to saved config
          parsedConfig.fields = parsedConfig.fields.map((field: any) => {
            if (field.id === 'governmentIdentification') {
              return {
                ...field,
                label: identificationTypes.governmentIdentificationType || "DNI"
              };
            }
            if (field.id === 'governmentIdentification2') {
              return {
                ...field,
                label: identificationTypes.governmentIdentificationType2 || "CUIL"
              };
            }
            return field;
          });
          setSearchConfig(parsedConfig);
        } else {
          setSearchConfig(dynamicConfig);
        }
      } catch (error) {
        console.error("Failed to load search configuration:", error);
        setSearchConfig(defaultSearchConfig);
      }
    };

    loadSearchConfig();
  }, [settings.name]);

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
