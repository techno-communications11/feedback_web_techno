import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { pool } from "@/lib/db";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});



export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const ntid = formData.get("ntid") as string;

    if (!file || !ntid) {
      return new Response(JSON.stringify({ error: "File and NTID are required" }), { status: 400 });
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
        ContentType: "image/png",
      })
    );

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    // Store in DB
    const [result] = await pool.execute(
      `INSERT INTO employee_evaluation_writeups (writeup_uuid, ntid, document_url)
       VALUES (?, ?, ?)`,
      [writeup_uuid, ntid, fileUrl]
    );

    console.log(result); // { affectedRows: 1, insertId: 123, warningStatus: 0 }

    return new Response(JSON.stringify({ url: fileUrl, writeup_uuid }), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
