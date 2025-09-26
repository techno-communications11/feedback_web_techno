"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { LiaPowerOffSolid } from "react-icons/lia";
import { TbLockPassword } from "react-icons/tb";
import { SiGoogleforms } from "react-icons/si";
import { FaCloudUploadAlt } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "../context/ProtectedRoute";
import CustomAlert from "./CustomAlert";
import { IoMdDownload } from "react-icons/io";

import Spinners from "./Spinners";

const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, loading, logout, token } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLLIElement>(null);

  if (error) {
    return (
      <CustomAlert message="error logout" onClose={() => {}} type="error" />
    );
  }

  const handleDownload = async (endpoint: string, filename: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(endpoint, { method: "GET" });

      if (!res.ok) {
        throw new Error("Failed to download");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      setError("Failed to download file");
    } finally {
      setIsLoading(false);
      setIsDropdownOpen(false);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) {
        logout();
        router.push("/login");
      } else {
        setError("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
      setError("An error occurred during logout");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !token) {
    return <Spinners text="loading..." />;
  }

  return (
    <ProtectedRoute>
      <nav
        className="navbar navbar-expand-lg navbar-light bg-light shadow-sm border-bottom fixed-top px-3 px-md-5 py-3"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          className="navbar-brand d-flex align-items-center"
          href="/"
          aria-label="Techno Communications LLC Home"
        >
          <Image
            src="/logo.webp"
            width={30}
            height={30}
            alt="Techno Communications LLC Logo"
            className="me-2"
            priority
          />
          <span className="fw-bold d-none d-sm-inline">
            Techno Communications LLC
          </span>
        </Link>

        {/* Navbar Toggle for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {/* Notification Bell */}
            {/* <li
              className="nav-item dropdown me-3 me-lg-4 position-relative"
              ref={notificationRef}
            >
              <button
                className="nav-link bg-transparent border-0 p-0 position-relative"
                onClick={toggleNotification}
                aria-label={`Notifications (${notificationCount} new)`}
                disabled={isLoading}
              >
                <IoNotificationsCircleOutline
                  size={28}
                  className="text-success"
                  aria-hidden="true"
                />
                {notificationCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {notificationCount}
                    <span className="visually-hidden">new notifications</span>
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div
                  className="dropdown-menu dropdown-menu-end show p-3"
                  style={{
                    minWidth: "280px",
                    maxWidth: "90vw",
                    right: "0",
                    left: "auto",
                    top: "100%",
                    marginTop: "10px",
                  }}
                >
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  {isLoading ? (
                    <Spinners text="loading..."/>
                  ) : (
                    <NotificationList
                      notifications={notifications}
                      setNotificationLength={setNotificationCount}
                      showFullList={true}
                    />
                  )}
                </div>
              )}
            </li> */}

            {/* User Dropdown */}
            <li className="nav-item dropdown me-2" ref={dropdownRef}>
              <button
                className="nav-link dropdown-toggle bg-transparent border-0 p-0"
                onClick={toggleDropdown}
                aria-label="User menu"
                aria-expanded={isDropdownOpen}
              >
                <FaUserCircle size={30} aria-hidden="true" />
              </button>
              {isDropdownOpen && (
                <ul
                  className="dropdown-menu dropdown-menu-end show"
                  style={{
                    minWidth: "200px",
                    maxWidth: "90vw",
                    right: "0",
                    left: "auto",
                    top: "100%",
                    marginTop: "10px",
                  }}
                >
                  {user?.role === "admin" && (
                    <>
                      <li>
                        <Link
                          className="dropdown-item"
                          href="/admin/dumpempdata"
                          aria-label="Dump employee data"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaCloudUploadAlt
                            className="text-primary me-2"
                            aria-hidden="true"
                          />{" "}
                          Dump data
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          href="/admin/create-form"
                          aria-label="Create form"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <SiGoogleforms
                            className="text-success me-2"
                            aria-hidden="true"
                          />{" "}
                          Fill Form
                        </Link>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            handleDownload(
                              "/api/download-evaluations",
                              "evaluation-data.xlsx"
                            )
                          }
                        >
                          <IoMdDownload
                            className="text-success me-2"
                            aria-hidden="true"
                          />
                          Evaluation Data
                        </button>
                      </li>

                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            handleDownload(
                              "/api/download-writeups",
                              "writeups-data.xlsx"
                            )
                          }
                        >
                          <IoMdDownload
                            className="text-danger me-2"
                            aria-hidden="true"
                          />
                          Writeups Data
                        </button>
                      </li>

                      <li>
                        <Link
                          className="dropdown-item"
                          href="/admin/register"
                          aria-label="Register new user"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <CiUser
                            className="text-warning me-2"
                            aria-hidden="true"
                          />{" "}
                          Register
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          href="/admin/reset-password"
                          aria-label="Reset password"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <TbLockPassword
                            className="text-primary me-2"
                            aria-hidden="true"
                          />{" "}
                          Reset password
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                    </>
                  )}
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                      disabled={isLoading}
                      aria-label="Logout"
                    >
                      <LiaPowerOffSolid className="me-2" aria-hidden="true" />{" "}
                      {isLoading ? "Logging out..." : "Logout"}
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
