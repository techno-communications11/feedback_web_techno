import { NextResponse } from "next/server";
import { GetAllMarkets } from "../services/markets.services";

export async function GET() {
  try {
    const result = await GetAllMarkets();
    // Use result.status only if it's a valid HTTP status
    return NextResponse.json(result, { status: result.status || 200 });
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
