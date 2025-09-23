export interface EmployeeForm {
  form_id: number;
  applicant_uuid: string;
  first_name: string;
  last_name: string;
  ntid: string;
  market_manager_firstname: string;
  market_manager_lastname: string;
  hours_worked: number;
  boxes_completed: number;
  accessories_sold: number;
  feature_revenue: number;
  csat: number;
  day_155_activation_retention: number;
  day_155_future_mrc_retention: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  comment_id: number;
  form_id: number;
  applicant_uuid: string;
  comment_text: string;
  version: number;
  created_at: string;
}

export const fetchEmployeeData = async (
  applicantUuid: string
): Promise<EmployeeForm[]> => {
  try {
    const res = await fetch(
      `/api/getemployeedata?applicant_uuid=${applicantUuid}`
    );
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to fetch data");
    return json.data;
  } catch (err: any) {
    console.error("EmployeeService error:", err.message);
    throw err;
  }
};

export const fetchUncommentedEmployeeData = async (
  form_id: string
): Promise<EmployeeForm[]> => {
  try {
    const res = await fetch(
      `/api/fetchUncommentedEmployeeData?form_id=${form_id}`
    );
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to fetch data");
    return json.data;
  } catch (err: any) {
    console.error("EmployeeService error:", err.message);
    throw err;
  }
};

export async function fetchAssignments(
  applicant_uuid: string
): Promise<EmployeeForm[]> {
  const res = await fetch(
    `/api/fetchUncommentedEmployeeData?applicant_uuid=${applicant_uuid}`
  );
  if (!res.ok) throw new Error("Failed to fetch assignments");
  const result = await res.json();
  return result.data || [];
}

export async function addComment(
  form_id: number,
  applicant_uuid: string,
  comment_text: string
): Promise<Comment> {
  const res = await fetch(`/api/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ form_id, applicant_uuid, comment_text, version: 1 }),
  });
  console.log(res,'res');

  const json = await res.json(); // full API response
  console.log("Response from addComment:", json);

  if (!res.ok) {
    throw new Error(json.message || "Failed to submit comment");
  }

  // ✅ Return only the saved comment object
  return json.data;
}

