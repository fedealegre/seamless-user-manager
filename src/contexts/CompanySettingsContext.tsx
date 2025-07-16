
import React, { createContext, useContext, useState, useEffect } from "react";

// App rule structure
export interface AppRule {
  key: string;
  name: string;
  description: string;
  value: string;
  multiline: boolean;
}

// Default app rules
const DEFAULT_APP_RULES: AppRule[] = [
  {
    key: "error_alert_emails",
    name: "Error Alert Emails",
    description: "Email addresses where error alerts will be sent to (comma-separated)",
    value: "support@example.com,alerts@example.com",
    multiline: true
  },
  {
    key: "cashout_schedule",
    name: "Cashout Schedule",
    description: "CRON expression to schedule the process of cash out",
    value: "0 0 * * *",
    multiline: false
  },
  {
    key: "pin_expiration_time",
    name: "PIN Expiration Time",
    description: "Time in minutes before a PIN expires",
    value: "30",
    multiline: false
  },
  {
    key: "holidays_list",
    name: "Holidays List",
    description: "List of holidays in YYYYMMDD format (comma-separated)",
    value: "20250101,20250704,20251225",
    multiline: true
  }
];

// Default company settings
const DEFAULT_COMPANY_SETTINGS = {
  name: "Daxia Inc.",
  backofficeTitle: "Backoffice Daxia",
  companyLogo: null as string | null,
  backofficeIcon: null as string | null,
  appRules: DEFAULT_APP_RULES
};

// Type for company settings
export interface CompanySettings {
  name: string;
  backofficeTitle: string;
  companyLogo: string | null;
  backofficeIcon: string | null;
  appRules: AppRule[];
}

// Context interface with settings and update function
interface CompanySettingsContextType {
  settings: CompanySettings;
  updateSettings: (settings: Partial<CompanySettings>) => void;
  updateAppRules: (appRules: AppRule[]) => void;
}

// Create the context with default values
const CompanySettingsContext = createContext<CompanySettingsContextType>({
  settings: DEFAULT_COMPANY_SETTINGS,
  updateSettings: () => {},
  updateAppRules: () => {}
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

  // Function to update app rules specifically
  const updateAppRules = (appRules: AppRule[]) => {
    setSettings(prevSettings => {
      const updatedSettings = { ...prevSettings, appRules };
      
      // Store in localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
      
      return updatedSettings;
    });
  };

  return (
    <CompanySettingsContext.Provider value={{ settings, updateSettings, updateAppRules }}>
      {children}
    </CompanySettingsContext.Provider>
  );
};

// Hook for using the context
export const useCompanySettings = () => useContext(CompanySettingsContext);
