
import { useState, useEffect } from "react";
import { CompanySearchConfig, defaultSearchConfig } from "@/lib/api/types/company-config";
import { useCompanySettings } from "@/contexts/CompanySettingsContext";
import { userService } from "@/lib/api/user-service";
import { useCompanyUserConfig } from "./use-company-user-config";

export function useCompanySearchConfig() {
  const [searchConfig, setSearchConfig] = useState<CompanySearchConfig>(defaultSearchConfig);
  const { settings } = useCompanySettings();
  const { config, loading, isFieldSearchable } = useCompanyUserConfig();

  // Load dynamic search configuration with identification types and company restrictions
  useEffect(() => {
    const loadSearchConfig = async () => {
      console.log('🔍 Loading search config, state:', { loading, config: !!config });
      
      if (loading || !config) {
        console.log('⏳ Waiting for company config to load...');
        return;
      }
      
      try {
        console.log('🏢 Company config loaded, searchable fields:', config.user.searcheable_fields);
        
        // Get dynamic identification types
        const identificationTypes = await userService.getIdentificationTypes();
        console.log('🆔 Identification types loaded:', identificationTypes);
        
        // Filter searchable fields based on company configuration
        const allowedFields = defaultSearchConfig.fields.filter(field => {
          const isAllowed = isFieldSearchable(field.id);
          console.log(`📝 Field ${field.id}: ${isAllowed ? 'ALLOWED' : 'BLOCKED'}`);
          return isAllowed;
        });
        
        console.log('✅ Final allowed search fields:', allowedFields.map(f => f.id));
        
        if (allowedFields.length === 0) {
          console.warn('⚠️ No search fields allowed, falling back to default config');
          setSearchConfig(defaultSearchConfig);
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
          console.log('💾 Loading saved config from localStorage');
          const parsedConfig = JSON.parse(savedConfig);
          // Filter saved config fields based on company permissions
          parsedConfig.fields = parsedConfig.fields.filter((field: any) => {
            const isAllowed = isFieldSearchable(field.id);
            console.log(`📝 Saved field ${field.id}: ${isAllowed ? 'ALLOWED' : 'BLOCKED'}`);
            return isAllowed;
          }).map((field: any) => {
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
          console.log('🆕 Using dynamic config');
          setSearchConfig(dynamicConfig);
        }
      } catch (error) {
        console.error("❌ Failed to load search configuration:", error);
        setSearchConfig(defaultSearchConfig);
      }
    };

    loadSearchConfig();
  }, [settings.name, config, loading, isFieldSearchable]);

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
