"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const roleRoutes: Record<string, string> = {
  employee: "/employee",
  admin: "/admin",
  market_manager: "/market_manager",
};

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const { token, user, loading } = useAuth();
  const router = useRouter();
   console.log(user,"rrr");

  useEffect(() => {
    if (!loading && token && user?.role) {
      router.replace(roleRoutes[user.role] || "/login");
    }
  }, [token, user, loading, router]);

  if (loading) return <p>Loading...</p>;

  return <>{!token && children}</>;
}
