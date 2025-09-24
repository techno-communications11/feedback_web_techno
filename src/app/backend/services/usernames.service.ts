import { ApiResponse } from "../types/form.types";
import { pool } from "@/lib/db";
import { GET_USERNAMES_FROM_FORMS, GET_USERNAMES_FROM_FORMS_BY_MARKET } from "../quaries/forms.queries";

export const GetUserNames = async ({ market_id }: { market_id?: number | string }): Promise<ApiResponse> => {
  try {
    let result;

    if (market_id !==0) {
      // market_id exists → filter by market
      [result] = await pool.execute(GET_USERNAMES_FROM_FORMS_BY_MARKET, [market_id]);
    } else {
      // no market_id → fetch all
      [result] = await pool.execute(GET_USERNAMES_FROM_FORMS);
    }

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
