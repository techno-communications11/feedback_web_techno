"use client";

import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { fetchComments, Comment } from "../../services/readCommenstService";
import "../../styles/commentdata.css";
import { useAuth } from "@/context/AuthContext";

interface CommentsDataProps {
  ntid?: string;
  first_name?: string;
  last_name?: string;
}

  const CommentsData: React.FC<CommentsDataProps> = ({
  ntid,
  first_name,
  last_name,
}) => {
  const { commentsRefreshKey } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getComments = async () => {
      if (!ntid) return;
      setLoading(true);
      try {
        const data = await fetchComments(ntid);
        setComments(data || []);
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    };

    getComments();
  }, [ntid, commentsRefreshKey]);

  if (!ntid) {
    return (
      <p className="text-muted text-center py-3" role="alert">
        No user selected.
      </p>
    );
  }

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100px" }}
        role="status"
        aria-label="Loading comments"
      >
        <div className="spinner-border text-primary">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <p className="text-muted text-center py-3" role="alert">
        No comments found.
      </p>
    );
  }

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
    <div className="timeline-container mt-3 px-2 px-md-0">
      {Object.entries(groupedComments).map(([monthYear, monthComments]) => (
        <div key={monthYear} className="mb-4">
          <h5
            className="fw-bold text-primary mb-3 d-flex align-items-center flex-wrap"
            aria-label={`Comments for ${first_name} ${last_name} in ${monthYear}`}
          >
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "40px", height: "40px" }}
            >
              <FaUser />
            </div>
            <span className="ms-2 text-capitalize" aria-hidden="true">
              {first_name} {last_name}
            </span>

            <p className="mt-2 d-flex align-items-center">
              <MdOutlineAccessTimeFilled className="me-1" /> {monthYear}
            </p>
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
                  <div className="timeline-content ms-4 ms-md-5">
                    {/* Employee Comment */}
                    <div className="d-flex align-items-start mb-3">
                      <div
                        className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                        style={{
                          width: "32px",
                          height: "32px",
                          fontSize: "14px",
                        }}
                        aria-hidden="true"
                      >
                        E
                      </div>
                      <div className="flex-grow-1">
                        <small className="text-muted">{commentDate}</small>
                        <p className="mb-0">{c.comment_text}</p>
                      </div>
                    </div>

                    {/* Manager Comment */}
                    <div className="d-flex align-items-start mb-3">
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                        style={{
                          width: "32px",
                          height: "32px",
                          fontSize: "14px",
                        }}
                        aria-hidden="true"
                      >
                        M
                      </div>
                      <div className="flex-grow-1">
                        <small className="text-muted">
                          {manager_commented_at || "Manager not commented yet"}
                        </small>
                        <p className="mb-0">
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
    </div>
  );
};
 export default CommentsData
