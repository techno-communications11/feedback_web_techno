import { INSERT_COMMENT, GET_COMMENTS_BY_APPLICANT_UUID, GET_COMMENTS_BY_FORM_ID } from "../quaries/comments.queries";
import { ApiResponse } from "../types/form.types";
import { CommentData } from "../types/comments.types"; 
import { pool } from "@/lib/db";

export const addComment = async (comment: CommentData, version: number = 1): Promise<ApiResponse> => {
  const connection = await pool.getConnection(); // get connection for transaction

  try {
    await connection.beginTransaction();

    // Lock row for this form_id so no other transaction can insert simultaneously
    const [rows]: any = await connection.execute(GET_COMMENTS_BY_FORM_ID + " FOR UPDATE", [comment.form_id]);

    if (rows.length > 0) {
      await connection.rollback();
      return {
        status: 400,
        message: "Comment already exists for this form",
      };
    }

    // Insert new comment
    const values = [
      comment.form_id,
      comment.applicant_uuid,
      comment.comment_text,
      version,
    ];

    const [result] = await connection.execute(INSERT_COMMENT, values);
    const saveddata = await getComment(comment.applicant_uuid);
     console.log("SAVED DATA:", saveddata);

    await connection.commit();

    return {
      status: 200,
      message: "Comment added successfully",
      data: saveddata.data ? saveddata.data[0] : null,
    };
  } catch (error: any) {
    await connection.rollback();
    return {
      status: 500,
      message: "Failed to add comment",
      error: error.message || "Unknown error",
    };
  } finally {
    connection.release();
  }
};

export const getComment = async (applicant_uuid: string): Promise<ApiResponse> => {
  const connection = await pool.getConnection();
  try {
    const [rows]: any = await connection.execute(GET_COMMENTS_BY_APPLICANT_UUID, [applicant_uuid]);
    return { status: 200, message: "Comments fetched successfully", data: rows };
  } catch (error: any) {
    console.error("GET COMMENTS ERROR:", error);
    return { status: 500, message: "Failed to fetch comments", error: error.message || "Unknown error" };
  }
  finally {
    connection.release();
  }
};