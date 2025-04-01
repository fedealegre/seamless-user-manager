
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { CSVExportService } from '@/lib/csv/csv-export-service';
import { Transaction } from '@/lib/api/types';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { formatCurrency } from './transaction-utils';

interface ExportTransactionsButtonProps {
  transactions: Transaction[];
  className?: string;
}

const ExportTransactionsButton: React.FC<ExportTransactionsButtonProps> = ({
  transactions,
  className,
}) => {
  const handleExport = () => {
    if (!transactions || transactions.length === 0) {
      toast({
        title: 'No data to export',
        description: 'There are no transactions to export.',
        variant: 'destructive',
      });
      return;
    }

    // Generate a filename with the current date
    const filename = `transactions-${format(new Date(), 'yyyy-MM-dd')}`;

    // Define CSV headers
    const headers = ['Transaction ID', 'Reference', 'Date', 'Type', 'Amount', 'Currency', 'Status'];

    // Export the transactions
    CSVExportService.export({
      filename,
      headers,
      rows: transactions,
      mapRow: (transaction: Transaction) => {
        return [
          transaction.transactionId || transaction.id,
          transaction.reference || '',
          transaction.date ? new Date(transaction.date).toLocaleDateString() : '',
          transaction.type || transaction.transactionType || transaction.movementType || '',
          transaction.amount,
          transaction.currency,
          transaction.status,
        ];
      },
    });

    // Show success notification
    toast({
      title: 'Export Successful',
      description: 'The transactions have been exported to CSV successfully.',
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

export default ExportTransactionsButton;
