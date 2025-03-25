
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { CSVExportService } from '@/lib/csv/csv-export-service';
import { User } from '@/lib/api/types';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

interface ExportUsersButtonProps {
  users: User[];
  className?: string;
}

const ExportUsersButton: React.FC<ExportUsersButtonProps> = ({
  users,
  className,
}) => {
  const handleExport = () => {
    if (!users || users.length === 0) {
      toast({
        title: 'No data to export',
        description: 'There are no users to export.',
        variant: 'destructive',
      });
      return;
    }

    // Generate a filename with the current date
    const filename = `users-${format(new Date(), 'yyyy-MM-dd')}`;

    // Define CSV headers
    const headers = ['ID', 'Name', 'Surname', 'Username', 'Email', 'Phone Number', 'Status'];

    // Export the users
    CSVExportService.export({
      filename,
      headers,
      rows: users,
      mapRow: (user: User) => {
        return [
          user.id,
          user.name,
          user.surname,
          user.username,
          user.email || '',
          user.phoneNumber || '',
          user.status || (user.blocked ? 'BLOCKED' : 'ACTIVE'),
        ];
      },
    });

    // Show success notification
    toast({
      title: 'Export Successful',
      description: 'The users have been exported to CSV successfully.',
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      className={className}
    >
      <Download size={16} className="mr-2" />
      Export CSV
    </Button>
  );
};

export default ExportUsersButton;
