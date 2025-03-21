
import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import SidebarContent from "./SidebarContent";
import UserProfile from "./UserProfile";

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, toggleSidebar }) => {
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
        
        <SidebarContent sidebarOpen={sidebarOpen} />
        
        <div className="p-4 border-t border-border">
          <UserProfile type="sidebar" sidebarOpen={sidebarOpen} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
