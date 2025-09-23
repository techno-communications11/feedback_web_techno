import { NextRequest, NextResponse } from "next/server";
import { GetformData } from "../services/getemployeedata.service";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // 👇 Correct param name
    const applicant_uuid = searchParams.get("applicant_uuid");

    if (!applicant_uuid) {
      return NextResponse.json(
        { status: 400, message: "applicant_uuid is required" },
        { status: 400 }
      );
    }

    const result = await GetformData(applicant_uuid);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
