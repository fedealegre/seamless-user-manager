
import { useState, useEffect, useCallback, useMemo } from "react";
import { CompanySearchConfig, defaultSearchConfig } from "@/lib/api/types/company-config";
import { useCompanySettings } from "@/contexts/CompanySettingsContext";
import { userService } from "@/lib/api/user-service";
import { useCompanyUserConfig } from "./use-company-user-config";

export function useCompanySearchConfig() {
  const [searchConfig, setSearchConfig] = useState<CompanySearchConfig>(defaultSearchConfig);
  const [isConfigReady, setIsConfigReady] = useState(false);
  const { settings } = useCompanySettings();
  const { config, loading, isFieldSearchable } = useCompanyUserConfig();

  // Memoize the field filtering function to prevent infinite loops
  const filterAllowedFields = useCallback(() => {
    if (!config || loading) return [];
    
    return defaultSearchConfig.fields.filter(field => isFieldSearchable(field.id));
  }, [config, loading, isFieldSearchable]);

  // Load dynamic search configuration with identification types and company restrictions
  useEffect(() => {
    const loadSearchConfig = async () => {
      // Early return if still loading or already processed
      if (loading || !config || isConfigReady) {
        return;
      }
      
      try {
        // Get dynamic identification types
        const identificationTypes = await userService.getIdentificationTypes();
        
        // Filter searchable fields based on company configuration
        const allowedFields = filterAllowedFields();
        
        if (allowedFields.length === 0) {
          setSearchConfig(defaultSearchConfig);
          setIsConfigReady(true);
          return;
        }
        
        // Create config with dynamic labels and filtered fields
        const dynamicConfig = {
          ...defaultSearchConfig,
          fields: allowedFields.map(field => {
            if (field.id === 'government_identification') {
              return {
                ...field,
                label: identificationTypes.governmentIdentificationType || "DNI"
              };
            }
            if (field.id === 'government_identification2') {
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
          // Filter saved config fields based on company permissions
          parsedConfig.fields = parsedConfig.fields
            .filter((field: any) => isFieldSearchable(field.id))
            .map((field: any) => {
              if (field.id === 'government_identification') {
                return {
                  ...field,
                  label: identificationTypes.governmentIdentificationType || "DNI"
                };
              }
              if (field.id === 'government_identification2') {
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
        
        setIsConfigReady(true);
      } catch (error) {
        console.error("Failed to load search configuration:", error);
        setSearchConfig(defaultSearchConfig);
        setIsConfigReady(true);
      }
    };

    loadSearchConfig();
  }, [settings.name, config, loading, filterAllowedFields, isConfigReady]);

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
    isConfigReady,
  };
}
