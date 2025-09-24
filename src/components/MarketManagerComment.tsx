"use client";

import React, { useState, useRef, useEffect } from "react";
import { BiSolidCommentAdd } from "react-icons/bi";

function MarketManagerComment({ form_id }: { form_id: number | null }) {
  const [open, setOpen] = useState(false);
  const [manager_comment, setManagerComment] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  // Escape key closes modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // Auto-focus textarea
  useEffect(() => {
    if (open && modalRef.current) {
      const textarea = modalRef.current.querySelector("textarea");
      (textarea as HTMLTextAreaElement)?.focus();
    }
  }, [open]);

  const handleSave = async () => {
  if (!form_id) {
    return alert("Form ID is missing or  User not uploaded comments yet.");
  }

  if (!manager_comment.trim()) {
    return alert("Please write a comment.");
  }

  try {
    console.log("Saving comment for form_id:", form_id);
    const response = await fetch("/api/managercomment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form_id, manager_comment }),
    });

    if (!response.ok) throw new Error("Failed to save manager_comment");

    console.log("manager_comment saved successfully");
    alert("Comment added successfully!");
  } catch (error) {
    console.error("Error saving manager_comment:", error);
    alert("Failed to save comment.");
  } finally {
    setManagerComment("");
    setOpen(false);
  }
};


  const handleCancel = () => {
    setManagerComment("");
    setOpen(false);
  };

  return (
    <div className="position-relative d-inline-block">
      {/* Open Button */}
      <button
        type="button"
        className="btn btn-link text-primary p-0"
        aria-label="Add manager_comment"
        onClick={() => setOpen(true)}
      >
        <BiSolidCommentAdd size={24} />
      </button>

      {/* Modal */}
      {open && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex={-1}
          role="dialog"
          aria-labelledby="manager_commentModalLabel"
          onClick={() => setOpen(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
          >
            <div className="modal-content animate__fadeIn animate__faster">
              <div className="modal-header border-bottom">
                <h5 className="modal-title">Add Manager Comment</h5>
                <button type="button" className="btn-close" onClick={handleCancel}></button>
              </div>

              <div className="modal-body py-4">
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Write your manager_comment..."
                  value={manager_comment}
                  onChange={(e) => setManagerComment(e.target.value)}
                />
              </div>

              <div className="modal-footer border-top">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={!manager_comment.trim()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketManagerComment;
