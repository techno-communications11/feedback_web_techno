import { CommentData, updateCommentData } from "../types/comments.types";
import { ApiResponse } from "../types/form.types";
import { pool } from "@/lib/db";

import { UPDATE_COMMENT_BY_MANAGER ,UPDATE_COMMENT_BY_COMMENT_ID} from "../quaries/comments.queries";

export const addComment = async (
  managerComment: CommentData
): Promise<ApiResponse> => {
  try {
    const values = [managerComment.manager_comment, managerComment.form_id];

    const [result] = await pool.execute(UPDATE_COMMENT_BY_MANAGER, values);

    return {
      status: 200,
      message: "Comment updated successfully",
      data: { ...managerComment },
    };
  } catch (error: any) {
    return {
      status: 500,
      message: "Failed to update comment",
      error: error.message || "Unknown error",
    };
  }
};
export const updatedComment = async (
  managerComment: updateCommentData & { comment_id?: number }
): Promise<ApiResponse> => {  
  try {
    const values = [
      managerComment.manager_comment,
      managerComment.comment_id,
    ];
    const [result] = await pool.execute(UPDATE_COMMENT_BY_COMMENT_ID, values);

    return {
      status: 200,
      message: "Comment updated successfully",
      data: { ...managerComment },
    };
  }

    catch (error: any) {
    return {
      status: 500,
      message: "Failed to update comment",
      error: error.message || "Unknown error",
    };
  }
};


