import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBackofficeSettings } from '@/contexts/BackofficeSettingsContext';
import { translate } from '@/lib/translations';
interface BenefitsPaginationProps {
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  totalPages: number;
  totalBenefits: number;
}
const BenefitsPagination: React.FC<BenefitsPaginationProps> = ({
  page,
  setPage,
  pageSize,
  setPageSize,
  totalPages,
  totalBenefits
}) => {
  const {
    settings
  } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalBenefits);
  const pageSizeOptions = [10, 25, 50, 100];
  return <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">
          {t("showing")} <span className="font-medium">{startItem}</span> {t("to")}{" "}
          <span className="font-medium">{endItem}</span> {t("of")}{" "}
          <span className="font-medium">{totalBenefits}</span> {t("items")}
        </div>
        
        
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
          <ChevronLeft className="h-4 w-4" />
          <span className="ml-1">{t("previous")}</span>
        </Button>
        
        <div className="text-sm">
          {t("page")} <span className="font-medium">{page}</span> {t("of")}{" "}
          <span className="font-medium">{totalPages}</span>
        </div>
        
        <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
          <span className="mr-1">{t("next")}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>;
};
export default BenefitsPagination;