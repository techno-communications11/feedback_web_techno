// src/services/form.service.ts
export interface Feedback {
  comment_id:number;
  comment: string;
  created_at: string;
  user: string;
}

interface FetchFormCommentsProps {
  first_name: string;
  last_name: string;
  month: number;
  year: number;
}

export async function fetchFormComments({
  first_name,
  last_name,
  month,
  year,
}: FetchFormCommentsProps): Promise<Feedback[]> {
  const response = await fetch(
    `/api/form?first_name=${first_name}&last_name=${last_name}&month=${month}&year=${year}`,
    { headers: { "Content-Type": "application/json" } }
  );
  // console.log(response);

  if (!response.ok) {
    throw new Error(`Failed to fetch feedback: ${response.statusText}`);
  }

  return response.json();
}
