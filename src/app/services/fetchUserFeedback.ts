// src/services/form.service.ts
export interface Feedback {
  comment_id?: number;
  comment_text?: string | null;
  manager_comment?: string | null;
  comment_by?: string | null;
  comment_created_at?: string | null;
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
  day_35_activation_retention: number | null;
  day_35_future_mrc_retention: number | null;
  day_65_activation_retention: number | null;
  day_65_future_mrc_retention: number | null;
  day_95_activation_retention: number | null;
  day_95_future_mrc_retention: number | null;
  day_125_activation_retention: number | null;
  day_125_future_mrc_retention: number | null;
  day_155_activation_retention: number | null;
  day_155_future_mrc_retention: number | null;
  created_at: string;
  updated_at: string;
  form_uuid: string;
  market_id: number;
}

interface FetchFormCommentsProps {
 ntid: string;
  month: number;
  year: number;
}

export async function fetchFormComments({
 ntid,
  month,
  year,
}: FetchFormCommentsProps): Promise<Feedback[]> {
   const response = await fetch(
    `/api/form?ntid=${ntid}&month=${month}&year=${year}`,
    { headers: { "Content-Type": "application/json" } }
  );


  if (!response.ok) {
    throw new Error(`Failed to fetch feedback: ${response.statusText}`);
  }

   // Extract the `data` array from the API response
  const result: { status: number; message: string; data: Feedback[] } =
    await response.json();

  return result.data || [];
}

 // In fetchUserFeedback.ts
// In fetchUserFeedback.ts
export const submitComments = async ({
  ntid,
  form_uuid,
  employeeComment,
  managerComment,
  type
}: {
  ntid:string,
  form_uuid: string;
  employeeComment?: string;
  managerComment?: string;
  type: 'employee' | 'manager';
}) => {
  const response = await fetch('/api/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ntid,
      form_uuid,
      comment_text: employeeComment,
      manager_comment: managerComment,
      type
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit comment');
  }
  
  return response.json();
};
