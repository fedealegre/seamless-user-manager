
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";

interface BackofficeLayoutProps {
  children: React.ReactNode;
}

const BackofficeLayout: React.FC<BackofficeLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default BackofficeLayout;
