// /app/api/forms/route.ts
import { NextRequest } from "next/server";
import * as userNamesController from "../../backend/controllers/usernames.controller";

export async function GET(req: NextRequest) {
  return userNamesController.GET(req);
}