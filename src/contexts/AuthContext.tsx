
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";
import { BackofficeUser, LoginRequest } from "@/lib/api/types";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: BackofficeUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
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
      roles: ["configurador", "compensador", "operador", "analista"],
      state: "active",
      last_login: new Date().toISOString()
    }
  },
  {
    username: "operador",
    password: "operador",
    user: {
      id: "operator-1",
      name: "Operator",
      surname: "User",
      roles: ["operador"],
      state: "active",
      last_login: new Date().toISOString()
    }
  },
  {
    username: "compensador",
    password: "compensador",
    user: {
      id: "compensator-1",
      name: "Compensator",
      surname: "User",
      roles: ["compensador"],
      state: "active",
      last_login: new Date().toISOString()
    }
  },
  {
    username: "analista",
    password: "analista",
    user: {
      id: "analyst-1",
      name: "Analyst",
      surname: "User",
      roles: ["analista"],
      state: "active",
      last_login: new Date().toISOString()
    }
  },
  {
    username: "configurador",
    password: "configurador",
    user: {
      id: "configurator-1",
      name: "Configurator",
      surname: "User",
      roles: ["configurador"],
      state: "active",
      last_login: new Date().toISOString()
    }
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BackofficeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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
          title: "Login successful",
          description: `Welcome back, ${matchedUser.user.name}!`,
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
        title: "Login successful",
        description: `Welcome back, ${response.user.name}!`,
      });
    } catch (error) {
      console.error("Login failed:", error);
      let errorMessage = "Invalid credentials. Please try again.";
      
      if (error instanceof Error) {
        // Extract specific error message if available
        if (error.message.includes("Unauthorized")) {
          errorMessage = "Invalid username or password";
        } else if (error.message.includes("Network Error")) {
          errorMessage = "Network error. Please check your connection";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Login failed",
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
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
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
