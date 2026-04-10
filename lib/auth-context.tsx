"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "COMPLIANCE" | "LAWYER" | "RISK" | null;

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Basic persistence
    const savedRole = localStorage.getItem("acris_role") as UserRole;
    if (savedRole) setRoleState(savedRole);
    setIsLoading(false);
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole) {
      localStorage.setItem("acris_role", newRole);
    } else {
      localStorage.removeItem("acris_role");
    }
  };

  return (
    <AuthContext.Provider value={{ role, setRole, isLoading }}>
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
