
import React from "react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

interface TransactionsPaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  totalTransactions: number;
  pageSize: number;
}

const TransactionsPagination: React.FC<TransactionsPaginationProps> = ({
  page,
  totalPages,
  setPage,
  totalTransactions,
  pageSize,
}) => {
  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{Math.min((page - 1) * pageSize + 1, totalTransactions)}</span> to{" "}
        <span className="font-medium">{Math.min(page * pageSize, totalTransactions)}</span> of{" "}
        <span className="font-medium">{totalTransactions}</span> transactions
      </div>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className={page <= 1 ? "pointer-events-none opacity-50" : ""} 
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <PaginationItem key={i}>
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
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className={page >= totalPages ? "pointer-events-none opacity-50" : ""} 
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TransactionsPagination;
