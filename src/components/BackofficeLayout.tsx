import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { 
  Users, 
  Wallet, 
  FileText, 
  Shield, 
  Clock, 
  User, 
  LogOut, 
  Menu, 
  X, 
  BarChart3,
  SlidersHorizontal,
  Bell
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

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

const BackofficeLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
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
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleSidebar} 
              className="lg:hidden"
            >
              <Menu size={18} />
            </Button>
            <h1 className="text-xl font-semibold lg:hidden">PayBackoffice</h1>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleSidebar} 
              className="hidden lg:flex"
            >
              <Menu size={18} />
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell size={18} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-border">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">New user registration</p>
                        <p className="text-xs text-muted-foreground">User John Smith has registered</p>
                        <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-b border-border">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-destructive flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Fraud alert</p>
                        <p className="text-xs text-muted-foreground">Multiple failed login attempts for user</p>
                        <p className="text-xs text-muted-foreground mt-1">15 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Large transaction processed</p>
                        <p className="text-xs text-muted-foreground">Transaction of $25,000 processed</p>
                        <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <Link to="/notifications" className="w-full">
                  <Button variant="ghost" size="sm" className="w-full justify-center">
                    View all notifications
                  </Button>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name.charAt(0)}{user?.surname.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User size={16} className="mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut size={16} className="mr-2" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BackofficeLayout;
