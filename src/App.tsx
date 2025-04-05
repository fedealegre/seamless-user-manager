
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
                  
                  {/* Routes for Analista, Operador, Compensador, Configurador */}
                  <Route element={<PrivateRoute allowedRoles={["analista", "operador", "compensador", "configurador"]} />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                  </Route>
                  
                  {/* Routes for Operador, Compensador, Configurador */}
                  <Route element={<PrivateRoute allowedRoles={["operador", "compensador", "configurador"]} />}>
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/users/:userId" element={<UserDetailPage />} />
                    <Route path="/wallets" element={<WalletManagement />} />
                    <Route path="/transactions" element={<TransactionManagement />} />
                  </Route>
                  
                  {/* Routes for Configurador only */}
                  <Route element={<PrivateRoute allowedRoles={["configurador"]} />}>
                    <Route path="/anti-fraud" element={<AntiFraudRules />} />
                    <Route path="/audit-logs" element={<AuditLogs />} />
                    <Route path="/backoffice-operators" element={<BackofficeOperators />} />
                    <Route path="/company-settings" element={<CompanySettings />} />
                    <Route path="/user-field-settings" element={<UserFieldSettings />} />
                    <Route path="/backoffice-settings" element={<BackofficeSettings />} />
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
