"use client";
import Sidebar from "@/components/Sidebar";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { decodeId } from "@/lib/hashids";
import CurrentMonthComment from "@/components/CurrentMonthComment";
import { Months } from "@/app/admin/admin.constants";
import ProtectedRoute from "@/context/ProtectedRoute";
import { BiArrowBack } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import Commentsdata from "../../../../admin/commentsdata/page";

interface User {
  applicant_uuid: string;
  ntid: string;
  first_name: string;
  last_name: string;
}

function Page() {
  const params = useParams();
  const year = decodeId(params.year);
  const month = decodeId(params.month);
  const monthObj = Months.find((m) => m.id === month);
  const monthName = monthObj ? monthObj.Month : "Unknown";

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  console.log(selectedUser, "selectedUser");

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="row g-4">
        {/* Sidebar — Sticky on Desktop */}
        <div className="col-lg-3 col-md-4">
          <button
            className="btn btn-outline-secondary btn-sm mb-3 d-flex align-items-center"
            style={{ alignSelf: "flex-start" }}
            onClick={() => window.history.back()}
          >
            <BiArrowBack className="me-2" />
            Back to Month Selection
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

        {/* Main Content */}
        <div className="col-lg-6 col-md-8">
          <div className="bg-white p-4 rounded-3 shadow-sm h-100">
            <h2 className="fw-bold text-dark mb-1">Employee Evaluation</h2>
            <p className="text-muted mb-4">
              {monthName.toLowerCase()} • {year}
            </p>

            {selectedUser ? (
              <div className="mt-4">
                <div className="d-flex align-items-center mb-4 bg-light p-3 rounded-2">
                  <div className="flex-shrink-0">
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <FaUser />
                    </div>
                  </div>
                  <div className="ms-3">
                    <h5 className="mb-0 fw-bold">
                      {selectedUser.first_name} {selectedUser.last_name}
                    </h5>
                    <small className="text-muted">Selected Employee</small>
                  </div>
                </div>

                <div className="mt-3">
                  <CurrentMonthComment
                    first_name={selectedUser.first_name}
                    last_name={selectedUser.last_name}
                    month={month}
                    year={year}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-5">
                <div className="text-muted mb-3">
                  <FaUser size={48} />
                </div>
                <h5 className="fw-semibold">No User Selected</h5>
                <p className="text-muted mb-0">
                  Please select an employee from the sidebar to view their
                  evaluation.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Full History Panel — Sticky & Card Styled */}
        <div className="col-lg-3 d-none d-lg-block">
          <div className="bg-white p-4 rounded-3 shadow-sm h-100">
            <div className="sticky-top" style={{ top: "20px" }}>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                  <i className="bi bi-clock-history text-success fs-4"></i>
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">Full History</h4>
                  <small className="text-muted">
                    Performance across all months
                  </small>
                </div>
              </div>
              <hr className="my-4" />

              {/* Placeholder for future content */}
              <div className="list-group list-group-flush">
                <div className="list-group-item border-0 ps-0">
                  <Commentsdata applicant_uuid={selectedUser?.applicant_uuid} first_name={selectedUser?.first_name} last_name={selectedUser?.last_name} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default Page;
