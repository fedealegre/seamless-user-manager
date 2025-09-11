
import { useAuth } from "@/contexts/AuthContext";

export function usePermissions() {
  const { user } = useAuth();

  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) || false;
  };

  const canAccessDashboard = (): boolean => {
    return hasRole("analista");
  };

  const canAccessManagementPages = (): boolean => {
    return hasRole("operador") || hasRole("compensador") || hasRole("configurador");
  };
  
  const canAccessSecurityPages = (): boolean => {
    return hasRole("configurador");
  };
  
  const canAccessSettingsPages = (): boolean => {
    return hasRole("configurador");
  };

  const canAccessLoyaltyPages = (): boolean => {
    return hasRole("loyalty");
  };

  const canChangeTransactionStatus = (): boolean => {
    return hasRole("compensador") || hasRole("configurador");
  };

  const canCancelTransaction = (): boolean => {
    return hasRole("compensador");
  };

  const canEditUserFields = (): boolean => {
    return hasRole("compensador") || hasRole("configurador");
  };

  return {
    hasRole,
    canAccessDashboard,
    canAccessManagementPages,
    canAccessSecurityPages,
    canAccessSettingsPages,
    canAccessLoyaltyPages,
    canChangeTransactionStatus,
    canCancelTransaction,
    canEditUserFields
  };
}
