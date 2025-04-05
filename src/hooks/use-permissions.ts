
import { useAuth } from "@/contexts/AuthContext";

export function usePermissions() {
  const { user } = useAuth();

  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) || false;
  };

  const canChangeTransactionStatus = (): boolean => {
    return hasRole("compensador");
  };

  const canCancelTransaction = (): boolean => {
    return hasRole("compensador");
  };

  return {
    hasRole,
    canChangeTransactionStatus,
    canCancelTransaction
  };
}
