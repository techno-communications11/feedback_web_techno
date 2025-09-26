// CurrentMonthComment.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  fetchFormComments,
  Feedback,
  submitComments,
} from "../app/services/fetchUserFeedback";
import Spinners from "./Spinners";
import CommentInput from "./CommentInput"; // Properly named import
import { useAuth } from "@/context/AuthContext";
import { FcComments } from "react-icons/fc";
import '../../src/app/styles/currentmonthcomments.css'


interface CurrentMonthCommentProps {
  ntid?: string;
  month: number;
  year: number;
  setFormId?: (formId: number) => void;
}

const CurrentMonthComment: React.FC<CurrentMonthCommentProps> = ({
  ntid,
  month,
  year,
  setFormId,
}) => {
  const { user ,triggerCommentsRefresh } = useAuth();
  const [data, setData] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [employeeComment, setEmployeeComment] = useState("");
  const [managerComment, setManagerComment] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleEmployeeSubmit = useCallback(async () => {
    if (!employeeComment.trim() || data.length === 0) return;

    try {
      setSubmitting(true);
      await submitComments({
        ntid: data[0].ntid,
        form_uuid: data[0].form_uuid,
        employeeComment,
        type: "employee",
      });

      setSubmitted("employee");
      setEmployeeComment("");
      await loadFeedbackData();
      triggerCommentsRefresh();
    } catch (err: any) {
      setError(err.message || "Failed to submit employee comment");
    } finally {
      setSubmitting(false);
    }
  }, [employeeComment, data,triggerCommentsRefresh]);

  const handleMarketManagerSubmit = useCallback(async () => {
    if (!managerComment.trim() || data.length === 0) return;

    try {
      setSubmitting(true);
      await submitComments({
        ntid: data[0].ntid,
        form_uuid: data[0].form_uuid,
        managerComment,
        type: "manager",
      });

      setSubmitted("manager");
      setManagerComment("");
      await loadFeedbackData();
      triggerCommentsRefresh();
      
    } catch (err: any) {
      setError(err.message || "Failed to submit manager comment");
    } finally {
      setSubmitting(false);
    }
  }, [managerComment, data,triggerCommentsRefresh]);

  const loadFeedbackData = async () => {
    if (!ntid) return;
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchFormComments({
        ntid,
        month,
        year,
      });
      setData(result.data || []);
      if (result.data?.length > 0 && setFormId) {
        setFormId(result.data[0].form_id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load feedback");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbackData();
  }, [ntid, month, year]);

  // Reset submitted status when data changes
  useEffect(() => {
    if (data.length > 0) {
      setSubmitted(null);
    }
  }, [data]);

  return (
    <div className="current-month-comment mx-2 mx-md-4">
      {isLoading && <Spinners text="loading..." />}
      {submitting && <Spinners text="submitting..." />}

      {error && (
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <i
            className="bi bi-exclamation-triangle-fill me-2"
            aria-hidden="true"
          ></i>
          {error}
        </div>
      )}

      {!isLoading && !error && data.length === 0 && (
        <div
          className="alert alert-secondary d-flex align-items-center"
          role="alert"
        >
          <i className="bi bi-info-circle-fill me-2" aria-hidden="true"></i>
          No feedback available for this month.
        </div>
      )}

      {!isLoading && !error && data.length > 0 && (
        <>
          {/* Render all feedback cards */}
          <div className="row g-3 g-md-4">
            {data.map((feedback) => (
              <div
                key={feedback.comment_id || `feedback-${feedback.form_uuid}`}
                className="col-12"
              >
                <div className="card shadow-sm border-0">
                  <div className="card-header bg-light d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <strong className="text-primary">
                        Feedback #{feedback.comment_id}
                      </strong>
                      <br />
                      <small className="text-muted">
                        {new Date(feedback.created_at).toLocaleString()}
                      </small>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="row g-3">
                      {/* Personal Info */}
                      <div className="col-12 col-md-6">
                        <h6 className="fw-bold text-primary mb-2">
                          Personal Info
                        </h6>
                        <ul className="list-unstyled small">
                          <li>
                            <strong>First Name:</strong>{" "}
                            {feedback.first_name || "N/A"}
                          </li>
                          <li>
                            <strong>Last Name:</strong>{" "}
                            {feedback.last_name || "N/A"}
                          </li>
                          <li>
                            <strong>NTID:</strong> {feedback.ntid || "N/A"}
                          </li>
                          <li>
                            <strong>Market Manager:</strong>{" "}
                            {feedback.market_manager_firstname || "N/A"}{" "}
                            {feedback.market_manager_lastname || ""}
                          </li>
                        </ul>
                      </div>

                      {/* Performance Metrics */}
                      <div className="col-12 col-md-6">
                        <h6 className="fw-bold text-success mb-2">
                          Performance Metrics
                        </h6>
                        <ul className="list-unstyled small">
                          <li>
                            <strong>Hours Worked:</strong>{" "}
                            {feedback.hours_worked ?? "N/A"}
                          </li>
                          <li>
                            <strong>Boxes Completed:</strong>{" "}
                            {feedback.boxes_completed ?? "N/A"}
                          </li>
                          <li>
                            <strong>Accessories Sold:</strong>{" "}
                            {feedback.accessories_sold ?? "N/A"}
                          </li>
                          <li>
                            <strong>Feature Revenue:</strong>{" "}
                            {feedback.feature_revenue != null
                              ? `$${feedback.feature_revenue.toLocaleString()}`
                              : "N/A"}
                          </li>
                          <li>
                            <strong>CSAT:</strong>{" "}
                            {feedback.csat != null
                              ? `${feedback.csat}%`
                              : "N/A"}
                          </li>
                        </ul>
                      </div>

                      {/* Retention Metrics */}
                      <div className="col-12 col-md-6  align-content-center ms-5">
                        <h6 className="fw-bold text-warning mb-2">
                          Retention Metrics
                        </h6>
                        <table className="table table-sm retention-table ">
                          <thead>
                            <tr className="text-nowrap">
                              <th
                                className="text-center"
                                style={{ width: "25%" }}
                              >
                                Days
                              </th>
                              <th
                                className="text-center"
                                style={{ width: "37.5%" }}
                              >
                                Activation Retention
                              </th>
                              <th
                                className="text-center"
                                style={{ width: "37.5%" }}
                              >
                                Future MRC Retention
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              {
                                day: 35,
                                act: "day_35_activation_retention",
                                mrc: "day_35_future_mrc_retention",
                              },
                              {
                                day: 65,
                                act: "day_65_activation_retention",
                                mrc: "day_65_future_mrc_retention",
                              },
                              {
                                day: 95,
                                act: "day_95_activation_retention",
                                mrc: "day_95_future_mrc_retention",
                              },
                              {
                                day: 125,
                                act: "day_125_activation_retention",
                                mrc: "day_125_future_mrc_retention",
                              },
                              {
                                day: 155,
                                act: "day_155_activation_retention",
                                mrc: "day_155_future_mrc_retention",
                              },
                            ].map((row) => (
                              <tr key={row.day}>
                                <td className="text-center fw-medium">
                                  {row.day}
                                </td>
                                <td className="text-center">
                                  {feedback[row.act as keyof typeof feedback] !=
                                  null ? (
                                    <span className="badge bg-success-subtle text-success-emphasis">
                                      {
                                        feedback[
                                          row.act as keyof typeof feedback
                                        ]
                                      }
                                      %
                                    </span>
                                  ) : (
                                    <span className="text-muted">N/A</span>
                                  )}
                                </td>
                                <td className="text-center">
                                  {feedback[row.mrc as keyof typeof feedback] !=
                                  null ? (
                                    <span className="badge bg-info-subtle text-info-emphasis">
                                      {
                                        feedback[
                                          row.mrc as keyof typeof feedback
                                        ]
                                      }
                                      %
                                    </span>
                                  ) : (
                                    <span className="text-muted">N/A</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* Timestamps */}
                    <div className="col-12 col-md-6 ms-auto">
                      <h6 className="fw-bold text-muted mb-2">Timestamps</h6>
                      <ul className="list-unstyled small">
                        <li>
                          <strong>Created:</strong>{" "}
                          {new Date(feedback.created_at).toLocaleString()}
                        </li>
                      </ul>
                    </div>

                    {/* Comment Section */}
                    <div className="mt-3 p-2 p-md-3 bg-light border rounded">
                      <h6 className="mb-2 fw-bold text-dark">
                        <i
                          className="bi bi-chat-quote me-2"
                          aria-hidden="true"
                        ></i>
                        Employee Comment
                      </h6>
                      <p className="mb-0">
                        <FcComments /> {feedback.comment_text || "No comment provided."}
                      </p>
                    </div>
                    <div className="mt-3 p-2 p-md-3 bg-light border rounded">
                      <h6 className="mb-2 fw-bold text-dark">
                        <i
                          className="bi bi-chat-quote me-2"
                          aria-hidden="true"
                        ></i>
                         Manager Comment
                      </h6>
                      <p className="mb-0">
                        <FcComments /> {feedback.manager_comment || "No comment provided."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Render CommentInput ONCE outside the loop */}
          {user?.role === "market_manager" && (
            <CommentInput
              data={data}
              employeeComment={employeeComment}
              managerComment={managerComment}
              submitted={submitted}
              setEmployeeComment={setEmployeeComment}
              setManagerComment={setManagerComment}
              handleEmployeeSubmit={handleEmployeeSubmit}
              handleMarketManagerSubmit={handleMarketManagerSubmit}
            />
          )}
        </>
      )}

     
    </div>
  );
};

export default CurrentMonthComment;
