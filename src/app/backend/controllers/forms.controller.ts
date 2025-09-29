import { NextRequest, NextResponse } from "next/server";
import {
  createForm,
  getFormCommentsByUserMonthYear,
} from "../services/forms.service";
import { FormData } from "../types/form.types";
import { ApiResponse } from "../types/comments.types";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: FormData = await req.json();

    if (!body.first_name) {
      return NextResponse.json(
        { message: "Invalid form data" },
        { status: 400 }
      );
    }

    const result: ApiResponse = await createForm(body);

    if (result.status >= 400) {
      return NextResponse.json(
        { message: result.message, error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json(
      { message: result.message, data: result.data },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Server error", error: message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(req.url);
    const ntid = url.searchParams.get("ntid");
    const month = url.searchParams.get("month");
    const year = url.searchParams.get("year");

    if (!ntid || !month || !year) {
      return NextResponse.json(
        {
          status: 400,
          message: "NTID, month, and year are required",
        },
        { status: 400 }
      );
    }

    const result: ApiResponse = await getFormCommentsByUserMonthYear({
      ntid,
      month: Number(month),
      year: Number(year),
    });

    return NextResponse.json(result, { status: result.status || 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("FORM COMMENTS FETCH ERROR:", message);
    return NextResponse.json(
      { status: 500, message: "Server error", error: message },
      { status: 500 }
    );
  }
}
