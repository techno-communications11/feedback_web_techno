import React from "react";

interface CustomAlertProps {
  message: string;
  onClose: () => void;
  type?: "success" | "error" | "warning"; // optional, defaults to success
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  message,
  onClose,
  type = "success",
}) => {
  // Set background color based on type
  const backgroundColor = {
    success: "#4CAF50",
    error: "#f44336",
    warning: "#ff9800",
  }[type];

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor,
        color: "white",
        padding: "25px 40px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
      }}
    >
      <span style={{ marginRight: "20px" }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          backgroundColor: "transparent",
          border: "none",
          color: "white",
          fontSize: "16px",
          cursor: "pointer",
        }}
        aria-label="Close alert"
      >
        ×
      </button>
    </div>
  );
};

export default CustomAlert;
