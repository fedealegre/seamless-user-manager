
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface RoleSelectorProps {
  selectedRoles: string[];
  onRoleToggle: (roleId: string, checked: boolean) => void;
  errorMessage: string | null;
}

const roleOptions = [
  { id: "admin", label: "Admin" },
  { id: "support", label: "Support" },
  { id: "finance", label: "Finance" },
];

const RoleSelector: React.FC<RoleSelectorProps> = ({ 
  selectedRoles, 
  onRoleToggle, 
  errorMessage 
}) => {
  return (
    <div className="py-4">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
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
          User must have at least one role
        </p>
      )}
    </div>
  );
};

export default RoleSelector;
