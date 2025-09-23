// /app/api/forms/route.ts
import { NextRequest } from "next/server";
import * as formController from "../../backend/controllers/getemployeedata.controller";

export async function GET(req: NextRequest) {
    console.log(req.body);
  return formController.GET(req);
}