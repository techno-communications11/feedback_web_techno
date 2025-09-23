// /app/api/forms/route.ts
import * as userNamesController from "../../backend/controllers/usernames.controller";

export async function GET() {
  return userNamesController.GET();
}