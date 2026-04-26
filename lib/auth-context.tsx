import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { createApiClient, type ApiClient } from "./api-client";

interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  email_verified: boolean;
  role: string;
  created_at: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  apiClient: ApiClient;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; first_name: string; last_name: string }) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function normalizeUser(raw: any): AuthUser {
  return {
    id: raw.id,
    email: raw.email,
    first_name: raw.first_name,
    last_name: raw.last_name,
    is_active: raw.is_active ?? true,
    email_verified: raw.email_verified ?? raw.is_verified ?? false,
    role: raw.role ?? "user",
    created_at: raw.created_at ?? "",
  };
}

export function AuthProvider({ baseUrl, children }: { baseUrl: string; children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const apiClient = createApiClient({
    baseUrl,
    getAccessToken: () => null, // React Native: use secure storage in production
    setAccessToken: () => {},
    getRefreshToken: () => null,
    setRefreshToken: () => {},
    onAuthFailure: () => setUser(null),
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiClient.auth.login({ email, password });
    const me = await apiClient.auth.me();
    setUser(normalizeUser(me));
  }, [apiClient]);

  const register = useCallback(async (data: { email: string; password: string; first_name: string; last_name: string }) => {
    await apiClient.auth.register(data);
  }, [apiClient]);

  const logout = useCallback(async () => {
    setUser(null);
  }, []);

  const verifyEmail = useCallback(async (token: string) => {
    await apiClient.auth.verifyEmail(token);
  }, [apiClient]);

  const forgotPassword = useCallback(async (email: string) => {
    await apiClient.auth.forgotPassword(email);
  }, [apiClient]);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    await apiClient.auth.resetPassword(token, newPassword);
  }, [apiClient]);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, apiClient, login, register, logout, verifyEmail, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
