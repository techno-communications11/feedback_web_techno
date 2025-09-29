import { pool } from "@/lib/db";
import { CommentData, ApiResponse } from "../types/comments.types";
import {
  INSERT_COMMENT_EMPLOYEE,
  INSERT_COMMENT_MANAGER,
  UPDATE_MANAGER_COMMENT,
  GET_COMMENTS_BY_NTID,
  GET_LATEST_COMMENT_BY_FORM_UUID,
} from "../quaries/comments.queries";

export const addComment = async (
  comment: CommentData
): Promise<ApiResponse> => {
  const connection = await pool.getConnection();
  try {
    if (comment.type === "employee") {
      const [result] = await connection.execute(INSERT_COMMENT_EMPLOYEE, [
        comment.form_uuid,
        comment.comment_text,
        comment.ntid,
      ]);
      return {
        status: 200,
        message: "Employee comment added successfully",
        data: result,
      };
    }
     console.log(comment.form_uuid);

    if (comment.type === "manager") {
      const [existingComments] = await connection.query<CommentData[]>(
        GET_LATEST_COMMENT_BY_FORM_UUID,
        [comment.form_uuid]
      );
     console.log(existingComments[0]);

      if (existingComments.length > 0) {
        const [result] = await connection.execute(UPDATE_MANAGER_COMMENT, [
          comment.manager_comment,
          comment.form_uuid,
          existingComments[0].comment_id,
        ]);
        return {
          status: 200,
          message: "Manager comment updated successfully",
          data: result,
        };
      } else {
        const [result] = await connection.execute(INSERT_COMMENT_MANAGER, [
          comment.form_uuid,
          comment.manager_comment,
          comment.ntid,
        ]);
        return {
          status: 200,
          message: "Manager comment added successfully",
          data: result,
        };
      }
    }

    return { status: 400, message: "Invalid comment type" };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return {
      status: 500,
      message: "Failed to add comment",
      error: errorMessage,
    };
  } finally {
    connection.release();
  }
};

export const getComment = async (
  ntid: string
): Promise<ApiResponse<CommentData[]>> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute<CommentData[]>(
      GET_COMMENTS_BY_NTID,
      [ntid]
    );
    return {
      status: 200,
      message: "Comments fetched successfully",
      data: rows,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return {
      status: 500,
      message: "Failed to fetch comments",
      error: errorMessage,
    };
  } finally {
    connection.release();
  }
};
