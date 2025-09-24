"use client";
import React, { useState } from "react";
import { RiEditCircleFill } from "react-icons/ri";
import Modalbox from "./Modalbox";
interface CommentProps {
  comment_id?: number | null;
}

const MarketManageredit = ({comment_id}:CommentProps) => {
  const [showmodal, setShowmodal] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleSave = async () => {
    try {
      // Example: send comment to server (replace with your endpoint)
      const res = await fetch("/api/managercommentedit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manager_comment: commentText ,comment_id}),
      });

      if (!res.ok) throw new Error("Failed to save comment");
      alert("Comment saved successfully");

      console.log("✅ Comment saved:", commentText);
      setShowmodal(false);
      setCommentText(""); // reset after save
    } catch (error) {
      console.error("❌ Error saving comment:", error);
    }
  };

  return (
    <div>
      <RiEditCircleFill
        size={24}
        className="text-primary"
        style={{ cursor: "pointer" }}
        title="Edit manager comment"
        onClick={() => setShowmodal(true)}
      />

      {showmodal && (
        <Modalbox
          onClose={() => setShowmodal(false)}
          commentText={commentText}
          setCommentText={setCommentText}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default MarketManageredit;
