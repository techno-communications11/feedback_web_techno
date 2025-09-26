import { pool } from "@/lib/db";
import { FormData, ApiResponse, MonthData } from "../types/form.types";
import {
  INSERT_FORM,
  GET_FULL_FORM_DATA_BY_USER_MONTH_YEAR,
  GET_APPLICANT_Form_DETAILS_BY_NTID
} from "../quaries/forms.queries";
import { v4 as uuidv4 } from "uuid";

export const createForm = async (form: FormData): Promise<ApiResponse> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1️⃣ Check if form already exists for this NTID in current month
    const [rows]: any = await connection.execute(
      GET_APPLICANT_Form_DETAILS_BY_NTID,
      [form.NTID]
    );

    if (rows.length > 0) {
      await connection.rollback();
      return {
        status: 400,
        message: `Form for NTID ${form.NTID} already exists this month`,
      };
    }

    // 2️⃣ Insert form
    const formValues = [
      uuidv4(), // form_uuid
      form.first_name || null,
      form.last_name || null,
      form.market_id !== undefined ? Number(form.market_id) : 0,
      form.NTID || null,
      form.market_manager_firstname || null,
      form.market_manager_lastname || null,
      form.HoursWorked !== undefined ? Number(form.HoursWorked) : 0,
      form.BoxesCompleted !== undefined ? Number(form.BoxesCompleted) : 0,
      form.AccessorySold !== undefined ? Number(form.AccessorySold) : 0,
      form.FeatureRevenue !== undefined ? Number(form.FeatureRevenue) : 0,
      form.CSAT !== undefined ? Number(form.CSAT) : 0,
      form.DayActivationRetention35 !== undefined ? Number(form.DayActivationRetention35) : 0,
      form.DayFeatureMRCRetention35 !== undefined ? Number(form.DayFeatureMRCRetention35) : 0,
      form.DayActivationRetention65 !== undefined ? Number(form.DayActivationRetention65) : 0,
      form.DayFeatureMRCRetention65 !== undefined ? Number(form.DayFeatureMRCRetention65) : 0,
      form.DayActivationRetention95 !== undefined ? Number(form.DayActivationRetention95) : 0,
      form.DayFeatureMRCRetention95 !== undefined ? Number(form.DayFeatureMRCRetention95) : 0,
      form.DayActivationRetention125 !== undefined ? Number(form.DayActivationRetention125) : 0,
      form.DayFeatureMRCRetention125 !== undefined ? Number(form.DayFeatureMRCRetention125) : 0,
      form.DayActivationRetention155 !== undefined ? Number(form.DayActivationRetention155) : 0,
      form.DayFeatureMRCRetention155 !== undefined ? Number(form.DayFeatureMRCRetention155) : 0,
    ];

    const [formResult]: any = await connection.execute(INSERT_FORM, formValues);

    await connection.commit();

    return {
      status: 200,
      message: "Form created successfully",
      data: { form_uuid: formValues[0] },
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
    const values = [form.ntid, form.month, form.year];

    const [rows] = await pool.execute(
      GET_FULL_FORM_DATA_BY_USER_MONTH_YEAR,
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
