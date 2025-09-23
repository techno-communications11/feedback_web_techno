import { NextResponse } from "next/server";
import { GetUserNames } from "../services/usernames.service";

export async function GET() {
  try {
    const result = await GetUserNames();
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
