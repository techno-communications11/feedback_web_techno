'use client';
import { useState } from "react";

interface CommentInputProps {
  formId: number;
}

export default function CommentInput({ formId }: CommentInputProps) {
  const [employeeComment, setEmployeeComment] = useState("");
  const [managerComment, setManagerComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!employeeComment.trim() && !managerComment.trim()) return;

    // Call API to save both comments here
    console.log("Form ID:", formId);
    console.log("Employee Comment:", employeeComment);
    console.log("Manager Comment:", managerComment);

    setSubmitted(true);
  };

  return (
    <div className="card p-3 mb-3">
      {submitted ? (
        <p className="text-success fw-bold">Comments submitted successfully!</p>
      ) : (
        <>
          <div className="mb-3">
            <label className="form-label">Employee Comment</label>
            <textarea
              className="form-control"
              rows={3}
              value={employeeComment}
              onChange={(e) => setEmployeeComment(e.target.value)}
              placeholder="Add employee comment..."
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Market Manager Comment</label>
            <textarea
              className="form-control"
              rows={3}
              value={managerComment}
              onChange={(e) => setManagerComment(e.target.value)}
              placeholder="Add market manager comment..."
            />
          </div>

          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit Comments
          </button>
        </>
      )}
    </div>
  );
}
