import * as addComment from "../../backend/controllers/managercomments.controller";
import { NextRequest } from "next/server";
export async function POST(req: NextRequest) {
  
  return addComment.POST(req);
}