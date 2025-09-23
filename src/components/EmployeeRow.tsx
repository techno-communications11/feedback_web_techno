import React from "react";
import { EmployeeForm } from "../app/services/employeeService";

interface Props {
  emp: EmployeeForm;
}

const EmployeeRow: React.FC<Props> = ({ emp }) => {
  // Format dates consistently

  // Conditional styling for CSAT (example: <70 = warning, <50 = danger)
  const getCSATColor = (csat: number) => {
    if (csat >= 90) return "text-success fw-bold";
    if (csat >= 70) return "text-warning";
    return "text-danger fw-bold";
  };

  // Conditional styling for Revenue (highlight top performers)
  const getRevenueColor = (revenue: number) => {
    if (revenue > 1000) return "text-primary fw-bold";
    if (revenue > 500) return "text-info";
    return "";
  };

  return (
    <tr
      className="align-middle text-center border-bottom border-light-subtle transition-all hover:bg-light hover:shadow-sm"
      style={{ cursor: "default" }}
    >
      {/* Form ID — subtle monospace for IDs */}

      {/* UUID — truncated with tooltip on hover */}

      {/* Names — semibold for readability */}
      <td className="px-3 py-3 fw-semibold text-start">{emp.first_name}</td>
      <td className="px-3 py-3 fw-semibold text-start">{emp.last_name}</td>

      {/* NTID — monospace, subtle */}
      <td className="px-3 py-3 fw-mono text-muted">{emp.ntid}</td>

      {/* Manager — combine names, subtle label style */}
      <td className="px-3 py-3">
        <span className="badge bg-light text-dark border border-secondary-subtle">
          {emp.market_manager_firstname} {emp.market_manager_lastname}
        </span>
      </td>

      {/* Numeric Metrics — right-align numbers for scanning */}
      <td className="px-3 py-3 fw-medium">{emp.hours_worked}</td>
      <td className="px-3 py-3 fw-medium">{emp.boxes_completed}</td>
      <td className="px-3 py-3 fw-medium">{emp.accessories_sold}</td>

      {/* Revenue — highlight high performers */}
      <td
        className={`px-3 py-3 fw-bold ${getRevenueColor(emp.feature_revenue)}`}
      >
        ${emp.feature_revenue.toLocaleString()}
      </td>

      {/* CSAT — color-coded */}
      <td className={`px-3 py-3 fw-bold ${getCSATColor(emp.csat)}`}>
        {emp.csat}%
      </td>

      {/* Retention metrics — subtle badges */}
      <td className="px-3 py-3">
        <span
          className={`badge ${
            emp.day_155_activation_retention ? "bg-success" : "bg-danger"
          }`}
        >
          {emp.day_155_activation_retention ? "Yes" : "No"}
        </span>
      </td>
      <td className="px-3 py-3 fw-medium">
        ${emp.day_155_future_mrc_retention.toLocaleString()}
      </td>
      <td className="px-3 py-3 fw-medium">${emp.comment_text}</td>
    </tr>
  );
};

export default EmployeeRow;
