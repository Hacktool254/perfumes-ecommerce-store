"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  image?: string;
  phone?: string;
  createdAt?: number;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { signIn, signOut } = useAuthActions();
  const { isLoading: isConvexLoading, isAuthenticated } = useConvexAuth();
  const viewer = useQuery(api.users.viewer);
  
  const [error, setError] = useState<string | null>(null);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const router = useRouter();

  // Map Convex user to our AuthUser type
  const user: AuthUser | null = viewer && viewer._id ? {
    id: viewer._id.toString(),
    email: viewer.email ?? "",
    name: viewer.name,
    firstName: viewer.firstName,
    lastName: viewer.lastName,
    role: viewer.role,
    image: viewer.image,
    phone: viewer.phone,
    createdAt: viewer._creationTime,
  } : null;

  const login = async (email: string, password: string) => {
    setError(null);
    setIsLocalLoading(true);
    try {
      await signIn("password", { flow: "signIn", email, password });
      // Don't navigate here — the AuthGuard will redirect to "/" once
      // the viewer query resolves and confirms the admin role.
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
      throw err;
    } finally {
      setIsLocalLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setError(null);
    setIsLocalLoading(true);
    try {
      await signIn("password", { flow: "signUp", email, password, name });
      // Don't navigate here — the AuthGuard will redirect to "/" once
      // the viewer query resolves and confirms the admin role.
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      throw err;
    } finally {
      setIsLocalLoading(false);
    }
  };

  const logout = async () => {
    await signOut();
    router.push("/login");
  };

  const clearError = () => setError(null);

  const isLoading = isConvexLoading || isLocalLoading || (isAuthenticated && viewer === undefined);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, error, clearError }}>
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
