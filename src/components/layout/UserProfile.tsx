import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, KeyRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import ChangePasswordDialog from "@/components/profile/ChangePasswordDialog";

interface UserProfileProps {
  type: "sidebar" | "header";
  sidebarOpen?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ type, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigateToProfile = () => {
    navigate("/my-profile");
  };

  const handleChangePassword = () => {
    setIsPasswordDialogOpen(true);
  };

  if (!user) return null;

  if (type === "sidebar") {
    return sidebarOpen ? (
      <div className="flex items-center">
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user.name.charAt(0)}{user.surname.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <p className="text-sm font-medium">{user.name} {user.surname}</p>
          <p className="text-xs text-muted-foreground">{user.roles.join(", ")}</p>
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
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.name.charAt(0)}{user.surname.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-background">
          <DropdownMenuLabel>{user.name} {user.surname}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleNavigateToProfile}>
            <User size={16} className="mr-2" /> {t('profile')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleChangePassword}>
            <KeyRound size={16} className="mr-2" /> {t('change-password')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut size={16} className="mr-2" /> {t('log-out')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <ChangePasswordDialog 
        isOpen={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
      />
    </>
  );
};

export default UserProfile;
