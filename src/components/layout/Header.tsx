
import React from "react";
import { Link } from "react-router-dom";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserProfile from "./UserProfile";
import { useCompanySettings } from "@/contexts/CompanySettingsContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { settings } = useCompanySettings();
  
  return (
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
        <h1 className="text-xl font-semibold lg:hidden">{settings.backofficeTitle}</h1>
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
        
        <UserProfile type="header" />
      </div>
    </header>
  );
};

export default Header;
