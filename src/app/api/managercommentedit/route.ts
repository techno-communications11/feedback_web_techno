import * as updateComment from "../../backend/controllers/managercomments.controller";
import { NextRequest } from "next/server";
export async function PUT(req: NextRequest) {
  console.log("In route.ts", req);
  return updateComment.PUT(req);
}