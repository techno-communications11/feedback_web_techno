import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export interface TokenPayload {
  applicant_uuid: string;
  email: string;
  role:string;
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
