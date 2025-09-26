import { NextRequest, NextResponse } from "next/server";
import {
  createForm,
  getFormCommentsByUserMonthYear,
} from "../services/forms.service";
import { FormData,  } from "../types/form.types";


export async function POST(req: NextRequest) {
  try {
    const body: FormData = await req.json();

    if (!body.first_name) {
      return NextResponse.json(
        { message: "Invalid form data" },
        { status: 400 } // <-- HTTP status explicitly here
      );
    }

    const result = await createForm(body);
    console.log(result, "ress");

    if (result.status && result.status >= 400) {
      // explicitly send HTTP status from createForm
      return NextResponse.json(
        { message: result.message }, 
        { status: result.status } // <-- ensures client sees 400
      );
    }

    // Success
    return NextResponse.json(
      { message: result.message, data: result.data },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}



export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const ntid = searchParams.get("ntid");
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    console.log(ntid, month, year);

    if (!ntid || !month || !year) {
      return NextResponse.json(
        {
          status: 400,
          message: "applicant uuid month, and year are required",
        },
        { status: 400 }
      );
    }

    
    const result = await getFormCommentsByUserMonthYear({
      ntid,
      month: Number(month),
      year: Number(year),
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("FORM COMMENTS FETCH ERROR:", error);
    return NextResponse.json(
      { status: 500, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
