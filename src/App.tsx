
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import PrivateRoute from "@/components/PrivateRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import UserDetailPage from "./pages/UserDetailPage";
import TransactionManagement from "./pages/TransactionManagement";
import WalletManagement from "./pages/WalletManagement";
import AntiFraudRules from "./pages/AntiFraudRules";
import AuditLogs from "./pages/AuditLogs";
import BackofficeUsers from "./pages/BackofficeUsers";
import CompanySettings from "./pages/CompanySettings";
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
              <Route path="/users" element={<UserManagement />} />
              <Route path="/users/:userId" element={<UserDetailPage />} />
              <Route path="/wallets" element={<WalletManagement />} />
              <Route path="/transactions" element={<TransactionManagement />} />
            </Route>
            
            {/* Admin-only Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/anti-fraud" element={<AntiFraudRules />} />
              <Route path="/audit-logs" element={<AuditLogs />} />
              <Route path="/backoffice-users" element={<BackofficeUsers />} />
              <Route path="/company-settings" element={<CompanySettings />} />
            </Route>
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
