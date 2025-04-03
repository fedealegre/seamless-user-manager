
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Save } from "lucide-react";
import { useUserFieldSettings, FieldSetting } from "@/hooks/use-user-field-settings";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

const UserFieldSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  const isAdmin = user?.roles.includes("admin");
  const { fieldSettings, saveSettings, isLoaded } = useUserFieldSettings();
  
  const [localSettings, setLocalSettings] = useState<FieldSetting[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize local settings once the settings are loaded
  useEffect(() => {
    if (isLoaded) {
      setLocalSettings([...fieldSettings]);
    }
  }, [fieldSettings, isLoaded]);

  // Check if user has admin role
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="text-4xl font-bold text-destructive mb-2">{t("access-denied")}</div>
        <p className="text-lg text-muted-foreground mb-6">
          {t("no-permission-access-user-field-settings")}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("required-role")}: admin
        </p>
      </div>
    );
  }

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="container mx-auto py-4">
        <div className="mb-6">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleToggleVisibility = (index: number) => {
    const updated = [...localSettings];
    updated[index] = { 
      ...updated[index], 
      isVisible: !updated[index].isVisible,
      // If a field is not visible, it cannot be editable
      isEditable: !updated[index].isVisible ? false : updated[index].isEditable
    };
    setLocalSettings(updated);
    setHasChanges(true);
  };

  const handleToggleEditability = (index: number) => {
    const updated = [...localSettings];
    updated[index] = { ...updated[index], isEditable: !updated[index].isEditable };
    setLocalSettings(updated);
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Save settings to localStorage using our hook
    saveSettings(localSettings);
    
    setTimeout(() => {
      setIsSaving(false);
      setHasChanges(false);
      toast({
        title: t("settings-saved"),
        description: t("user-field-settings-updated"),
      });
    }, 500);
  };

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("user-field-settings")}</h1>
          <p className="text-muted-foreground">
            {t("configure-user-fields-backoffice")}
          </p>
        </div>
        <Button 
          onClick={handleSaveSettings} 
          disabled={isSaving || !hasChanges}
          className="flex items-center gap-2"
        >
          <Save size={16} />
          {isSaving ? t("saving") : t("save-settings")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("user-field-configuration")}</CardTitle>
          <CardDescription>
            {t("toggle-visibility-editability")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">{t("field")}</TableHead>
                <TableHead className="text-center">{t("visible")}</TableHead>
                <TableHead className="text-center">{t("editable")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localSettings.map((field, index) => (
                <TableRow key={field.fieldName}>
                  <TableCell className="font-medium">{field.displayName}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Switch
                        checked={field.isVisible}
                        onCheckedChange={() => handleToggleVisibility(index)}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Switch
                        checked={field.isEditable}
                        onCheckedChange={() => handleToggleEditability(index)}
                        disabled={
                          !field.isVisible || 
                          field.fieldName === "hasPin" || 
                          field.fieldName === "governmentIdentification" || 
                          field.fieldName === "governmentIdentificationType"
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserFieldSettings;
