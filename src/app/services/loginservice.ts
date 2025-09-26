// services/authService.ts
import { Credentials,RegisterUser } from "../login/auth.types";

export const login = async (credentials: Credentials) => {
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...credentials }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Login failed");
  return res.json();
};

export const register = async (RegisterUser: RegisterUser) => {
  const {email,password,role,market}=RegisterUser;
  const payload={email,password,role,market};
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({  ...payload }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "registration failed");
  return res.json();
};

export const resetPassword = async (email: string, newPassword: string) => {
  const res = await fetch("/api/register", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: newPassword }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Password reset failed");
  return res.json();
};




