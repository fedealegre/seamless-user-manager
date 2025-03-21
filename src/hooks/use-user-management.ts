
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/api/types";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/lib/api/user-service";

interface SearchHistoryItem {
  query: string;
  searchBy: "name" | "surname" | "identifier" | "phone" | "walletId";
  timestamp: number;
}

export function useUserManagement() {
  const [searchParams, setSearchParams] = useState({
    query: "",
    searchBy: "name" as "name" | "surname" | "identifier" | "phone" | "walletId",
  });
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
        setSearchHistory(JSON.parse(savedHistory));
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
      const params: any = {};
      
      if (searchParams.query) {
        if (searchParams.searchBy === "name") {
          params.name = searchParams.query;
        } else if (searchParams.searchBy === "surname") {
          params.surname = searchParams.query;
        } else if (searchParams.searchBy === "phone") {
          params.phoneNumber = searchParams.query;
        } else if (searchParams.searchBy === "walletId") {
          params.walletId = searchParams.query;
        } else {
          params.identifier = searchParams.query;
        }
      }
      
      return userService.searchUsers(params);
    },
    enabled: false, // Don't run on mount, only when explicitly triggered
  });

  const saveSearchToHistory = () => {
    if (searchParams.query.trim() === "") return;
    
    const newItem: SearchHistoryItem = {
      ...searchParams,
      timestamp: Date.now()
    };
    
    // Add to the front, limit to 10 items
    const updatedHistory = [
      newItem,
      ...searchHistory.filter(item => 
        !(item.query === newItem.query && item.searchBy === newItem.searchBy)
      )
    ].slice(0, 10);
    
    setSearchHistory(updatedHistory);
    localStorage.setItem('userSearchHistory', JSON.stringify(updatedHistory));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('userSearchHistory');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchParams.query.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }
    
    saveSearchToHistory();
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
    clearSearchHistory
  };
}
