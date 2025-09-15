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
import { Copy, Edit2, FileText } from "lucide-react";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";

interface UserInfoTabProps {
  user: User;
}

export const UserInfoTab: React.FC<UserInfoTabProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
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
    
    return (
      <div key={key} className="flex justify-between items-start py-2 border-b last:border-b-0">
        <span className="font-medium text-muted-foreground capitalize min-w-0 flex-1">
          {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}:
        </span>
        <div className="text-right min-w-0 flex-1 ml-4">
          <span className="break-words">
            {formattedValue}
          </span>
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
          <h3 className="text-lg font-semibold">{t("personal-information")}</h3>
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
              {t("edit")}
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
            {Object.entries(user)
              .filter(([key, value]) => key !== 'id' && key !== 'additionalInfo')
              .map(([key, value]) => renderUserField(key, value))}
            
            {user.additionalInfo && Object.entries(user.additionalInfo).map(([key, value]) => 
              renderUserField(key, value)
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