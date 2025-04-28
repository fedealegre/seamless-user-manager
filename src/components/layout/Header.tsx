
import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserProfile from "./UserProfile";
import { useCompanySettings } from "@/contexts/CompanySettingsContext";

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
        {/* Notification bell removed here */}
        <UserProfile type="header" />
      </div>
    </header>
  );
};

export default Header;
