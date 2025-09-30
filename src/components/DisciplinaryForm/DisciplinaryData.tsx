import React, { useEffect, useState, useCallback } from "react";
import { Months } from "@/app/admin/admin.constants";
import Spinners from "../Spinners";
import { useAuth } from "@/context/AuthContext";

interface User {
  ntid: string;
  first_name: string;
  last_name: string;
}

interface Document {
  name: string;
  createdAt: string;
  url: string;
}

interface SelectedUserProps {
  selectedUser: User | null;
}

export default function DisciplinaryData({ selectedUser }: SelectedUserProps) {
  const { docsRefreshKey } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!selectedUser?.ntid) {
      setDocuments([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/get-user-docs?ntid=${encodeURIComponent(selectedUser.ntid)}`
      );
      if (!response.ok) throw new Error("Failed to fetch documents");

      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Invalid response format");

      const validDocuments = data.filter(
        (doc): doc is Document =>
          doc &&
          typeof doc.name === "string" &&
          typeof doc.createdAt === "string" &&
          typeof doc.url === "string"
      );

      setDocuments(validDocuments);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Failed to load documents. Please try again later.");
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments, docsRefreshKey]);

  const openModal = (doc: Document) => {
    setSelectedDoc(doc);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDoc(null);
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    if (modalOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [modalOpen]);

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "20px auto",
        padding: "0 16px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h3
          style={{ color: "#E10174", marginBottom: "12px", fontSize: "22px" }}
        >
          Write-ups History
        </h3>
        {selectedUser ? (
          <p style={{ fontSize: "16px", fontWeight: 600, margin: "8px 0" }}>
            {selectedUser.first_name} {selectedUser.last_name} –{" "}
            <strong>{selectedUser.ntid}</strong>
          </p>
        ) : (
          <p style={{ fontSize: "16px", color: "#777" }}>No user selected</p>
        )}
        <p style={{ fontSize: "14px", color: "#666" }}>
          Total Write-Ups: <strong>{documents.length}</strong>
        </p>
      </div>

      {loading ? (
        <Spinners text="loading..." />
      ) : error ? (
        <div
          style={{
            textAlign: "center",
            color: "#d32f2f",
            padding: "20px",
            background: "#ffebee",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      ) : documents.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {documents.map((doc) => {
            const date = new Date(doc.createdAt);
            const monthObj = Months.find((m) => m.id === date.getMonth() + 1);
            const monthName = monthObj ? monthObj.Month : "";

            const handlePrint = () => {
              const printWindow = window.open("", "_blank");
              if (printWindow) {
                printWindow.document.write(`
        <html>
          <head>
            <title>Print Document</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; }
              img { max-width: 100%; height: auto; }
              @media print { body { margin: 0; } img { width: 100%; height: auto; } }
            </style>
          </head>
          <body>
            <img src="${doc.url}" onload="window.print(); setTimeout(() => window.close(), 500);" />
          </body>
        </html>
      `);
                printWindow.document.close();
              } else {
                alert("Please allow pop-ups to print the document.");
              }
            };

            return (
              <li
                key={doc.url}
                style={{
                  background: "#fff",
                  padding: "14px 16px",
                  borderRadius: "8px",
                  marginBottom: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  border: "1px solid #eee",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "70%",
                    wordBreak: "break-word",
                  }}
                  onClick={() => openModal(doc)}
                >
                  <span
                    style={{
                      color: "#E10174",
                      fontWeight: 600,
                      textDecoration: "underline",
                    }}
                  >
                    {monthName}
                  </span>
                  <span style={{ fontSize: "12px", color: "#777" }}>
                    {date.toLocaleDateString()}
                  </span>
                </div>

                <button
                  onClick={handlePrint}
                  style={{
                    background: "#E10174",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Print
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div
          style={{
            textAlign: "center",
            color: "#777",
            padding: "20px",
            background: "#fafafa",
            borderRadius: "8px",
          }}
        >
          No disciplinary documents found.
        </div>
      )}

      {modalOpen && selectedDoc && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.95)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            overflow: "auto", // allows scrolling/zooming if image is large
            padding: "20px",
          }}
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              background: "rgba(255,255,255,0.8)",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              fontSize: "24px",
              cursor: "pointer",
              fontWeight: "bold",
              zIndex: 10000,
            }}
          >
            ×
          </button>

          {/* Image */}
          <img
            src={selectedDoc.url}
            alt=""
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              cursor: "zoom-in",
              display: "block",
              margin: "auto",
            }}
            onClick={(e) => e.stopPropagation()} // prevents closing modal on image click
          />
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
