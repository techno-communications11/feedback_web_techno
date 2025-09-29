
import { RowDataPacket } from "mysql2/promise";
export interface CommentData extends RowDataPacket {
  comment_id?: number;
  ntid: string;
  form_uuid: string;
  comment_text?: string;
  manager_comment?: string;
  type?: "employee" | "manager";
}

export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  error?: string;
}
 
