import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@/lib/api-types";
import { userService } from "@/lib/api/user-service";

export function useUserCardTransactions(cardId: string | undefined, userId: string) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<Record<string, any>>({});

  const {
    data: transactions,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user-card-transactions', cardId, userId, filters],
    queryFn: () => {
      if (!cardId) throw new Error('Card ID is required');
      return userService.getCardTransactions(cardId, userId);
    },
    enabled: !!cardId,
  });

  const filteredAndPaginatedTransactions = useMemo(() => {
    if (!transactions) return { data: [], totalPages: 0, totalCount: 0 };

    let filtered = [...transactions];

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(transaction => 
        transaction.transactionId?.toLowerCase().includes(searchTerm) ||
        transaction.additionalInfo?.merchant?.toLowerCase().includes(searchTerm) ||
        transaction.additionalInfo?.category?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(transaction => transaction.status === filters.status);
    }

    if (filters.movementType) {
      filtered = filtered.filter(transaction => transaction.movementType === filters.movementType);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date || '');
        return transactionDate >= new Date(filters.dateFrom);
      });
    }

    if (filters.dateTo) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date || '');
        return transactionDate <= new Date(filters.dateTo);
      });
    }

    // Calculate pagination
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const data = filtered.slice(startIndex, endIndex);

    return { data, totalPages, totalCount };
  }, [transactions, filters, currentPage, itemsPerPage]);

  return {
    transactions: filteredAndPaginatedTransactions.data,
    totalTransactions: filteredAndPaginatedTransactions.totalCount,
    totalPages: filteredAndPaginatedTransactions.totalPages,
    currentPage,
    itemsPerPage,
    isLoading,
    error,
    filters,
    setCurrentPage,
    setItemsPerPage,
    setFilters,
    refetch
  };
}