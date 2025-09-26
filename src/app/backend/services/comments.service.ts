

import { 
  INSERT_COMMENT_EMPLOYEE,
  INSERT_COMMENT_MANAGER,
  UPDATE_MANAGER_COMMENT,
  GET_COMMENTS_BY_NTID
} from "../quaries/comments.queries";
import { ApiResponse } from "../types/form.types";
import { CommentData } from "../types/comments.types"; 
import { pool } from "@/lib/db";

export const addComment = async (comment: CommentData, type: string): Promise<ApiResponse> => {
  try {
    console.log(comment,'cccccccc')
    if (type === "employee") {
      // Insert new employee comment
      const [result] = await pool.execute(INSERT_COMMENT_EMPLOYEE, [
        comment.form_uuid,
        comment.comment_text,
        comment.ntid
      ]);
      
      return {
        status: 200,
        message: "Employee comment added successfully",
        data: result
      };
    } else if (type === "manager") {
      // Check if comment already exists for this form_uuid
      const [existingComments]: any = await pool.execute(
        'SELECT comment_id FROM comments WHERE form_uuid = ? ORDER BY created_at DESC LIMIT 1',
        [comment.form_uuid]
      );
      
      if (existingComments.length > 0) {
        // Update existing comment with manager comment
        const [result] = await pool.execute(UPDATE_MANAGER_COMMENT, [
          comment.manager_comment,
          comment.form_uuid,
          existingComments[0].comment_id
        ]);
        
        return {
          status: 200,
          message: "Manager comment updated successfully",
          data: result
        };
      } else {
        // Create new comment with manager comment
        const [result] = await pool.execute(INSERT_COMMENT_MANAGER, [
          comment.form_uuid,
          comment.manager_comment,
          comment.ntid
        ]);
        
        return {
          status: 200,
          message: "Manager comment added successfully",
          data: result
        };
      }
    } else {
      throw new Error("Invalid comment type");
    }
  } catch (error: any) {
    console.error("Error in addComment:", error);
    return {
      status: 500,
      message: "Failed to add comment",
      error: error.message || "Unknown error",
    };
  } 
};

export const getComment = async (ntid: string): Promise<ApiResponse> => {
  const connection = await pool.getConnection();
  try {
    const [rows]: any = await connection.execute(GET_COMMENTS_BY_NTID, [ntid]);
    return { status: 200, message: "Comments fetched successfully", data: rows };
  } catch (error: any) {
    console.error("GET COMMENTS ERROR:", error);
    return { status: 500, message: "Failed to fetch comments", error: error.message || "Unknown error" };
  }
  finally {
    connection.release();
  }
};

