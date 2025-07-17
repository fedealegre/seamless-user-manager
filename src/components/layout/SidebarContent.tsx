
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
  Sliders,
  Gift,
  Star,
  Tag,
  CreditCard
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { usePermissions } from "@/hooks/use-permissions";
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
  permissionCheck?: () => boolean;
}

interface SidebarSection {
  title: string;
  translationKey: string;
  items: SidebarItem[];
  permissionCheck?: () => boolean;
}

interface SidebarContentProps {
  sidebarOpen: boolean;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ sidebarOpen }) => {
  const { user } = useAuth();
  const { settings } = useBackofficeSettings();
  const location = useLocation();
  const {
    canAccessDashboard,
    canAccessManagementPages,
    canAccessSecurityPages,
    canAccessSettingsPages,
    canAccessLoyaltyPages
  } = usePermissions();

  const sidebarSections: SidebarSection[] = [
    {
      title: "Management",
      translationKey: "management",
      permissionCheck: () => canAccessDashboard() || canAccessManagementPages(),
      items: [
        { 
          title: "Dashboard", 
          translationKey: "dashboard", 
          icon: BarChart3, 
          path: "/dashboard", 
          permissionCheck: canAccessDashboard
        },
        { 
          title: "User Management", 
          translationKey: "users", 
          icon: Users, 
          path: "/users", 
          permissionCheck: canAccessManagementPages
        }
      ]
    },
    {
      title: "Loyalty",
      translationKey: "loyalty",
      permissionCheck: () => user?.roles.includes("loyalty") || false,
      items: [
        { 
          title: "Beneficios", 
          translationKey: "benefits", 
          icon: Gift, 
          path: "/beneficios", 
          permissionCheck: () => user?.roles.includes("loyalty") || false
        },
        { 
          title: "Categorías", 
          translationKey: "categories", 
          icon: Tag, 
          path: "/maestros/categorias", 
          permissionCheck: () => user?.roles.includes("loyalty") || false
        },
        { 
          title: "Rubros (MCC)", 
          translationKey: "mcc", 
          icon: CreditCard, 
          path: "/maestros/mcc", 
          permissionCheck: () => user?.roles.includes("loyalty") || false
        }
      ]
    },
    {
      title: "Security",
      translationKey: "security",
      permissionCheck: canAccessSecurityPages,
      items: [
        { 
          title: "Anti-Fraud Rules", 
          translationKey: "anti-fraud", 
          icon: Shield, 
          path: "/anti-fraud", 
          permissionCheck: canAccessSecurityPages
        },
        { 
          title: "Audit Logs", 
          translationKey: "audit-logs", 
          icon: Clock, 
          path: "/audit-logs", 
          permissionCheck: canAccessSecurityPages
        },
        { 
          title: "Backoffice Operators", 
          translationKey: "backoffice-operators", 
          icon: User, 
          path: "/backoffice-operators", 
          permissionCheck: canAccessSecurityPages
        }
      ]
    },
    {
      title: "Settings",
      translationKey: "settings",
      permissionCheck: canAccessSettingsPages,
      items: [
        { 
          title: "Company Settings", 
          translationKey: "company-settings", 
          icon: Settings, 
          path: "/company-settings", 
          permissionCheck: canAccessSettingsPages
        },
        { 
          title: "User Field Settings", 
          translationKey: "user-field-settings", 
          icon: UserCog, 
          path: "/user-field-settings", 
          permissionCheck: canAccessSettingsPages
        },
        { 
          title: "Backoffice Settings", 
          translationKey: "backoffice-settings", 
          icon: Sliders, 
          path: "/backoffice-settings", 
          permissionCheck: canAccessSettingsPages
        }
      ]
    }
  ];

  const hasRequiredPermission = (item: SidebarItem) => {
    if (item.permissionCheck) {
      return item.permissionCheck();
    }
    // Fallback to legacy role checking if no permission check is defined
    if (!item.roles || item.roles.length === 0) return true;
    return user?.roles.some(role => item.roles?.includes(role));
  };

  const sectionHasPermission = (section: SidebarSection) => {
    if (section.permissionCheck) {
      return section.permissionCheck();
    }
    // If no section permission check, check if any item in the section has permission
    return section.items.some(item => hasRequiredPermission(item));
  };

  // Filter sections and items based on permissions
  const filteredSections = sidebarSections
    .filter(section => sectionHasPermission(section))
    .map(section => ({
      ...section,
      items: section.items.filter(item => hasRequiredPermission(item))
    }))
    .filter(section => section.items.length > 0); // Remove sections with no visible items

  return (
    <div className="flex-1 py-4 overflow-y-auto">
      {filteredSections.map((section, index) => {
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
                        : "hover:bg-accent hover:text-accent-foreground"
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
