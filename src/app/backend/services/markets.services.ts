import { pool } from "@/lib/db";
import { SELECT_ALL_MARKETS } from "../quaries/auth.queries";
import { ApiResponse } from "../types/form.types";
import { Market } from "../types/markets.types";

export const GetAllMarkets = async (): Promise<ApiResponse> => {
  try {
    const [result] = await pool.execute(SELECT_ALL_MARKETS);

    return {
      status: 200,
      message: "Markets fetched successfully",
      data: result as Market[],
    };
  } catch (error: any) {
    console.error("Fetch ERROR:", error);
    return {
      status: 500,
      message: "Failed to fetch markets",
      error: error.message || "Unknown error",
    };
  }
};
