// pages/api/logout.ts
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Set-Cookie", "refresh_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict");
  res.status(200).json({ message: "Logged out" });
}
