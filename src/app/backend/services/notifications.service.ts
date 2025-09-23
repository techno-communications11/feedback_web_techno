import { ApiResponse } from "../types/form.types";
import { pool } from "@/lib/db";
import { SELECT_NOTIFICATIONS_BY_APPLICANT } from "../quaries/notification.quaries";

export const GetEmployeeNotification = async (applicant_uuid: string): Promise<ApiResponse> => {
  try {
    const [result] = await pool.execute(SELECT_NOTIFICATIONS_BY_APPLICANT, [applicant_uuid]);
     console.log(result,'res');

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
