
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
import Analytics from "./pages/Analytics";
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

// Report Pages
import TransactionTypes from "./pages/reports/TransactionTypes";
import TransactionDetails from "./pages/reports/TransactionDetails";
import WalletBalances from "./pages/reports/WalletBalances";

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
                  
                  {/* Private Routes */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/users/:userId" element={<UserDetailPage />} />
                    <Route path="/wallets" element={<WalletManagement />} />
                    <Route path="/transactions" element={<TransactionManagement />} />
                    <Route path="/backoffice-settings" element={<BackofficeSettings />} />
                    
                    {/* Report Routes */}
                    <Route path="/reports/transaction-types" element={<TransactionTypes />} />
                    <Route path="/reports/transaction-details" element={<TransactionDetails />} />
                    <Route path="/reports/wallet-balances" element={<WalletBalances />} />
                  </Route>
                  
                  {/* Admin-only Routes */}
                  <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                    <Route path="/anti-fraud" element={<AntiFraudRules />} />
                    <Route path="/audit-logs" element={<AuditLogs />} />
                    <Route path="/backoffice-operators" element={<BackofficeOperators />} />
                    <Route path="/company-settings" element={<CompanySettings />} />
                    <Route path="/user-field-settings" element={<UserFieldSettings />} />
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
