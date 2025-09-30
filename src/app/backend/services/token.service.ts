import jwt from "jsonwebtoken";

export interface TokenPayload {
  applicant_uuid: string;
  email: string;
  role: string;
  market_id?: number;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  return secret;
}

export class TokenService {
  static generateAccessToken(payload: TokenPayload) {
    return jwt.sign(payload, getJwtSecret(), { expiresIn: "15m" });
  }

  static generateRefreshToken(payload: TokenPayload) {
    return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
  }

  static verifyToken(token: string) {
    return jwt.verify(token, getJwtSecret()) as TokenPayload;
  }
}
