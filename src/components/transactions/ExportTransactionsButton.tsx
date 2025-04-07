
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { CSVExportService } from '@/lib/csv/csv-export-service';
import { Transaction } from '@/lib/api/types';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { formatCurrency } from './transaction-utils';
import { useBackofficeSettings } from '@/contexts/BackofficeSettingsContext';
import { translate } from '@/lib/translations';

interface ExportTransactionsButtonProps {
  transactions: Transaction[];
  className?: string;
}

const ExportTransactionsButton: React.FC<ExportTransactionsButtonProps> = ({
  transactions,
  className,
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  const handleExport = () => {
    if (!transactions || transactions.length === 0) {
      toast({
        title: t('no-data-to-export'),
        description: t('no-transactions-to-export'),
        variant: 'destructive',
      });
      return;
    }

    // Generate a filename with the current date
    const filename = `transactions-${format(new Date(), 'yyyy-MM-dd')}`;

    // Define CSV headers
    const headers = [
      t('transaction-id'), 
      t('reference'), 
      t('date'), 
      t('type'), 
      t('amount'), 
      t('currency'), 
      t('status')
    ];

    // Export the transactions
    CSVExportService.export({
      filename,
      headers,
      rows: transactions,
      mapRow: (transaction: Transaction) => {
        return [
          transaction.transactionId || transaction.id.toString(),
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
      title: t('export-successful'),
      description: t('transactions-exported-successfully'),
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      className={className}
    >
      <Download size={16} className="mr-2" />
      {t('export-csv')}
    </Button>
  );
};

export default ExportTransactionsButton;
