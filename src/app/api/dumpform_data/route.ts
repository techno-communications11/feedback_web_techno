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

      // Convert file to ArrayBuffer
      const buffer = await file.arrayBuffer();

      // Parse Excel
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const rows: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      let successCount = 0;
      let skippedCount = 0;
      const errors: { NTID: string; message: string }[] = [];

      for (const originalRow of rows) {
        // Normalize keys
        const row: Record<string, any> = {};
        for (const key of Object.keys(originalRow)) {
          const normalizedKey = key.toLowerCase().split(" ").join("_");
          row[normalizedKey] = originalRow[key];
        }

        // Call service
        const result = await createForm({
          first_name: row.first_name || "",
          last_name: row.last_name || "",
          NTID: row.ntid || "",
          market_id: row.market,
          market_manager_firstname: row.market_manager_firstname || "",
          market_manager_lastname: row.market_manager_lastname || "",
          HoursWorked: row.hours_worked || "0",
          BoxesCompleted: row.boxes_completed || "0",
          AccessorySold: row.accessories_sold || "0",
          FeatureRevenue: row.future_revenue || "0",
          CSAT: row.csat || "0",
          DayActivationRetention35: row.day_35_activation_retention || "0",
          DayFeatureMRCRetention35: row.day_35_future_mrc_retention || "0",
          DayActivationRetention65: row.day_65_activation_retention || "0",
          DayFeatureMRCRetention65: row.day_65_future_mrc_retention || "0",
          DayActivationRetention95: row.day_95_activation_retention || "0",
          DayFeatureMRCRetention95: row.day_95_future_mrc_retention || "0",
          DayActivationRetention125: row.day_125_activation_retention || "0",
          DayFeatureMRCRetention125: row.day_125_future_mrc_retention || "0",
          DayActivationRetention155: row.day_155_activation_retention || "0",
          DayFeatureMRCRetention155: row.day_155_future_mrc_retention || "0",
        });

        console.log("Result:", result);

        if (result.status === 400 && result.message.includes("already exists")) {
          skippedCount++;
        } else if (result.status === 200) {
          successCount++;
        } else {
          errors.push({ NTID: row.ntid, message: result.message });
        }
      }

      // Decide final status
      if (successCount > 0 && skippedCount === 0 && errors.length === 0) {
        // ✅ All new inserts
        return NextResponse.json(
          {
            status: 200,
            message: `${successCount} form(s) imported successfully`,
            imported: successCount,
            skipped: skippedCount,
            errors,
          },
          { status: 200 }
        );
      } else if (skippedCount > 0 && successCount === 0 && errors.length === 0) {
        // ⚠️ Only duplicates
        return NextResponse.json(
          {
            status: 400,
            message: `${skippedCount} form(s) already exist this month`,
            imported: successCount,
            skipped: skippedCount,
            errors,
          },
          { status: 400 }
        );
      } else if (successCount > 0 && skippedCount > 0) {
        // ✅+⚠️ Mixed case
        return NextResponse.json(
          {
            status: 207, // Multi-Status (partial success)
            message: `${successCount} imported, ${skippedCount} skipped`,
            imported: successCount,
            skipped: skippedCount,
            errors,
          },
          { status: 207 }
        );
      } else {
        // ❌ Only errors
        return NextResponse.json(
          {
            status: 500,
            message: "All rows failed to process",
            imported: successCount,
            skipped: skippedCount,
            errors,
          },
          { status: 500 }
        );
      }
    } catch (error: any) {
      console.error("DumpForm Error:", error);
      return NextResponse.json(
        { status: 500, message: "Failed to import", error: error.message },
        { status: 500 }
      );
    }
  };
