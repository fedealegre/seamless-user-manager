
import { useQuery } from "@tanstack/react-query";
import { User, Wallet } from "@/lib/api/types";
import { userService } from "@/lib/api/user-service";

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
      return userService.getUserData(userId);
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
      return userService.getUserWallets(userId);
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
