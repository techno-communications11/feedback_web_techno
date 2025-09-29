// app/api/download-evaluations/route.ts
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { pool } from "@/lib/db";
import { GET_ALL_FORM_WITH_COMMENTS_AND_MARKET } from "../../backend/quaries/downloads.quary";
import { EvaluationRow } from "@/app/backend/types/download.types";

export async function GET() {
  const connection = await pool.getConnection();
  try {
    // Properly type rows
    const [rows] = await connection.execute<EvaluationRow[]>(
      GET_ALL_FORM_WITH_COMMENTS_AND_MARKET
    );

    console.log(rows[0], "xsss");

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
