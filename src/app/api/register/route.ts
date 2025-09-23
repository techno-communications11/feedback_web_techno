// /app/api/forms/route.ts
import { NextRequest } from "next/server";
import * as authController from "../../backend/controllers/register.controller";

export async function POST(req: NextRequest) {
  return authController.POST(req);
}

export async function PUT(req: NextRequest) {
  return authController.PUT(req);
}

