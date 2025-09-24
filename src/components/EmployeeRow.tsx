import React from "react";
import { EmployeeForm } from "../app/services/employeeService";

interface Props {
  emp: EmployeeForm;
}

const EmployeeRow: React.FC<Props> = ({ emp }) => {
  const getCSATColor = (csat: number) => {
    if (csat >= 90) return "text-success";
    if (csat >= 70) return "text-warning";
    return "text-danger";
  };

  const getRevenueColor = (revenue: number) => {
    if (revenue > 1000) return "fw-bold text-primary";
    if (revenue > 500) return "text-info";
    return "";
  };

  return (
    <tr className="jira-table-row">
      <td className="fw-medium">{emp.first_name}</td>
      <td className="fw-medium">{emp.last_name}</td>
      <td className="text-muted font-monospace" style={{ fontSize: "0.9em" }}>
        {emp.ntid}
      </td>
      <td>
        <div className="d-inline-block px-2 py-1 bg-light border rounded text-nowrap">
          {emp.market_manager_firstname} {emp.market_manager_lastname}
        </div>
      </td>
      <td className="text-center fw-medium">{emp.hours_worked}</td>
      <td className="text-center fw-medium">{emp.boxes_completed}</td>
      <td className="text-center fw-medium">{emp.accessories_sold}</td>
      <td
        className={`text-center fw-medium ${getRevenueColor(emp.feature_revenue)}`}
      >
        ${emp.feature_revenue.toLocaleString()}
      </td>
      <td className={`text-center fw-medium ${getCSATColor(emp.csat)}`}>
        {emp.csat}
      </td>
      <td className="text-center">{emp.day_155_activation_retention}</td>
      <td className="text-center fw-medium">
        {emp.day_155_future_mrc_retention}
      </td>
      <td className="text-muted" style={{ fontSize: "0.9em" }}>
        {emp.comment_text || <span className="text-secondary">—</span>}
      </td>
      <td className="text-muted text-center" style={{ fontSize: "0.9em" }}>
        {emp.created_at ? (
          new Date(emp.created_at).toLocaleDateString("en-US") // MM/DD/YYYY
        ) : (
          <span className="text-secondary">—</span>
        )}
      </td>
    </tr>
  );
};

export default EmployeeRow;
