
import { useState, useEffect } from "react";
import { CompanySearchConfig, defaultSearchConfig } from "@/lib/api/types/company-config";
import { useCompanySettings } from "@/contexts/CompanySettingsContext";

export function useCompanySearchConfig() {
  const [searchConfig, setSearchConfig] = useState<CompanySearchConfig>(defaultSearchConfig);
  const { settings } = useCompanySettings();

  // In the future, this could be loaded from a company-specific endpoint
  // For now, we're using the defaultSearchConfig and potentially from localStorage
  useEffect(() => {
    // Try loading from localStorage
    try {
      const savedConfig = localStorage.getItem(`company_search_config_${settings.name}`);
      if (savedConfig) {
        setSearchConfig(JSON.parse(savedConfig));
      }
    } catch (error) {
      console.error("Failed to load search configuration:", error);
    }
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
