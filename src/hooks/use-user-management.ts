import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/lib/api/types";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/lib/api/user-service";
import { useCompanySearchConfig } from "@/hooks/use-company-search-config";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface SearchHistoryItem {
  params: Record<string, string>;
  timestamp: number;
}

const SEARCH_PARAMS_STORAGE_KEY = 'userSearchParams';
const SEARCH_HISTORY_STORAGE_KEY = 'userSearchHistory';

export function useUserManagement() {
  const { searchConfig } = useCompanySearchConfig();
  const [searchParams, setSearchParams] = useState<Record<string, string>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showUnblockDialog, setShowUnblockDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const queryClient = useQueryClient();

  useEffect(() => {
    const savedHistory = localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        const validHistory = parsedHistory.map((item: any) => ({
          ...item,
          params: item.params || {}
        }));
        setSearchHistory(validHistory);
      } catch (e) {
        console.error("Error loading search history:", e);
        localStorage.removeItem(SEARCH_HISTORY_STORAGE_KEY);
      }
    }

    const savedParams = localStorage.getItem(SEARCH_PARAMS_STORAGE_KEY);
    if (savedParams) {
      try {
        const parsedParams = JSON.parse(savedParams);
        if (parsedParams && Object.keys(parsedParams).length > 0) {
          setSearchParams(parsedParams);
        }
      } catch (e) {
        console.error("Error loading search params:", e);
        localStorage.removeItem(SEARCH_PARAMS_STORAGE_KEY);
      }
    }
  }, []);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["users", searchParams],
    queryFn: () => userService.searchUsers(searchParams),
    enabled: Object.keys(searchParams).length > 0,
  });

  const saveSearchToHistory = (params: Record<string, string>) => {
    if (Object.keys(params).length === 0) return;
    
    const newItem: SearchHistoryItem = {
      params,
      timestamp: Date.now()
    };
    
    const isDuplicate = searchHistory.some(item => 
      JSON.stringify(item.params) === JSON.stringify(newItem.params)
    );
    
    if (!isDuplicate) {
      const updatedHistory = [newItem, ...searchHistory].slice(0, 10);
      setSearchHistory(updatedHistory);
      localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_STORAGE_KEY);
  };

  const handleSearch = (params: Record<string, string>) => {
    if (Object.keys(params).length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one search term",
        variant: "destructive",
      });
      return;
    }
    
    setSearchParams(params);
    localStorage.setItem(SEARCH_PARAMS_STORAGE_KEY, JSON.stringify(params));
    
    saveSearchToHistory(params);
    
    refetch();
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setIsSubmitting(true);
      await userService.deleteUser(selectedUser.id.toString());
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "User Deleted",
        description: `User ${selectedUser.name} ${selectedUser.surname} has been deleted successfully.`,
      });
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setShowDeleteDialog(false);
      setSelectedUser(null);
    }
  };

  const handleBlockUser = async (reason: string) => {
    if (!selectedUser) return;
    
    try {
      setIsSubmitting(true);
      await userService.blockUser(selectedUser.id.toString(), reason);
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: t("success"),
        description: t("user-blocked-success"),
      });
    } catch (error) {
      console.error("Failed to block user:", error);
      toast({
        title: t("error"),
        description: t("failed-block-user"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setShowBlockDialog(false);
      setSelectedUser(null);
    }
  };

  const handleUnblockUser = async () => {
    if (!selectedUser) return;
    
    try {
      setIsSubmitting(true);
      await userService.unblockUser(selectedUser.id.toString());
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "User Unblocked",
        description: `User ${selectedUser.name} ${selectedUser.surname} has been unblocked.`,
      });
    } catch (error) {
      console.error("Failed to unblock user:", error);
      toast({
        title: "Error",
        description: "Failed to unblock user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setShowUnblockDialog(false);
      setSelectedUser(null);
    }
  };

  const executeSearch = (params: Record<string, string>) => {
    if (!params || Object.keys(params).length === 0) return;
    
    setSearchParams(params);
    localStorage.setItem(SEARCH_PARAMS_STORAGE_KEY, JSON.stringify(params));
    
    refetch();
  };

  return {
    users,
    isLoading,
    isSubmitting,
    searchParams,
    setSearchParams,
    handleSearch,
    selectedUser,
    setSelectedUser,
    showDeleteDialog,
    setShowDeleteDialog,
    showBlockDialog,
    setShowBlockDialog,
    showUnblockDialog, 
    setShowUnblockDialog,
    handleDeleteUser,
    handleBlockUser,
    handleUnblockUser,
    searchHistory,
    clearSearchHistory,
    executeSearch,
    searchConfig
  };
}
