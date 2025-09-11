
import React, { useState } from "react";
import { User } from "@/lib/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditUserInfoForm } from "./EditUserInfoForm";
import { ResetPasswordDialog } from "./ResetPasswordDialog";
import { userService } from "@/lib/api/user-service";
import { useQueryClient } from "@tanstack/react-query";
import { formatFieldName, parseDate } from "@/lib/utils";
import { formatBirthDate } from "@/lib/date-utils";
import { useCompanyUserConfig } from "@/hooks/use-company-user-config";
import { Key, ChevronDown, ChevronUp, Copy } from "lucide-react";
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
  const { isFieldVisible, isFieldEditable, loading: configLoading } = useCompanyUserConfig();
  const { settings } = useBackofficeSettings();
  const { toast } = useToast();
  const t = (key: string) => translate(key, settings.language);

  // Helper function to format dates
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Empty";
    
    // Use the specialized birth date formatter
    if (dateString.includes('-')) {
      return formatBirthDate(dateString);
    }
    
    // For other dates, use the regular parser
    const date = parseDate(dateString);
    if (!date) return "Invalid date";
    return date.toLocaleDateString();
  };

  // Helper function to format display values
  const formatDisplayValue = (value: any): string => {
    if (value === undefined || value === null || value === "") {
      return "Empty";
    }
    
    if (typeof value === "string") {
      return value;
    }
    
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
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
        title: "Copied!",
        description: `${fieldName} value copied to clipboard`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
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

  const renderAdditionalInfoValue = (key: string, value: any) => {
    const stringValue = formatDisplayValue(value);
    const isLongValue = stringValue.length > 100;
    const isJSONValue = typeof value === 'string' && isJSON(value);
    const isExpanded = expandedValues[key] || false;
    
    // Determine display value
    let displayValue = stringValue;
    if (isJSONValue) {
      displayValue = isExpanded ? formatJSON(value) : stringValue;
    }
    
    // Truncate if not expanded and is long
    const shouldTruncate = isLongValue && !isExpanded;
    const truncatedValue = shouldTruncate ? displayValue.slice(0, 100) + "..." : displayValue;

    return (
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <pre className={`text-sm text-muted-foreground font-mono whitespace-pre-wrap break-words overflow-hidden ${
              isJSONValue ? 'bg-muted/50 p-2 rounded border' : ''
            }`}>
              {truncatedValue}
            </pre>
          </div>
          {(isLongValue || isJSONValue) && (
            <div className="flex gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(stringValue, formatFieldName(key))}
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
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-xs">JSON</Badge>
          </div>
        )}
      </div>
    );
  };

  const renderAdditionalInfo = () => {
    if (!user.additionalInfo || Object.keys(user.additionalInfo).length === 0) {
      return <p className="text-muted-foreground">{t("no-additional-info")}</p>;
    }

    return (
      <div className="space-y-6">
        {Object.entries(user.additionalInfo).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <p className="text-sm font-medium">{formatFieldName(key)}</p>
            {renderAdditionalInfoValue(key, value)}
          </div>
        ))}
      </div>
    );
  };

  const handleUpdateUser = async (updatedUserData: any) => {
    await userService.updateUser(user.id.toString(), updatedUserData);
    setIsEditing(false);
    queryClient.invalidateQueries({ queryKey: ['user', user.id.toString()] });
  };

  const handleResetPassword = () => {
    setShowResetPasswordDialog(true);
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("edit-profile")}</CardTitle>
          </CardHeader>
          <CardContent>
            <EditUserInfoForm 
              user={user} 
              onUpdate={handleUpdateUser} 
              onCancel={() => setIsEditing(false)} 
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Field visibility check helper
  const shouldRenderField = (fieldName: string) => {
    return isFieldVisible(fieldName);
  };

  // Show loading state while configuration is loading
  if (configLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading user configuration...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if the edit button should be visible
  // There should be at least one editable field
  const hasEditableFields = [
    "name", "surname", "username", "email", "cellPhone", 
    "birthDate", "nationality", "gender", "language", "region",
    "additionalInfo"
  ].some(field => isFieldEditable(field));

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-3">
        {hasEditableFields && (
          <Button onClick={() => setIsEditing(true)} className="hidden">
            {t("edit")} {t("information")}
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("basic-information")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {shouldRenderField("name") && shouldRenderField("surname") && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t("full-name")}</h3>
                  <p>{formatDisplayValue(user.name)} {formatDisplayValue(user.surname)}</p>
                </div>
              )}
              {shouldRenderField("username") && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t("username")}</h3>
                  <p>{formatDisplayValue(user.username)}</p>
                </div>
              )}
              {shouldRenderField("status") && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t("status")}</h3>
                  <div>{renderStatus()}</div>
                </div>
              )}
              {shouldRenderField("email") && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t("email")}</h3>
                  <p>{formatDisplayValue(user.email)}</p>
                </div>
              )}
              {shouldRenderField("cellPhone") && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t("cell-phone")}</h3>
                  <p>{formatDisplayValue(user.cellPhone)}</p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {shouldRenderField("birthDate") && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t("birth-date")}</h3>
                  <p>{formatDate(user.birthDate)}</p>
                </div>
              )}
              {shouldRenderField("nationality") && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t("nationality")}</h3>
                  <p>{formatDisplayValue(user.nationality)}</p>
                </div>
              )}
              {shouldRenderField("gender") && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t("gender")}</h3>
                  <p>{user.gender === 'M' ? t('male') : user.gender === 'F' ? t('female') : formatDisplayValue(user.gender)}</p>
                </div>
              )}
              {shouldRenderField("language") && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t("language")}</h3>
                  <p>{formatDisplayValue(user.language)}</p>
                </div>
              )}
              {shouldRenderField("region") && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t("region")}</h3>
                  <p>{formatDisplayValue(user.region)}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("identification")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{t("user-id")}</h3>
                <p>{formatDisplayValue(user.id)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{t("public-id")}</h3>
                <p>{formatDisplayValue(user.publicId)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{t("default-wallet")}</h3>
                <p>{formatDisplayValue(user.defaultWalletId)}</p>
              </div>
            </div>
            <div className="space-y-4">
              {shouldRenderField("government_identification") && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {user.government_identification_type ? formatDisplayValue(user.government_identification_type) : t("government-id")}
                  </h3>
                  <p>{formatDisplayValue(user.government_identification)}</p>
                </div>
              )}
              {shouldRenderField("government_identification2") && user.government_identification2 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {user.government_identification_type2 ? formatDisplayValue(user.government_identification_type2) : t("government-id-2")}
                  </h3>
                  <p>{formatDisplayValue(user.government_identification2)}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {shouldRenderField("additionalInfo") && (
        <Card>
          <CardHeader>
            <CardTitle>{t("additional-information")}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderAdditionalInfo()}
          </CardContent>
        </Card>
      )}
      
      {/* Reset Password Dialog */}
      {showResetPasswordDialog && (
        <ResetPasswordDialog
          open={showResetPasswordDialog}
          userId={user.id.toString()}
          userName={`${user.name} ${user.surname}`}
          onClose={() => setShowResetPasswordDialog(false)}
        />
      )}
    </div>
  );
};
