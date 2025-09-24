import { NextRequest, NextResponse } from "next/server";
import { addComment,updatedComment } from "../services/managercomments.service";
import { CommentData, updateCommentData } from "../types/comments.types";

export async function POST(req: NextRequest) {
  try {
    const body: CommentData & { version?: number } = await req.json();
    console.log("Received Comment Data:", body);

    if (!body.manager_comment || !body.form_id ) {
      return NextResponse.json(
        { status: 400, message: "Invalid comment data" },
        { status: 400 }
      );
    }


    // Insert comment
    const savedComment = await addComment(body);

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

export async function PUT(req: NextRequest) {
  try {
    const body: updateCommentData & { comment_id?: number ,manager_comment:string} =
      await req.json();
    console.log("Received Update Comment Data:", body);
    if (
      !body.manager_comment ||
      !body.comment_id
    ) {
      return NextResponse.json(
        { status: 400, message: "Invalid comment data" },
        { status: 400 }
      );
    }
 
    await updatedComment(body);
   
    return NextResponse.json(
      {
        status: 200,

        message: "Comment updated successfully",
        data: updatedComment.data,
      },
      { status: 200 }
    );
  }
  catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { status: 500, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}