
import React, { createContext, useContext, useState, useEffect } from "react";

// Define the available languages
export type Language = "en" | "es";

// Define the settings structure
export interface BackofficeSettings {
  language: Language;
  timezone: string;
}

// Default settings
const DEFAULT_SETTINGS: BackofficeSettings = {
  language: "en",
  timezone: "UTC"
};

// Context interface
interface BackofficeSettingsContextType {
  settings: BackofficeSettings;
  updateSettings: (settings: Partial<BackofficeSettings>) => void;
  formatDate: (date: Date | string | number) => string;
}

// Create the context
const BackofficeSettingsContext = createContext<BackofficeSettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
  formatDate: () => "",
});

// Storage key for localStorage
const STORAGE_KEY = "backoffice_settings";

// Provider component
export const BackofficeSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [settings, setSettings] = useState<BackofficeSettings>(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem(STORAGE_KEY);
    if (storedSettings) {
      try {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...JSON.parse(storedSettings)
        });
      } catch (error) {
        console.error("Failed to parse backoffice settings:", error);
      }
    }
  }, []);

  // Function to update settings
  const updateSettings = (newSettings: Partial<BackofficeSettings>) => {
    setSettings(prevSettings => {
      const updatedSettings = { ...prevSettings, ...newSettings };
      
      // Store in localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
      
      return updatedSettings;
    });
  };

  // Function to format dates according to the selected timezone
  const formatDate = (date: Date | string | number): string => {
    if (!date) return "";
    
    const dateObj = typeof date === "string" || typeof date === "number" 
      ? new Date(date) 
      : date;
    
    try {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: settings.timezone
      }).format(dateObj);
    } catch (error) {
      console.error("Error formatting date:", error);
      return String(date);
    }
  };

  return (
    <BackofficeSettingsContext.Provider value={{ settings, updateSettings, formatDate }}>
      {children}
    </BackofficeSettingsContext.Provider>
  );
};

// Hook for using the context
export const useBackofficeSettings = () => useContext(BackofficeSettingsContext);
