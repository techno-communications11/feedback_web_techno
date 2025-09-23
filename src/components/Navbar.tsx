"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { LiaPowerOffSolid } from "react-icons/lia";
import { TbLockPassword } from "react-icons/tb";
import { SiGoogleforms } from "react-icons/si";
import { FaCloudUploadAlt } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "../context/ProtectedRoute";
import { fetchEmployeeNotification } from "@/app/services/notificationService";
import NotificationList from "./NotificationList";

const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, loading, logout, token } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]); // full notifications

  if (loading || !token) return null;

  const role = user?.role;

  // ✅ Fetch notifications immediately on load
  useEffect(() => {
    const getNotifications = async () => {
      if (!user?.applicant_uuid) return;
      try {
        const data = await fetchEmployeeNotification(user.applicant_uuid);
        setNotifications(data || []);
        setNotificationCount(data?.length || 0);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    getNotifications();
  }, [user?.applicant_uuid]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleNotification = () => setIsNotificationOpen(!isNotificationOpen);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <ProtectedRoute>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm border-bottom fixed-top px-5 py-3">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" href="/">
          <Image src="/logo.webp" width={30} height={30} alt="Logo" className="me-2" />
          <span className="fw-bold">Techno Communications LLC</span>
        </Link>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">

            {/* Notification Bell */}
            <li className="nav-item dropdown me-4 position-relative">
              <button
                className="nav-link bg-transparent border-0 p-0"
                onClick={toggleNotification}
              >
                <IoNotificationsCircleOutline size={28} className="text-success" />
                {notificationCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.75rem" }}>
                    {notificationCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <ul className="dropdown-menu dropdown-menu-end show" style={{ transform: "translate(-130px, 40px)" }}>
                  <NotificationList
                    notifications={notifications} // pass the fetched data
                    setNotificationLength={setNotificationCount}
                    showFullList={true}
                  />
                </ul>
              )}
            </li>

            {/* User Dropdown */}
            <li className="nav-item dropdown me-2">
              <button className="nav-link dropdown-toggle bg-transparent border-0 p-0" onClick={toggleDropdown}>
                <FaUserCircle size={30} />
              </button>
              {isDropdownOpen && (
                <ul className="dropdown-menu dropdown-menu-end show" style={{ transform: "translate(-85px, 40px)" }}>
                  {role === "admin" && (
                    <>
                      <li>
                        <Link className="dropdown-item" href="/admin/dumpempdata">
                          <FaCloudUploadAlt className="text-primary me-2" /> Dump data
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" href="/admin/create-form">
                          <SiGoogleforms className="text-success me-2" /> Fill Form
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" href="/admin/register">
                          <CiUser className="text-warning me-2" /> Register
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" href="/admin/reset-password">
                          <TbLockPassword className="text-primary me-2" /> Reset password
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                    </>
                  )}
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <LiaPowerOffSolid className="me-2" /> Logout
                    </button>
                  </li>
                </ul>
              )}
            </li>

          </ul>
        </div>
      </nav>
    </ProtectedRoute>
  );
};

export default Navbar;
