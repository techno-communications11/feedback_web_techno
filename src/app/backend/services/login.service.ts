import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SELECT_USER_BY_EMAIL } from "../quaries/auth.queries";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // should be in .env

export const loginUser = async (email: string, password: string) => {
  try {
    const [rows] = await pool.execute(SELECT_USER_BY_EMAIL, [email]);
    const users = rows as any[];

    if (users.length === 0) {
      return { status: 401, message: "Invalid email or password" };
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { status: 401, message: "Invalid email or password" };
    }

    // Access token (short lived)
    const accessToken = jwt.sign(
      { applicant_uuid: user.applicant_uuid, email: user.email, role: user.role, market_id: user.market_id },
      JWT_SECRET,
      { expiresIn: "15m" } // shorter life for security
    );

    // Refresh token (long lived, stored in cookie)
    const refreshToken = jwt.sign(
      { applicant_uuid: user.applicant_uuid, email: user.email,role: user.role, market_id: user.market_id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Store refresh token in HttpOnly cookie
    cookies().set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/"
    });

    return {
      status: 200,
      message: "Login successful",
      data: {
        token: accessToken, // client uses this in Authorization header
        user: {
          applicant_uuid: user.applicant_uuid,
          email: user.email,
          role: user.role,
          market_id: user.market_id
        }
      }
    };
  } catch (error: any) {
    console.error("LOGIN ERROR:", error);
    return { status: 500, message: "Server error", error: error.message };
  }
};
