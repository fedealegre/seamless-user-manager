
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Wallet,
  BarChart3,
  ShieldAlert,
  FileText,
  UserCog,
  Building2,
  Settings,
  FormInput,
} from "lucide-react";

interface SidebarContentProps {
  sidebarOpen: boolean;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();

  const isAdmin = user?.role === "admin";
  
  const mainMenuItems = [
    { path: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { path: "/users", label: t("users"), icon: Users },
    { path: "/wallets", label: t("wallets"), icon: Wallet },
    { path: "/transactions", label: t("transactions"), icon: BarChart3 },
  ];
  
  const adminMenuItems = [
    { path: "/anti-fraud", label: t("antiFraud"), icon: ShieldAlert },
    { path: "/audit-logs", label: t("auditLogs"), icon: FileText },
    { path: "/backoffice-operators", label: t("backofficeOperators"), icon: UserCog },
    { path: "/company-settings", label: t("companySettings"), icon: Building2 },
    { path: "/user-field-settings", label: t("userFieldSettings"), icon: FormInput },
  ];

  const settingsMenuItems = [
    { path: "/backoffice-settings", label: t("backofficeSettings"), icon: Settings },
  ];
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="flex-1 overflow-y-auto py-4">
      <div className="px-3 py-2">
        <div className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
          {sidebarOpen ? "MAIN" : ""}
        </div>
        <nav className="space-y-1">
          {mainMenuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium",
                "transition-colors duration-200",
                location.pathname === item.path
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>
      
      {isAdmin && (
        <div className="px-3 py-2">
          <div className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
            {sidebarOpen ? "ADMIN" : ""}
          </div>
          <nav className="space-y-1">
            {adminMenuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium",
                  "transition-colors duration-200",
                  location.pathname === item.path
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="mr-2 h-5 w-5" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>
      )}

      <div className="px-3 py-2">
        <div className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
          {sidebarOpen ? t("settings").toUpperCase() : ""}
        </div>
        <nav className="space-y-1">
          {settingsMenuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium",
                "transition-colors duration-200",
                location.pathname === item.path
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SidebarContent;
