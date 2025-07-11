import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Users, 
  Shield, 
  Clock, 
  User, 
  BarChart3,
  Settings,
  UserCog,
  Sliders
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  path: string;
  badge?: number | string;
  roles?: string[];
  translationKey: string;
}

interface SidebarSection {
  title: string;
  translationKey: string;
  items: SidebarItem[];
}

const sidebarSections: SidebarSection[] = [
  {
    title: "Management",
    translationKey: "management",
    items: [
      { title: "Dashboard", translationKey: "dashboard", icon: BarChart3, path: "/dashboard", roles: ["analista", "operador", "compensador", "configurador"] },
      { title: "User Management", translationKey: "users", icon: Users, path: "/users", roles: ["operador", "compensador"] }
    ]
  },
  {
    title: "Security",
    translationKey: "security",
    items: [
      { title: "Anti-Fraud Rules", translationKey: "anti-fraud", icon: Shield, path: "/anti-fraud", roles: ["configurador"] },
      { title: "Audit Logs", translationKey: "audit-logs", icon: Clock, path: "/audit-logs", roles: ["configurador"] },
      { title: "Backoffice Operators", translationKey: "backoffice-operators", icon: User, path: "/backoffice-operators", roles: ["configurador"] }
    ]
  },
  {
    title: "Settings",
    translationKey: "settings",
    items: [
      { title: "Company Settings", translationKey: "company-settings", icon: Settings, path: "/company-settings", roles: ["configurador"] },
      { title: "User Field Settings", translationKey: "user-field-settings", icon: UserCog, path: "/user-field-settings", roles: ["configurador"] },
      { title: "Backoffice Settings", translationKey: "backoffice-settings", icon: Sliders, path: "/backoffice-settings", roles: ["configurador"] }
    ]
  }
];

interface SidebarContentProps {
  sidebarOpen: boolean;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ sidebarOpen }) => {
  const { user } = useAuth();
  const { settings } = useBackofficeSettings();
  const location = useLocation();

  const hasRequiredRoles = (item: SidebarItem) => {
    if (!item.roles || item.roles.length === 0) return true;
    return user?.roles.some(role => item.roles?.includes(role));
  };

  return (
    <div className="flex-1 py-4 overflow-y-auto">
      {sidebarSections.map((section, index) => {
        return (
          <div key={index} className="mb-6">
            {sidebarOpen && (
              <div className="px-4 mb-2">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {translate(section.translationKey, settings.language)}
                </h2>
              </div>
            )}
            <ul>
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Link 
                    to={item.path} 
                    className={cn(
                      "flex items-center h-10 px-4 text-sm rounded-md transition-colors duration-200",
                      location.pathname === item.path 
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-accent hover:text-accent-foreground",
                      !hasRequiredRoles(item) && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    <item.icon size={18} />
                    {sidebarOpen && (
                      <>
                        <span className="ml-3">{translate(item.translationKey, settings.language)}</span>
                        {item.badge && (
                          <Badge 
                            variant="outline" 
                            className="ml-auto bg-primary/10 text-primary text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default SidebarContent;
