import React from "react";
import { Spinner } from "react-bootstrap";

interface SpinnersProps {
  text: string;
}

function Spinners({ text }: SpinnersProps) {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "300px" }}
    >
      <Spinner animation="border" variant="primary" />
      <span className="ms-2">{text}</span>
    </div>
  );
}

export default Spinners;
