import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { pool } from "@/lib/db";
import { OkPacket } from "mysql2/promise";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface UploadResponse {
  url: string;
  writeup_uuid: string;
}

interface ErrorResponse {
  error: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const ntid = formData.get("ntid");

    if (!(file instanceof File) || typeof ntid !== "string") {
      return new Response(
        JSON.stringify({ error: "File and NTID are required" } as ErrorResponse),
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const writeup_uuid = crypto.randomUUID();
    const key = `disciplinary-forms/${writeup_uuid}.png`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type || "image/png",
      })
    );

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    // Store in DB
    const [result] = await pool.execute<OkPacket>(
      `INSERT INTO employee_evaluation_writeups (writeup_uuid, ntid, document_url)
       VALUES (?, ?, ?)`,
      [writeup_uuid, ntid, fileUrl]
    );

    console.log(result); // typed as OkPacket

    return new Response(
      JSON.stringify({ url: fileUrl, writeup_uuid } as UploadResponse),
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Upload Error:", message);
    return new Response(JSON.stringify({ error: message } as ErrorResponse), { status: 500 });
  }
}
