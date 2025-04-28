
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import BackofficeLayout from "./BackofficeLayout";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface PrivateRouteProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
  noLayout?: boolean; // Added this prop to control layout rendering
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles, children, noLayout = false }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  // Show loading state while authentication status is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If there are role restrictions, check if the user has the required role
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = user?.roles.some(role => allowedRoles.includes(role));
    
    if (!hasRequiredRole) {
      // For access denied, only show the message without layout if parent is already showing layout
      return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
          <div className="text-4xl font-bold text-destructive mb-2">{t('access-denied')}</div>
          <p className="text-lg text-muted-foreground mb-6">
            {t('no-permission')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('required-roles')}: {allowedRoles.join(", ")}
          </p>
        </div>
      );
    }
  }

  // If children are provided, render them directly; otherwise, render the Outlet
  const content = children ? <>{children}</> : <Outlet />;

  // Only wrap with BackofficeLayout if noLayout is false
  if (noLayout) {
    return content;
  }

  return (
    <BackofficeLayout>
      {content}
    </BackofficeLayout>
  );
};

export default PrivateRoute;
