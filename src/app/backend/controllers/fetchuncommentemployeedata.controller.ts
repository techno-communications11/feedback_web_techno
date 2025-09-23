import { NextRequest, NextResponse } from "next/server";
import { GetUncommentedformData } from "../services/getuncommentedemployeedata.service";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // 👇 Correct param name
    const form_id = searchParams.get("form_id");
    console.log(form_id,'uuuuuu')


    if (!form_id) {
      return NextResponse.json(
        { status: 400, message: "applicant_uuid is required" },
        { status: 400 }
      );
    }

    const result = await GetUncommentedformData(form_id);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
