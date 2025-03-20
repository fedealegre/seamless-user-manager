import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Users, 
  Wallet, 
  FileText, 
  Shield, 
  Clock, 
  User, 
  LogOut,
  BarChart3,
  SlidersHorizontal
} from "lucide-react";
import { X } from "@/components/layout/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  path: string;
  badge?: number | string;
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
      { title: "Anti-Fraud Rules", icon: Shield, path: "/antifraud-rules" },
      { title: "Audit Logs", icon: Clock, path: "/audit-logs" },
      { title: "Backoffice Users", icon: User, path: "/backoffice-users" }
    ]
  },
  {
    title: "Settings",
    items: [
      { title: "System Settings", icon: SlidersHorizontal, path: "/settings" }
    ]
  }
];

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sidebarOpen, 
  toggleSidebar, 
  handleLogout 
}) => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <aside 
      className={cn(
        "fixed lg:relative lg:block z-20 transition-all duration-300 ease-in-out",
        "h-full bg-sidebar border-r border-border",
        sidebarOpen ? "w-64" : "w-0 lg:w-16 overflow-hidden"
      )}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <div 
            className={cn(
              "flex items-center transition-opacity duration-200",
              !sidebarOpen && "lg:opacity-0"
            )}
          >
            <div className="w-8 h-8 mr-2 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold">PB</span>
            </div>
            <h1 className="text-xl font-semibold">PayBackoffice</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="lg:hidden"
          >
            <X size={18} />
          </Button>
        </div>
        
        <div className="flex-1 py-4 overflow-y-auto">
          {sidebarSections.map((section, index) => (
            <div key={index} className="mb-6">
              {sidebarOpen && (
                <div className="px-4 mb-2">
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.title}
                  </h2>
                </div>
              )}
              <ul>
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link 
                      to={item.path} 
                      className={cn(
                        "sidebar-menu-item group",
                        "mx-2 mb-1 transition-colors duration-200",
                        location.pathname === item.path 
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <item.icon size={18} />
                      {sidebarOpen && (
                        <>
                          <span>{item.title}</span>
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
          ))}
        </div>
        
        <div className="p-4 border-t border-border">
          {sidebarOpen ? (
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.name.charAt(0)}{user?.surname.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name} {user?.surname}</p>
                <p className="text-xs text-muted-foreground">{user?.roles.join(", ")}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-auto" 
                onClick={handleLogout}
              >
                <LogOut size={18} />
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-full" 
              onClick={handleLogout}
            >
              <LogOut size={18} />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
