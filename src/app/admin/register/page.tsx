"use client";

import React, { useState, useEffect } from "react";
import Inputbox from "@/components/Inputbox";
import ProtectedRoute from "@/context/ProtectedRoute";
import { RegisterUser, RegisterErrors } from "@/app/login/auth.types";
import { register } from "@/app/services/loginservice";
import MarketDropdown from "@/components/MarketDropdown";

// Initial form state
const initialState: RegisterUser = {
  email: "",
  password: "",
  confirmPassword: "",
  market: 0,
  role: "",
};

// Role options (kept as lowercase internally, displayed capitalized)
const ROLES = ["admin", "market_manager"];

// Utility to capitalize first letter
const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).replace("_", " ");

const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterUser>(initialState);
  const [formErrors, setFormErrors] = useState<Partial<RegisterErrors>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Auto-dismiss success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field on change
    if (formErrors[name as keyof RegisterErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Validate form fields
  const validate = (): Partial<RegisterErrors> => {
    const errors: Partial<RegisterErrors> = {};

    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email is invalid";

    if (!formData.role) errors.role = "Role is required";
    if (!formData.password) errors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    if (formData.role !== "admin" && !formData.market)
      errors.market = "Market is required for this role";
    if (formData.role === "admin" && formData.market)
      errors.market = "Market should be empty for admin role";

    return errors;
  };
  console.log(formErrors);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setSuccessMessage("");

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        email: formData.email.toLowerCase().trim(),
        password: formData.password.trim(),
        market: formData.market ? Number(formData.market) : null, // convert to number
      };
      const res = await register(payload);

      if (res.status === 200) {
        setSuccessMessage("✅ User registered successfully!");
        setFormData(initialState);
      } else {
        setFormErrors({ email: "Failed registration" });
      }
    } catch (err) {
      console.error("Registration error:", err);
      setFormErrors({ email: "⚠️ Server error. Please try again later." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mt-4">
        <div className="row justify-content-center align-items-start g-4">
          {/* Form Card */}
          <div className="col-md-6 col-lg-5">
            <div className="p-4 bg-white rounded shadow-sm border">
              <h2 className="h4 fw-bold text-center mb-4">
                Create New User Account
              </h2>

              {/* Success Alert */}
              {successMessage && (
                <div
                  className="alert alert-success alert-dismissible fade show"
                  role="alert"
                >
                  {successMessage}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSuccessMessage("")}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <Inputbox
                    type="email"
                    text="Enter Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={formErrors.email}
                    required
                  />
                  {formErrors.email && (
                    <div className="text-danger mt-1 small">
                      {formErrors.email}
                    </div>
                  )}
                </div>

                {/* Role */}
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    Role <span className="text-danger">*</span>
                  </label>
                  <select
                    id="role"
                    className="form-select"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    aria-invalid={!!formErrors.role}
                    required
                  >
                    <option value="">Select a role</option>
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {capitalize(role)}
                      </option>
                    ))}
                  </select>
                  {formErrors.role && (
                    <div className="text-danger mt-1 small">
                      {formErrors.role}
                    </div>
                  )}
                </div>
                {formData.role !== "admin" && (
                  <>
                    <MarketDropdown
                      value={
                        formData.market !== null ? String(formData.market) : ""
                      }
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          market: Number(value),
                        }))
                      }
                    />
                  </>
                )}

                {/* Password */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <Inputbox
                    type="password"
                    text="Create password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={formErrors.password}
                    required
                  />
                  {formErrors.password && (
                    <div className="text-danger mt-1 small">
                      {formErrors.password}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password <span className="text-danger">*</span>
                  </label>
                  <Inputbox
                    type="password"
                    text="Confirm password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={formErrors.confirmPassword}
                    required
                  />
                  {formErrors.confirmPassword && (
                    <div className="text-danger mt-1 small">
                      {formErrors.confirmPassword}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100  fw-medium"
                  disabled={submitting}
                  aria-busy={submitting}
                >
                  {submitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Registering...
                    </>
                  ) : (
                    "Register User"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default RegisterPage;
