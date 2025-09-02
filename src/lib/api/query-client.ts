
import { QueryClient } from "@tanstack/react-query";

// Single QueryClient instance to avoid cache conflicts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});
