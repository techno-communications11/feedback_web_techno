import { pool } from "@/lib/db";
import { FormData, ApiResponse, MonthData } from "../types/form.types";
import {
  INSERT_FORM,
  GET_FULL_FORM_COMMENTS_BY_USER_MONTH_YEAR,
} from "../quaries/forms.queries";
import { GET_APPLICANT_BY_NTID } from "../quaries/auth.queries";
import { v4 as uuidv4 } from "uuid";
import { INSERT_NOTIFICATIONS } from "../quaries/notification.quaries";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const createForm = async (form: FormData): Promise<ApiResponse> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1️⃣ Get applicant
    const [rows]: any = await connection.execute(GET_APPLICANT_BY_NTID, [
      form.NTID,
    ]);
    if (!rows || rows.length === 0) {
      await connection.rollback();
      return { status: 404, message: `User with NTID ${form.NTID} not found` };
    }

    console.log("Applicant found:", rows[0]);
    const applicant_uuid = rows[0].applicant_uuid;
    const user_email = rows[0].email;
    const notification_uuid = uuidv4();

    // 2️⃣ Insert form first
    const formValues = [
      applicant_uuid,
      form.first_name || null,
      form.last_name || null,
      form.NTID || null,
      form.market_manager_firstname || null,
      form.market_manager_lastname || null,
      form.HoursWorked !== undefined ? Number(form.HoursWorked) : 0,
      form.BoxesCompleted !== undefined ? Number(form.BoxesCompleted) : 0,
      form.AccessorySold !== undefined ? Number(form.AccessorySold) : 0,
      form.FeatureRevenue !== undefined ? Number(form.FeatureRevenue) : 0,
      form.CSAT !== undefined ? Number(form.CSAT) : 0,
      form.DayActivationRetention155 !== undefined
        ? Number(form.DayActivationRetention155)
        : 0,
      form.DayFeatureMRCRetention155 !== undefined
        ? Number(form.DayFeatureMRCRetention155)
        : 0,
    ];

    console.log("Inserting form with values:", formValues);

    const [formResult]: any = await connection.execute(INSERT_FORM, formValues);

    const form_id = formResult.insertId; // ✅ capture generated form_id
    console.log("Form inserted with ID:", form_id);

    // 3️⃣ Insert notification with correct form_id
    const notificationValues = [
      notification_uuid,
      applicant_uuid,
      "employee",
      "new_assignment",
      false,
      form_id,
    ];

    await connection.execute(INSERT_NOTIFICATIONS, notificationValues);

    if (user_email) {
      const emailHtml = `
  <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <!-- Header -->
      <div style="background-color: #0d6efd; color: #ffffff; padding: 20px; text-align: center;">
        <h2 style="margin: 0; font-size: 24px;">Monthly Performance Review</h2>
      </div>

      <!-- Body -->
      <div style="padding: 20px; color: #333333; line-height: 1.6;">
        <p>Hi <strong>${form.first_name}</strong>,</p>
        <p>A new monthly performance form has been submitted. Please review and add your comments in the portal:</p>

        <!-- Form Details Table -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Form ID</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${form_id}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>First Name</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${form.first_name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Last Name</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${form.last_name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>NTID</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${form.NTID}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Market Manager First Name</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${form.market_manager_firstname || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Market Manager Last Name</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${form.market_manager_lastname || "-"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Hours Worked</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${form.HoursWorked}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Boxes Completed</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${form.BoxesCompleted}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Accessories Sold</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${form.AccessorySold}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Future Revenue</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${form.FeatureRevenue}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>CSAT</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${form.CSAT}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Day 155 Activation Retention</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${form.DayActivationRetention155}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Day 155 Future MRC Retention</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${form.DayFeatureMRCRetention155}</td>
          </tr>
        </table>

        <!-- Call-to-Action -->
        <p style="text-align: center; margin-top: 20px;">
          <a href="https://your-portal-url.com/forms/${form_id}" 
             style="display: inline-block; background-color: #0d6efd; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold;">
            Review Form
          </a>
        </p>

        <p>Thank you for your prompt attention!</p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f7f7f7; color: #777777; padding: 15px; font-size: 12px; text-align: center;">
        This is an automated message from Techno Communications. Please do not reply to this email.
      </div>
    </div>
  </div>
`;

      try {
        await resend.emails.send({
          from: "no-reply@techno-communications.com",
          to: [user_email],
          subject: "Please Review Monthly Performance",
          html: emailHtml,
        });
        console.log(`Email sent to ${user_email}`);
      } catch (err) {
        console.error("Failed to send email:", err);
      }
    }

    await connection.commit();

    return {
      status: 200,
      message: "Form created successfully",
      data: { form_id },
    };
  } catch (error: any) {
    await connection.rollback();
    console.error("INSERT FORM ERROR:", error);
    return {
      status: 500,
      message: "Failed to create form",
      error: error.message || "Unknown error",
    };
  } finally {
    connection.release();
  }
};

export const getFormCommentsByUserMonthYear = async (form: MonthData) => {
  try {
    const values = [form.first_name, form.last_name, form.month, form.year];

    const [rows] = await pool.execute(
      GET_FULL_FORM_COMMENTS_BY_USER_MONTH_YEAR,
      values
    );
    console.log(rows);

    return {
      status: 200,
      message: "Data fetched successfully",
      data: rows,
    };
  } catch (error: any) {
    console.error("DB ERROR:", error);
    return { status: 500, message: "Database error", error: error.message };
  }
};
