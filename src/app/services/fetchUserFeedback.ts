// src/services/form.service.ts
export interface Feedback {
  comment_id:number;
  comment: string;
  created_at: string;
  user: string;
}

interface FetchFormCommentsProps {
 applicant_uuid: string;
  month: number;
  year: number;
}

export async function fetchFormComments({
 applicant_uuid,
  month,
  year,
}: FetchFormCommentsProps): Promise<Feedback[]> {
   const response = await fetch(
    `/api/form?applicant_uuid=${applicant_uuid}&month=${month}&year=${year}`,
    { headers: { "Content-Type": "application/json" } }
  );
  // console.log(response);

  if (!response.ok) {
    throw new Error(`Failed to fetch feedback: ${response.statusText}`);
  }

  return response.json();
}
