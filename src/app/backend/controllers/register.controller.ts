import { NextRequest, NextResponse } from "next/server";
import { createUser, updatePassword } from "../services/register.service";
import { UserData } from "../types/register.types";

export async function POST(req: NextRequest) {
  try {
    const body: UserData = await req.json();

    // Basic validation
    if (!body.email || !body.password || !body.role || !body.ntid) {
      return NextResponse.json(
        { status: 400, message: "fields are required" },
        { status: 400 }
      );
    }

    // Optional: validate role
    const validRoles = ["employee", "admin", "market_manager"];
    if (body.role && !validRoles.includes(body.role)) {
      return NextResponse.json(
        { status: 400, message: "Invalid role" },
        { status: 400 }
      );
    } else {
      console.log(body, "bbbbbbbbbbbbb");
    }

    const result = await createUser(body);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    console.error("USER POST ERROR:", error);
    return NextResponse.json(
      { status: 500, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  // <-- use native Request
  try {
    const body = await req.json(); // works here
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({
          status: 400,
          message: "Email and password are required",
        }),
        { status: 400 }
      );
    }
    const result = await updatePassword(email, password);
    return new Response(JSON.stringify(result), { status: result.status });
  } catch (error: any) {
    console.error("USER PUT ERROR:", error);
    return new Response(
      JSON.stringify({
        status: 500,
        message: "Server error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
