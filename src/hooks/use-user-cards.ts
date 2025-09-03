import { useQuery } from "@tanstack/react-query";
import { Card } from "@/lib/api-types";
import { userService } from "@/lib/api/user-service";

export function useUserCards(userId: string | undefined) {
  const {
    data: cards,
    isLoading,
    error
  } = useQuery({
    queryKey: ['user-cards', userId],
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return userService.getUserCards(userId);
    },
    enabled: !!userId,
  });

  return {
    cards: cards || [],
    isLoadingCards: isLoading,
    error
  };
}