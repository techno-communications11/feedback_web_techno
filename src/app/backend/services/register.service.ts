import { pool } from "@/lib/db";
import { UserData } from "../types/register.types";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { INSERT_USER,SELECT_USER_BY_EMAIL, UPDATE_PASSWORD_BY_EMAIL } from "../quaries/auth.queries";

export const createUser = async (user: UserData) => {
  try {
    const applicant_uuid = uuidv4(); // generate unique user ID
    const hashedPassword = await bcrypt.hash(user.password, 10); // hash password

    const values = [
      applicant_uuid,
      user.email,
      hashedPassword,
      user.role || "employee", // default role
      user.ntid || "",
    ];
    console.log(values);

    await pool.execute(INSERT_USER, values);

    return {
      status: 200,
      message: "User created successfully",
      data: {
        applicant_uuid,
        email: user.email,
        role: user.role || "employee",
      },
    };
  } catch (error: any) {
    console.error("CREATE USER ERROR:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return {
        status: 400,
        message: "Email or ntid already exists",
        error: error.message,
      };
    }

    return {
      status: 500,
      message: "Failed to create user",
      error: error.message || "Unknown error",
    };
  }
};

export const updatePassword = async (email:string,password:string) => {
  let connection;
  try {
    connection = await pool.getConnection();

    // Check if user exists
    const [userRows]: any = await connection.execute(SELECT_USER_BY_EMAIL, [email]);
    if (userRows.length === 0) {
      return { status: 404, message: "User not found" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    const [result]: any = await connection.execute(
      UPDATE_PASSWORD_BY_EMAIL,
      [hashedPassword, email]
    );

    if (result.affectedRows === 0) {
      return { status: 404, message: "User not found" };
    }

    return { status: 200, message: "Password updated successfully" };
  } catch (error: any) {
    console.error("UPDATE PASSWORD ERROR:", error);
    return {
      status: 500,
      message: "Failed to update password",
      error: error.message || "Unknown error",
    };
  } finally {
    if (connection) connection.release(); // ✅ always release
  }
};


