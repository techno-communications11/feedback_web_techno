import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export interface TokenPayload {
  applicant_uuid: string;
  email: string;
  role:string;
  market_id?: number;
}

export class TokenService {
  static generateAccessToken(payload: TokenPayload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
  }

  static generateRefreshToken(payload: TokenPayload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  }

  static verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  }
}
