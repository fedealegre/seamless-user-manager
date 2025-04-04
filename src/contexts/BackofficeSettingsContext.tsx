
import React, { createContext, useContext, useState, useEffect } from "react";
import { formatDateInTimezone } from "@/lib/date-utils";

// Define the available languages
export type Language = "en" | "es";

// Define the theme options
export type Theme = "light" | "dark" | "system";

// Define the settings structure with all theme colors
export interface BackofficeSettings {
  language: Language;
  timezone: string;
  defaultTheme?: Theme;
  
  // Light mode colors
  primaryColor: string;
  primaryForeground: string;
  secondaryColor: string;
  secondaryForeground: string;
  mutedColor: string;
  mutedForeground: string;
  accentColor: string;
  accentForeground: string;
  destructiveColor: string;
  destructiveForeground: string;
  backgroundColor: string;
  foregroundColor: string;
  cardColor: string;
  cardForeground: string;
  borderColor: string;
  inputColor: string;
  ringColor: string;
  
  // Sidebar colors
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
  
  // Dark mode colors
  darkPrimaryColor: string;
  darkPrimaryForeground: string;
  darkSecondaryColor: string;
  darkSecondaryForeground: string;
  darkMutedColor: string;
  darkMutedForeground: string;
  darkAccentColor: string;
  darkAccentForeground: string;
  darkDestructiveColor: string;
  darkDestructiveForeground: string;
  darkBackgroundColor: string;
  darkForegroundColor: string;
  darkCardColor: string;
  darkCardForeground: string;
  darkBorderColor: string;
  darkInputColor: string;
  darkRingColor: string;
  
  // Dark mode sidebar colors
  darkSidebarBackground: string;
  darkSidebarForeground: string;
  darkSidebarPrimary: string;
  darkSidebarPrimaryForeground: string;
  darkSidebarAccent: string;
  darkSidebarAccentForeground: string;
  darkSidebarBorder: string;
  darkSidebarRing: string;
}

// Default settings with all theme colors
const DEFAULT_SETTINGS: BackofficeSettings = {
  language: "en",
  timezone: "UTC",
  defaultTheme: "light",
  
  // Light mode colors
  primaryColor: "hsl(221.2 83.2% 53.3%)",
  primaryForeground: "hsl(210 40% 98%)",
  secondaryColor: "hsl(210 40% 96.1%)",
  secondaryForeground: "hsl(222.2 47.4% 11.2%)",
  mutedColor: "hsl(210 40% 96.1%)",
  mutedForeground: "hsl(215.4 16.3% 46.9%)",
  accentColor: "hsl(210 40% 96.1%)",
  accentForeground: "hsl(222.2 47.4% 11.2%)",
  destructiveColor: "hsl(0 84.2% 60.2%)",
  destructiveForeground: "hsl(210 40% 98%)",
  backgroundColor: "hsl(210 40% 98%)",
  foregroundColor: "hsl(222.2 84% 4.9%)",
  cardColor: "hsl(0 0% 100%)",
  cardForeground: "hsl(222.2 84% 4.9%)",
  borderColor: "hsl(214.3 31.8% 91.4%)",
  inputColor: "hsl(214.3 31.8% 91.4%)",
  ringColor: "hsl(221.2 83.2% 53.3%)",
  
  // Sidebar colors
  sidebarBackground: "hsl(220 20% 97%)",
  sidebarForeground: "hsl(222 47% 11%)",
  sidebarPrimary: "hsl(221.2 83.2% 53.3%)",
  sidebarPrimaryForeground: "hsl(0 0% 100%)",
  sidebarAccent: "hsl(210 40% 96.1%)",
  sidebarAccentForeground: "hsl(222.2 47.4% 11.2%)",
  sidebarBorder: "hsl(214.3 31.8% 91.4%)",
  sidebarRing: "hsl(221.2 83.2% 53.3%)",
  
  // Dark mode colors
  darkPrimaryColor: "hsl(217.2 91.2% 59.8%)",
  darkPrimaryForeground: "hsl(222.2 47.4% 11.2%)",
  darkSecondaryColor: "hsl(217.2 32.6% 17.5%)",
  darkSecondaryForeground: "hsl(210 40% 98%)",
  darkMutedColor: "hsl(217.2 32.6% 17.5%)",
  darkMutedForeground: "hsl(215 20.2% 65.1%)",
  darkAccentColor: "hsl(217.2 32.6% 17.5%)",
  darkAccentForeground: "hsl(210 40% 98%)",
  darkDestructiveColor: "hsl(0 62.8% 30.6%)",
  darkDestructiveForeground: "hsl(210 40% 98%)",
  darkBackgroundColor: "hsl(222.2 84% 4.9%)",
  darkForegroundColor: "hsl(210 40% 98%)",
  darkCardColor: "hsl(222.2 84% 4.9%)",
  darkCardForeground: "hsl(210 40% 98%)",
  darkBorderColor: "hsl(217.2 32.6% 17.5%)",
  darkInputColor: "hsl(217.2 32.6% 17.5%)",
  darkRingColor: "hsl(224.3 76.3% 48%)",
  
  // Dark mode sidebar colors
  darkSidebarBackground: "hsl(222.2 47.4% 9%)",
  darkSidebarForeground: "hsl(210 40% 98%)",
  darkSidebarPrimary: "hsl(217.2 91.2% 59.8%)",
  darkSidebarPrimaryForeground: "hsl(222.2 47.4% 11.2%)",
  darkSidebarAccent: "hsl(217.2 32.6% 17.5%)",
  darkSidebarAccentForeground: "hsl(210 40% 98%)",
  darkSidebarBorder: "hsl(217.2 32.6% 17.5%)",
  darkSidebarRing: "hsl(224.3 76.3% 48%)"
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
  applyColorValues: () => void;
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
  applyColorValues: () => {},
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

  // Apply all CSS variables based on current settings
  const applyColorValues = () => {
    const isDark = userTheme === "dark" || 
      (userTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const root = document.documentElement;
    
    // Add transition class for smooth theme changes
    root.classList.add("theme-transition");
    
    // Apply light or dark mode colors accordingly
    if (!isDark) {
      // Light mode colors
      root.style.setProperty('--background', settings.backgroundColor);
      root.style.setProperty('--foreground', settings.foregroundColor);
      root.style.setProperty('--card', settings.cardColor);
      root.style.setProperty('--card-foreground', settings.cardForeground);
      root.style.setProperty('--popover', settings.cardColor);
      root.style.setProperty('--popover-foreground', settings.cardForeground);
      root.style.setProperty('--primary', settings.primaryColor);
      root.style.setProperty('--primary-foreground', settings.primaryForeground);
      root.style.setProperty('--secondary', settings.secondaryColor);
      root.style.setProperty('--secondary-foreground', settings.secondaryForeground);
      root.style.setProperty('--muted', settings.mutedColor);
      root.style.setProperty('--muted-foreground', settings.mutedForeground);
      root.style.setProperty('--accent', settings.accentColor);
      root.style.setProperty('--accent-foreground', settings.accentForeground);
      root.style.setProperty('--destructive', settings.destructiveColor);
      root.style.setProperty('--destructive-foreground', settings.destructiveForeground);
      root.style.setProperty('--border', settings.borderColor);
      root.style.setProperty('--input', settings.inputColor);
      root.style.setProperty('--ring', settings.ringColor);
      
      // Sidebar colors
      root.style.setProperty('--sidebar-background', settings.sidebarBackground);
      root.style.setProperty('--sidebar-foreground', settings.sidebarForeground);
      root.style.setProperty('--sidebar-primary', settings.sidebarPrimary);
      root.style.setProperty('--sidebar-primary-foreground', settings.sidebarPrimaryForeground);
      root.style.setProperty('--sidebar-accent', settings.sidebarAccent);
      root.style.setProperty('--sidebar-accent-foreground', settings.sidebarAccentForeground);
      root.style.setProperty('--sidebar-border', settings.sidebarBorder);
      root.style.setProperty('--sidebar-ring', settings.sidebarRing);
    } else {
      // Dark mode colors
      root.style.setProperty('--background', settings.darkBackgroundColor);
      root.style.setProperty('--foreground', settings.darkForegroundColor);
      root.style.setProperty('--card', settings.darkCardColor);
      root.style.setProperty('--card-foreground', settings.darkCardForeground);
      root.style.setProperty('--popover', settings.darkCardColor);
      root.style.setProperty('--popover-foreground', settings.darkCardForeground);
      root.style.setProperty('--primary', settings.darkPrimaryColor);
      root.style.setProperty('--primary-foreground', settings.darkPrimaryForeground);
      root.style.setProperty('--secondary', settings.darkSecondaryColor);
      root.style.setProperty('--secondary-foreground', settings.darkSecondaryForeground);
      root.style.setProperty('--muted', settings.darkMutedColor);
      root.style.setProperty('--muted-foreground', settings.darkMutedForeground);
      root.style.setProperty('--accent', settings.darkAccentColor);
      root.style.setProperty('--accent-foreground', settings.darkAccentForeground);
      root.style.setProperty('--destructive', settings.darkDestructiveColor);
      root.style.setProperty('--destructive-foreground', settings.darkDestructiveForeground);
      root.style.setProperty('--border', settings.darkBorderColor);
      root.style.setProperty('--input', settings.darkInputColor);
      root.style.setProperty('--ring', settings.darkRingColor);
      
      // Sidebar colors
      root.style.setProperty('--sidebar-background', settings.darkSidebarBackground);
      root.style.setProperty('--sidebar-foreground', settings.darkSidebarForeground);
      root.style.setProperty('--sidebar-primary', settings.darkSidebarPrimary);
      root.style.setProperty('--sidebar-primary-foreground', settings.darkSidebarPrimaryForeground);
      root.style.setProperty('--sidebar-accent', settings.darkSidebarAccent);
      root.style.setProperty('--sidebar-accent-foreground', settings.darkSidebarAccentForeground);
      root.style.setProperty('--sidebar-border', settings.darkSidebarBorder);
      root.style.setProperty('--sidebar-ring', settings.darkSidebarRing);
    }
    
    // Remove transition class after changes are applied
    setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 300);
  };

  // Apply color values whenever settings or userTheme changes
  useEffect(() => {
    applyColorValues();
  }, [settings, userTheme]);

  // Function to update settings
  const updateSettings = (newSettings: Partial<BackofficeSettings>) => {
    setSettings(prevSettings => {
      const updatedSettings = { ...prevSettings, ...newSettings };
      
      // Store in localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
      
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
      setUserTheme: handleUserThemeChange,
      applyColorValues
    }}>
      {children}
    </BackofficeSettingsContext.Provider>
  );
};

// Hook for using the context
export const useBackofficeSettings = () => useContext(BackofficeSettingsContext);
