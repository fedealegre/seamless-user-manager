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

import { useAuth } from "@/contexts/AuthContext";

export function useUserManagement() {
  const { searchConfig } = useCompanySearchConfig();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useState<Record<string, string>>({});
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
        title: t("error"),
        description: t("enter-search-term"),
        variant: "destructive",
      });
      return;
    }
    
    setSearchParams(params);
    localStorage.setItem(SEARCH_PARAMS_STORAGE_KEY, JSON.stringify(params));
    
    saveSearchToHistory(params);
    
    refetch();
  };

  const handleBlockUser = async (reason: string) => {
    if (!selectedUser) return;
    
    try {
      setIsSubmitting(true);
      await userService.blockUser(selectedUser.id.toString(), reason);

      queryClient.setQueryData(["users", searchParams], (oldUsers: User[] | undefined) => {
        if (!oldUsers) return oldUsers;
        return oldUsers.map(user => 
          user.id === selectedUser.id
            ? { ...user, blocked: true, blockReason: reason, status: "BLOCKED" }
            : user
        );
      });

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
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }, 350);
    }
  };

  const handleUnblockUser = async () => {
    if (!selectedUser) return;
    
    try {
      setIsSubmitting(true);
      await userService.unblockUser(selectedUser.id.toString());

      queryClient.setQueryData(["users", searchParams], (oldUsers: User[] | undefined) => {
        if (!oldUsers) return oldUsers;
        return oldUsers.map(user => 
          user.id === selectedUser.id
            ? { ...user, blocked: false, blockReason: undefined, status: "ACTIVE" }
            : user
        );
      });

      toast({
        title: t("user-unblocked"),
        description: t("user-unblocked-success").replace("{name}", `${selectedUser.name} ${selectedUser.surname}`),
      });
    } catch (error) {
      console.error("Failed to unblock user:", error);
      toast({
        title: t("error"),
        description: t("failed-unblock-user"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setShowUnblockDialog(false);
      setSelectedUser(null);
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }, 350);
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
    showBlockDialog,
    setShowBlockDialog,
    showUnblockDialog, 
    setShowUnblockDialog,
    handleBlockUser,
    handleUnblockUser,
    searchHistory,
    clearSearchHistory,
    executeSearch,
    searchConfig
  };
}
