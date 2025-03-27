
import React, { useState } from "react";
import { User } from "@/lib/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditUserInfoForm } from "./EditUserInfoForm";
import { userService } from "@/lib/api/user-service";
import { useQueryClient } from "@tanstack/react-query";
import { formatFieldName, parseDate } from "@/lib/utils";

interface UserInfoTabProps {
  user: User;
}

export const UserInfoTab: React.FC<UserInfoTabProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  // Helper function to format dates
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Empty";
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
      return <Badge variant="destructive">Blocked</Badge>;
    } else if (user.deleted) {
      return <Badge variant="destructive">Deleted</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
    }
  };

  const renderAdditionalInfo = () => {
    if (!user.additionalInfo || Object.keys(user.additionalInfo).length === 0) {
      return <p className="text-muted-foreground">No additional information available</p>;
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

  if (isEditing) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit User Information</CardTitle>
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

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsEditing(true)}>
          Edit Information
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                <p>{formatDisplayValue(user.name)} {formatDisplayValue(user.surname)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Username</h3>
                <p>{formatDisplayValue(user.username)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <div>{renderStatus()}</div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p>{formatDisplayValue(user.email)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Phone Number</h3>
                <p>{formatDisplayValue(user.phoneNumber || user.cellPhone)}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Birth Date</h3>
                <p>{formatDate(user.birthDate)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Nationality</h3>
                <p>{formatDisplayValue(user.nationality)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Gender</h3>
                <p>{user.gender === 'M' ? 'Male' : user.gender === 'F' ? 'Female' : formatDisplayValue(user.gender)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Language</h3>
                <p>{formatDisplayValue(user.language)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Region</h3>
                <p>{formatDisplayValue(user.region)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Identification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">User ID</h3>
                <p>{formatDisplayValue(user.id)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Public ID</h3>
                <p>{formatDisplayValue(user.publicId)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Default Wallet</h3>
                <p>{formatDisplayValue(user.defaultWalletId)}</p>
              </div>
            </div>
            <div className="space-y-4">
              {user.governmentIdentificationType && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {formatDisplayValue(user.governmentIdentificationType)}
                  </h3>
                  <p>{formatDisplayValue(user.governmentIdentification)}</p>
                </div>
              )}
              {user.governmentIdentificationType2 && (
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

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          {renderAdditionalInfo()}
        </CardContent>
      </Card>
    </div>
  );
};
