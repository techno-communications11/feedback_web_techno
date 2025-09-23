// /app/api/forms/route.ts
import * as yearController from "../../backend/controllers/year.controller";

export async function GET() {
  return yearController.GET();
}