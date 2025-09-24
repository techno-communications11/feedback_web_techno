import React from "react";
import { EmployeeForm } from "../app/services/employeeService";
import EmployeeRow from "./EmployeeRow";

interface Props {
  data: EmployeeForm[];
  isLoading?: boolean;
}

const EmployeeTable: React.FC<Props> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="jira-table-container">
        <table className="jira-table">
          <thead>
            <tr>
              <th colSpan={15} className="text-center py-4">
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
        <div className="spinner-border"></div>
      </div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
    );
  }

  console.log(data, "data in table component"); 

  if (data.length === 0) {
    return (
      <div className="jira-table-container">
        <table className="jira-table">
          <thead>
            <tr>
              <th colSpan={15} className="text-center py-5 text-muted">
                <i className="bi bi-clipboard-x me-2"></i>
                No records found.
              </th>
            </tr>
          </thead>
        </table>
      </div>
    );
  }

  return (
    <div className="jira-table-container">
      <table className="jira-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>NTID</th>
            <th>Manager Name</th>
            <th>Hours Worked</th>
            <th>Boxes Completed</th>
            <th>Accessories Sold</th>
            <th>Feature Revenue </th>
            <th>CSAT</th>
            <th>D155 Act.</th>
            <th>D155 MRC</th>
            <th>Comments</th>
            <th>Created at</th>
          </tr>
        </thead>
        <tbody>
          {data.map((emp) => (
            <EmployeeRow key={emp.form_id} emp={emp} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;