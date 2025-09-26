"use client";

import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import CurrentMonthComment from "./CurrentMonthComment";
import Commentsdata from "../app/admin/commentsdata/page";
import { Months } from "@/app/admin/admin.constants";
import { decodeId } from "@/lib/hashids";
import { useParams } from "next/navigation";
import { User } from "@/constants/writeup.constants";


interface EvaluationProps {
  selectedUser: User;
}

function Evaluation({ selectedUser }: EvaluationProps) {
  const params = useParams();

  const month = decodeId(params.month as string);
  const year = decodeId(params.year as string);
  const monthObj = Months.find((m) => m.id === month);
  const monthName = monthObj ? monthObj.Month : "Unknown";

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="row g-3">
      {/* Main Evaluation */}
      <div className="col-12 col-lg-8">
        <div className="bg-white p-3 p-md-4 rounded-3 shadow-sm h-100">
          <h2 className="fw-bold text-dark mb-1">Employee Evaluation</h2>
          <p className="text-muted mb-4">
            {monthName.toLowerCase()} • {year}
          </p>

          <div className="mt-4">
            <div className="d-flex flex-column flex-md-row align-items-md-center mb-4 bg-light p-3 rounded-2">
              <div className="d-flex align-items-center">
                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px" }}
                >
                  <FaUser />
                </div>
                <div className="ms-3">
                  <h5 className="mb-0 fw-bold text-capitalize">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </h5>
                  <small className="text-muted">Selected Employee</small>
                </div>
              </div>
            </div>

            <CurrentMonthComment
              ntid={selectedUser.ntid}
              month={Number(month)}
              year={Number(year)}
            />
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-4">
        <div className="d-flex align-items-center mb-3 d-lg-none">
          <button
            className="btn btn-outline-primary btn-sm w-100"
            onClick={() => setIsHistoryOpen((prev) => !prev)}
          >
            {isHistoryOpen ? "Hide" : "Show"} Full History
          </button>
        </div>
        <div
          className={`bg-white p-3 p-md-4 rounded-3 shadow-sm h-100 ${
            isHistoryOpen ? "d-block" : "d-none d-lg-block"
          }`}
        >
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
            <div className="list-group list-group-flush">
              <div className="list-group-item border-0 ps-0">
                <Commentsdata
                  ntid={selectedUser.ntid}
                  first_name={selectedUser.first_name}
                  last_name={selectedUser.last_name}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Evaluation;
