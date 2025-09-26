"use client";
import Spinners from "@/components/Spinners";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { token, user, loading } = useAuth();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!token) {
        router.push("/login");
      } else if (allowedRoles && user && !allowedRoles.includes(user.role || "")) {
        router.push("/unauthorized");
      } else {
        setAllowed(true);
      }
    }
  }, [token, loading, user, router, allowedRoles]);

  if (loading || !allowed)
    return (
      <Spinners text="loading..."/>
    );

  return <>{children}</>;
}
