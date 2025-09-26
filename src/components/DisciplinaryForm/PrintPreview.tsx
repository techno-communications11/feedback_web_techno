import { useRef } from "react";
import { motion } from "framer-motion";
import { drawCanvas } from "./healpers/drawCanvas";
import { User } from "@/constants/writeup.constants";

interface PrintPreviewProps {
  selectedUser: User;
  formData: any;
  letterheadImgSrc: string;
}

const PrintPreview = ({ selectedUser, formData, letterheadImgSrc }: PrintPreviewProps) => {
  const printCanvasRef = useRef<HTMLCanvasElement>(null);

   const handlePrint = async () => {
    await drawCanvas(printCanvasRef, formData, letterheadImgSrc);

    const canvas = printCanvasRef.current;
    if (!canvas) return;

    // Convert canvas to Blob
    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b as Blob), "image/png")
    );

    // Send Blob to backend
    const formDataObj = new FormData();
    formDataObj.append("file", blob, `disciplinary-${Date.now()}.png`);
    formDataObj.append("ntid", selectedUser.ntid);

    const res = await fetch("/api/upload-doc", {
      method: "POST",
      body: formDataObj,
    });

    const data = await res.json();
    console.log("✅ Uploaded to S3:", data.url);
  };

  return (
    <>
      <canvas ref={printCanvasRef} style={{ display: "none" }} />
      <div className="text-center">
        <motion.button
          type="button"
          className="btn btn-primary rounded-pill px-4 py-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrint}
        >
          Print Document
        </motion.button>
      </div>
    </>
  );
};

export default PrintPreview;
