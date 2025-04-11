
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CompanySettingsProvider } from "@/contexts/CompanySettingsContext";
import { BackofficeSettingsProvider } from "@/contexts/BackofficeSettingsContext";
import PrivateRoute from "@/components/PrivateRoute";
import { TransactionGeneratorProvider } from "@/contexts/TransactionGeneratorContext";
import { useAuth } from "@/contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import UserDetailPage from "./pages/UserDetailPage";
import TransactionManagement from "./pages/TransactionManagement";
import WalletManagement from "./pages/WalletManagement";
import AntiFraudRules from "./pages/AntiFraudRules";
import AuditLogs from "./pages/AuditLogs";
import BackofficeOperators from "./pages/BackofficeOperators";
import CompanySettings from "./pages/CompanySettings";
import UserFieldSettings from "./pages/UserFieldSettings";
import BackofficeSettings from "./pages/BackofficeSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Helper function to determine the default landing page based on user roles
export const getDefaultLandingPage = (roles: string[]): string => {
  if (roles.includes("analista")) {
    return "/dashboard";
  } else if (roles.includes("operador") || roles.includes("compensador")) {
    return "/users";
  } else if (roles.includes("configurador")) {
    return "/anti-fraud";
  }
  // Fallback - should never happen if roles are properly assigned
  return "/login";
};

// Root redirect component that uses the helper function
const RootRedirect = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const defaultPage = getDefaultLandingPage(user.roles);
  return <Navigate to={defaultPage} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CompanySettingsProvider>
        <BackofficeSettingsProvider>
          <TransactionGeneratorProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  
                  {/* Redirect from root to appropriate page based on user role */}
                  <Route path="/" element={<RootRedirect />} />
                  
                  {/* Private Routes with a shared layout */}
                  <Route element={<PrivateRoute />}>
                    {/* Dashboard - Only available to analista role */}
                    <Route path="/dashboard" element={
                      <PrivateRoute allowedRoles={["analista"]} noLayout={true}>
                        <Dashboard />
                      </PrivateRoute>
                    } />
                    
                    {/* User Management Routes - Only available to operador, compensador */}
                    <Route path="/users" element={
                      <PrivateRoute allowedRoles={["operador", "compensador"]} noLayout={true}>
                        <UserManagement />
                      </PrivateRoute>
                    } />
                    <Route path="/users/:userId" element={
                      <PrivateRoute allowedRoles={["operador", "compensador"]} noLayout={true}>
                        <UserDetailPage />
                      </PrivateRoute>
                    } />
                    
                    {/* Wallet Management - Only available to operador, compensador */}
                    <Route path="/wallets" element={
                      <PrivateRoute allowedRoles={["operador", "compensador"]} noLayout={true}>
                        <WalletManagement />
                      </PrivateRoute>
                    } />
                    
                    {/* Transaction Management - Only available to operador, compensador */}
                    <Route path="/transactions" element={
                      <PrivateRoute allowedRoles={["operador", "compensador"]} noLayout={true}>
                        <TransactionManagement />
                      </PrivateRoute>
                    } />
                    
                    {/* Security Routes - Only available to configurador */}
                    <Route path="/anti-fraud" element={
                      <PrivateRoute allowedRoles={["configurador"]} noLayout={true}>
                        <AntiFraudRules />
                      </PrivateRoute>
                    } />
                    <Route path="/audit-logs" element={
                      <PrivateRoute allowedRoles={["configurador"]} noLayout={true}>
                        <AuditLogs />
                      </PrivateRoute>
                    } />
                    <Route path="/backoffice-operators" element={
                      <PrivateRoute allowedRoles={["configurador"]} noLayout={true}>
                        <BackofficeOperators />
                      </PrivateRoute>
                    } />
                    
                    {/* Settings Routes - Only available to configurador */}
                    <Route path="/company-settings" element={
                      <PrivateRoute allowedRoles={["configurador"]} noLayout={true}>
                        <CompanySettings />
                      </PrivateRoute>
                    } />
                    <Route path="/user-field-settings" element={
                      <PrivateRoute allowedRoles={["configurador"]} noLayout={true}>
                        <UserFieldSettings />
                      </PrivateRoute>
                    } />
                    <Route path="/backoffice-settings" element={
                      <PrivateRoute allowedRoles={["configurador"]} noLayout={true}>
                        <BackofficeSettings />
                      </PrivateRoute>
                    } />
                  </Route>
                  
                  {/* Catch-all Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </TransactionGeneratorProvider>
        </BackofficeSettingsProvider>
      </CompanySettingsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
