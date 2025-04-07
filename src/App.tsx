
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
                  
                  {/* Redirect from root to dashboard */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  
                  {/* Private Routes with a shared layout */}
                  <Route element={<PrivateRoute />}>
                    {/* Dashboard - Available to all authenticated users */}
                    <Route path="/dashboard" element={
                      <PrivateRoute allowedRoles={["analista", "operador", "compensador", "configurador"]} noLayout={true}>
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
