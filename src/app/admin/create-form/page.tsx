"use client";
import React, { useState } from "react";
import Inputbox from "@/components/Inputbox";
import validation from "./form-validation";
import {
  FormData,
  FormErrors,
  employeeFields,
  marketManagerFields,
  performanceFields,
} from "./form.types";
import { submitEmployeeForm } from "@/app/services/formSubmitService";
import ProtectedRoute from "@/context/ProtectedRoute";

function Page() {
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    NTID: "",
    market_manager_firstname: "",
    market_manager_lastname: "",
    HoursWorked: "",
    BoxesCompleted: "",
    AccessorySold: "",
    FeatureRevenue: "",
    CSAT: "",
    DayActivationRetention155: "",
    DayFeatureMRCRetention155: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // alert("Form submission is disabled in the demo.");
    e.preventDefault();
    setIsSubmitting(true);
    const validationErrors = validation(formData);
    setErrors(validationErrors);
    setSuccessMessage(null);

    if (Object.keys(validationErrors).length === 0) {
      const result = await submitEmployeeForm(formData);

      if (result.status === 200 || result.status === 201) {
        setSuccessMessage(result.message);
        // console.log("Server Response:", result.data);
        // Reset form on successful submission
        setFormData({
          first_name: "",
          last_name: "",
          NTID: "",
          market_manager_firstname: "",
          market_manager_lastname: "",
          HoursWorked: "",
          BoxesCompleted: "",
          AccessorySold: "",
          FeatureRevenue: "",
          CSAT: "",
          DayActivationRetention155: "",
          DayFeatureMRCRetention155: "",
        });
      } else {
        alert(result.message || "Something went wrong");
        console.error(result.error);
      }
    }
    setIsSubmitting(false);
  };

  const renderFields = (
    fields: { name: string; text: string }[],
    colClass = "col-md-4"
  ) =>
    fields.map((field) => (
      <div key={field.name} className={colClass}>
        <div className="mb-3">
          <label
            htmlFor={field.name}
            className="form-label small text-muted mb-1"
          >
            {field.text}{" "}
            {errors[field.name] && <span className="text-danger">*</span>}
          </label>
          <Inputbox
            name={field.name}
            type="text"
            text={field.text}
            value={formData[field.name as keyof FormData]}
            onChange={handleChange}
            error={errors[field.name]}
          />
          {errors[field.name] && (
            <div id={`${field.name}Error`} className="invalid-feedback small">
              {errors[field.name]}
            </div>
          )}
        </div>
      </div>
    ));

  return (
    <ProtectedRoute allowedRoles={['admin']}>
    <div className="min-vh-100  d-flex align-items-center">
      <div className="container ">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-9 ">
            {/* Main Form Card */}
            <div className="card border-1">
              {/* Header */}
              <div className="card-header  text-dark py-3">
                <h3 className="card-title mb-0 text-center fw-bold">
                  <i className="bi bi-clipboard-check me-2"></i>
                  Employee Evaluation Form
                </h3>
              </div>

              <div className="card-body p-4">
                {/* Success Message */}
                {successMessage && (
                  <div
                    className="alert alert-success alert-dismissible fade show mb-4"
                    role="alert"
                  >
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {successMessage}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setSuccessMessage(null)}
                    ></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Employee Info Section */}
                  <div className="mb-4">
                    <h5 className="text-primary mb-3 border-bottom pb-2">
                      <i className="bi bi-person-badge me-2"></i>
                      Employee Information
                    </h5>
                    <div className="row">
                      {renderFields(employeeFields, "col-md-6")}

                      {/* NTID Field */}
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label
                            htmlFor="NTID"
                            className="form-label small text-muted mb-1"
                          >
                            NTID{" "}
                            {errors.NTID && (
                              <span className="text-danger">*</span>
                            )}
                          </label>
                          <Inputbox
                            name="NTID"
                            type="text"
                            text="NTID"
                            value={formData.NTID}
                            onChange={handleChange}
                            error={errors.NTID}
                          />
                          {errors.NTID && (
                            <div
                              id="NTIDError"
                              className="invalid-feedback small"
                            >
                              {errors.NTID}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Market Manager Section */}
                  <div className="mb-4">
                    <h5 className="text-primary mb-3 border-bottom pb-2">
                      <i className="bi bi-person-plus me-2"></i>
                      Market Manager Information
                    </h5>
                    <div className="row">
                      {renderFields(marketManagerFields, "col-md-6")}
                    </div>
                  </div>

                  {/* Performance Metrics Section */}
                  <div className="mb-4">
                    <h5 className="text-primary mb-3 border-bottom pb-2">
                      <i className="bi bi-graph-up me-2"></i>
                      Performance Metrics
                    </h5>
                    <div className="row">
                      {renderFields(performanceFields, "col-md-6 col-lg-4")}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg fw-bold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send me-2"></i>
                          Submit Evaluation
                        </>
                      )}
                    </button>
                  </div>
                </form>
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
