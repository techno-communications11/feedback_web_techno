// app/api/dumpform_data/route.ts
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { createForm } from "../../backend/services/forms.service";

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { status: 400, message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert File to ArrayBuffer
    const buffer = await file.arrayBuffer();

    // Parse Excel
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const rows: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Loop through each row and call your service
    for (const originalRow of rows) {
      // Normalize keys: lowercase + replace spaces with underscores
      const row: Record<string, any> = {};
      for (const key of Object.keys(originalRow)) {
        const normalizedKey = key.toLowerCase().split(" ").join("_");
        row[normalizedKey] = originalRow[key];
      }

      await createForm({
        applicant_uuid: row.applicant_uuid || "", // optional
        first_name: row.first_name || "",
        last_name: row.last_name || "",
        NTID: row.ntid || "",
        market_manager_firstname: row.market_manager_firstname || "",
        market_manager_lastname: row.market_manager_lastname || "",
        HoursWorked: row.hours_worked || "0",
        BoxesCompleted: row.boxes_completed || "0",
        AccessorySold: row.accessories_sold || "0",
        FeatureRevenue: row.future_revenue || "0",
        CSAT: row.csat || "0",
        DayActivationRetention155: row.day_155_activation_retention || "0",
        DayFeatureMRCRetention155: row.day_155_future_mrc_retention || "0",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "All forms imported successfully",
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { status: 500, message: "Failed to import", error: error.message },
      { status: 500 }
    );
  }
};
