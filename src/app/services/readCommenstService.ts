// src/services/comments.service.ts
export interface Comment {
  comment_id: number;
  form_uuid: number;
  ntid: string;
  comment_text: string;
  manager_comment:string
  created_at: string;
  manager_commented_at:string
}

// Fetch comments for a specific applicant
export const fetchComments = async (ntid?: string): Promise<Comment[]> => {
  if (!ntid) return [];

  try {
    const res = await fetch(`/api/comments?ntid=${ntid}`);
    const data = await res.json();

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
