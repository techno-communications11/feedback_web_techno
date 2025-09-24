import React from "react";
import ProtectedRoute from "@/context/ProtectedRoute";
import AdminPage from "../admin/page";

function page() {
  return (
    <ProtectedRoute allowedRoles={["market_manager"]}>
      <div>
        <AdminPage />
      </div>
    </ProtectedRoute>
  );
}

export default page;
