"use client";

import { useEffect, useState, useCallback } from "react";
import ProtectedRoute from "../../context/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { fetchEmployeeData, EmployeeForm } from "../services/employeeService";
import EmployeeTable from "@/components/EmployeeTable";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";

export default function EmployeePage() {
  const { user, loading: authLoading } = useAuth();

  const [allData, setAllData] = useState<EmployeeForm[]>([]);
  const [data, setData] = useState<EmployeeForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null] | null>(
    null
  );
function stripTimeUTC(d: Date | string): number {
  const date = typeof d === "string" ? new Date(d) : d;
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}
 console.log(dateRange, "dateRange");
 console.log(data, "data after filter");
 console.log(allData, "allData");


  // Fetch employee data
  const fetchData = useCallback(async () => {
    if (!user?.applicant_uuid) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchEmployeeData(user.applicant_uuid);
      setAllData(result || []);
      setData(result || []);
    } catch (err) {
      console.error("Failed to fetch employee data:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [user?.applicant_uuid]);

  // Initial load
  useEffect(() => {
    if (!authLoading && user?.applicant_uuid) {
      fetchData();
    } else if (!authLoading && !user) {
      setLoading(false);
      setAllData([]);
      setData([]);
    }
  }, [authLoading, user, fetchData]);

  // Filter by date range
 useEffect(() => {
  if (!dateRange || dateRange.length !== 2 || !dateRange[0] || !dateRange[1]) {
    setData(allData);
    return;
  }

  const [start, end] = dateRange;

  const startUTC = stripTimeUTC(start);
  const endUTC = stripTimeUTC(end);

  const filtered = allData.filter((item) => {
    const createdAtUTC = stripTimeUTC(item.created_at);
    const isInRange = createdAtUTC >= startUTC && createdAtUTC <= endUTC;

    // 👇 Add this for debugging
    console.log(
      `Record created: ${item.created_at} → UTC Date: ${new Date(createdAtUTC).toISOString().split('T')[0]}, In Range: ${isInRange}`
    );

    return isInRange;
  });

  console.log("Filtered Data Count:", filtered.length);
  setData(filtered);
}, [dateRange, allData]);


  // Auth loading UI
  if (authLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Authenticating...</span>
          </div>
          <p className="mt-3 text-muted">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <ProtectedRoute>
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="alert alert-danger text-center shadow-sm">
                <h4 className="alert-heading">⚠️ Oops! Something went wrong</h4>
                <p>{error}</p>
                <hr />
                <div className="d-grid">
                  <button
                    onClick={() => fetchData()}
                    className="btn btn-outline-danger"
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Retry Loading Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Empty state
  if (!loading && data.length === 0) {
    return (
      <ProtectedRoute>
        <div className="container mt-5">
          <div className="text-center py-5">
            <div className="display-4 text-muted mb-3">
              <i className="bi bi-people"></i>
            </div>
            <h3 className="text-muted">No Employee Records Found</h3>
            <p className="text-muted">
              There are no records associated with your account.
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Main UI
  return (
    <ProtectedRoute allowedRoles={["employee"]}>
      <div className="container-fluid py-4 px-5">
        {/* Header */}
        <div className="container">
          <div className="d-flex mb-4 pb-3 border-bottom border-muted align-items-center">
            <div className="col-4">
              <h1 className="h2 fw-bold text-dark mb-1">Employee Records</h1>
              <p className="text-muted mb-0">
                Welcome back,{" "}
                <strong>{user?.first_name || "Team Member"}</strong> 👋
              </p>
            </div>
            <div className="me-auto col-8" style={{ maxWidth: "300px" }}>
              <span className="text-muted me-2">Filter by Date:</span>
              <DateRangePicker
                placeholder="Select Date Range"
                style={{ width: "100%" }}
                onChange={setDateRange}
              />
            </div>
          </div>
        </div>

        {/* Loading or Table */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading employee data...</span>
            </div>
            <p className="mt-3 text-muted">Fetching your records...</p>
          </div>
        ) : (
          <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 fw-bold text-dark m-0">
                Employee  Records
              </h2>
              <span className="badge bg-light text-dark border px-3 py-2 fw-normal">
                {data.length} record{data.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="jira-table-container">
              <EmployeeTable data={data} isLoading={false} />
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
