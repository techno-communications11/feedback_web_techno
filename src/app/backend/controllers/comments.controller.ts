import { NextRequest, NextResponse } from "next/server";
import { addComment, getComment } from "../services/comments.service";
import { CommentData, ApiResponse } from "../types/comments.types";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: CommentData = await req.json();
    

    if (!body.ntid || !body.form_uuid || !body.type) {
      return NextResponse.json({ status: 400, message: "Missing required fields" } as ApiResponse, { status: 400 });
    }

    if (body.type === "employee" && !body.comment_text) {
      return NextResponse.json({ status: 400, message: "Employee comment_text is required" } as ApiResponse, { status: 400 });
    }

    if (body.type === "manager" && !body.manager_comment) {
      return NextResponse.json({ status: 400, message: "Manager comment is required" } as ApiResponse, { status: 400 });
    }

    const savedComment = await addComment(body);
    return NextResponse.json(savedComment, { status: savedComment.status });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ status: 500, message: "Server error", error: errorMessage } as ApiResponse, { status: 500 });
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const ntid = new URL(req.url).searchParams.get("ntid");
    if (!ntid) {
      return NextResponse.json({ status: 400, message: "ntid is required" } as ApiResponse, { status: 400 });
    }

    const result = await getComment(ntid);
    return NextResponse.json(result, { status: result.status });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ status: 500, message: "Server error", error: errorMessage } as ApiResponse, { status: 500 });
  }
}
