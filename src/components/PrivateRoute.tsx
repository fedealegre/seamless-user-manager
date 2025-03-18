
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import BackofficeLayout from "./BackofficeLayout";

interface PrivateRouteProps {
  allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

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
      return (
        <BackofficeLayout>
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
            <div className="text-4xl font-bold text-destructive mb-2">Access Denied</div>
            <p className="text-lg text-muted-foreground mb-6">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-muted-foreground">
              Required roles: {allowedRoles.join(", ")}
            </p>
          </div>
        </BackofficeLayout>
      );
    }
  }

  return (
    <BackofficeLayout>
      <Outlet />
    </BackofficeLayout>
  );
};

export default PrivateRoute;
