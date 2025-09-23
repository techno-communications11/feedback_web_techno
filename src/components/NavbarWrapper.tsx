"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth(); // track login state
  const showNavbar = pathname !== "/login" && !!user;

  return (
    <>
      {showNavbar && <Navbar />}
      <div style={showNavbar ? { paddingTop: "80px" } : undefined}>
        {children}
      </div>
    </>
  );
}
