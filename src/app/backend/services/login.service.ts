import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SELECT_USER_BY_EMAIL } from "../quaries/auth.queries";

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

    const accessToken = jwt.sign(
      { applicant_uuid: user.applicant_uuid, email: user.email, role: user.role, market_id: user.market_id },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { applicant_uuid: user.applicant_uuid, email: user.email, role: user.role, market_id: user.market_id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      status: 200,
      message: "Login successful",
      data: {
        token: accessToken,
        refreshToken, // return refresh token to be set by route
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

