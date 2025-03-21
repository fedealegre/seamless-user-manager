
import React, { createContext, useContext, useState, useEffect } from "react";

// Default company settings
const DEFAULT_COMPANY_SETTINGS = {
  name: "PayBackoffice Inc.",
  backofficeTitle: "PayBackoffice",
  companyLogo: null as string | null,
  backofficeIcon: null as string | null
};

// Type for company settings
export interface CompanySettings {
  name: string;
  backofficeTitle: string;
  companyLogo: string | null;
  backofficeIcon: string | null;
}

// Context interface with settings and update function
interface CompanySettingsContextType {
  settings: CompanySettings;
  updateSettings: (settings: Partial<CompanySettings>) => void;
}

// Create the context with default values
const CompanySettingsContext = createContext<CompanySettingsContextType>({
  settings: DEFAULT_COMPANY_SETTINGS,
  updateSettings: () => {}
});

// Storage key for localStorage
const STORAGE_KEY = "company_settings";

// Provider component
export const CompanySettingsProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_COMPANY_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem(STORAGE_KEY);
    if (storedSettings) {
      try {
        setSettings({
          ...DEFAULT_COMPANY_SETTINGS,
          ...JSON.parse(storedSettings)
        });
      } catch (error) {
        console.error("Failed to parse company settings:", error);
      }
    }
  }, []);

  // Function to update settings
  const updateSettings = (newSettings: Partial<CompanySettings>) => {
    setSettings(prevSettings => {
      const updatedSettings = { ...prevSettings, ...newSettings };
      
      // Store in localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
      
      return updatedSettings;
    });
  };

  return (
    <CompanySettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </CompanySettingsContext.Provider>
  );
};

// Hook for using the context
export const useCompanySettings = () => useContext(CompanySettingsContext);
