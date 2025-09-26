// /app/api/forms/route.ts
import { NextRequest } from "next/server";
import * as addComment from "../../backend/controllers/comments.controller";
import * as getComment from "../../backend/controllers/comments.controller";

export async function POST(req: NextRequest) {
  console.log(req.body, "bbbbbbbbbbbbbbbb");
  return addComment.POST(req);
}

export async function GET(req: NextRequest) {
  console.log(req.body, "appi comments");
  return getComment.GET(req);
}
