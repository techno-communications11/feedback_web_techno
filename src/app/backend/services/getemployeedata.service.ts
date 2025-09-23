import { ApiResponse } from "../types/form.types";
import { pool } from "@/lib/db";
import { GET_FULL_FORM_DETAILS_BY_APPLICANT_UUUID } from "../quaries/forms.queries";

export const GetformData = async (applicant_uuid: string): Promise<ApiResponse> => {
  try {
    const [result] = await pool.execute(GET_FULL_FORM_DETAILS_BY_APPLICANT_UUUID, [applicant_uuid]);

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
