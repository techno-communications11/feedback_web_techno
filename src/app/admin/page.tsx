"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { BsCalendarCheck } from "react-icons/bs";
import "../styles/admin.css";
import { colors } from "./admin.constants";
import { encodeId } from "@/lib/hashids";
import ProtectedRoute from "@/context/ProtectedRoute";
import { getyearsService } from "../services/getYearsService";
import { useAuth } from "@/context/AuthContext";

function Page() {
  const { user } = useAuth();
  const router = useRouter();
  const [years, setYears] = React.useState<{ year: string }[]>([]);
  React.useEffect(() => {
    const yearList = async () => {
      const yearsArray: number[] = await getyearsService();
      // Convert number[] to { year: string }[]
      const formattedYears = yearsArray.map((y) => ({ year: y.toString() }));
      setYears(formattedYears);
    };
    yearList();
  }, []);

  const baseRoute =
    user?.role === "market_manager" ? "market_manager" : "admin";

  // Handle click (optional: navigate or show modal)
  const handleYearClick = (year: string) => {
    if (!year) return;
    const encodedYear = encodeId(Number(year));
    router.push(`/${baseRoute}/monthly/${encodedYear}`);
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "market_manager"]}>
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-dark mb-3">
            Select Evaluation Year
          </h1>
          <p className="lead text-muted">
            Choose a year to view or submit employee evaluations
          </p>
        </div>

        {/* Year Cards Grid */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 justify-content-center">
          {years.map((item, index) => (
            <div key={index++} className="col">
              <div
                className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden year-card position-relative"
                style={{
                  background: colors[index % colors.length],
                  cursor: "pointer",
                  transition:
                    "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease",
                }}
                onClick={() => handleYearClick(item.year)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleYearClick(item.year);
                  }
                }}
              >
                {/* Optional glow on hover */}
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-white opacity-0 year-glow"></div>

                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-4">
                  <div className="rounded-circle bg-white bg-opacity-25 p-3 mb-3">
                    <BsCalendarCheck className="text-white" size={32} />
                  </div>
                  <h3 className="card-title fw-bold text-white mb-1 display-6">
                    {item.year}
                  </h3>
                  {/* <p className="text-white small mb-0">View Reports & Metrics</p> */}
                </div>

                {/* Hover Shine Effect */}
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
