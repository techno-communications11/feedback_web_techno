"use client";

import { useEffect, useState, useCallback } from "react";
import ProtectedRoute from "../../context/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { fetchEmployeeData, EmployeeForm } from "../services/employeeService";
import EmployeeTable from "@/components/EmployeeTable";

// Or use pure Bootstrap classes if not using React-Bootstrap

export default function EmployeePage() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<EmployeeForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wrap fetch in useCallback for retry capability
  const fetchData = useCallback(async () => {
    if (!user?.applicant_uuid) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchEmployeeData(user.applicant_uuid);
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

  // Initial load + dependency effect
  useEffect(() => {
    if (!authLoading && user?.applicant_uuid) {
      fetchData();
    } else if (!authLoading && !user) {
      setLoading(false);
      // ProtectedRoute should handle this, but we set empty state
      setData([]);
    }
  }, [authLoading, user, fetchData]);

  // If auth is loading, show full-page loader
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

  // Show error state
  if (error) {
    return (
      <ProtectedRoute>
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <Alert variant="danger" className="text-center shadow-sm">
                <Alert.Heading>⚠️ Oops! Something went wrong</Alert.Heading>
                <p>{error}</p>
                <hr />
                <div className="d-grid">
                  <Button onClick={() => fetchData()} variant="outline-danger">
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Retry Loading Data
                  </Button>
                </div>
              </Alert>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Show empty state (no data)
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
            <button
              className="btn btn-outline-primary mt-3"
              onClick={() => fetchData()}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Refresh
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["employee"]}>
      <div className="container py-5">
        {/* Header with subtle animation */}
        <div className="text-center mb-5 animate__animated animate__fadeIn">
          <h1 className="display-5 fw-bold text-primary mb-3">
            Employee Records
          </h1>
          <p className="lead text-muted">
            Welcome back, <strong>{user?.first_name || "Team Member"}</strong>{" "}
            👋
          </p>
          <div className="border-bottom border-primary-subtle w-25 mx-auto"></div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">
                  Loading employee data...
                </span>
              </div>
              <p className="mt-3 text-muted">Fetching your records...</p>
            </div>
          </div>
        ) : (
          /* Table with fade-in animation */
          <div className="animate__animated animate__fadeInUp">
            <div className="bg-white p-4 rounded shadow-sm border">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0 fw-bold text-dark">
                  <i className="bi bi-table me-2"></i>
                  Employee Performance Records
                </h5>
                <span className="badge bg-primary rounded-pill px-3 py-2">
                  {data.length} record{data.length !== 1 ? "s" : ""}
                </span>
              </div>
              <EmployeeTable data={data} isLoading={false} />
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
