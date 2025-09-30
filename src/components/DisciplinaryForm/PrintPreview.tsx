"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { drawCanvas } from "./healpers/drawCanvas";
import { User } from "@/constants/writeup.constants";
import { useAuth } from "@/context/AuthContext";

interface PrintPreviewProps {
  selectedUser: User;
  formData: any;
  letterheadImgSrc: string;
}

const PrintPreview = ({
  selectedUser,
  formData,
  letterheadImgSrc,
}: PrintPreviewProps) => {
  const { triggerDocsRefresh } = useAuth();
  const printCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Data validation
  const validateFormData = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (!selectedUser?.ntid?.trim()) errors.push("NTID is required");
    if (!formData?.employeeName?.trim())
      errors.push("Employee name is required");
    if (!formData?.date?.trim()) errors.push("Date of issue is required");
    if (!formData?.companyStatement?.trim())
      errors.push("Company statement is required");
    if (!formData?.supervisorName?.trim())
      errors.push("Supervisor name is required");
    return { isValid: errors.length === 0, errors };
  };

  const handleUpload = async () => {
    const validation = validateFormData();
    if (!validation.isValid) {
      alert(
        `Please fix the following errors:\n• ${validation.errors.join("\n• ")}`
      );
      return;
    }

    setIsProcessing(true);

    try {
      const canvas = printCanvasRef.current;
      if (!canvas) throw new Error("Canvas element not found");

      // Draw content to canvas
      await drawCanvas(
        printCanvasRef as React.RefObject<HTMLCanvasElement>,
        formData,
        letterheadImgSrc
      );

      // Convert canvas to Blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) =>
            b
              ? resolve(b)
              : reject(new Error("Failed to convert canvas to image")),
          "image/png"
        );
      });

      // Prepare FormData for upload
      const uploadData = new FormData();
      uploadData.append(
        "file",
        blob,
        `disciplinary-${selectedUser.ntid}-${Date.now()}.png`
      );
      uploadData.append("ntid", selectedUser.ntid);

      // Upload to backend
      const response = await fetch("/api/upload-doc", {
        method: "POST",
        body: uploadData,
      });

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {}
        throw new Error(
          errorData?.message || `Upload failed: ${response.status}`
        );
      }

      let result: any = {};
      try {
        result = await response.json();
      } catch {
        result = {};
      }

      console.log(
        "✅ Document uploaded successfully:",
        result.url ?? "No URL returned"
      );
      alert("Document uploaded successfully!");

      triggerDocsRefresh(); // ✅ tells DisciplinaryData to refresh
    } catch (error: any) {
      console.error("❌ Upload error:", error);
      alert(`Failed to upload document: ${error.message || "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <canvas
        ref={printCanvasRef}
        style={{ display: "none" }}
        aria-hidden="true"
      />
      <div className="text-center mt-4">
        <motion.button
          type="button"
          className="btn btn-primary rounded-pill px-4 py-2"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUpload}
          disabled={isProcessing}
          aria-busy={isProcessing}
        >
          {isProcessing ? (
            <>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Uploading...
            </>
          ) : (
            "Upload Document"
          )}
        </motion.button>
      </div>
    </>
  );
};

export default PrintPreview;
