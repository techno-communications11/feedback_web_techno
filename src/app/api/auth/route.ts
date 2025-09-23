// /app/api/forms/route.ts
import { NextRequest } from "next/server";
import * as authController from "../../backend/controllers/login.controller";

export async function POST(req: NextRequest) {
  return authController.POST(req);
}


