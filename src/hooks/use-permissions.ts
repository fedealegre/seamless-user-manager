
import { useAuth } from "@/contexts/AuthContext";

export function usePermissions() {
  const { user } = useAuth();

  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) || false;
  };

  const canAccessManagementPages = (): boolean => {
    return hasRole("operador") || hasRole("compensador");
  };
  
  const canAccessSecurityPages = (): boolean => {
    return hasRole("configurador");
  };
  
  const canAccessSettingsPages = (): boolean => {
    return hasRole("configurador");
  };

  const canChangeTransactionStatus = (): boolean => {
    return hasRole("compensador");
  };

  const canCancelTransaction = (): boolean => {
    return hasRole("compensador");
  };

  return {
    hasRole,
    canAccessManagementPages,
    canAccessSecurityPages,
    canAccessSettingsPages,
    canChangeTransactionStatus,
    canCancelTransaction
  };
}
