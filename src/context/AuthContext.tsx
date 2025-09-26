"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type User = {
  applicant_uuid: string;
  email: string;
  role?: string;
  market_id?: number;
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  triggerDocsRefresh: () => void; // NEW
  docsRefreshKey: number;
  commentsRefreshKey: number; // new
  triggerCommentsRefresh: () => void; // new
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [docsRefreshKey, setDocsRefreshKey] = useState(0);
  const triggerDocsRefresh = () => setDocsRefreshKey((prev) => prev + 1);
  const [commentsRefreshKey, setCommentsRefreshKey] = useState(0);

  const triggerCommentsRefresh = () => {
    setCommentsRefreshKey((prev) => prev + 1);
  };

  // 🔥 Try refresh on mount
  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await fetch("/api/refresh");
        if (res.ok) {
          const data = await res.json();
          setToken(data.token);

          // decode user from token
          const decoded: any = jwtDecode(data.token);
          setUser({
            applicant_uuid: decoded.applicant_uuid,
            email: decoded.email,
            role: decoded.role,
            market_id: decoded.market_id,
          });
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    refresh();
  }, []);

  const login = (token: string, user: User) => {
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout,
        triggerDocsRefresh,
        docsRefreshKey,
        commentsRefreshKey,
        triggerCommentsRefresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
