
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart, 
  Users, 
  Wallet, 
  ArrowLeftRight, 
  LogOut, 
  Settings, 
  Shield, 
  ClipboardList, 
  UserCog, 
  Building, 
  FormInput, 
  LineChart,
  FileBarChart,
  FileSpreadsheet,
  FileCog
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, icon, label, isActive }) => {
  return (
    <Link to={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 font-normal hover:bg-background-hover",
          isActive && "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};

const SidebarContent = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  const currentPath = location.pathname;
  
  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };
  
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-col gap-1 p-4">
        <SidebarLink
          href="/dashboard"
          icon={<BarChart size={20} />}
          label={t("dashboard")}
          isActive={isActive("/dashboard")}
        />
        <SidebarLink
          href="/analytics"
          icon={<LineChart size={20} />}
          label={t("analytics")}
          isActive={isActive("/analytics")}
        />
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-1">
          <SidebarLink
            href="/users"
            icon={<Users size={20} />}
            label={t("users")}
            isActive={isActive("/users")}
          />
          <SidebarLink
            href="/wallets"
            icon={<Wallet size={20} />}
            label={t("wallets")}
            isActive={isActive("/wallets")}
          />
          <SidebarLink
            href="/transactions"
            icon={<ArrowLeftRight size={20} />}
            label={t("transactions")}
            isActive={isActive("/transactions")}
          />
        </div>
        
        <div className="my-4">
          <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">{t("reports")}</h3>
          <div className="flex flex-col gap-1">
            <SidebarLink
              href="/reports/transaction-types"
              icon={<FileBarChart size={20} />}
              label={t("transaction-types-report")}
              isActive={isActive("/reports/transaction-types")}
            />
            <SidebarLink
              href="/reports/transaction-details"
              icon={<FileSpreadsheet size={20} />}
              label={t("transaction-details-report")}
              isActive={isActive("/reports/transaction-details")}
            />
            <SidebarLink
              href="/reports/wallet-balances"
              icon={<FileCog size={20} />}
              label={t("wallet-balances-report")}
              isActive={isActive("/reports/wallet-balances")}
            />
          </div>
        </div>
        
        <div className="my-4">
          <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">{t("security")}</h3>
          <div className="flex flex-col gap-1">
            <SidebarLink
              href="/anti-fraud"
              icon={<Shield size={20} />}
              label={t("anti-fraud")}
              isActive={isActive("/anti-fraud")}
            />
            <SidebarLink
              href="/audit-logs"
              icon={<ClipboardList size={20} />}
              label={t("audit-logs")}
              isActive={isActive("/audit-logs")}
            />
          </div>
        </div>
        
        <div className="my-4">
          <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">{t("settings")}</h3>
          <div className="flex flex-col gap-1">
            <SidebarLink
              href="/backoffice-operators"
              icon={<UserCog size={20} />}
              label={t("backoffice-operators")}
              isActive={isActive("/backoffice-operators")}
            />
            <SidebarLink
              href="/company-settings"
              icon={<Building size={20} />}
              label={t("company-settings")}
              isActive={isActive("/company-settings")}
            />
            <SidebarLink
              href="/user-field-settings"
              icon={<FormInput size={20} />}
              label={t("user-field-settings")}
              isActive={isActive("/user-field-settings")}
            />
            <SidebarLink
              href="/backoffice-settings"
              icon={<Settings size={20} />}
              label={t("backoffice-settings")}
              isActive={isActive("/backoffice-settings")}
            />
          </div>
        </div>
      </ScrollArea>
      
      <div className="mt-auto p-4">
        <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
          <LogOut size={20} className="mr-2" />
          <span>{t("logout")}</span>
        </Button>
      </div>
    </div>
  );
};

export default SidebarContent;
