// /app/api/forms/route.ts
import * as marketController from "../../backend/controllers/market.controller";

export async function GET() {
  return marketController.GET();
}