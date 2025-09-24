// src/services/comments.service.ts
export interface Comment {
  comment_id: number;
  form_id: number;
  applicant_uuid: string;
  comment_text: string;
  version: number;
  created_at: string;
}

// Fetch comments for a specific applicant
export const fetchComments = async (applicant_uuid?: string): Promise<Comment[]> => {
  if (!applicant_uuid) return [];

  try {
    const res = await fetch(`/api/comments?applicant_uuid=${applicant_uuid}`);
    const data = await res.json();

     console.log(data, "comments data from fetchComments");

    if (Array.isArray(data.data)) {
      // Sort by created_at descending
      return data.data.sort(
        (a: Comment, b: Comment) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return [];
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};
