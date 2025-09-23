import { ApiResponse } from "../types/form.types";
import { pool } from "@/lib/db";
import { GET_FORMS_WITHOUT_COMMENTS_BY_FORM_ID } from "../quaries/forms.queries";

export const GetUncommentedformData = async (form_id: string): Promise<ApiResponse> => {
  try {
    const [result] = await pool.execute(GET_FORMS_WITHOUT_COMMENTS_BY_FORM_ID, [form_id]);

    return {
      status: 200,
      message: "Data fetched successfully",
      data: result,
    };
  } catch (error: any) {
    console.error("Fetch ERROR:", error);
    return {
      status: 500,
      message: "Failed to fetch form",
      error: error.message || "Unknown error",
    };
  }
};
