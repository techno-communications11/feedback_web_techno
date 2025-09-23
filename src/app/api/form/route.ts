// /app/api/forms/route.ts
import { NextRequest } from "next/server";
import * as formController from "../../backend/controllers/forms.controller";

export async function POST(req: NextRequest) {
    console.log(req.body);
  return formController.POST(req);
}
export async function GET(req: NextRequest) {
    console.log(req.body);
  return formController.GET(req);
}
