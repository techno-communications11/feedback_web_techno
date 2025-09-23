"use client";
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { fetchComments, Comment } from "../../services/readCommenstService";

interface CommentsDataProps {
  applicant_uuid?: string;
  first_name?: string;
  last_name?: string;
}

export default function Commentsdata({
  applicant_uuid,
  first_name,
  last_name,
}: CommentsDataProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getComments = async () => {
      if (!applicant_uuid) return;
      setLoading(true); // start loading
      const data = await fetchComments(applicant_uuid);
      setComments(data);
      setLoading(false); // end loading
    };
    getComments();
  }, [applicant_uuid]);

  if (!applicant_uuid) return <p className="text-muted">No user selected.</p>;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
        <div className="spinner-border"></div>
      </div>
      
    );
  }

  if (comments.length === 0) return <p className="text-muted">No comments found.</p>;

  // Group comments by year
  const groupedByYear: Record<string, Comment[]> = {};
  comments.forEach((c) => {
    const year = new Date(c.created_at).getFullYear().toString();
    if (!groupedByYear[year]) groupedByYear[year] = [];
    groupedByYear[year].push(c);
  });

  return (
    <div className="timeline-container mt-3">
      {Object.entries(groupedByYear).map(([year, yearComments]) => (
        <div key={year} className="mb-4">
          <h5 className="fw-bold text-primary mb-3 d-flex align-items-center">
            <FaUser className="me-2 text-secondary" />
            {first_name} {last_name} • {year}
          </h5>
          <div className="timeline">
            {yearComments.map((c) => {
              const date = new Date(c.created_at);
              const month = date.toLocaleString("default", { month: "long" });
              const day = date.getDate();

              return (
                <div key={c.comment_id} className="timeline-item mb-4">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content ms-4">
                    <div className="small text-muted mb-1">
                      {day} {month}
                    </div>
                    <p className="mb-1">{c.comment_text}</p>
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
          top: 4px;
          width: 12px;
          height: 12px;
          background: #0d6efd;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}
