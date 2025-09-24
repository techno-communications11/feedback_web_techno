import * as updateComment from "../../backend/controllers/comments.controller";
import { NextRequest } from "next/server";
export async function PUT(req: NextRequest) {
  
  return updateComment.PUT(req);
}