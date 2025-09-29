import { ApiResponse } from "../types/form.types";
import { pool } from "@/lib/db";
import { GET_FULL_FORM_DETAILS_BY_APPLICANT_UUUID } from "../quaries/forms.queries";
import { RowDataPacket } from "mysql2/promise";

export const GetformData = async (applicant_uuid: string): Promise<ApiResponse> => {
  try {
    // Use RowDataPacket[] to type the result from MySQL
    const [rows] = await pool.execute<RowDataPacket[]>(
      GET_FULL_FORM_DETAILS_BY_APPLICANT_UUUID,
      [applicant_uuid]
    );

    return {
      status: 200,
      message: "Data fetched successfully",
      data: rows,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Fetch ERROR:", message);
    return {
      status: 500,
      message: "Failed to fetch form",
      error: message,
    };
  }
};
