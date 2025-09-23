import { NextResponse } from "next/server";
import { GetYears } from "../services/getyear.service";

export async function GET() {
  try {
    const result = await GetYears();
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
