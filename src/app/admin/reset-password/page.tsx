"use client";

import React, { useState } from "react";
import Inputbox from "@/components/Inputbox";
import ProtectedRoute from "@/context/ProtectedRoute";
import { resetPassword } from "../../services/loginservice";

// Define interface with proper camelCase
interface ResetPassword {
  email: string;
  password: string;
  confirmPassword: string; // Fixed naming
}

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState<ResetPassword>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<ResetPassword>>({});
  const [success, setSuccess] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error on change
    if (errors[name as keyof ResetPassword]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validate = () => {
    const newErrors: Partial<ResetPassword> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const res = await resetPassword(formData.email.trim().toLowerCase(), formData.password.trim())
    if (res.status !== 200) {
      setErrors({ email: res.message });
      return;
    }

    // Simulate API call
    setSuccess("✅ Password reset Successful");
    // In real app: call API like resetPassword(formData)
    setFormData({ email: "", password: "", confirmPassword: "" });

    // Optional: Reset form after success
    // setFormData({ email: "", password: "", confirmPassword: "" });
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="d-flex justify-content-center align-items-center max-vh-100  mt-5">
        <div className="w-100" style={{ maxWidth: "450px" }}>
          <div className="card p-4 shadow-sm rounded-4 border-0">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-primary">Reset Password</h2>
              <p className="text-muted mb-0">
                Enter your details to reset your password
              </p>
            </div>

            {success && (
              <div
                className="alert alert-success alert-dismissible fade show mb-4"
                role="alert"
              >
                {success}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSuccess("")}
                ></button>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="needs-validation"
              noValidate
            >
              {/* Email */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-medium">
                  Email <span className="text-danger">*</span>
                </label>
                <Inputbox
                  name="email"
                  type="email"
                  text="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />
                {errors.email && (
                  <div className="text-danger mt-1 small">{errors.email}</div>
                )}
              </div>

              {/* Password */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-medium">
                  New Password <span className="text-danger">*</span>
                </label>
                <Inputbox
                  name="password"
                  type="password"
                  text="Create a new password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                />
                {errors.password && (
                  <div className="text-danger mt-1 small">
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="form-label fw-medium"
                >
                  Confirm Password <span className="text-danger">*</span>
                </label>
                <Inputbox
                  name="confirmPassword" // Fixed name
                  type="password"
                  text="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                />
                {errors.confirmPassword && (
                  <div className="text-danger mt-1 small">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg py-2 fw-semibold rounded-3"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ResetPasswordPage;
