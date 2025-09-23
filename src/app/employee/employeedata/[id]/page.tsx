"use client";
import { useState, useEffect } from "react";
import {
  EmployeeForm,
  Comment,
  fetchUncommentedEmployeeData,
  addComment,
} from "../../../services/employeeService";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/context/ProtectedRoute";
import { decodeId } from "@/lib/hashids";
import { useAuth } from "@/context/AuthContext";

export default function EmployeeAssignmentView() {
  const params = useParams();
  const form_id_str = params?.id as string;
  const form_id = decodeId(form_id_str); // Decode hashed form_id
  const applicant_uuid = useAuth().user?.applicant_uuid || "";

  const [assignments, setAssignments] = useState<EmployeeForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittedComments, setSubmittedComments] = useState<
    Record<number, Comment>
  >({});
  const [commentTexts, setCommentTexts] = useState<Record<number, string>>({});
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const data = await fetchUncommentedEmployeeData(form_id.toString());
        setAssignments(data);
      } catch (err: any) {
        setMessage({
          type: "error",
          text: err.message || "Failed to load assignments",
        });
      } finally {
        setLoading(false);
      }
    };
    loadAssignments();
  }, [form_id]);

  const handleAddComment = async (form_id: number) => {
    const text = commentTexts[form_id] || "";
    if (!text.trim()) return;

    try {
      const savedComment = await addComment(form_id, applicant_uuid, text);

      setSubmittedComments((prev) => ({
        ...prev,
        [form_id]: savedComment,
      }));

      setCommentTexts((prev) => ({ ...prev, [form_id]: "" })); // clear only this input
      setMessage({ type: "success", text: "Comment submitted successfully!" });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Failed to submit comment",
      });
    }
  };

  if (loading) return <p className="text-center mt-4">Loading assignments...</p>;
  if (assignments.length === 0)
    return <p className="text-center mt-4">No assignments found.</p>;

  return (
    <ProtectedRoute allowedRoles={["employee"]}>
      <div className="container mt-4">
        {message && (
          <div
            className={`alert ${
              message.type === "success" ? "alert-success" : "alert-danger"
            }`}
            role="alert"
          >
            {message.text}
          </div>
        )}
        {assignments.map((assignment) => {
          const hasComment = !!submittedComments[assignment.form_id];

          return (
            <div key={assignment.form_id} className="card shadow-sm p-3 mb-4">
              <div className="row">
                {/* Left side: Assignment details */}
                <div className="col-md-7 border-end">
                  <h5 className="card-title mb-3">
                    📋 Assignment for {assignment.first_name}{" "}
                    {assignment.last_name}
                  </h5>
                  <p>
                    <strong>NTID:</strong> {assignment.ntid}
                  </p>
                  <p>
                    <strong>Market Manager:</strong>{" "}
                    {assignment.market_manager_firstname}{" "}
                    {assignment.market_manager_lastname}
                  </p>
                  <hr />
                  <p>
                    <strong>Hours Worked:</strong> {assignment.hours_worked}
                  </p>
                  <p>
                    <strong>Boxes Completed:</strong>{" "}
                    {assignment.boxes_completed}
                  </p>
                  <p>
                    <strong>Accessory Sold:</strong>{" "}
                    {assignment.accessories_sold}
                  </p>
                  <p>
                    <strong>Feature Revenue:</strong>{" "}
                    {assignment.feature_revenue}
                  </p>
                  <p>
                    <strong>CSAT:</strong> {assignment.csat}
                  </p>
                  <p>
                    <strong>Day Activation Retention 155:</strong>{" "}
                    {assignment.day_155_activation_retention}
                  </p>
                  <p>
                    <strong>Day Feature MRC Retention 155:</strong>{" "}
                    {assignment.day_155_future_mrc_retention}
                  </p>
                </div>

                {/* Right side: Comment section */}
                <div className="col-md-5 d-flex flex-column justify-content-between">
                  {hasComment ? (
                    <div className="p-3 bg-light rounded">
                      <strong>Your Comment:</strong>
                      <p>{submittedComments[assignment.form_id].comment_text}</p>
                      <small className="text-muted">
                        {submittedComments[assignment.form_id].created_at
                          ? new Date(
                              submittedComments[assignment.form_id].created_at
                            ).toLocaleString()
                          : ""}
                      </small>
                    </div>
                  ) : (
                    <>
                      <textarea
                        className="form-control mb-2"
                        rows={6}
                        placeholder="Add your comment/feedback..."
                        value={commentTexts[assignment.form_id] || ""}
                        onChange={(e) =>
                          setCommentTexts((prev) => ({
                            ...prev,
                            [assignment.form_id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        className="btn btn-success"
                        onClick={() => handleAddComment(assignment.form_id)}
                        disabled={!commentTexts[assignment.form_id]?.trim()}
                      >
                        Submit Comment
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ProtectedRoute>
  );
}
