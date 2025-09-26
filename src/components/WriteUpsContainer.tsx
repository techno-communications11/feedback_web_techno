import React from "react";
import DisciplinaryForm from "../components/DisciplinaryForm/DisciplinaryForm";
import DisciplinaryData from "../components/DisciplinaryForm/DisciplinaryData"; // ✅ Fixed path
import { useAuth } from "@/context/AuthContext";
import { FaFileAlt } from "react-icons/fa"; // Import icon from react-icons
import { SelectedUserProps } from "@/constants/writeup.constants";
import Spinners from "./Spinners";

function WriteUpsContainer({ selectedUser }: SelectedUserProps) {
  const { user } = useAuth();

  // Guard: if no user or no selectedUser, render nothing or a fallback
  if (!user || !selectedUser) {
    return <Spinners text="loading..." />;
  }

  const isAdmin = user.role === "admin";
  const isMarketManager = user.role === "market_manager";

  if (isAdmin) {
    // Admin sees ONLY DisciplinaryData in full width
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <DisciplinaryData selectedUser={selectedUser} />
          </div>
        </div>
      </div>
    );
  }

  if (isMarketManager) {
    // Market Manager sees split view
    return (
      <div className="container-fluid">
        <div className="row">
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#007bff", // Primary color (replace with your theme's primary color)
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              padding: "8px 0",
            }}
          >
            <FaFileAlt
              style={{ fontSize: "20px", color: "#007bff" }}
              aria-hidden="true"
            />
            New Write Up
          </h1>

          <div className="col-md-9">
            <DisciplinaryForm
              selectedUser={selectedUser}
              letterheadImgSrc="/Technoletterhead.jpg"
              companyName="Techno communications LLC"
            />
          </div>
          <div className="col-md-3">
            <DisciplinaryData selectedUser={selectedUser} />
          </div>
        </div>
      </div>
    );
  }

  // Optional: handle other roles (e.g., hide or show error)
  return (
    <div className="text-center p-4 text-muted">
      You do not have permission to view this content.
    </div>
  );
}

export default WriteUpsContainer;
