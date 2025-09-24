"use client";

import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { fetchComments, Comment } from "../../services/readCommenstService";
import { useAuth } from "@/context/AuthContext";
import MarketManageredit from "@/components/MarketManageredit";
import UserCommentEdit from "@/components/UserCommentEdit";

interface CommentsDataProps {
  applicant_uuid?: string;
  first_name?: string;
  last_name?: string;
}

export default function CommentsData({
  applicant_uuid,
  first_name,
  last_name,
}: CommentsDataProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [comment_id, setCommentId] = useState<number | null>(null);

  useEffect(() => {
    const getComments = async () => {
      if (!applicant_uuid) return;
      setLoading(true);
      try {
        const data = await fetchComments(applicant_uuid);
        setComments(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    getComments();
  }, [applicant_uuid]);

  

  if (!applicant_uuid) return <p className="text-muted">No user selected.</p>;

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100px" }}
      >
        <div className="spinner-border"></div>
      </div>
    );

  if (comments.length === 0)
    return <p className="text-muted">No comments found.</p>;

  // Group comments by month & year
  const groupedComments: Record<string, Comment[]> = {};
  comments.forEach((c) => {
    const monthYear = new Date(c.created_at).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    if (!groupedComments[monthYear]) groupedComments[monthYear] = [];
    groupedComments[monthYear].push(c);
  });

  return (
    <div className="timeline-container mt-3">
      {Object.entries(groupedComments).map(([monthYear, monthComments]) => (
        <div key={monthYear} className="mb-4">
          <h5 className="fw-bold text-primary mb-3 d-flex align-items-center">
            <FaUser className="me-2 text-secondary" />
            {first_name} {last_name} • {monthYear}
          </h5>

          <div className="timeline">
            {monthComments.map((c) => {
              const commentDate = new Date(c.created_at).toLocaleString();
              const manager_commented_at = c.manager_commented_at
                ? new Date(c.manager_commented_at).toLocaleString()
                : null;

              return (
                <div key={c.comment_id} className="timeline-item mb-4">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content ms-4">
                    {/* User Comment */}
                    <div className="d-flex align-items-start mb-2">
                      <div className="flex-shrink-0 me-2">
                        <div
                          className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "32px", height: "32px" }}
                        >
                          E
                        </div>
                      </div>
                      <div className="flex-grow-1 bg-light p-3 rounded shadow-sm position-relative">
                        <div className="d-flex justify-content-between mb-1 align-items-center">
                          <small className="text-muted">{commentDate}</small>

                          {user?.role === "market_manager" && (
                            <UserCommentEdit  comment_id={c.comment_id}/>
                          )}
                        </div>
                        <p className="mb-1">{c.comment_text}</p>
                      </div>
                    </div>

                    {/* Manager Comment */}
                    <div className="d-flex align-items-start mb-3">
                      <div className="flex-shrink-0 me-2">
                        <div
                          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "32px", height: "32px" }}
                        >
                          M
                        </div>
                      </div>
                      <div className="flex-grow-1 bg-light p-3 rounded shadow-sm position-relative">
                        <div className="d-flex justify-content-between mb-1 align-items-center">
                          <small className="text-muted">
                            {manager_commented_at ||
                              "Manager not commented yet"}
                          </small>
                          {user?.role === "market_manager" && (
                            <MarketManageredit comment_id={c.comment_id} />
                          )}
                        </div>
                        <p className="mb-1">
                          {c.manager_comment || "No comment provided."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <style jsx>{`
        .timeline {
          position: relative;
          margin-left: 20px;
          border-left: 2px solid #0d6efd;
        }
        .timeline-item {
          position: relative;
        }
        .timeline-marker {
          position: absolute;
          left: -10px;
          top: 10px;
          width: 12px;
          height: 12px;
          background: #0d6efd;
          border-radius: 50%;
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
