
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";
import { BackofficeUser, LoginRequest } from "@/lib/api-types";
import { useToast } from "@/hooks/use-toast";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface AuthContextType {
  user: BackofficeUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Backoffice user credentials for direct login
const BACKOFFICE_USERS = [
  {
    username: "fede.alegre",
    password: "backoffice",
    user: {
      id: "admin-1",
      name: "Federico",
      surname: "Alegre",
      email: "fede@example.com",
      roles: ["configurador", "compensador", "operador", "analista", "loyalty"],
      state: "active" as const,
      last_login: new Date().toISOString(),
      password: "backoffice"
    }
  },
  {
    username: "operador",
    password: "operador",
    user: {
      id: "operator-1",
      name: "Operator",
      surname: "User",
      email: "operator@example.com",
      roles: ["operador"],
      state: "active" as const,
      last_login: new Date().toISOString(),
      password: "operador"
    }
  },
  {
    username: "compensador",
    password: "compensador",
    user: {
      id: "compensator-1",
      name: "Compensator",
      surname: "User",
      email: "compensator@example.com",
      roles: ["compensador"],
      state: "active" as const,
      last_login: new Date().toISOString(),
      password: "compensador"
    }
  },
  {
    username: "analista",
    password: "analista",
    user: {
      id: "analyst-1",
      name: "Analyst",
      surname: "User",
      email: "analyst@example.com",
      roles: ["analista"],
      state: "active" as const,
      last_login: new Date().toISOString(),
      password: "analista"
    }
  },
  {
    username: "configurador",
    password: "configurador",
    user: {
      id: "configurator-1",
      name: "Configurator",
      surname: "User",
      email: "configurator@example.com",
      roles: ["configurador"],
      state: "active" as const,
      last_login: new Date().toISOString(),
      password: "configurador"
    }
  },
  {
    username: "loyalty",
    password: "loyalty",
    user: {
      id: "loyalty-1",
      name: "Loyalty",
      surname: "User",
      email: "loyalty@example.com",
      roles: ["loyalty"],
      state: "active" as const,
      last_login: new Date().toISOString(),
      password: "loyalty"
    }
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BackofficeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      
      // Check if credentials match one of our backoffice users
      const matchedUser = BACKOFFICE_USERS.find(
        u => u.username === credentials.userName && u.password === credentials.password
      );
      
      if (matchedUser) {
        // Store user and mock token
        setUser(matchedUser.user);
        localStorage.setItem("user", JSON.stringify(matchedUser.user));
        localStorage.setItem("token", "mock-token-" + Date.now());
        localStorage.setItem("refreshToken", "mock-refresh-token-" + Date.now());
        
        // Store token expiration (24 hours)
        const expiresAt = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem("expiresAt", expiresAt.toString());
        
        toast({
          title: t("login-successful"),
          description: t("welcome-back") + ", " + matchedUser.user.name + "!",
        });
        
        return;
      }
      
      // If not a backoffice user, proceed with regular API login
      const response = await api.login(credentials);
      
      // Store user and token
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.accessToken);
      
      // Also store refresh token
      localStorage.setItem("refreshToken", response.refreshToken);
      
      // Store token expiration time
      const expiresAt = Date.now() + (response.expiresIn * 1000);
      localStorage.setItem("expiresAt", expiresAt.toString());
      
      toast({
        title: t("login-successful"),
        description: t("welcome-back") + ", " + response.user.name + "!",
      });
    } catch (error) {
      console.error("Login failed:", error);
      let errorMessage = t("invalid-credentials");
      
      if (error instanceof Error) {
        // Extract specific error message if available
        if (error.message.includes("Unauthorized")) {
          errorMessage = t("invalid-username-password");
        } else if (error.message.includes("Network Error")) {
          errorMessage = t("network-error");
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: t("login-failed"),
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expiresAt");
    
    toast({
      title: t("logout-successful"),
      description: t("successfully-logged-out"),
    });
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!user) {
      throw new Error(t("no-user-logged-in"));
    }

    try {
      setIsLoading(true);
      
      // Check if credentials match the current user's password
      const matchedUser = BACKOFFICE_USERS.find(
        u => u.username === user.id && u.password === currentPassword
      );
      
      if (!matchedUser) {
        throw new Error(t("current-password-incorrect"));
      }
      
      // Update the stored password
      const userIndex = BACKOFFICE_USERS.findIndex(u => u.username === user.id);
      if (userIndex >= 0) {
        BACKOFFICE_USERS[userIndex].password = newPassword;
        BACKOFFICE_USERS[userIndex].user.password = newPassword;
        
        // Update local storage (only if needed)
        if (JSON.parse(localStorage.getItem("user") || "{}").id === user.id) {
          localStorage.setItem("user", JSON.stringify(BACKOFFICE_USERS[userIndex].user));
        }
      }
      
      return;
    } catch (error) {
      console.error("Password update failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUserPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
