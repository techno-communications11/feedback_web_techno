export interface CommentData {
  form_id: number;
  applicant_uuid: string;
  comment_text: string;
  manager_comment:string;
  field_name?: string;
}

export interface updateCommentData {
  comment_id: number;
  applicant_uuid: string;
  comment_text: string;
  manager_comment:string;
}
