"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Evaluation from "@/components/Evaluation";
import ProtectedRoute from "@/context/ProtectedRoute";
import { BiArrowBack } from "react-icons/bi";
import { FcHighPriority } from "react-icons/fc";
import WriteUpsContainer from "@/components/WriteUpsContainer";


interface User {
  actionName: string;
  applicant_uuid: string;
  ntid: string;
  first_name: string;
  last_name: string;
}

function Page() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Helper component to display a "no selection" message
  const NoSelectionMessage = ({ text }: { text: string }) => (
    <div className="d-flex flex-column justify-content-center align-items-center text-center py-5">
      {/* Icon */}
      <FcHighPriority className="mb-3" style={{ fontSize: "3rem" }} />

      {/* Text */}
      <h5 className="fw-semibold text-muted mb-2">{text}</h5>
      <p className="text-muted mb-0">Please select an employee or action to continue</p>
    </div>
  );

  // Decide what to render in the main content area
  const renderContent = () => {
    if (!selectedUser) {
      return <NoSelectionMessage text="Select to  View" />;
    }

    switch (selectedUser.actionName) {
      case "Evaluation":
        return <Evaluation selectedUser={selectedUser} />;
      case "Writeup":
        return <WriteUpsContainer selectedUser={selectedUser} />;
      default:
        return <NoSelectionMessage text="Select an action for the employee" />;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "market_manager"]}>
      <div className="container-fluid py-4">
        <div className="row g-3 g-md-4">
          {/* Sidebar */}
          <div className="col-12 col-md-4 col-lg-3">
            <button
              className="btn btn-outline-secondary btn-sm mb-3 d-flex align-items-center"
              style={{ alignSelf: "flex-start" }}
              onClick={() => window.history.back()}
              aria-label="Back"
            >
              <BiArrowBack className="me-2" />
              Back
            </button>
            <div className="bg-white p-3 rounded-3 shadow-sm h-100 d-flex flex-column">
              <h5 className="fw-bold text-primary mb-4 border-bottom pb-2">
                <i className="bi bi-people me-2"></i> Team Members
              </h5>
              <div className="flex-grow-1 overflow-auto">
                <Sidebar onSelectUser={setSelectedUser} />
              </div>
            </div>
          </div>

          {/* Main Content (Evaluation / WriteUp / Messages) */}
          <div className="col-12 col-md-8 col-lg-9">{renderContent()}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default Page;
