
import React from "react";
import { User } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

interface UserDetailsTabProps {
  user?: User;
}

const UserDetailsTab: React.FC<UserDetailsTabProps> = ({ user }) => {
  if (!user) {
    return <div>No user data available</div>;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status?: string, blocked?: boolean) => {
    if (blocked) {
      return <Badge variant="destructive">Blocked</Badge>;
    }
    
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return <Badge className="bg-green-500">Active</Badge>;
      case "PENDING":
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Pending</Badge>;
      case "SUSPENDED":
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status || "Unknown"}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md border">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium w-1/3">Status</TableCell>
              <TableCell>{getStatusBadge(user.status, user.blocked)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Full Name</TableCell>
              <TableCell>{user.name} {user.surname}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Username</TableCell>
              <TableCell>{user.username}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">User ID</TableCell>
              <TableCell>{user.id}</TableCell>
            </TableRow>
            {user.publicId && (
              <TableRow>
                <TableCell className="font-medium">Public ID</TableCell>
                <TableCell>{user.publicId}</TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell className="font-medium">Company ID</TableCell>
              <TableCell>{user.companyId}</TableCell>
            </TableRow>
            {user.email && (
              <TableRow>
                <TableCell className="font-medium">Email</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            )}
            {user.phoneNumber && (
              <TableRow>
                <TableCell className="font-medium">Phone Number</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
              </TableRow>
            )}
            {user.birthDate && (
              <TableRow>
                <TableCell className="font-medium">Birth Date</TableCell>
                <TableCell>{formatDate(user.birthDate)}</TableCell>
              </TableRow>
            )}
            {user.nationality && (
              <TableRow>
                <TableCell className="font-medium">Nationality</TableCell>
                <TableCell>{user.nationality}</TableCell>
              </TableRow>
            )}
            {user.gender && (
              <TableRow>
                <TableCell className="font-medium">Gender</TableCell>
                <TableCell>
                  {user.gender === 'M' ? 'Male' : 
                   user.gender === 'F' ? 'Female' : 
                   user.gender}
                </TableCell>
              </TableRow>
            )}
            {user.governmentIdentification && (
              <TableRow>
                <TableCell className="font-medium">ID Document</TableCell>
                <TableCell>
                  {user.governmentIdentificationType}: {user.governmentIdentification}
                </TableCell>
              </TableRow>
            )}
            {user.governmentIdentification2 && (
              <TableRow>
                <TableCell className="font-medium">Secondary ID</TableCell>
                <TableCell>
                  {user.governmentIdentificationType2}: {user.governmentIdentification2}
                </TableCell>
              </TableRow>
            )}
            {user.language && (
              <TableRow>
                <TableCell className="font-medium">Language</TableCell>
                <TableCell>{user.language}</TableCell>
              </TableRow>
            )}
            {user.region && (
              <TableRow>
                <TableCell className="font-medium">Region</TableCell>
                <TableCell>{user.region}</TableCell>
              </TableRow>
            )}
            {user.timeZone && (
              <TableRow>
                <TableCell className="font-medium">Time Zone</TableCell>
                <TableCell>{user.timeZone}</TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell className="font-medium">Has PIN</TableCell>
              <TableCell>{user.hasPin ? "Yes" : "No"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserDetailsTab;
