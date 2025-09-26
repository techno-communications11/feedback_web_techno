// CommentInput.tsx
"use client";

import React from "react";

interface CommentInputProps {
  data: any[];
  employeeComment: string;
  managerComment: string;
  submitted: string | null;
  setEmployeeComment: (val: string) => void;
  setManagerComment: (val: string) => void;
  handleEmployeeSubmit: () => void;
  handleMarketManagerSubmit: () => void;
}

const CommentInput: React.FC<CommentInputProps> = ({
  data,
  employeeComment,
  managerComment,
  submitted,
  setEmployeeComment,
  setManagerComment,
  handleEmployeeSubmit,
  handleMarketManagerSubmit,
}) => {
  // Check if there's existing comment data
  const hasExistingData = data && data.length > 0;
  const firstFeedback = hasExistingData ? data[0] : null;
  
  // Show employee comment box only if comment_text is empty/null
  const showEmployeeSection = hasExistingData && 
    (!firstFeedback.comment_text || firstFeedback.comment_text.trim() === '');
  
  // Show manager comment box only if manager_comment is empty/null  
  const showManagerSection = hasExistingData && 
    (!firstFeedback.manager_comment || firstFeedback.manager_comment.trim() === '');

  // If neither section should be shown, return null
  if (!showEmployeeSection && !showManagerSection) {
    return null;
  }

  return (
    <div className="card shadow-sm p-4 mb-3 border-0 rounded-3">
      <h5 className="fw-semibold mb-3 text-primary">Comments Section</h5>

      {submitted === "employee" && (
        <p className="alert alert-success py-2">
          Employee comment submitted successfully!
        </p>
      )}
      {submitted === "manager" && (
        <p className="alert alert-success py-2">
          Manager comment submitted successfully!
        </p>
      )}

      {/* Employee Comment */}
      {showEmployeeSection && (
        <div className="mb-4">
          <label className="form-label fw-medium">Employee Comment</label>
          <textarea
            className="form-control mb-2"
            rows={4}
            value={employeeComment}
            onChange={(e) => setEmployeeComment(e.target.value)}
            placeholder="Write your comment..."
          />
          <button
            className="btn btn-sm btn-primary"
            onClick={handleEmployeeSubmit}
            disabled={!employeeComment.trim()}
          >
            Submit Employee Comment
          </button>
        </div>
      )}

      {/* Manager Comment */}
      {showManagerSection && (
        <div>
          <label className="form-label fw-medium">Market Manager Comment</label>
          <textarea
            className="form-control mb-2"
            rows={4}
            value={managerComment}
            onChange={(e) => setManagerComment(e.target.value)}
            placeholder="Write your comment..."
          />
          <button
            className="btn btn-sm btn-success"
            onClick={handleMarketManagerSubmit}
            disabled={!managerComment.trim()}
          >
            Submit Manager Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentInput;