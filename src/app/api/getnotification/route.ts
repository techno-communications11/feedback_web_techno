// /app/api/forms/route.ts
import { NextRequest } from "next/server";
import * as GetEmployeeNotification from "../../backend/controllers/notifications.controller";

export async function GET(req: NextRequest) {
    console.log(req.body);
  return GetEmployeeNotification.GET(req);
}