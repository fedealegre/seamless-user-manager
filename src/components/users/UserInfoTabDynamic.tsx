import React, { useState } from "react";
import { User } from "@/lib/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditUserInfoForm } from "./EditUserInfoForm";
import { userService } from "@/lib/api/user-service";
import { useQueryClient } from "@tanstack/react-query";
import { useCompanyUserConfig } from "@/hooks/use-company-user-config";
import { usePermissions } from "@/hooks/use-permissions";
import { Copy, Edit2, ChevronDown, ChevronUp } from "lucide-react";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";

interface UserInfoTabProps {
  user: User;
}

export const UserInfoTab: React.FC<UserInfoTabProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [expandedValues, setExpandedValues] = useState<Record<string, boolean>>({});
  const queryClient = useQueryClient();
  const { hasEditableFields } = useCompanyUserConfig();
  const { hasRole } = usePermissions();
  const { settings } = useBackofficeSettings();
  const { toast } = useToast();
  const t = (key: string) => translate(key, settings.language);

  // Helper function to get Spanish field name
  const getFieldLabel = (fieldName: string): string => {
    // Try to get the translation first, if not found, format the field name
    const translationKey = fieldName.toLowerCase();
    const translated = translate(translationKey, settings.language);
    
    // If translation exists and is different from the key, use it
    if (translated !== translationKey) {
      return translated;
    }
    
    // Otherwise, format the field name nicely
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim();
  };

  const formatDisplayValue = (value: any): string => {
    if (value === undefined || value === null || value === "") {
      return "Empty";
    }
    
    if (typeof value === "boolean") {
      return value ? t("active") : "No";
    }
    
    return String(value);
  };

  const renderStatus = () => {
    if (user.blocked || user.status === "BLOCKED") {
      return <Badge variant="destructive">{t("blocked")}</Badge>;
    } else if (user.deleted) {
      return <Badge variant="destructive">{t("deleted")}</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t("active")}</Badge>;
    }
  };

  // Helper function to detect if value is JSON
  const isJSON = (value: string): boolean => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  };

  // Helper function to format JSON with proper indentation
  const formatJSON = (value: string): string => {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  };

  // Copy to clipboard function
  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: `Valor de ${fieldName} copiado al portapapeles`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al copiar",
        description: "No se pudo copiar al portapapeles",
      });
    }
  };

  // Toggle expanded state for a specific field
  const toggleExpanded = (key: string) => {
    setExpandedValues(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderFieldValue = (key: string, value: any) => {
    const stringValue = formatDisplayValue(value);
    const isLongValue = stringValue.length > 100;
    const isJSONValue = typeof value === 'string' && isJSON(value);
    const isExpanded = expandedValues[key] || false;
    
    // Special handling for status field
    if (key === 'status' || key === 'blocked' || key === 'deleted') {
      return (
        <div className="text-right min-w-0 flex-1 ml-4">
          {renderStatus()}
        </div>
      );
    }
    
    // Determine display value
    let displayValue = stringValue;
    if (isJSONValue) {
      displayValue = isExpanded ? formatJSON(value) : stringValue;
    }
    
    // Truncate if not expanded and is long
    const shouldTruncate = isLongValue && !isExpanded;
    const truncatedValue = shouldTruncate ? displayValue.slice(0, 100) + "..." : displayValue;

    return (
      <div className="text-right min-w-0 flex-1 ml-4">
        <div className="flex items-start gap-2 justify-end">
          <div className="flex-1 min-w-0 text-right">
            <pre className={`text-sm break-words whitespace-pre-wrap text-right ${
              isJSONValue ? 'bg-muted/50 p-2 rounded border font-mono' : ''
            }`}>
              {truncatedValue}
            </pre>
          </div>
          {(isLongValue || isJSONValue) && (
            <div className="flex gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(stringValue, getFieldLabel(key))}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
              {isLongValue && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(key)}
                  className="h-6 w-6 p-0"
                >
                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Helper function to render government identification fields
  const renderGovernmentIdentification = (typeKey: string, idKey: string, userData: any) => {
    const type = userData[typeKey];
    const identification = userData[idKey];
    
    if (!type || !identification) {
      return null;
    }

    return (
      <div key={`${typeKey}-${idKey}`} className="flex justify-between items-start py-2 border-b last:border-b-0">
        <span className="font-medium text-muted-foreground min-w-0 flex-1">
          {type}:
        </span>
        {renderFieldValue(idKey, identification)}
      </div>
    );
  };

  const renderUserField = (key: string, value: any) => {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    return (
      <div key={key} className="flex justify-between items-start py-2 border-b last:border-b-0">
        <span className="font-medium text-muted-foreground min-w-0 flex-1">
          {getFieldLabel(key)}:
        </span>
        {renderFieldValue(key, value)}
      </div>
    );
  };

  const handleUpdateUser = async (updatedUserData: any) => {
    try {
      await userService.updateUser(user.id.toString(), updatedUserData);
      queryClient.invalidateQueries({ queryKey: ['user', user.id.toString()] });
      setIsEditing(false);
      toast({
        title: t("success"),
        description: t("user-updated-successfully"),
      });
    } catch (error) {
      console.error("Failed to update user:", error);
      toast({
        title: t("error"),
        description: t("failed-to-update-user"),
        variant: "destructive",
      });
    }
  };

  if (isEditing) {
    return (
      <EditUserInfoForm
        user={user}
        onUpdate={handleUpdateUser}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{t("user-information")}</h3>
          {renderStatus()}
        </div>
        <div className="flex gap-2">
          {hasEditableFields() && !hasRole("operador") && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              {t("edit-information")}
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-1">
            {/* First render government identification pairs from user fields */}
            {user.government_identification_type && user.government_identification && 
              renderGovernmentIdentification('government_identification_type', 'government_identification', user)
            }
            {user.government_identification_type2 && user.government_identification2 && 
              renderGovernmentIdentification('government_identification_type2', 'government_identification2', user)
            }
            
            {/* Then render remaining user fields, excluding government identification fields and additionalInfo */}
            {Object.entries(user)
              .filter(([key, value]) => 
                key !== 'additionalInfo' && 
                key !== 'government_identification_type' && 
                key !== 'government_identification' &&
                key !== 'government_identification_type2' && 
                key !== 'government_identification2'
              )
              .map(([key, value]) => renderUserField(key, value))}
            
            {/* Check for government identification pairs in additional info */}
            {user.additionalInfo?.government_identification_type && user.additionalInfo?.government_identification && 
              renderGovernmentIdentification('government_identification_type', 'government_identification', user.additionalInfo)
            }
            {user.additionalInfo?.government_identification_type2 && user.additionalInfo?.government_identification2 && 
              renderGovernmentIdentification('government_identification_type2', 'government_identification2', user.additionalInfo)
            }
            
            {/* Then render remaining additional info fields, excluding government identification fields */}
            {user.additionalInfo && Object.entries(user.additionalInfo)
              .filter(([key, value]) => 
                key !== 'government_identification_type' && 
                key !== 'government_identification' &&
                key !== 'government_identification_type2' && 
                key !== 'government_identification2'
              )
              .map(([key, value]) => renderUserField(key, value))
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
