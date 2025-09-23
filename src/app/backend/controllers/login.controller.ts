import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "../services/login.service";
import { UserLoginData } from "../types/login.types";

export async function POST(req: NextRequest) {
  try {
    const body:UserLoginData = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { status: 400, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await loginUser(email, password);
    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    console.error("LOGIN POST ERROR:", error);
    return NextResponse.json(
      { status: 500, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
