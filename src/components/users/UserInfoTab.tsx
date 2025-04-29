
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
import { useUserFieldSettings } from "@/hooks/use-user-field-settings";
import { Key } from "lucide-react";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface UserInfoTabProps {
  user: User;
}

export const UserInfoTab: React.FC<UserInfoTabProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const queryClient = useQueryClient();
  const { isFieldVisible, isFieldEditable, isLoaded } = useUserFieldSettings();
  const { settings } = useBackofficeSettings();
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

  const renderAdditionalInfo = () => {
    if (!user.additionalInfo || Object.keys(user.additionalInfo).length === 0) {
      return <p className="text-muted-foreground">{t("no-additional-info")}</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(user.additionalInfo).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <p className="text-sm font-medium">{formatFieldName(key)}</p>
            <p className="text-sm text-muted-foreground">{formatDisplayValue(value)}</p>
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
    return isLoaded && isFieldVisible(fieldName);
  };

  // Check if the edit button should be visible
  // There should be at least one editable field
  const hasEditableFields = isLoaded && [
    "name", "surname", "username", "email", "cellPhone", 
    "birthDate", "nationality", "gender", "language", "region",
    "additionalInfo"
  ].some(field => isFieldEditable(field));

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-3">
        <Button 
          variant="outline" 
          onClick={handleResetPassword}
          className="flex items-center gap-2"
        >
          <Key className="h-4 w-4" />
          {t("reset-password")}
        </Button>
        
        {hasEditableFields && (
          <Button onClick={() => setIsEditing(true)}>
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
              {shouldRenderField("governmentIdentificationType") && shouldRenderField("governmentIdentification") && user.governmentIdentificationType && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {formatDisplayValue(user.governmentIdentificationType)}
                  </h3>
                  <p>{formatDisplayValue(user.governmentIdentification)}</p>
                </div>
              )}
              {shouldRenderField("governmentIdentificationType2") && shouldRenderField("governmentIdentification2") && user.governmentIdentificationType2 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {formatDisplayValue(user.governmentIdentificationType2)}
                  </h3>
                  <p>{formatDisplayValue(user.governmentIdentification2)}</p>
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
