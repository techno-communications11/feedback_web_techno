"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Spinners from "@/components/Spinners";

const roleRoutes: Record<string, string> = {
  employee: "/employee",
  admin: "/admin",
  market_manager: "/market_manager",
};

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && token && user?.role) {
      router.replace(roleRoutes[user.role] || "/login");
    }
  }, [token, user, loading, router]);

  if (loading) return <Spinners text="loading..." />;

  return <>{!token && children}</>;
}
