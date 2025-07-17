
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface RoleSelectorProps {
  selectedRoles: string[];
  onRoleToggle: (roleId: string, checked: boolean) => void;
  errorMessage: string | null;
}

const roleOptions = [
  { id: "configurador", label: "Configurador" },
  { id: "compensador", label: "Compensador" },
  { id: "operador", label: "Operador" },
  { id: "analista", label: "Analista" },
  { id: "loyalty", label: "Loyalty" },
];

const RoleSelector: React.FC<RoleSelectorProps> = ({ 
  selectedRoles, 
  onRoleToggle, 
  errorMessage 
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  return (
    <div className="py-4">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t("error")}</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        {roleOptions.map((role) => (
          <div key={role.id} className="flex items-center space-x-2">
            <Checkbox
              id={`role-${role.id}`}
              checked={selectedRoles.includes(role.id)}
              onCheckedChange={(checked) => 
                onRoleToggle(role.id, checked as boolean)
              }
              disabled={selectedRoles.length === 1 && selectedRoles.includes(role.id)}
            />
            <label
              htmlFor={`role-${role.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {role.label}
            </label>
          </div>
        ))}
      </div>
      
      {selectedRoles.length === 0 && (
        <p className="text-sm text-destructive mt-2">
          {t("user-must-have-one-role")}
        </p>
      )}
    </div>
  );
};

export default RoleSelector;
