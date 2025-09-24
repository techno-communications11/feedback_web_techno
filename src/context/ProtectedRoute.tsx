"use client";
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
   console.log(user,'user in protected route')

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
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
        <div className="spinner-border"></div>
      </div>
    );

  return <>{children}</>;
}
