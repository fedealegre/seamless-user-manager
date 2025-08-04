
import { useState, useEffect } from "react";

export interface FieldSetting {
  fieldName: string;
  displayName: string;
  isVisible: boolean;
  isEditable: boolean;
}

// Field settings based on the provided JSON configuration
export const defaultFieldSettings: FieldSetting[] = [
  { fieldName: "name", displayName: "First Name", isVisible: true, isEditable: true },
  { fieldName: "surname", displayName: "Last Name", isVisible: true, isEditable: true },
  { fieldName: "username", displayName: "Username", isVisible: true, isEditable: true },
  { fieldName: "email", displayName: "Email", isVisible: true, isEditable: true },
  { fieldName: "cellPhone", displayName: "Cell Phone", isVisible: true, isEditable: true },
  { fieldName: "gender", displayName: "Gender", isVisible: true, isEditable: true },
  { fieldName: "birthDate", displayName: "Birth Date", isVisible: true, isEditable: true },
  { fieldName: "nationality", displayName: "Nationality", isVisible: true, isEditable: true },
  { fieldName: "language", displayName: "Language", isVisible: true, isEditable: true },
  { fieldName: "region", displayName: "Region", isVisible: true, isEditable: true },
  { fieldName: "status", displayName: "Status", isVisible: true, isEditable: true },
  { fieldName: "hasPin", displayName: "Has PIN", isVisible: true, isEditable: false },
  { fieldName: "timeZone", displayName: "Time Zone", isVisible: true, isEditable: true },
  { fieldName: "government_identification", displayName: "Government ID", isVisible: true, isEditable: false },
  { fieldName: "government_identification_type", displayName: "Government ID Type", isVisible: true, isEditable: false },
  { fieldName: "government_identification2", displayName: "Government ID 2", isVisible: true, isEditable: false },
  { fieldName: "government_identification_type2", displayName: "Government ID Type 2", isVisible: true, isEditable: false },
  { fieldName: "additionalInfo", displayName: "Additional Information", isVisible: true, isEditable: true },
];

const USER_FIELD_SETTINGS_KEY = 'userFieldSettings';

export function useUserFieldSettings() {
  const [fieldSettings, setFieldSettings] = useState<FieldSetting[]>(defaultFieldSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount, but use the new JSON config as fallback
  useEffect(() => {
    const storedSettings = localStorage.getItem(USER_FIELD_SETTINGS_KEY);
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        setFieldSettings(parsedSettings);
      } catch (error) {
        console.error("Failed to parse user field settings:", error);
        // If parsing fails, use the new JSON config
        setFieldSettings(defaultFieldSettings);
      }
    } else {
      // No stored settings, use the new JSON config
      setFieldSettings(defaultFieldSettings);
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage
  const saveSettings = (newSettings: FieldSetting[]) => {
    setFieldSettings(newSettings);
    localStorage.setItem(USER_FIELD_SETTINGS_KEY, JSON.stringify(newSettings));
  };

  // Helper function to check if a field is visible
  const isFieldVisible = (fieldName: string): boolean => {
    const setting = fieldSettings.find(s => s.fieldName === fieldName);
    return setting ? setting.isVisible : true; // Default to visible if setting not found
  };

  // Helper function to check if a field is editable
  const isFieldEditable = (fieldName: string): boolean => {
    const setting = fieldSettings.find(s => s.fieldName === fieldName);
    return setting ? (setting.isVisible && setting.isEditable) : true; // Must be visible to be editable
  };

  return {
    fieldSettings,
    saveSettings,
    isFieldVisible,
    isFieldEditable,
    isLoaded
  };
}
