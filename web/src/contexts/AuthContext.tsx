import React, { createContext, useContext, useState, useEffect } from "react";
import { User, authService } from "../services/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    role: "driver" | "passenger";
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = await authService.getCurrentUser();
          setUser(user);
        }
      } catch (err) {
        setError("Failed to load user data");
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const { user } = await authService.login({ email, password });
      setUser(user);
    } catch (err) {
      setError("Invalid email or password");
      throw err;
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    name: string;
    role: "driver" | "passenger";
  }) => {
    try {
      setError(null);
      const { user } = await authService.register(data);
      setUser(user);
    } catch (err) {
      setError("Registration failed");
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setError(null);
      if (!user) throw new Error("No user logged in");
      const updatedUser = await authService.updateProfile(user.id, data);
      setUser(updatedUser);
    } catch (err) {
      setError("Failed to update profile");
      throw err;
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      setError(null);
      if (!user) throw new Error("No user logged in");
      await authService.changePassword(user.id, currentPassword, newPassword);
    } catch (err) {
      setError("Failed to change password");
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
