import React from "react";
import { EmployeeForm } from "../app/services/employeeService";
import EmployeeRow from "./EmployeeRow";

interface Props {
  data: EmployeeForm[];
  isLoading?: boolean; // Optional: for loading state
}

const EmployeeTable: React.FC<Props> = ({ data, isLoading = false }) => {
  // Optional: Show loading skeleton
  if (isLoading) {
    return (
      <div className="table-responsive shadow-sm rounded bg-white">
        <table className="table table-striped table-bordered mb-0">
          <thead className="table-dark">
            <tr>
              <th colSpan={15} className="text-center py-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
    );
  }

  // Optional: Show empty state
  if (data.length === 0) {
    return (
      <div className="table-responsive shadow-sm rounded bg-white">
        <table className="table table-striped table-bordered mb-0">
          <thead className="table-dark">
            <tr>
              <th colSpan={15} className="text-center py-4">
                <div className="text-muted">
                  <i className="bi bi-clipboard-x me-2"></i>
                  No employee records found.
                </div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
    );
  }

  return (
    <div className="table-responsive shadow-sm rounded border-0">
      <table className="table table-striped table-bordered table-hover align-middle mb-0">
        {/* PRO TIP: Use thead-light or thead-dark with subtle gradient */}
        <thead className="table-dark">
          <tr>
            
            <th scope="col" className="fw-bold text-nowrap text-center">
              First Name
            </th>
            <th scope="col" className="fw-bold text-nowrap text-center">
              Last Name
            </th>
            <th scope="col" className="fw-bold text-nowrap text-center">
              NTID
            </th>
            <th scope="col" className="fw-bold text-nowrap text-center">
              Manager Name
            </th>
           
            <th scope="col" className="fw-bold text-nowrap text-center">
              Hours Worked
            </th>
            <th scope="col" className="fw-bold text-nowrap text-center">
              Boxes Completed
            </th>
            <th scope="col" className="fw-bold text-nowrap text-center">
              Accessories Sold
            </th>
            <th scope="col" className="fw-bold text-nowrap text-center">
              Feature Revenue
            </th>
            <th scope="col" className="fw-bold text-nowrap text-center">
              CSAT
            </th>
            <th scope="col" className="fw-bold text-nowrap text-center">
              Day 155 Activation
            </th>
            <th scope="col" className="fw-bold text-nowrap text-center">
              Day 155 Future MRC
            </th>
            <th scope="col" className="fw-bold text-nowrap text-center">
              Comments
            </th>
            
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.map((emp) => (
            <EmployeeRow key={emp.form_id} emp={emp} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;