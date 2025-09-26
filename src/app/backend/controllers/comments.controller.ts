import { NextRequest, NextResponse } from "next/server";
import { addComment, getComment } from "../services/comments.service";
import { CommentData } from "../types/comments.types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { comment_text, manager_comment, form_uuid, type, ntid } = body;

    // Validate required fields based on type
    if (type === "employee" && (!comment_text || !form_uuid || !ntid)) {
      return NextResponse.json(
        { status: 400, message: "Employee comment and form_uuid are required" },
        { status: 400 }
      );
    }

    if (type === "manager" && (!manager_comment || !form_uuid || !ntid)) {
      return NextResponse.json(
        { status: 400, message: "Manager comment and form_uuid are required" },
        { status: 400 }
      );
    }

    if (!type || (type !== "employee" && type !== "manager")) {
      return NextResponse.json(
        {
          status: 400,
          message: "Invalid comment type. Must be 'employee' or 'manager'",
        },
        { status: 400 }
      );
    }

    // Insert comment
    const savedComment = await addComment(
      { comment_text, manager_comment, form_uuid,ntid } as CommentData,
      type
    );

    if (savedComment.status !== 200) {
      return NextResponse.json(
        {
          status: savedComment.status,
          message: savedComment.message,
          error: savedComment.error,
        },
        { status: savedComment.status }
      );
    }

    return NextResponse.json(
      {
        status: 200,
        message: "Comment added successfully",
        data: savedComment.data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { status: 500, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const ntid = searchParams.get("ntid");

    if (!ntid) {
      return NextResponse.json(
        { status: 400, message: "ntid is required" },
        { status: 400 }
      );
    }
    const result = await getComment(ntid);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
