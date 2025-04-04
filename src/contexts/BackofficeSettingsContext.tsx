
import React, { createContext, useContext, useState, useEffect } from "react";
import { formatDateInTimezone } from "@/lib/date-utils";

// Define the available languages
export type Language = "en" | "es";

// Define the theme options
export type Theme = "light" | "dark" | "system";

// Define the settings structure
export interface BackofficeSettings {
  language: Language;
  timezone: string;
  primaryColor?: string;
  defaultTheme?: Theme;
}

// Default settings
const DEFAULT_SETTINGS: BackofficeSettings = {
  language: "en",
  timezone: "UTC",
  primaryColor: "hsl(221.2 83.2% 53.3%)",
  defaultTheme: "light"
};

// Context interface
interface BackofficeSettingsContextType {
  settings: BackofficeSettings;
  updateSettings: (settings: Partial<BackofficeSettings>) => void;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (date: Date | string | number) => string;
  formatDateTime: (date: Date | string | number) => string;
  userTheme: Theme;
  setUserTheme: (theme: Theme) => void;
}

// Create the context
const BackofficeSettingsContext = createContext<BackofficeSettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
  formatDate: () => "",
  formatTime: () => "",
  formatDateTime: () => "",
  userTheme: "light",
  setUserTheme: () => {},
});

// Storage key for localStorage
const STORAGE_KEY = "backoffice_settings";
const USER_THEME_KEY = "backoffice_user_theme";

// Provider component
export const BackofficeSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [settings, setSettings] = useState<BackofficeSettings>(DEFAULT_SETTINGS);
  const [userTheme, setUserTheme] = useState<Theme>("light");

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

    // Load user theme preference
    const storedUserTheme = localStorage.getItem(USER_THEME_KEY);
    if (storedUserTheme && (storedUserTheme === "light" || storedUserTheme === "dark" || storedUserTheme === "system")) {
      setUserTheme(storedUserTheme as Theme);
    } else {
      // Default to system's default theme if not stored
      setUserTheme(settings.defaultTheme || "light");
    }
  }, []);

  // Apply theme when userTheme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove("light", "dark");

    // Apply preferred theme
    if (userTheme === "system") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.add(systemPrefersDark ? "dark" : "light");
    } else {
      root.classList.add(userTheme);
    }

    // Store user theme preference
    localStorage.setItem(USER_THEME_KEY, userTheme);
  }, [userTheme]);

  // Function to update settings
  const updateSettings = (newSettings: Partial<BackofficeSettings>) => {
    setSettings(prevSettings => {
      const updatedSettings = { ...prevSettings, ...newSettings };
      
      // Store in localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
      
      // If primaryColor is updated, update CSS variable
      if (newSettings.primaryColor) {
        document.documentElement.style.setProperty('--primary', newSettings.primaryColor);
      }
      
      return updatedSettings;
    });
  };

  // Function to handle user theme change
  const handleUserThemeChange = (theme: Theme) => {
    setUserTheme(theme);
  };

  // Function to format dates according to the selected timezone and language
  const formatDate = (date: Date | string | number, options?: Intl.DateTimeFormatOptions): string => {
    if (!date) return "";
    
    const locale = settings.language === "en" ? "en-US" : "es-ES";
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      ...options
    };
    
    return formatDateInTimezone(date, settings.timezone, locale, defaultOptions);
  };
  
  // Function to format time only
  const formatTime = (date: Date | string | number): string => {
    return formatDate(date, {
      year: undefined,
      month: undefined,
      day: undefined,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };
  
  // Function to format full date and time
  const formatDateTime = (date: Date | string | number): string => {
    return formatDate(date, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <BackofficeSettingsContext.Provider value={{ 
      settings, 
      updateSettings, 
      formatDate,
      formatTime,
      formatDateTime,
      userTheme,
      setUserTheme: handleUserThemeChange
    }}>
      {children}
    </BackofficeSettingsContext.Provider>
  );
};

// Hook for using the context
export const useBackofficeSettings = () => useContext(BackofficeSettingsContext);
