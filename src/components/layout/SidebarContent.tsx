
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Users, 
  Wallet, 
  FileText, 
  Shield, 
  Clock, 
  User, 
  BarChart3,
  Settings
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  path: string;
  badge?: number | string;
  roles?: string[];
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

const sidebarSections: SidebarSection[] = [
  {
    title: "Management",
    items: [
      { title: "Dashboard", icon: BarChart3, path: "/dashboard" },
      { title: "User Management", icon: Users, path: "/users", badge: 3 },
      { title: "Wallets", icon: Wallet, path: "/wallets" },
      { title: "Transactions", icon: FileText, path: "/transactions" }
    ]
  },
  {
    title: "Security",
    items: [
      { title: "Anti-Fraud Rules", icon: Shield, path: "/anti-fraud" },
      { title: "Audit Logs", icon: Clock, path: "/audit-logs" },
      { title: "Backoffice Operators", icon: User, path: "/backoffice-operators" }
    ]
  },
  {
    title: "Settings",
    items: [
      { title: "Company Settings", icon: Settings, path: "/company-settings", roles: ["admin"] }
    ]
  }
];

interface SidebarContentProps {
  sidebarOpen: boolean;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ sidebarOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  const hasRequiredRoles = (item: SidebarItem) => {
    if (!item.roles || item.roles.length === 0) return true;
    return user?.roles.some(role => item.roles?.includes(role));
  };

  return (
    <div className="flex-1 py-4 overflow-y-auto">
      {sidebarSections.map((section, index) => {
        const visibleItems = section.items.filter(hasRequiredRoles);
        
        if (visibleItems.length === 0) return null;
        
        return (
          <div key={index} className="mb-6">
            {sidebarOpen && (
              <div className="px-4 mb-2">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h2>
              </div>
            )}
            <ul>
              {visibleItems.map((item, itemIndex) => (
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
                        <span className="ml-3">{item.title}</span>
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
