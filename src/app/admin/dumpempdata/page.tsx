"use client";
import React, { useState } from "react";
import { categories } from "../admin.constants";
import { dumpFormData } from "../../services/dumpformdataService";
import Spinners from "../../../components/Spinners";

function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setMessage(null);

    const result = await dumpFormData(file);
    setMessage(
      result.success ? `✅ ${result.message}` : `⚠️ ${result.message}`
    );

    setLoading(false);
  };

  return (
    <div
      className="d-flex flex-column"
      style={{
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* Header */}
      <div className="text-center py-2 bg-white border-bottom">
        <h1 className="display-6 fw-bold mb-1">Employee Import</h1>
        <p className="text-muted small mb-0">
          Upload your Excel/CSV file following the format below
        </p>
      </div>

      {/* Main Content Area — Flex Row */}
      <div className="row g-0 flex-grow-1" style={{ overflow: "hidden" }}>
        {/* Left Side - Format Guide (Scrollable) */}
        <div className="col-lg-7 d-flex flex-column">
          <div
            className="bg-light p-2 overflow-auto"
            style={{
              height: "100%",
              borderTop: "1px solid #eee",
            }}
          >
            <h5 className="fw-bold mb-2">📄 Required Format</h5>
            <p className="text-danger">
              {" "}
              Note*: This is the required format for uploading your excel file{" "}
              <br /> I mean to say is the column should be with the same names or <br/> download the example file  format above the choose file  option right side 
            </p>
            {categories.map((cat, i) => (
              <div key={i} className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <span className="me-2 fs-5">{cat.icon}</span>
                  <h6 className="fw-bold mb-0">{cat.title}</h6>
                </div>
                <div className="row g-3">
                  {cat.fields.map((f, idx) => (
                    <div key={idx} className="col-6 col-md-4">
                      <div
                        className="p-3 border rounded-2 text-center fw-medium text-dark"
                        style={{
                          background: cat.color,
                          transition: "transform 0.2s ease",
                          fontSize: "0.875rem",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.02)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        {f.replace(/_/g, " ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Upload Card (Fixed Height Friendly) */}
        <div className="col-lg-5 d-flex">
          <div
            className="card border-0  rounded-0 w-100 d-flex flex-column"
            style={{
              margin: 0,
              maxHeight: "70%",
            }}
          >
            <div className="card-body d-flex flex-column">
              <h5 className="fw-bold mb-2">📤 Upload File</h5>

              {/* Drag & Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-3  text-center  flex-grow-1 d-flex flex-column justify-content-center align-items-center ${
                  dragActive
                    ? "border-primary bg-light"
                    : "border-gray-300 bg-white"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                  minHeight: "80px",
                }}
              >
                <div className="mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    fill="currentColor"
                    className="bi bi-cloud-arrow-up text-muted"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"
                    />
                    <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.318 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.949 15 9.773c0-1.266-1.433-2.416-3.111-2.665l-.445-.066v-.448c0-.616-.398-1.403-1.153-2.056z" />
                  </svg>
                </div>
                <p className="text-muted mb-1">
                  Drag & drop your file here, or click to browse
                </p>
                <p className="small text-muted mb-1">
                  Supports: <code>.xlsx, .xls, .csv</code>
                </p>
                <button
                  className="btn btn-primary my-2"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = "/example-format.xlsx"; // file path inside public folder
                    link.download = "example-format.xlsx"; // suggested filename
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Download Example Format File
                </button>

                <input
                  type="file"
                  className="form-control d-none"
                  id="file-upload"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  className="btn btn-outline-secondary btn-sm"
                >
                  Choose File
                </label>
                {file && (
                  <div className="mt-1">
                    <span className="badge bg-success">
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <button
                className="btn btn-primary w-100  fw-bold rounded-3 d-flex align-items-center justify-content-center"
                onClick={handleUpload}
                disabled={!file || loading}
                style={{
                  transition: "all 0.3s ease",
                  opacity: !file || loading ? 0.7 : 1,
                  cursor: !file || loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <Spinners text="Uploading..." />
                ) : (
                  "📤 Upload & Import"
                )}
              </button>

              {/* Feedback Message */}
              {message && (
                <div
                  className={`mt-3 p-2 text-center rounded-2 fw-medium ${
                    message.includes("✅")
                      ? "bg-success bg-opacity-10 text-success"
                      : "bg-danger bg-opacity-10 text-danger"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
