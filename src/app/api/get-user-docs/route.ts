// src/app/api/get-user-docs/route.ts
import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";
import { pool } from "@/lib/db";
import { WriteUpDocs } from "@/app/backend/types/docs.type";

// Configure S3
const s3 = new AWS.S3({
  region: "eu-north-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});

// The bucket URL prefix in your DB
const BUCKET_URL =
  "https://employee-evaluation-writeups.s3.eu-north-1.amazonaws.com/";

// GET method
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ntid = searchParams.get("ntid");

    if (!ntid) {
      return NextResponse.json({ error: "ntid is required" }, { status: 400 });
    }

    // Query the DB for documents of this user
    const [rows] = await pool.execute<WriteUpDocs[]>(
      `SELECT writeup_uuid, ntid, document_url, created_at
       FROM employee_evaluation_writeups
       WHERE ntid = ?
       ORDER BY created_at DESC`,
      [ntid]
    );

    // Map rows to signed URLs and metadata
    const docsWithUrls = (rows as WriteUpDocs[]).map((doc) => {
      const key = doc.document_url.replace(BUCKET_URL, "");

      return {
        name: doc.writeup_uuid, // or another display name if you have it
        createdAt: doc.created_at,
        url: s3.getSignedUrl("getObject", {
          Bucket: "employee-evaluation-writeups",
          Key: key,
          Expires: 300, // 5 minutes
        }),
      };
    });

    return NextResponse.json(docsWithUrls);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
