// /app/api/forms/route.ts
import { NextRequest } from "next/server";
import * as formController from "../../backend/controllers/forms.controller";

export async function POST(req: NextRequest) {
  return formController.POST(req);
}
export async function GET(req: NextRequest) {
  return formController.GET(req);
}
