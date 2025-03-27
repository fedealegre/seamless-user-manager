
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/api/types";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/lib/api/user-service";
import { useCompanySearchConfig } from "@/hooks/use-company-search-config";

interface SearchHistoryItem {
  params: Record<string, string>;
  timestamp: number;
}

export function useUserManagement() {
  const { searchConfig } = useCompanySearchConfig();
  const [searchParams, setSearchParams] = useState<Record<string, string>>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showUnblockDialog, setShowUnblockDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  
  const { toast } = useToast();

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('userSearchHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        // Make sure each item has a valid params object
        const validHistory = parsedHistory.map((item: any) => ({
          ...item,
          params: item.params || {}
        }));
        setSearchHistory(validHistory);
      } catch (e) {
        console.error("Error loading search history:", e);
        localStorage.removeItem('userSearchHistory');
      }
    }
  }, []);

  // Query for users
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["users", searchParams],
    queryFn: () => {
      return userService.searchUsers(searchParams);
    },
    enabled: false, // Don't run on mount, only when explicitly triggered
  });

  const saveSearchToHistory = (params: Record<string, string>) => {
    // Don't save empty searches
    if (Object.keys(params).length === 0) return;
    
    const newItem: SearchHistoryItem = {
      params,
      timestamp: Date.now()
    };
    
    // Add to the front, limit to 10 items, avoid duplicates
    const isDuplicate = searchHistory.some(item => 
      JSON.stringify(item.params) === JSON.stringify(newItem.params)
    );
    
    if (!isDuplicate) {
      const updatedHistory = [newItem, ...searchHistory].slice(0, 10);
      setSearchHistory(updatedHistory);
      localStorage.setItem('userSearchHistory', JSON.stringify(updatedHistory));
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('userSearchHistory');
  };

  const handleSearch = (params: Record<string, string>) => {
    // Check if we have at least one non-empty search parameter
    if (Object.keys(params).length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one search term",
        variant: "destructive",
      });
      return;
    }
    
    setSearchParams(params);
    saveSearchToHistory(params);
    refetch();
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await userService.deleteUser(selectedUser.id.toString());
      toast({
        title: "User Deleted",
        description: `User ${selectedUser.name} ${selectedUser.surname} has been deleted successfully.`,
      });
      refetch();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setSelectedUser(null);
    }
  };

  const handleBlockUser = async () => {
    if (!selectedUser) return;
    
    try {
      await userService.blockUser(selectedUser.id.toString());
      toast({
        title: "User Blocked",
        description: `User ${selectedUser.name} ${selectedUser.surname} has been blocked.`,
      });
      refetch();
    } catch (error) {
      console.error("Failed to block user:", error);
      toast({
        title: "Error",
        description: "Failed to block user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowBlockDialog(false);
      setSelectedUser(null);
    }
  };

  const handleUnblockUser = async () => {
    if (!selectedUser) return;
    
    try {
      await userService.unblockUser(selectedUser.id.toString());
      toast({
        title: "User Unblocked",
        description: `User ${selectedUser.name} ${selectedUser.surname} has been unblocked.`,
      });
      refetch();
    } catch (error) {
      console.error("Failed to unblock user:", error);
      toast({
        title: "Error",
        description: "Failed to unblock user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowUnblockDialog(false);
      setSelectedUser(null);
    }
  };

  const executeSearch = (params: Record<string, string>) => {
    if (!params || Object.keys(params).length === 0) return;
    
    setSearchParams(params);
    refetch();
  };

  return {
    users,
    isLoading,
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
