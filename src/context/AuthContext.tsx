"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";


type User = {
  applicant_uuid: string;
  email: string;
  role?: string;
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  console.log(user,'ssssss');
  console.log(token,'kk');

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
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
