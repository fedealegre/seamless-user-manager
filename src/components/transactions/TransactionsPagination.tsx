
import React from "react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface TransactionsPaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  totalTransactions: number;
  pageSize: number;
  itemName?: string;
}

const TransactionsPagination: React.FC<TransactionsPaginationProps> = ({
  page,
  totalPages,
  setPage,
  totalTransactions,
  pageSize,
  itemName = "transactions"
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  return (
    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-muted-foreground order-2 sm:order-1">
        {t("showing")} <span className="font-medium">{Math.min((page - 1) * pageSize + 1, totalTransactions)}</span> {t("to")}{" "}
        <span className="font-medium">{Math.min(page * pageSize, totalTransactions)}</span> {t("of")}{" "}
        <span className="font-medium">{totalTransactions}</span> {t(itemName)}
      </div>
      
      <Pagination className="order-1 sm:order-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setPage(Math.max(1, page - 1))}
              className={page <= 1 ? "pointer-events-none opacity-50" : ""} 
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <PaginationItem key={i} className="hidden sm:inline-block">
                <PaginationLink
                  onClick={() => setPage(pageNum)}
                  isActive={page === pageNum}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              className={page >= totalPages ? "pointer-events-none opacity-50" : ""} 
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TransactionsPagination;
