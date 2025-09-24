import { NextRequest, NextResponse } from "next/server";
import { createUser, updatePassword } from "../services/register.service";
import { UserData } from "../types/register.types";

export async function POST(req: NextRequest) {
  try {
    const body: UserData = await req.json();
     console.log(body, "body");

    // Basic validation
    if (!body.email || !body.password || !body.role) {
      return NextResponse.json(
        { status: 400, message: "Email, password, and role are required" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["employee", "admin", "market_manager"];
    if (!validRoles.includes(body.role)) {
      return NextResponse.json(
        { status: 400, message: "Invalid role" },
        { status: 400 }
      );
    }

    // Market and NTID required for non-admin roles
    if (body.role !== "admin") {
      if (!body.ntid || !body.market) {
        return NextResponse.json(
          {
            status: 400,
            message: "NTID and Market are required for this role",
          },
          { status: 400 }
        );
      }
    }

    const result = await createUser(body);
    return NextResponse.json(result, { status: result.status || 200 });
  } catch (error: any) {
    console.error("USER POST ERROR:", error);
    return NextResponse.json(
      { status: 500, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: { email: string; password: string } = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { status: 400, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await updatePassword(email, password);
    return NextResponse.json(result, { status: result.status || 200 });
  } catch (error: any) {
    console.error("USER PUT ERROR:", error);
    return NextResponse.json(
      { status: 500, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
