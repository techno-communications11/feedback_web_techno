"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { BsCalendarCheck } from "react-icons/bs";
import "../../../styles/admin.css";
import { useParams } from "next/navigation";
import { colors, Months } from "../../admin.constants";
import { encodeId, decodeId } from "@/lib/hashids";
import ProtectedRoute from "@/context/ProtectedRoute";
import { BiArrowBack } from "react-icons/bi";
import { useAuth } from "@/context/AuthContext";

function Page() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const encodedyear = params?.year;


  const handleMonthClick = (monthName: string) => {
    if (!encodedyear) return;
    const monthNumber =
      Months.findIndex(
        (m) => m.Month.toLowerCase() === monthName.toLowerCase()
      ) + 1;
    const encodedMonth = encodeId(monthNumber);
    const baseroute =
      user?.role === "market_manager" ? "market_manager" : "admin";
    router.push(`/${baseroute}/monthly/${encodedyear}/${encodedMonth}`);
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "market_manager"]}>
      <div
        className="container py-1 d-flex flex-column justify-content-between"
        style={{ minHeight: "90vh" }}
      >
        {/* Back Button */}
        <button
          className="btn btn-outline-secondary btn-sm  d-flex align-items-center"
          style={{ alignSelf: "flex-start" }}
          onClick={() => window.history.back()}
        >
          <BiArrowBack className="me-2" />
          Back to Year Selection
        </button>

        {/* Header */}
        <div className="text-center mb-2 flex-shrink-0">
          <h1 className="display-5 fw-bold text-dark ">
            Select Evaluation Month of {decodeId(String(encodedyear))}
          </h1>
          <p className="lead text-muted">
            Choose a Month to view or submit employee evaluations
          </p>
        </div>

        {/* Month Cards Grid */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 flex-grow-1 align-items-center justify-content-center">
          {Months.map((item, index) => (
            <div key={index} className="col">
              <div
                className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden Month-card position-relative"
                style={{
                  background: colors[index % colors.length],
                  cursor: "pointer",
                  transition:
                    "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease",
                }}
                onClick={() => handleMonthClick(item.Month?.toLowerCase())}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleMonthClick(item.Month);
                  }
                }}
              >
                <div className="position-absolute top-0 start-0 w-100 h-90 bg-white opacity-0 Month-glow"></div>

                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-4">
                  <div className="rounded-circle bg-white bg-opacity-25 p-2 mb-3">
                    <BsCalendarCheck className="text-white" size={22} />
                  </div>
                  <h2 className="card-title fw-bold text-white mb-1">
                    {item.Month}
                  </h2>
                </div>

                <div className="shine"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default Page;
