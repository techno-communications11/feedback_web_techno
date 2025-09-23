import { ApiResponse } from "../types/form.types";
import { pool } from "@/lib/db";
import { GET_USERNAMES_FROM_FORMS } from "../quaries/forms.queries";

export const GetUserNames = async (): Promise<ApiResponse> => {
  try {
    const [result] = await pool.execute(GET_USERNAMES_FROM_FORMS);

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
