import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Edit } from "lucide-react";
import { User } from "@/lib/api/types";
import { EditUserInfoForm } from "./EditUserInfoForm";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { usePermissions } from "@/hooks/use-permissions";
import { useQueryClient } from "@tanstack/react-query";
import { userService } from "@/lib/api/user-service";
import { useToast } from "@/hooks/use-toast";

interface UserInfoTabProps {
  user: User;
}

export const UserInfoTab: React.FC<UserInfoTabProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [expandedValues, setExpandedValues] = useState<Record<string, boolean>>({});
  const [expandedObjects, setExpandedObjects] = useState<Record<string, boolean>>({});
  const { settings } = useBackofficeSettings();
  const { hasRole } = usePermissions();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const t = (key: string) => translate(key, settings.language);

  // Fields to exclude from display
  const excludedFields = ['hasPin', 'has_pin', 'accountBlocked', 'account_blocked', 'accountDeleted', 'account_deleted'];
  
  // Fields that should only appear once (avoid duplication between root and additional_info)
  const uniqueFields = ['status'];

  const renderGovernmentIdentification = (user: any, typeKey: string, idKey: string) => {
    const typeValue = user[typeKey];
    const idValue = user[idKey];
    
    // Only render if both values exist
    if (!typeValue || !idValue) return null;
    
    return (
      <div key={idKey} className="flex justify-between items-start py-2 border-b border-border/40">
        <span className="font-medium text-foreground">
          {typeValue}
        </span>
        {renderFieldValue(idKey, idValue)}
      </div>
    );
  };

  const getFieldLabel = (fieldName: string): string => {
    const translationKey = fieldName.toLowerCase().replace(/[._]/g, '_');
    const translation = translate(translationKey, settings.language);
    
    if (translation === translationKey) {
      // If no translation found, format the field name by replacing special characters with spaces
      return fieldName
        .replace(/[._]/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/\b\w/g, l => l.toUpperCase())
        .trim();
    }
    
    return translation;
  };

  const formatDisplayValue = (value: any): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? t("yes") : t("no");
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };


  const isJSON = (value: string): boolean => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  };

  const formatJSON = (value: string): string => {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: t("copied-to-clipboard"),
        description: `${fieldName}: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`,
      });
    });
  };

  const toggleExpanded = (key: string) => {
    setExpandedValues(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleObjectExpanded = (key: string) => {
    setExpandedObjects(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isObject = (value: any): boolean => {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  };

  const renderFieldValue = (key: string, value: any) => {
    const stringValue = formatDisplayValue(value);
    
    // Check if the value is long and should be collapsible (more than ~200 characters or multiline)
    const isLongValue = stringValue.length > 200 || stringValue.includes('\n');
    const isExpanded = expandedValues[key] || false;
    
    if (isLongValue) {
      // Show truncated version if not expanded
      const truncatedValue = isExpanded ? stringValue : stringValue.substring(0, 200) + (stringValue.length > 200 ? '...' : '');
      
      return (
        <div className="text-right min-w-0 flex-1 ml-4">
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <span 
                className={`text-sm break-words ${isJSON(stringValue) ? 'font-mono' : ''}`}
                style={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: isExpanded ? 'none' : 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  wordBreak: 'break-all'
                }}
              >
                {isJSON(stringValue) && isExpanded ? formatJSON(stringValue) : truncatedValue}
              </span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpanded(key)}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              >
                {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    // Regular value
    return (
      <div className="text-right min-w-0 flex-1 ml-4">
        <span className="text-sm break-words">
          {stringValue}
        </span>
      </div>
    );
  };

  const renderObjectField = (key: string, obj: any) => {
    const isExpanded = expandedObjects[key] || false;
    const objectEntries = Object.entries(obj);
    
    return (
      <div key={key} className="space-y-2">
        <div className="flex justify-between items-center py-2 border-b border-border/40">
          <span className="font-medium text-foreground">
            {getFieldLabel(key)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleObjectExpanded(key)}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>
        
        {isExpanded && (
          <div className="ml-4 space-y-2 pl-4 border-l-2 border-border/20">
            {objectEntries.map(([subKey, subValue]) => (
              <div key={subKey} className="flex justify-between items-start py-1">
                <span className="text-sm text-muted-foreground">
                  {getFieldLabel(subKey)}
                </span>
                <div className="text-right min-w-0 flex-1 ml-4">
                  <span className="text-sm break-words">
                    {formatDisplayValue(subValue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderUserField = (key: string, value: any, userData?: any) => {
    // Skip excluded fields
    if (excludedFields.includes(key)) {
      return null;
    }

    // Skip government identification fields that will be handled specially
    if (key === 'government_identification_type' || key === 'government_identification_type2') {
      return null;
    }

    // Handle government identification fields specially
    if (key === 'government_identification') {
      return renderGovernmentIdentification(userData || user, 'government_identification_type', 'government_identification');
    }
    if (key === 'government_identification2') {
      return renderGovernmentIdentification(userData || user, 'government_identification_type2', 'government_identification2');
    }

    // Handle object fields (like address)
    if (isObject(value)) {
      return renderObjectField(key, value);
    }

    return (
      <div key={key} className="flex justify-between items-start py-2 border-b border-border/40">
        <span className="font-medium text-foreground">
          {getFieldLabel(key)}
        </span>
        {renderFieldValue(key, value)}
      </div>
    );
  };

  const handleUpdateUser = async (updatedUserData: any) => {
    try {
      await userService.updateUser(String(user.id), updatedUserData);
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user', String(user.id)] });
      
      toast({
        title: t("user-updated-successfully"),
        description: t("user-information-has-been-updated"),
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: t("error"),
        description: t("error-updating-user"),
        variant: "destructive"
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

  // Prepare data for rendering
  const rootFields: [string, any][] = [];
  const additionalInfoFields: [string, any][] = [];
  const statusShown = { current: false };

  // Process root fields first
  Object.entries(user).forEach(([key, value]) => {
    if (key === 'additionalInfo' || key === 'additional_info') return;
    
    // Handle status uniqueness
    if (uniqueFields.includes(key.toLowerCase())) {
      if (!statusShown.current) {
        rootFields.push([key, value]);
        statusShown.current = true;
      }
      return;
    }
    
    rootFields.push([key, value]);
  });

  // Process additional_info fields
  const additionalInfo = user.additionalInfo || {};
  Object.entries(additionalInfo).forEach(([key, value]) => {
    // Handle status uniqueness
    if (uniqueFields.includes(key.toLowerCase())) {
      if (!statusShown.current) {
        additionalInfoFields.push([key, value]);
        statusShown.current = true;
      }
      return;
    }
    
    additionalInfoFields.push([key, value]);
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">{t("personal-info")}</CardTitle>
          </div>
          {hasRole("admin") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              {t("edit")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {/* Render root fields */}
        {rootFields.map(([key, value]) => renderUserField(key, value, user))}
        
        {/* Render additional_info fields */}
        {additionalInfoFields.map(([key, value]) => renderUserField(key, value, { ...user, ...additionalInfo }))}
      </CardContent>
    </Card>
  );
};