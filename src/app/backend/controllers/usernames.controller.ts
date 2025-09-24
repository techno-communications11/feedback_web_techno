import { NextResponse, NextRequest } from "next/server";
import { GetUserNames } from "../services/usernames.service";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl; // use nextUrl instead of new URL(req.url)
    const searchParams = url.searchParams;

    // Parse market_id as integer
    const market_id_param = searchParams.get("market_id");
    const market_id = market_id_param ? parseInt(market_id_param, 10) : undefined;

    if (market_id_param && isNaN(market_id!)) {
      return NextResponse.json(
        { status: 400, message: "Invalid market_id" },
        { status: 400 }
      );
    }

    const result = await GetUserNames({ market_id });

    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { status: 500, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

