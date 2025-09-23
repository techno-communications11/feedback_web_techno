"use client";
import React, { useEffect, useState } from "react";
import { fetchFormComments, Feedback } from "../app/services/fetchUserFeedback";

interface CurrentMonthCommentProps {
  first_name: string;
  last_name: string;
  month: number;
  year: number;
}

const CurrentMonthComment: React.FC<CurrentMonthCommentProps> = ({
  first_name,
  last_name,
  month,
  year,
}) => {
  const [data, setData] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadFeedbackData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchFormComments({
        first_name,
        last_name,
        month,
        year,
      });
      
      setData(result.data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (first_name && last_name) {
      loadFeedbackData();
    }
  }, [first_name, last_name, month, year]);

  return (
    <div className="m-4">
      {isLoading && (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {!isLoading && !error && data.length === 0 && (
        <div
          className="alert alert-secondary d-flex align-items-center"
          role="alert"
        >
          <i className="bi bi-info-circle-fill me-2"></i>
          No feedback available for this month.
        </div>
      )}

      {!isLoading && !error && data.length > 0 && (
        <div className="row g-4">
          {data.map((feedback) => (
            <div key={feedback.comment_id || Math.random()} className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
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
                    <div className="col-md-6">
                      <h6 className="fw-bold text-primary">Personal Info</h6>
                      <ul className="list-unstyled small">
                        <li>
                          <strong>First Name:</strong> {feedback.first_name}
                        </li>
                        <li>
                          <strong>Last Name:</strong> {feedback.last_name}
                        </li>
                        <li>
                          <strong>NTID:</strong> {feedback.ntid}
                        </li>
                        <li>
                          <strong>Market Manager:</strong>{" "}
                          {feedback.market_manager_firstname}{" "}
                          {feedback.market_manager_lastname}
                        </li>
                      </ul>
                    </div>

                    {/* Metrics */}
                    <div className="col-md-6">
                      <h6 className="fw-bold text-success">
                        Performance Metrics
                      </h6>
                      <ul className="list-unstyled small">
                        <li>
                          <strong>Hours Worked:</strong> {feedback.hours_worked}
                        </li>
                        <li>
                          <strong>Boxes Completed:</strong>{" "}
                          {feedback.boxes_completed}
                        </li>
                        <li>
                          <strong>Accessories Sold:</strong>{" "}
                          {feedback.accessories_sold}
                        </li>
                        <li>
                          <strong>Feature Revenue:</strong> $
                          {feedback.feature_revenue?.toLocaleString() || "N/A"}
                        </li>
                        <li>
                          <strong>CSAT:</strong> {feedback.csat}%
                        </li>
                      </ul>
                    </div>

                    {/* Retention Metrics */}
                    <div className="col-md-6">
                      <h6 className="fw-bold text-warning">
                        Retention Metrics
                      </h6>
                      <ul className="list-unstyled small">
                        <li>
                          <strong>Day 155 Activation Retention:</strong>{" "}
                          {feedback.day_155_activation_retention}%
                        </li>
                        <li>
                          <strong>Day 155 Future MRC Retention:</strong>{" "}
                          {feedback.day_155_future_mrc_retention}%
                        </li>
                      </ul>
                    </div>

                    {/* Timestamps */}
                    <div className="col-md-6">
                      <h6 className="fw-bold text-muted">Timestamps</h6>
                      <ul className="list-unstyled small">
                        <li>
                          <strong>Created:</strong>{" "}
                          {new Date(feedback.created_at).toLocaleString()}
                        </li>
                        <li>
                          <strong>Updated:</strong>{" "}
                          {new Date(feedback.updated_at).toLocaleString()}
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Comment Section */}
                  <div className="mt-4 p-3 bg-light border rounded">
                    <h6 className="mb-2 fw-bold text-dark">
                      <i className="bi bi-chat-quote me-2"></i>
                      Comment
                    </h6>
                    <p className="mb-0">
                      {feedback.comment_text || "No comment provided."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrentMonthComment;
