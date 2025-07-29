
import { useMemo } from "react";

export interface StaticFieldSetting {
  name: string;
  isVisible: boolean;
  isEditable: boolean;
}

// JSON configuration provided by the user
const FIELD_CONFIGURATION = {
  "name": "Company Name",
  "id": 1,
  "fields": [
    {
      "name": "name",
      "isVisible": true,
      "isEditable": true
    },
    {
      "name": "surname",
      "isVisible": true,
      "isEditable": true
    },
    {
      "name": "username",
      "isVisible": true,
      "isEditable": true
    },
    {
      "name": "email",
      "isVisible": true,
      "isEditable": true
    },
    {
      "name": "cellPhone",
      "isVisible": true,
      "isEditable": true
    },
    {
      "name": "gender",
      "isVisible": true,
      "isEditable": true
    },
    {
      "name": "birthDate",
      "isVisible": true,
      "isEditable": true
    },
    {
      "name": "nationality",
      "isVisible": false,
      "isEditable": true
    },
    {
      "name": "language",
      "isVisible": false,
      "isEditable": true
    },
    {
      "name": "region",
      "isVisible": false,
      "isEditable": true
    },
    {
      "name": "status",
      "isVisible": true,
      "isEditable": true
    },
    {
      "name": "hasPin",
      "isVisible": true,
      "isEditable": false
    },
    {
      "name": "timeZone",
      "isVisible": true,
      "isEditable": true
    },
    {
      "name": "governmentIdentification",
      "isVisible": true,
      "isEditable": false
    },
    {
      "name": "governmentIdentificationType",
      "isVisible": true,
      "isEditable": false
    },
    {
      "name": "additionalInfo",
      "isVisible": true,
      "isEditable": true
    }
  ]
};

export function useStaticFieldSettings() {
  const fieldSettings = useMemo(() => FIELD_CONFIGURATION.fields, []);

  // Helper function to check if a field is visible
  const isFieldVisible = (fieldName: string): boolean => {
    const setting = fieldSettings.find(s => s.name === fieldName);
    return setting ? setting.isVisible : true; // Default to visible if setting not found
  };

  // Helper function to check if a field is editable
  const isFieldEditable = (fieldName: string): boolean => {
    const setting = fieldSettings.find(s => s.name === fieldName);
    return setting ? (setting.isVisible && setting.isEditable) : true; // Must be visible to be editable
  };

  return {
    fieldSettings,
    isFieldVisible,
    isFieldEditable,
    isLoaded: true // Always loaded since it's static
  };
}
