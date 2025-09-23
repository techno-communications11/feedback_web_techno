export interface Notification {
  notification_id: string;
  form_id: string;
  role: "employee" | "admin" | "market_manager"; // strict typing
  type: "new_assignment" | "comment_added";
  is_read: boolean;
  created_at: Date;
}



export const fetchEmployeeNotification = async (applicantUuid: string): Promise<Notification[]> => {
  try {
    const res = await fetch(`/api/getnotification?applicant_uuid=${applicantUuid}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to fetch data");
    return json.data;
  } catch (err: any) {
    console.error("EmployeeService error:", err.message);
    throw err;
  }
};
