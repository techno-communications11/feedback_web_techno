export interface CommentData {
  ntid:string,
  form_uuid: number;
  comment_text: string;
  manager_comment: string;
  text?: "employee" | "market_manager"; // union type
}
