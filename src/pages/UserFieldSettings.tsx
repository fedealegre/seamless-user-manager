
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/api/types";
import { useAuth } from "@/contexts/AuthContext";
import { Save } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface FieldSettings {
  fieldName: string;
  displayName: string;
  isVisible: boolean;
  isEditable: boolean;
}

const UserFieldSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.roles.includes("admin");

  // Get user fields from the User interface
  const initialFieldSettings: FieldSettings[] = [
    { fieldName: "name", displayName: "First Name", isVisible: true, isEditable: true },
    { fieldName: "surname", displayName: "Last Name", isVisible: true, isEditable: true },
    { fieldName: "username", displayName: "Username", isVisible: true, isEditable: true },
    { fieldName: "email", displayName: "Email", isVisible: true, isEditable: true },
    { fieldName: "phoneNumber", displayName: "Phone Number", isVisible: true, isEditable: true },
    { fieldName: "gender", displayName: "Gender", isVisible: true, isEditable: true },
    { fieldName: "birthDate", displayName: "Birth Date", isVisible: true, isEditable: true },
    { fieldName: "nationality", displayName: "Nationality", isVisible: true, isEditable: true },
    { fieldName: "language", displayName: "Language", isVisible: true, isEditable: true },
    { fieldName: "region", displayName: "Region", isVisible: true, isEditable: true },
    { fieldName: "status", displayName: "Status", isVisible: true, isEditable: true },
    { fieldName: "hasPin", displayName: "Has PIN", isVisible: true, isEditable: false },
    { fieldName: "timeZone", displayName: "Time Zone", isVisible: true, isEditable: true },
    { fieldName: "governmentIdentification", displayName: "Government ID", isVisible: true, isEditable: false },
    { fieldName: "governmentIdentificationType", displayName: "Government ID Type", isVisible: true, isEditable: false },
    { fieldName: "additionalInfo", displayName: "Additional Information", isVisible: true, isEditable: true },
  ];

  const [fieldSettings, setFieldSettings] = useState<FieldSettings[]>(initialFieldSettings);
  const [isSaving, setIsSaving] = useState(false);

  // Check if user has admin role
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="text-4xl font-bold text-destructive mb-2">Access Denied</div>
        <p className="text-lg text-muted-foreground mb-6">
          You don't have permission to access User Field Settings.
        </p>
        <p className="text-sm text-muted-foreground">
          Required role: admin
        </p>
      </div>
    );
  }

  const handleToggleVisibility = (index: number) => {
    setFieldSettings(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], isVisible: !updated[index].isVisible };
      return updated;
    });
  };

  const handleToggleEditability = (index: number) => {
    setFieldSettings(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], isEditable: !updated[index].isEditable };
      return updated;
    });
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call to save settings
    setTimeout(() => {
      // In a real app, we would save these settings to the backend
      localStorage.setItem('userFieldSettings', JSON.stringify(fieldSettings));
      
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "User field settings have been updated successfully.",
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Field Settings</h1>
          <p className="text-muted-foreground">
            Configure which user fields are visible and editable in the backoffice
          </p>
        </div>
        <Button 
          onClick={handleSaveSettings} 
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save size={16} />
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Field Configuration</CardTitle>
          <CardDescription>
            Toggle visibility and editability for each user field in the backoffice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Field</TableHead>
                <TableHead className="text-center">Visible</TableHead>
                <TableHead className="text-center">Editable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fieldSettings.map((field, index) => (
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
