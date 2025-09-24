import { NextRequest, NextResponse } from "next/server";
import { addComment, getComment,updateComment } from "../services/comments.service";
import { CommentData,updateCommentData } from "../types/comments.types";

export async function POST(req: NextRequest) {
  try {
    const body: CommentData & { version?: number } = await req.json();

    if (!body.comment_text || !body.form_id || !body.applicant_uuid) {
      return NextResponse.json(
        { status: 400, message: "Invalid comment data" },
        { status: 400 }
      );
    }

    const version = body.version || 1;

    // Insert comment
    const savedComment = await addComment(body, version);

    console.log("Saved Comment:", savedComment);

    return NextResponse.json(
      {
        status: 200,
        message: "Comment added successfully",
        data: savedComment.data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
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
    const applicant_uuid = searchParams.get("applicant_uuid");

    if (!applicant_uuid) {
      return NextResponse.json(
        { status: 400, message: "applicant_uuid is required" },
        { status: 400 }
      );
    }
    const result = await getComment(applicant_uuid);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: updateCommentData & { comment_id?: number } = await req.json();
    console.log("Received Update Comment Data:", body);
    if (
      !body.comment_text ||
      !body.comment_id
    ) {
      return NextResponse.json(
        { status: 400, message: "Invalid comment data" },
        { status: 400 }
      );
    }
    // Update comment
    const updatedComment = await updateComment(body);

    return NextResponse.json(
      {
        status: 200,
        message: "Comment updated successfully",
        data: updatedComment.data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { status: 500, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

