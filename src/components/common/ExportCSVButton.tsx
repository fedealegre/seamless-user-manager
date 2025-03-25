
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { CSVExportService, CSVExportOptions } from '@/lib/csv/csv-export-service';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { ButtonProps } from '@/components/ui/button';

interface ExportCSVButtonProps extends Omit<ButtonProps, 'onClick'> {
  filename?: string;
  headers: string[];
  data: any[];
  mapRow?: (row: any, index: number) => any[];
  onExportComplete?: () => void;
}

const ExportCSVButton: React.FC<ExportCSVButtonProps> = ({
  filename = `export-${format(new Date(), 'yyyy-MM-dd')}`,
  headers,
  data,
  mapRow,
  onExportComplete,
  children,
  ...buttonProps
}) => {
  const handleExport = () => {
    if (!data || data.length === 0) {
      toast({
        title: 'No data to export',
        description: 'There is no data to export.',
        variant: 'destructive',
      });
      return;
    }

    // Export the data
    const exportOptions: CSVExportOptions = {
      filename,
      headers,
      rows: data,
    };

    if (mapRow) {
      exportOptions.mapRow = mapRow;
    }

    CSVExportService.export(exportOptions);

    // Show success notification
    toast({
      title: 'Export Successful',
      description: 'The data has been exported to CSV successfully.',
    });

    // Call the onExportComplete callback if provided
    if (onExportComplete) {
      onExportComplete();
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      {...buttonProps}
    >
      {children || (
        <>
          <Download size={16} className="mr-2" />
          Export CSV
        </>
      )}
    </Button>
  );
};

export default ExportCSVButton;
