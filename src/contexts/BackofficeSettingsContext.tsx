
import React, { createContext, useContext, useState, useEffect } from "react";
import { formatDateInTimezone } from "@/lib/date-utils";

// Define the available languages
export type Language = "en" | "es";

// Define the settings structure
export interface BackofficeSettings {
  language: Language;
  utcOffset: string; // Changed from timezone to utcOffset
}

// Default settings
const DEFAULT_SETTINGS: BackofficeSettings = {
  language: "en",
  utcOffset: "UTC+0"  // Changed from "UTC" to "UTC+0"
};

// Context interface
interface BackofficeSettingsContextType {
  settings: BackofficeSettings;
  updateSettings: (settings: Partial<BackofficeSettings>) => void;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (date: Date | string | number) => string;
  formatDateTime: (date: Date | string | number) => string;
  getTimezoneFromOffset: (utcOffset: string) => string;
}

// Create the context
const BackofficeSettingsContext = createContext<BackofficeSettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
  formatDate: () => "",
  formatTime: () => "",
  formatDateTime: () => "",
  getTimezoneFromOffset: () => "UTC",
});

// Storage key for localStorage
const STORAGE_KEY = "backoffice_settings";

// Convert UTC offset to timezone string
const getTimezoneFromOffset = (utcOffset: string): string => {
  if (utcOffset === "UTC+0") return "UTC";
  
  // Extract the offset value
  const match = utcOffset.match(/UTC([+-])(\d+)/);
  if (!match) return "UTC";
  
  const sign = match[1];
  const hours = parseInt(match[2], 10);
  
  if (sign === '+') {
    return `Etc/GMT-${hours}`;  // Note: Etc/GMT uses opposite sign convention
  } else {
    return `Etc/GMT+${hours}`;  // Note: Etc/GMT uses opposite sign convention
  }
};

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

  // Get timezone from UTC offset
  const timezone = getTimezoneFromOffset(settings.utcOffset);

  // Function to format dates according to the selected timezone and language
  const formatDate = (date: Date | string | number, options?: Intl.DateTimeFormatOptions): string => {
    if (!date) return "";
    
    const locale = settings.language === "en" ? "en-US" : "es-ES";
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      ...options
    };
    
    return formatDateInTimezone(date, timezone, locale, defaultOptions);
  };
  
  // Function to format time only - 24-hour format
  const formatTime = (date: Date | string | number): string => {
    return formatDate(date, {
      year: undefined,
      month: undefined,
      day: undefined,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
  };
  
  // Function to format full date and time (DD/MM/YYYY HH:MM)
  const formatDateTime = (date: Date | string | number): string => {
    return formatDate(date, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  };

  return (
    <BackofficeSettingsContext.Provider value={{ 
      settings, 
      updateSettings, 
      formatDate,
      formatTime,
      formatDateTime,
      getTimezoneFromOffset
    }}>
      {children}
    </BackofficeSettingsContext.Provider>
  );
};

// Hook for using the context
export const useBackofficeSettings = () => useContext(BackofficeSettingsContext);
