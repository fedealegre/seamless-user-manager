
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import BackofficeLayout from "@/components/BackofficeLayout";
import PrivateRoute from "@/components/PrivateRoute";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import UserManagement from "@/pages/UserManagement";
import UserDetails from "@/pages/UserDetails";
import TransactionManagement from "@/pages/TransactionManagement";
import WalletManagement from "@/pages/WalletManagement";
import AuditLogs from "@/pages/AuditLogs";
import BackofficeUsers from "@/pages/BackofficeUsers";
import AntiFraudRules from "@/pages/AntiFraudRules";
import "./App.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes with PrivateRoute component */}
        <Route element={<PrivateRoute />}>
          <Route element={<BackofficeLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/users/:userId" element={<UserDetails />} />
            <Route path="/transactions" element={<TransactionManagement />} />
            <Route path="/wallets" element={<WalletManagement />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="/backoffice-users" element={<BackofficeUsers />} />
            <Route path="/antifraud-rules" element={<AntiFraudRules />} />
          </Route>
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
