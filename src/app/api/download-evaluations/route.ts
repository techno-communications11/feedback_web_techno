// app/api/download-evaluations/route.ts
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { pool } from "@/lib/db";
import {GET_ALL_FORM_WITH_COMMENTS_AND_MARKET} from '../../backend/quaries/downloads.quary'

export async function GET() {
  const connection = await pool.getConnection();
  try {
    const [rows]: any = await connection.execute(GET_ALL_FORM_WITH_COMMENTS_AND_MARKET); // replace with your actual table
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Evaluations");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="evaluation-data.xlsx"',
      },
    });
  } finally {
    connection.release();
  }
}
