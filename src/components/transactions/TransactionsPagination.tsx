
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBackofficeSettings } from '@/contexts/BackofficeSettingsContext';
import { translate } from '@/lib/translations';

interface TransactionsPaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  totalTransactions: number;
  pageSize: number;
}

const TransactionsPagination: React.FC<TransactionsPaginationProps> = ({
  page,
  setPage,
  totalPages,
  totalTransactions,
  pageSize,
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalTransactions);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
      <div className="text-sm text-muted-foreground">
        {t("showing")} <span className="font-medium">{startItem}</span> {t("to")}{" "}
        <span className="font-medium">{endItem}</span> {t("of")}{" "}
        <span className="font-medium">{totalTransactions}</span> {t("items")}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="ml-1">{t("previous")}</span>
        </Button>
        
        <div className="text-sm">
          {t("page")} <span className="font-medium">{page}</span> {t("of")}{" "}
          <span className="font-medium">{totalPages}</span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          <span className="mr-1">{t("next")}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TransactionsPagination;
