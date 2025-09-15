import React, { useState } from "react";
import { User } from "@/lib/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditUserInfoForm } from "./EditUserInfoForm";
import { ResetPasswordDialog } from "./ResetPasswordDialog";
import { userService } from "@/lib/api/user-service";
import { useQueryClient } from "@tanstack/react-query";
import { useCompanyUserConfig } from "@/hooks/use-company-user-config";
import { Copy, Edit2, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";

interface UserInfoTabProps {
  user: User;
}

export const UserInfoTab: React.FC<UserInfoTabProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [expandedValues, setExpandedValues] = useState<Record<string, boolean>>({});
  const queryClient = useQueryClient();
  const { hasEditableFields } = useCompanyUserConfig();
  const { settings } = useBackofficeSettings();
  const { toast } = useToast();
  const t = (key: string) => translate(key, settings.language);

  const formatDisplayValue = (value: any): string => {
    if (value === undefined || value === null || value === "") {
      return "Empty";
    }
    
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    
    return String(value);
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
        title: t("success"),
        description: `${fieldName} copied to clipboard`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: "Unable to copy to clipboard",
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

  const renderStatus = () => {
    if (user.blocked || user.status === "BLOCKED") {
      return <Badge variant="destructive">{t("blocked")}</Badge>;
    } else if (user.deleted) {
      return <Badge variant="destructive">{t("deleted")}</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t("active")}</Badge>;
    }
  };

  const renderUserField = (key: string, value: any) => {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    const formattedValue = formatDisplayValue(value);
    const stringValue = String(value);
    const isLongValue = stringValue.length > 100;
    const isJSONValue = typeof value === 'string' && isJSON(value);
    const isExpanded = expandedValues[key] || false;
    
    // Determine display value
    let displayValue = formattedValue;
    if (isJSONValue) {
      displayValue = isExpanded ? formatJSON(value) : stringValue;
    }
    
    // Truncate if not expanded and is long
    const shouldTruncate = isLongValue && !isExpanded;
    const truncatedValue = shouldTruncate ? displayValue.slice(0, 100) + "..." : displayValue;
    
    return (
      <div key={key} className="flex justify-between items-start py-3 border-b last:border-b-0">
        <span className="font-medium text-muted-foreground capitalize min-w-0 flex-1">
          {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}:
        </span>
        <div className="min-w-0 flex-1 ml-4">
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <pre className={`text-sm break-words whitespace-pre-wrap overflow-hidden text-right ${
                isJSONValue ? 'bg-muted/50 p-2 rounded border font-mono' : ''
              }`}>
                {truncatedValue}
              </pre>
            </div>
            {(isLongValue || isJSONValue || stringValue.length > 20) && (
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(stringValue, key)}
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
          {isJSONValue && (
            <div className="flex justify-end mt-1">
              <Badge variant="secondary" className="text-xs">JSON</Badge>
            </div>
          )}
        </div>
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
          {hasEditableFields() && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              {t("edit")} {t("information")}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResetPasswordDialog(true)}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            {t("reset-password")}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-1">
            {/* Render all user fields except id */}
            {Object.entries(user)
              .filter(([key, value]) => key !== 'id' && key !== 'additionalInfo')
              .map(([key, value]) => renderUserField(key, value))}
            
            {/* Render additional info fields */}
            {user.additionalInfo && Object.entries(user.additionalInfo).map(([key, value]) => 
              renderUserField(`additional_${key}`, value)
            )}
          </div>
        </CardContent>
      </Card>

      <ResetPasswordDialog
        open={showResetPasswordDialog}
        onClose={() => setShowResetPasswordDialog(false)}
        userId={user.id.toString()}
        userName={user.username || user.name || ""}
      />
    </div>
  );
};