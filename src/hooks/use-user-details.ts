
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/api";
import { User, Wallet } from "@/lib/api/types";

export function useUserDetails(userId: string | undefined) {
  // Fetch user info
  const { 
    data: user,
    isLoading: isLoadingUser,
    error: userError
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return apiService.getUserData(userId);
    },
    enabled: !!userId,
  });

  // Fetch user wallets
  const {
    data: wallets,
    isLoading: isLoadingWallets,
    error: walletsError
  } = useQuery({
    queryKey: ['user-wallets', userId],
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return apiService.getUserWallets(userId);
    },
    enabled: !!userId,
  });

  const error = userError || walletsError;

  return {
    user,
    wallets: wallets || [],
    isLoadingUser,
    isLoadingWallets,
    error
  };
}
