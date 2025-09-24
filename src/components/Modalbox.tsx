import React from "react";
import "../app/styles/modal.css";

interface ModalboxProps {
  onClose: () => void;
  commentText: string;
  setCommentText: (text: string) => void;
  onSave: () => void;
}

function Modalbox({
  onClose,
  commentText,
  setCommentText,
  onSave,
}: ModalboxProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h5 className="modal-title"> update Comment</h5>
          <button type="button" className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <textarea
            name="comment"
            value={commentText}
            placeholder="Enter comment"
            onChange={(e) => setCommentText(e.target.value)}
            className="form-control"
            rows={4}
          />
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={onSave}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modalbox;
