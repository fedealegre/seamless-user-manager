
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
      return userService.getUserData(userId).then(userData => {
        // Process any date fields here if needed
        return userData;
      });
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

  // Fetch company wallets
  const {
    data: companyWallets,
    isLoading: isLoadingCompanyWallets,
    error: companyWalletsError
  } = useQuery({
    queryKey: ['company-wallets'],
    queryFn: () => userService.getCompanyWallets(),
  });

  const error = userError || walletsError || companyWalletsError;

  return {
    user,
    wallets: wallets || [],
    companyWallets: companyWallets || [],
    isLoadingUser,
    isLoadingWallets,
    isLoadingCompanyWallets,
    error
  };
}
